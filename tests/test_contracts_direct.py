"""Adversarial Direct Mode coverage for the canonical WITLOCK monolith."""

import json

import pytest


SDK_VERSION = "v0.2.16"
BASE_TIMESTAMP = 1_767_225_600  # 2026-01-01T00:00:00Z


def address_hex(address) -> str:
    if hasattr(address, "as_hex"):
        return address.as_hex.lower()
    return "0x" + bytes(address).hex()


def terms(issuer: str, verifier: str, count: int = 1) -> dict:
    tasks = []
    for index in range(count):
        tasks.append(
            {
                "id": "source" if count == 1 else f"source{index}",
                "question": "Does the independently verified source support the frozen acceptance criterion?",
                "weight": 100 if count == 1 else (100 // count + (1 if index < 100 % count else 0)),
                "critical": True,
                "issuer": issuer,
                "verifier": verifier,
            }
        )
    return {"tasks": tasks}


def create(direct_vm, agreement, requester, provider, issuer, verifier, key="agreement-1", terms_value=None):
    direct_vm.sender = requester
    agreement.create_agreement(
        key,
        address_hex(provider),
        json.dumps(terms_value or terms(address_hex(issuer), address_hex(verifier))),
        "c" * 64,
        BASE_TIMESTAMP + 100,
        BASE_TIMESTAMP + 200,
        BASE_TIMESTAMP + 300,
        0,
        0,
    )


def activate(direct_vm, agreement, provider):
    with direct_vm.prank(provider):
        agreement.accept_agreement("agreement-1")


def publish_and_verify(direct_vm, agreement, issuer, verifier, key="agreement-1", task_id="source", attestation_id="att-1"):
    with direct_vm.prank(issuer):
        agreement.publish_attestation(
            key,
            task_id,
            attestation_id,
            "d" * 64,
            "https://issuer.example/release/1",
            "commit-1",
            "HTTPS_GET",
            BASE_TIMESTAMP,
            "The source supports the criterion.",
            "e" * 64,
            0,
        )
    with direct_vm.prank(verifier):
        agreement.verify_attestation_source(key, task_id, attestation_id, "d" * 64, "e" * 64)


def submit_and_authenticate(direct_vm, agreement, requester, issuer, key="agreement-1", task_id="source", attestation_id="att-1"):
    with direct_vm.prank(requester):
        agreement.submit_evidence(key, task_id, attestation_id)
    with direct_vm.prank(issuer):
        agreement.authenticate_evidence(key, task_id, "d" * 64)


def open_authenticated_appeal(direct_vm, agreement, requester, verifier, key="agreement-1"):
    grounds = json.dumps(
        {
            "task_id": "source",
            "challenged_version": 1,
            "basis": "The independent source review identifies a material contradiction in the ruling.",
            "digest": "f" * 64,
            "source": "https://appeal.example/review/1",
            "source_revision": "appeal-commit-1",
            "retrieval_method": "HTTPS_GET",
            "retrieved_at": BASE_TIMESTAMP,
            "claim": "The reviewed source contradicts the challenged criterion.",
            "provenance_hash": "a" * 64,
        },
        sort_keys=True,
    )
    with direct_vm.prank(requester):
        agreement.open_appeal(key, grounds)
    with direct_vm.prank(verifier):
        agreement.authenticate_appeal(key, "f" * 64, "a" * 64)


@pytest.mark.direct
def test_monolith_freezes_terms_and_requires_provider_acceptance(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana)

    with direct_vm.expect_revert("WL_ACCEPT_UNAUTHORIZED"):
        agreement.accept_agreement("agreement-1")

    with direct_vm.prank(direct_bob):
        agreement.accept_agreement("agreement-1")

    state = json.loads(agreement.get_agreement("agreement-1"))
    assert state["status"] == "ACTIVE"
    assert state["terms"]["tasks"][0]["issuer"] == address_hex(direct_charlie)
    assert state["terms"]["tasks"][0]["verifier"] == address_hex(direct_dana)


@pytest.mark.direct
def test_delivery_ack_does_not_lock_provider_evidence_submission(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana)
    activate(direct_vm, agreement, direct_bob)
    publish_and_verify(direct_vm, agreement, direct_charlie, direct_dana)

    with direct_vm.prank(direct_alice):
        agreement.acknowledge_delivery("agreement-1")
    with direct_vm.prank(direct_bob):
        agreement.submit_evidence("agreement-1", "source", "att-1")

    evidence = json.loads(agreement.get_evidence("agreement-1", "source"))
    assert evidence["submitted_by"] == address_hex(direct_bob)


@pytest.mark.direct
def test_open_dispute_does_not_lock_provider_evidence_submission(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana)
    activate(direct_vm, agreement, direct_bob)
    publish_and_verify(direct_vm, agreement, direct_charlie, direct_dana)

    with direct_vm.prank(direct_alice):
        agreement.open_dispute("agreement-1", "f" * 64)
    with direct_vm.prank(direct_bob):
        agreement.submit_evidence("agreement-1", "source", "att-1")

    assert json.loads(agreement.get_agreement("agreement-1"))["status"] == "REVIEW"


@pytest.mark.direct
def test_source_verifier_is_independent_and_required_before_authentication(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana)
    activate(direct_vm, agreement, direct_bob)

    with direct_vm.prank(direct_charlie):
        agreement.publish_attestation(
            "agreement-1", "source", "att-1", "d" * 64,
            "https://issuer.example/release/1", "commit-1", "HTTPS_GET", BASE_TIMESTAMP,
            "The source supports the criterion.", "e" * 64, 0,
        )
    with direct_vm.expect_revert("WL_SOURCE_VERIFIER"):
        with direct_vm.prank(direct_charlie):
            agreement.verify_attestation_source("agreement-1", "source", "att-1", "d" * 64, "e" * 64)
    with direct_vm.expect_revert("WL_SOURCE_NOT_VERIFIED"):
        with direct_vm.prank(direct_alice):
            agreement.submit_evidence("agreement-1", "source", "att-1")

    with direct_vm.prank(direct_dana):
        agreement.verify_attestation_source("agreement-1", "source", "att-1", "d" * 64, "e" * 64)
    submit_and_authenticate(direct_vm, agreement, direct_alice, direct_charlie)
    assert json.loads(agreement.get_evidence("agreement-1", "source"))["source_verified"] is True


@pytest.mark.direct
def test_adjudication_and_resolved_appeal_can_finalize(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana)
    activate(direct_vm, agreement, direct_bob)
    publish_and_verify(direct_vm, agreement, direct_charlie, direct_dana)
    submit_and_authenticate(direct_vm, agreement, direct_alice, direct_charlie)
    with direct_vm.prank(direct_alice):
        agreement.acknowledge_delivery("agreement-1")
        agreement.seal_agreement("agreement-1")

    direct_vm.mock_llm("Classify each frozen criterion", json.dumps({"answers": {"source": "PASS"}}))
    agreement.adjudicate("agreement-1")
    open_authenticated_appeal(direct_vm, agreement, direct_alice, direct_dana)
    direct_vm.clear_mocks()
    direct_vm.mock_llm("Classify each frozen criterion", json.dumps({"answers": {"source": "FAIL"}}))
    agreement.resolve_appeal("agreement-1")

    state = json.loads(agreement.get_agreement("agreement-1"))
    assert state["status"] == "APPEAL_WINDOW"
    assert state["appeal_status"] == "RESOLVED"
    assert state["decision_version"] == 2

    direct_vm.warp("2026-01-01T00:05:01Z")
    agreement.finalize_decision("agreement-1")
    state = json.loads(agreement.get_agreement("agreement-1"))
    assert state["status"] == "FINAL_DECISION"
    assert state["appeal_status"] == "FINALIZED"
    assert json.loads(agreement.get_decision("agreement-1"))["result"] == "REJECTED"


@pytest.mark.direct
def test_expired_appeal_preserves_prior_ruling_and_inconclusive_recovery(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana)
    activate(direct_vm, agreement, direct_bob)
    publish_and_verify(direct_vm, agreement, direct_charlie, direct_dana)
    submit_and_authenticate(direct_vm, agreement, direct_alice, direct_charlie)
    with direct_vm.prank(direct_alice):
        agreement.acknowledge_delivery("agreement-1")
        agreement.seal_agreement("agreement-1")
    direct_vm.mock_llm("Classify each frozen criterion", json.dumps({"answers": {"source": "PASS"}}))
    agreement.adjudicate("agreement-1")
    open_authenticated_appeal(direct_vm, agreement, direct_alice, direct_dana)
    direct_vm.warp("2026-01-08T00:00:01Z")
    agreement.expire_appeal("agreement-1")
    state = json.loads(agreement.get_agreement("agreement-1"))
    assert state["status"] == "FINAL_DECISION"
    assert state["appeal_status"] == "EXPIRED"
    assert state["decision_version"] == 1
    assert json.loads(agreement.get_decision("agreement-1"))["result"] == "APPROVED"


@pytest.mark.direct
def test_inconclusive_appeal_expires_into_bounded_terminal_state(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana)
    activate(direct_vm, agreement, direct_bob)
    direct_vm.warp("2026-01-01T00:03:21Z")
    agreement.timeout_delivery("agreement-1")
    agreement.finalize_inconclusive("agreement-1")
    open_authenticated_appeal(direct_vm, agreement, direct_alice, direct_dana)
    direct_vm.warp("2026-01-08T00:03:22Z")
    agreement.expire_appeal("agreement-1")
    state = json.loads(agreement.get_agreement("agreement-1"))
    assert state["status"] == "FINAL_DECISION"
    assert state["result"] == "INCONCLUSIVE"
    assert state["settlement_status"] == "BLOCKED_INCONCLUSIVE"
    assert state["decision_version"] == 1


@pytest.mark.direct
def test_draft_expiration_is_permissionless_and_terminal(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana)
    with direct_vm.expect_revert("WL_DRAFT_EXPIRY"):
        agreement.expire_draft("agreement-1")
    direct_vm.warp("2026-01-01T00:01:41Z")
    agreement.expire_draft("agreement-1")
    assert json.loads(agreement.get_agreement("agreement-1"))["status"] == "EXPIRED"
    with direct_vm.expect_revert("WL_ACCEPT_UNAUTHORIZED"):
        with direct_vm.prank(direct_bob):
            agreement.accept_agreement("agreement-1")


@pytest.mark.direct
def test_consensus_failure_fails_closed_to_inconclusive(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana)
    activate(direct_vm, agreement, direct_bob)
    publish_and_verify(direct_vm, agreement, direct_charlie, direct_dana)
    submit_and_authenticate(direct_vm, agreement, direct_alice, direct_charlie)
    with direct_vm.prank(direct_alice):
        agreement.acknowledge_delivery("agreement-1")
        agreement.seal_agreement("agreement-1")
    direct_vm.mock_llm("Classify each frozen criterion", json.dumps({"answers": {"source": "UNSAFE"}}))
    agreement.adjudicate("agreement-1")
    decision = json.loads(agreement.get_decision("agreement-1"))
    assert decision["result"] == "INCONCLUSIVE"
    assert decision["consensus_status"] == "FAILED_CLOSED"
    assert decision["failure_code"] == "CONSENSUS_LABEL"


@pytest.mark.direct
def test_oversized_consensus_dossier_reverts_instead_of_truncating(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    long_terms = terms(address_hex(direct_charlie), address_hex(direct_dana), 8)
    for task in long_terms["tasks"]:
        task["question"] = "Q" * 400
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana, terms_value=long_terms)
    activate(direct_vm, agreement, direct_bob)
    for index, task in enumerate(long_terms["tasks"]):
        task_id = task["id"]
        with direct_vm.prank(direct_charlie):
            agreement.publish_attestation(
                "agreement-1", task_id, f"att-{index}", "d" * 64,
                "https://" + "s" * 391, "r" * 160, "HTTPS_GET", BASE_TIMESTAMP,
                "C" * 1200, "e" * 64, 0,
            )
        with direct_vm.prank(direct_dana):
            agreement.verify_attestation_source("agreement-1", task_id, f"att-{index}", "d" * 64, "e" * 64)
        with direct_vm.prank(direct_alice):
            agreement.submit_evidence("agreement-1", task_id, f"att-{index}")
        with direct_vm.prank(direct_charlie):
            agreement.authenticate_evidence("agreement-1", task_id, "d" * 64)
    with direct_vm.prank(direct_alice):
        agreement.acknowledge_delivery("agreement-1")
        agreement.seal_agreement("agreement-1")
    direct_vm.mock_llm("Classify each frozen criterion", json.dumps({"answers": {task["id"]: "PASS" for task in long_terms["tasks"]}}))
    with direct_vm.expect_revert("WL_DOSSIER_SIZE"):
        agreement.adjudicate("agreement-1")


@pytest.mark.direct
def test_custody_gate_rejects_arbitrary_payment_arguments_and_boolean_reconciliation(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana, "zero")
    direct_vm.value = 1
    with direct_vm.expect_revert("WL_CUSTODY_DISABLED"):
        agreement.fund_agreement("zero")
    direct_vm.value = 0
    assert agreement.custody_enabled() is False
    with direct_vm.expect_revert("WL_CUSTODY_DISABLED"):
        agreement.begin_payment("zero", "PROVIDER")
    with direct_vm.expect_revert("WL_CUSTODY_DISABLED"):
        agreement.confirm_payment_delivery("zero", 1, "a" * 64, "b" * 64)
    with direct_vm.expect_revert("WL_CUSTODY_DISABLED"):
        agreement.reconcile_payment("zero", 1, "a" * 64)
