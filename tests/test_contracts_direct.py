"""Direct Mode coverage for the canonical WITLOCK monolith."""

import json

import pytest


SDK_VERSION = "v0.2.16"
BASE_TIMESTAMP = 1_767_225_600  # 2026-01-01T00:00:00Z


def address_hex(address) -> str:
    if hasattr(address, "as_hex"):
        return address.as_hex.lower()
    return "0x" + bytes(address).hex()


def terms(issuer: str, critical: bool = True) -> dict:
    return {
        "tasks": [
            {
                "id": "source",
                "question": "Does the authorized issuer support the frozen acceptance criterion?",
                "weight": 100,
                "critical": critical,
                "issuer": issuer,
            }
        ]
    }


def create(direct_vm, agreement, requester, provider, issuer, key="agreement-1"):
    direct_vm.sender = requester
    agreement.create_agreement(
        key,
        address_hex(provider),
        json.dumps(terms(address_hex(issuer))),
        "c" * 64,
        BASE_TIMESTAMP + 100,
        BASE_TIMESTAMP + 200,
        BASE_TIMESTAMP + 300,
        0,
        0,
    )


@pytest.mark.direct
def test_monolith_freezes_terms_and_requires_provider_acceptance(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
    direct_charlie,
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie)

    with direct_vm.expect_revert("WL_ACCEPT_UNAUTHORIZED"):
        agreement.accept_agreement("agreement-1")

    with direct_vm.prank(direct_bob):
        agreement.accept_agreement("agreement-1")

    state = json.loads(agreement.get_agreement("agreement-1"))
    assert state["status"] == "ACTIVE"
    assert state["terms"]["tasks"][0]["issuer"] == address_hex(direct_charlie)
    assert state["funding_required"] == 0
    assert state["funding_received"] == 0


@pytest.mark.direct
def test_attestation_is_case_bound_and_sealing_is_evidence_bound(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
    direct_charlie,
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie)
    with direct_vm.prank(direct_bob):
        agreement.accept_agreement("agreement-1")

    with direct_vm.expect_revert("WL_ISSUER_REQUIRED"):
        agreement.publish_attestation(
            "agreement-1", "source", "att-1", "d" * 64,
            "https://issuer.example/release/1", "commit-1",
            "The issuer supports the criterion.", "e" * 64, 0,
        )

    with direct_vm.prank(direct_charlie):
        agreement.publish_attestation(
            "agreement-1", "source", "att-1", "d" * 64,
            "https://issuer.example/release/1", "commit-1",
            "The issuer supports the criterion.", "e" * 64, 0,
        )
    with direct_vm.prank(direct_alice):
        agreement.submit_evidence("agreement-1", "source", "att-1")

    with direct_vm.prank(direct_alice):
        with direct_vm.expect_revert("WL_SEAL_STATE"):
            agreement.seal_agreement("agreement-1")

    with direct_vm.prank(direct_charlie):
        agreement.authenticate_evidence("agreement-1", "source", "d" * 64)
    with direct_vm.prank(direct_alice):
        agreement.acknowledge_delivery("agreement-1")
        agreement.seal_agreement("agreement-1")

    state = json.loads(agreement.get_agreement("agreement-1"))
    assert state["status"] == "SEALED"
    assert json.loads(agreement.get_evidence("agreement-1", "source"))["authenticated"] is True


@pytest.mark.direct
def test_adjudication_uses_bounded_labels_and_append_only_decisions(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
    direct_charlie,
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, "decision")
    with direct_vm.prank(direct_bob):
        agreement.accept_agreement("decision")
    with direct_vm.prank(direct_charlie):
        agreement.publish_attestation(
            "decision", "source", "att-1", "d" * 64,
            "https://issuer.example/release/1", "commit-1",
            "The issuer supports the criterion.", "e" * 64, 0,
        )
    with direct_vm.prank(direct_alice):
        agreement.submit_evidence("decision", "source", "att-1")
    with direct_vm.prank(direct_charlie):
        agreement.authenticate_evidence("decision", "source", "d" * 64)
    with direct_vm.prank(direct_alice):
        agreement.acknowledge_delivery("decision")
        agreement.seal_agreement("decision")

    direct_vm.mock_llm(
        "Classify each frozen criterion",
        json.dumps({"answers": {"source": "PASS"}}),
    )
    agreement.adjudicate("decision")
    state = json.loads(agreement.get_agreement("decision"))
    decision = json.loads(agreement.get_decision("decision"))
    assert state["status"] == "APPEAL_WINDOW"
    assert state["decision_version"] == 1
    assert decision["result"] == "APPROVED"
    assert decision["answers"] == {"source": "PASS"}
    assert json.loads(agreement.get_decision_version("decision", 1))["version"] == 1


@pytest.mark.direct
def test_custody_gate_rejects_nonzero_value_and_payout_paths(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
    direct_charlie,
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")

    with direct_vm.expect_revert("WL_CUSTODY_DISABLED"):
        agreement.create_agreement(
            "funded", address_hex(direct_bob), json.dumps(terms(address_hex(direct_charlie))),
            "c" * 64, BASE_TIMESTAMP + 100, BASE_TIMESTAMP + 200,
            BASE_TIMESTAMP + 300, 1, 0,
        )

    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, "zero")
    direct_vm.value = 1
    with direct_vm.expect_revert("WL_CUSTODY_DISABLED"):
        agreement.fund_agreement("zero")
    direct_vm.value = 0
    assert agreement.custody_enabled() is False
    with direct_vm.expect_revert("WL_CUSTODY_DISABLED"):
        agreement.begin_payment("zero", address_hex(direct_bob), 1)


@pytest.mark.direct
def test_timeout_closes_only_missing_evidence_and_appeals_have_expiry(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
    direct_charlie,
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, "timeout")
    with direct_vm.prank(direct_bob):
        agreement.accept_agreement("timeout")

    with direct_vm.expect_revert("WL_TIMEOUT_EARLY"):
        agreement.timeout_delivery("timeout")
    direct_vm.warp("2026-01-01T00:03:21Z")
    agreement.timeout_delivery("timeout")
    agreement.finalize_inconclusive("timeout")
    state = json.loads(agreement.get_agreement("timeout"))
    assert state["status"] == "APPEAL_WINDOW"
    assert json.loads(agreement.get_decision("timeout"))["result"] == "INCONCLUSIVE"

    with direct_vm.prank(direct_alice):
        agreement.open_appeal("timeout", "f" * 64)
    direct_vm.warp("2026-01-08T00:03:22Z")
    agreement.expire_appeal("timeout")
    state = json.loads(agreement.get_agreement("timeout"))
    assert state["status"] == "FINAL_DECISION"
    assert state["settlement_status"] == "BLOCKED_APPEAL"
    assert json.loads(agreement.get_decision_version("timeout", 1))["result"] == "INCONCLUSIVE"
    assert json.loads(agreement.get_decision_version("timeout", 2))["appeal"] is True
