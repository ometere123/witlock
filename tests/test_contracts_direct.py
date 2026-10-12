"""Direct Mode coverage for the deployed contract surface."""

import json

import pytest


SDK_VERSION = "v0.2.16"
BASE_TIMESTAMP = 1_767_225_600  # 2026-01-01T00:00:00Z


def address_hex(address) -> str:
    if hasattr(address, "as_hex"):
        return address.as_hex.lower()
    return "0x" + bytes(address).hex()


@pytest.mark.direct
def test_registry_attestation_is_immutable(direct_vm, direct_deploy, direct_alice):
    registry = direct_deploy(
        "contracts/WitlockRegistry.py",
        sdk_version=SDK_VERSION,
    )
    direct_vm.sender = direct_alice

    registry.attest(
        "issuer-1",
        "case-1:task-1",
        "a" * 64,
        "https://issuer.example/report/1",
        "The issuer confirms the criterion.",
    )

    record = json.loads(registry.get_attestation("issuer-1"))
    assert record["issuer"] == address_hex(direct_alice)
    assert registry.count() == 1

    with direct_vm.expect_revert("WL_REGISTRY_KEY_USED"):
        registry.attest(
            "issuer-1",
            "case-1:task-1",
            "b" * 64,
            "https://issuer.example/report/2",
            "A replacement claim must be rejected.",
        )


@pytest.mark.direct
def test_agreement_freezes_terms_and_enforces_parties(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
    direct_charlie,
):
    agreement = direct_deploy(
        "contracts/WitlockAgreement.py",
        direct_charlie,
        sdk_version=SDK_VERSION,
    )
    direct_vm.warp("2026-01-01T00:00:00Z")

    provider = address_hex(direct_alice)
    issuer = address_hex(direct_bob)
    terms = {
        "tasks": [
            {
                "id": "task-1",
                "question": "Does the issuer record support the frozen acceptance criterion?",
                "weight": 100,
                "critical": True,
                "issuer": issuer,
            }
        ]
    }

    agreement.create_case(
        "case-1",
        provider,
        json.dumps(terms),
        "c" * 64,
        BASE_TIMESTAMP + 100,
        BASE_TIMESTAMP + 200,
        BASE_TIMESTAMP + 300,
    )
    assert json.loads(agreement.get_case("case-1"))["status"] == "DRAFT"

    with direct_vm.expect_revert("WL_AGREEMENT_ACCEPT_UNAUTHORIZED"):
        agreement.accept_case("case-1")

    with direct_vm.prank(direct_alice):
        agreement.accept_case("case-1")
    assert json.loads(agreement.get_case("case-1"))["status"] == "ACTIVE"

    with direct_vm.expect_revert("WL_AGREEMENT_EVIDENCE_PARTY"):
        with direct_vm.prank(direct_bob):
            agreement.submit_evidence(
                "case-1",
                "task-1",
                json.dumps(
                    {
                        "issuer": issuer,
                        "subject": "case-1:task-1",
                        "digest": "d" * 64,
                        "claim": "The issuer confirms the criterion.",
                        "source": "https://issuer.example/report/1",
                        "registry_key": "issuer-1",
                    }
                ),
            )


@pytest.mark.direct
def test_agreement_timeout_is_deadline_bound(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    agreement = direct_deploy(
        "contracts/WitlockAgreement.py",
        direct_bob,
        sdk_version=SDK_VERSION,
    )
    direct_vm.warp("2026-01-01T00:00:00Z")
    terms = {
        "tasks": [
            {
                "id": "task-1",
                "question": "Does the issuer record support the frozen acceptance criterion?",
                "weight": 100,
                "critical": True,
                "issuer": address_hex(direct_alice),
            }
        ]
    }
    agreement.create_case(
        "case-2",
        address_hex(direct_bob),
        json.dumps(terms),
        "e" * 64,
        BASE_TIMESTAMP + 10,
        BASE_TIMESTAMP + 20,
        BASE_TIMESTAMP + 30,
    )

    direct_vm.warp("2026-01-01T00:00:11Z")
    agreement.timeout_case("case-2")
    assert json.loads(agreement.get_case("case-2"))["status"] == "EXPIRED"
