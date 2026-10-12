"""Adversarial Direct Mode coverage for the canonical WITLOCK monolith."""

import hashlib
import json
import re

import pytest


SDK_VERSION = "v0.2.16"
BASE_TIMESTAMP = 1_767_225_600  # 2026-01-01T00:00:00Z
SOURCE_COMMIT = "a" * 40
APPEAL_COMMIT = "b" * 40
SOURCE_URL = (
    "https://raw.githubusercontent.com/ometere123/witlock/"
    + SOURCE_COMMIT + "/docs/source-fixtures/pass.txt"
)
APPEAL_URL = (
    "https://raw.githubusercontent.com/ometere123/witlock/"
    + APPEAL_COMMIT + "/docs/source-fixtures/reversal.txt"
)
SOURCE_BODY = "The accepted delivery satisfies the frozen criterion."
APPEAL_BODY = "The accepted delivery contradicts the frozen criterion."


def address_hex(address) -> str:
    if hasattr(address, "as_hex"):
        return address.as_hex.lower()
    return "0x" + bytes(address).hex()


def digest(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def provenance(subject: str, source: str, revision: str, source_digest: str) -> str:
    return digest(subject + "|" + source + "|" + revision + "|" + source_digest)


def mock_source(direct_vm, source: str, revision: str, content: str) -> None:
    direct_vm.mock_web(re.escape(source), {"status": 200, "body": content})
    api_url = "https://api.github.com/repos/ometere123/witlock/git/commits/" + revision
    direct_vm.mock_web(
        re.escape(api_url),
        {
            "status": 200,
            "body": json.dumps(
                {
                    "sha": revision,
                    "url": api_url,
                    "html_url": "https://github.com/ometere123/witlock/commit/" + revision,
                }
            ),
        },
    )


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
    source_digest = digest(SOURCE_BODY)
    source_provenance = provenance(key + ":" + task_id, SOURCE_URL, SOURCE_COMMIT, source_digest)
    with direct_vm.prank(issuer):
        agreement.publish_attestation(
            key,
            task_id,
            attestation_id,
            source_digest,
            SOURCE_URL,
            SOURCE_COMMIT,
            "HTTPS_GET",
            BASE_TIMESTAMP,
            "The source supports the criterion.",
            source_provenance,
            0,
        )
    mock_source(direct_vm, SOURCE_URL, SOURCE_COMMIT, SOURCE_BODY)
    with direct_vm.prank(verifier):
        agreement.verify_attestation_source(key, task_id, attestation_id, source_digest, source_provenance)


def submit_and_authenticate(
    direct_vm,
    agreement,
    requester,
    issuer,
    key="agreement-1",
    task_id="source",
    attestation_id="att-1",
    observed_digest=None,
):
    with direct_vm.prank(requester):
        agreement.submit_evidence(key, task_id, attestation_id)
    with direct_vm.prank(issuer):
        agreement.authenticate_evidence(key, task_id, observed_digest or digest(SOURCE_BODY))


def open_authenticated_appeal(direct_vm, agreement, requester, verifier, key="agreement-1"):
    appeal_digest = digest(APPEAL_BODY)
    appeal_provenance = provenance(key + ":source", APPEAL_URL, APPEAL_COMMIT, appeal_digest)
    grounds = json.dumps(
        {
            "task_id": "source",
            "challenged_version": 1,
            "basis": "The independent source review identifies a material contradiction in the ruling.",
            "digest": appeal_digest,
            "source": APPEAL_URL,
            "source_revision": APPEAL_COMMIT,
            "retrieval_method": "HTTPS_GET",
            "retrieved_at": BASE_TIMESTAMP,
            "claim": "The reviewed source contradicts the challenged criterion.",
            "provenance_hash": appeal_provenance,
        },
        sort_keys=True,
    )
    with direct_vm.prank(requester):
        agreement.open_appeal(key, grounds)
    mock_source(direct_vm, APPEAL_URL, APPEAL_COMMIT, APPEAL_BODY)
    with direct_vm.prank(verifier):
        agreement.authenticate_appeal(key, appeal_digest, appeal_provenance)


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

    source_digest = digest(SOURCE_BODY)
    source_provenance = provenance("agreement-1:source", SOURCE_URL, SOURCE_COMMIT, source_digest)

    with direct_vm.prank(direct_charlie):
        agreement.publish_attestation(
            "agreement-1", "source", "att-1", source_digest,
            SOURCE_URL, SOURCE_COMMIT, "HTTPS_GET", BASE_TIMESTAMP,
            "The source supports the criterion.", source_provenance, 0,
        )
    with direct_vm.expect_revert("WL_SOURCE_VERIFIER"):
        with direct_vm.prank(direct_charlie):
            agreement.verify_attestation_source("agreement-1", "source", "att-1", source_digest, source_provenance)
    with direct_vm.expect_revert("WL_SOURCE_NOT_VERIFIED"):
        with direct_vm.prank(direct_alice):
            agreement.submit_evidence("agreement-1", "source", "att-1")

    mock_source(direct_vm, SOURCE_URL, SOURCE_COMMIT, SOURCE_BODY)
    with direct_vm.prank(direct_dana):
        agreement.verify_attestation_source("agreement-1", "source", "att-1", source_digest, source_provenance)
    submit_and_authenticate(direct_vm, agreement, direct_alice, direct_charlie, observed_digest=source_digest)
    assert json.loads(agreement.get_evidence("agreement-1", "source"))["source_verified"] is True


@pytest.mark.direct
def test_altered_source_bytes_fail_closed_after_real_retrieval(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana)
    activate(direct_vm, agreement, direct_bob)
    source_digest = digest(SOURCE_BODY)
    source_provenance = provenance("agreement-1:source", SOURCE_URL, SOURCE_COMMIT, source_digest)
    with direct_vm.prank(direct_charlie):
        agreement.publish_attestation(
            "agreement-1", "source", "att-1", source_digest, SOURCE_URL, SOURCE_COMMIT,
            "HTTPS_GET", BASE_TIMESTAMP, "The source supports the criterion.", source_provenance, 0,
        )
    mock_source(direct_vm, SOURCE_URL, SOURCE_COMMIT, SOURCE_BODY + " altered")
    with direct_vm.prank(direct_dana):
        agreement.verify_attestation_source("agreement-1", "source", "att-1", source_digest, source_provenance)
    attestation = json.loads(agreement.get_attestation("agreement-1", "source", "att-1"))
    assert attestation["source_verified"] is False
    assert attestation["source_verification_status"] == "SOURCE_DIGEST_MISMATCH"
    with direct_vm.expect_revert("WL_SOURCE_NOT_VERIFIED"):
        with direct_vm.prank(direct_alice):
            agreement.submit_evidence("agreement-1", "source", "att-1")


@pytest.mark.direct
def test_mutable_branch_and_missing_commit_are_not_independent_source_proof(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana)
    activate(direct_vm, agreement, direct_bob)
    branch_url = "https://raw.githubusercontent.com/ometere123/witlock/main/docs/source-fixtures/pass.txt"
    branch_digest = digest(SOURCE_BODY)
    branch_provenance = provenance("agreement-1:source", branch_url, "main", branch_digest)
    with direct_vm.prank(direct_charlie):
        agreement.publish_attestation(
            "agreement-1", "source", "att-1", branch_digest, branch_url, "main",
            "HTTPS_GET", BASE_TIMESTAMP, "The source supports the criterion.", branch_provenance, 0,
        )
    with direct_vm.prank(direct_dana):
        agreement.verify_attestation_source("agreement-1", "source", "att-1", branch_digest, branch_provenance)
    attestation = json.loads(agreement.get_attestation("agreement-1", "source", "att-1"))
    assert attestation["source_verified"] is False
    assert attestation["source_verification_status"] == "SOURCE_NOT_IMMUTABLE_GITHUB_COMMIT"


@pytest.mark.direct
def test_missing_commit_redirect_and_oversized_source_fail_closed(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana)
    activate(direct_vm, agreement, direct_bob)
    source_digest = digest(SOURCE_BODY)
    source_provenance = provenance("agreement-1:source", SOURCE_URL, SOURCE_COMMIT, source_digest)
    with direct_vm.prank(direct_charlie):
        agreement.publish_attestation(
            "agreement-1", "source", "att-1", source_digest, SOURCE_URL, SOURCE_COMMIT,
            "HTTPS_GET", BASE_TIMESTAMP, "The source supports the criterion.", source_provenance, 0,
        )

    direct_vm.mock_web(re.escape(SOURCE_URL), {"status": 200, "body": SOURCE_BODY})
    api_url = "https://api.github.com/repos/ometere123/witlock/git/commits/" + SOURCE_COMMIT
    direct_vm.mock_web(re.escape(api_url), {"status": 404, "body": "missing"})
    with direct_vm.prank(direct_dana):
        agreement.verify_attestation_source("agreement-1", "source", "att-1", source_digest, source_provenance)
    attestation = json.loads(agreement.get_attestation("agreement-1", "source", "att-1"))
    assert attestation["source_verification_status"] == "GITHUB_COMMIT_NOT_FOUND"

    direct_vm.clear_mocks()
    direct_vm.mock_web(re.escape(SOURCE_URL), {"status": 302, "body": SOURCE_BODY})
    with direct_vm.prank(direct_dana):
        agreement.verify_attestation_source("agreement-1", "source", "att-1", source_digest, source_provenance)
    attestation = json.loads(agreement.get_attestation("agreement-1", "source", "att-1"))
    assert attestation["source_verification_status"] == "SOURCE_HTTP_302"

    direct_vm.clear_mocks()
    direct_vm.mock_web(re.escape(SOURCE_URL), {"status": 200, "body": "x" * 2049})
    with direct_vm.prank(direct_dana):
        agreement.verify_attestation_source("agreement-1", "source", "att-1", source_digest, source_provenance)
    attestation = json.loads(agreement.get_attestation("agreement-1", "source", "att-1"))
    assert attestation["source_verification_status"] == "SOURCE_CONTENT_BOUNDS"


@pytest.mark.direct
def test_github_commit_repository_identity_mismatch_fails_closed(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana)
    activate(direct_vm, agreement, direct_bob)
    source_digest = digest(SOURCE_BODY)
    source_provenance = provenance("agreement-1:source", SOURCE_URL, SOURCE_COMMIT, source_digest)
    with direct_vm.prank(direct_charlie):
        agreement.publish_attestation(
            "agreement-1", "source", "att-1", source_digest, SOURCE_URL, SOURCE_COMMIT,
            "HTTPS_GET", BASE_TIMESTAMP, "The source supports the criterion.", source_provenance, 0,
        )
    direct_vm.mock_web(re.escape(SOURCE_URL), {"status": 200, "body": SOURCE_BODY})
    api_url = "https://api.github.com/repos/ometere123/witlock/git/commits/" + SOURCE_COMMIT
    direct_vm.mock_web(
        re.escape(api_url),
        {
            "status": 200,
            "body": json.dumps(
                {
                    "sha": SOURCE_COMMIT,
                    "url": "https://api.github.com/repos/other/repository/git/commits/" + SOURCE_COMMIT,
                    "html_url": "https://github.com/other/repository/commit/" + SOURCE_COMMIT,
                }
            ),
        },
    )
    with direct_vm.prank(direct_dana):
        agreement.verify_attestation_source("agreement-1", "source", "att-1", source_digest, source_provenance)
    attestation = json.loads(agreement.get_attestation("agreement-1", "source", "att-1"))
    assert attestation["source_verification_status"] == "GITHUB_REPOSITORY_IDENTITY_MISMATCH"


@pytest.mark.direct
def test_false_issuer_claim_does_not_override_source_assessment(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana)
    activate(direct_vm, agreement, direct_bob)
    source_digest = digest(APPEAL_BODY)
    source_provenance = provenance("agreement-1:source", APPEAL_URL, APPEAL_COMMIT, source_digest)
    with direct_vm.prank(direct_charlie):
        agreement.publish_attestation(
            "agreement-1", "source", "att-1", source_digest, APPEAL_URL, APPEAL_COMMIT,
            "HTTPS_GET", BASE_TIMESTAMP, "This issuer claim falsely says the criterion passed.", source_provenance, 0,
        )
    mock_source(direct_vm, APPEAL_URL, APPEAL_COMMIT, APPEAL_BODY)
    with direct_vm.prank(direct_dana):
        agreement.verify_attestation_source("agreement-1", "source", "att-1", source_digest, source_provenance)
    submit_and_authenticate(direct_vm, agreement, direct_alice, direct_charlie, observed_digest=source_digest)
    with direct_vm.prank(direct_alice):
        agreement.acknowledge_delivery("agreement-1")
        agreement.seal_agreement("agreement-1")
    direct_vm.mock_llm("Classify each frozen criterion", json.dumps({"answers": {"source": "FAIL"}}))
    agreement.adjudicate("agreement-1")
    assert json.loads(agreement.get_decision("agreement-1"))["result"] == "REJECTED"


@pytest.mark.direct
def test_appeal_source_mutation_blocks_resolution(
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
    appeal_digest = digest(APPEAL_BODY)
    appeal_provenance = provenance("agreement-1:source", APPEAL_URL, APPEAL_COMMIT, appeal_digest)
    grounds = json.dumps({
        "task_id": "source", "challenged_version": 1,
        "basis": "The independent source review identifies a material contradiction in the ruling.",
        "digest": appeal_digest, "source": APPEAL_URL, "source_revision": APPEAL_COMMIT,
        "retrieval_method": "HTTPS_GET", "retrieved_at": BASE_TIMESTAMP,
        "claim": "The reviewed source contradicts the challenged criterion.",
        "provenance_hash": appeal_provenance,
    }, sort_keys=True)
    with direct_vm.prank(direct_alice):
        agreement.open_appeal("agreement-1", grounds)
    mock_source(direct_vm, APPEAL_URL, APPEAL_COMMIT, APPEAL_BODY + " altered")
    with direct_vm.prank(direct_dana):
        agreement.authenticate_appeal("agreement-1", appeal_digest, appeal_provenance)
    state = json.loads(agreement.get_agreement("agreement-1"))
    assert state["appeal_authenticated"] is False
    assert state["appeal_verification_status"] == "SOURCE_DIGEST_MISMATCH"
    with direct_vm.expect_revert("WL_APPEAL_NOT_AUTHENTICATED"):
        agreement.resolve_appeal("agreement-1")


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
    revision = state["revision"]
    agreement.finalize_decision("agreement-1")
    assert json.loads(agreement.get_agreement("agreement-1"))["revision"] == revision


@pytest.mark.direct
def test_unauthorized_evidence_and_premature_sealing_are_rejected(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    create(direct_vm, agreement, direct_alice, direct_bob, direct_charlie, direct_dana)
    activate(direct_vm, agreement, direct_bob)
    publish_and_verify(direct_vm, agreement, direct_charlie, direct_dana)
    with direct_vm.expect_revert("WL_PARTY_REQUIRED"):
        with direct_vm.prank(direct_dana):
            agreement.submit_evidence("agreement-1", "source", "att-1")
    with direct_vm.prank(direct_alice):
        agreement.acknowledge_delivery("agreement-1")
        agreement.submit_evidence("agreement-1", "source", "att-1")
        with direct_vm.expect_revert("WL_EVIDENCE_INCOMPLETE"):
            agreement.seal_agreement("agreement-1")
    with direct_vm.prank(direct_charlie):
        agreement.authenticate_evidence("agreement-1", "source", digest(SOURCE_BODY))
    with direct_vm.prank(direct_alice):
        agreement.seal_agreement("agreement-1")
    assert json.loads(agreement.get_agreement("agreement-1"))["status"] == "SEALED"


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
def test_task_limit_prevents_unreachable_dossier_combinations(
    direct_vm, direct_deploy, direct_alice, direct_bob, direct_charlie, direct_dana
):
    agreement = direct_deploy("contracts/Witlock.py", sdk_version=SDK_VERSION)
    direct_vm.warp("2026-01-01T00:00:00Z")
    long_terms = terms(address_hex(direct_charlie), address_hex(direct_dana), 5)
    with direct_vm.expect_revert("WL_TASKS"):
        create(
            direct_vm,
            agreement,
            direct_alice,
            direct_bob,
            direct_charlie,
            direct_dana,
            terms_value=long_terms,
        )


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
