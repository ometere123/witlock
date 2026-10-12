"""Deterministic WITLOCK policy helpers used by tests and review tooling.

These functions model agreement validation and scoring only. They do not move
GEN, authorize withdrawals, or stand in for GenVM execution.
"""

from hashlib import sha256
import json


STATUSES = {
    "DRAFT",
    "ACTIVE",
    "SEALED",
    "APPROVED",
    "PARTIAL",
    "REJECTED",
    "INCONCLUSIVE",
    "TIMED_OUT",
    "EXPIRED",
    "APPEALED",
}


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"))


def digest(value):
    return sha256(canonical(value).encode()).hexdigest()


def _address(value):
    return (
        isinstance(value, str)
        and len(value) == 42
        and value.startswith("0x")
        and all(char in "0123456789abcdefABCDEF" for char in value[2:])
    )


def _key(value, maximum):
    return (
        isinstance(value, str)
        and 1 <= len(value) <= maximum
        and all(char in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-" for char in value)
    )


def validate_terms(terms):
    if not isinstance(terms, dict):
        raise ValueError("terms object required")
    tasks = terms.get("tasks")
    if not isinstance(tasks, list) or not 1 <= len(tasks) <= 8:
        raise ValueError("1..8 tasks required")
    if any(not isinstance(task, dict) for task in tasks):
        raise ValueError("schema")
    if sum(t.get("weight", 0) for t in tasks) != 100:
        raise ValueError("weights must total 100")
    ids = set()
    for task in tasks:
        if set(task) != {"id", "question", "weight", "critical", "issuer"}:
            raise ValueError("schema")
        if not _key(task["id"], 20) or task["id"] in ids:
            raise ValueError("duplicate/invalid id")
        ids.add(task["id"])
        if type(task["weight"]) is not int or not 1 <= task["weight"] <= 100:
            raise ValueError("weight")
        if type(task["critical"]) is not bool:
            raise ValueError("critical")
        if not isinstance(task["question"], str) or not 20 <= len(task["question"]) <= 400:
            raise ValueError("question")
        if not _address(task["issuer"]):
            raise ValueError("issuer")
    return True


def validate_attestation(attestation, task, parties, expected_subject):
    required = {"issuer", "subject", "digest", "claim", "source", "registry_key"}
    if not isinstance(attestation, dict) or set(attestation) != required:
        raise ValueError("attestation schema")
    if not _address(attestation["issuer"]):
        raise ValueError("issuer address")
    if not isinstance(attestation["subject"], str):
        raise ValueError("subject")
    issuer = attestation["issuer"].lower()
    if issuer != task["issuer"].lower() or issuer in {party.lower() for party in parties}:
        raise ValueError("issuer authorization")
    if attestation["subject"] != expected_subject:
        raise ValueError("subject")
    if not isinstance(attestation["digest"], str) or len(attestation["digest"]) != 64 or any(
        char not in "0123456789abcdef" for char in attestation["digest"]
    ):
        raise ValueError("digest")
    if (
        not isinstance(attestation["claim"], str)
        or not isinstance(attestation["source"], str)
        or not 1 <= len(attestation["claim"]) <= 800
        or not 1 <= len(attestation["source"]) <= 400
    ):
        raise ValueError("bounds")
    if not _key(attestation["registry_key"], 96):
        raise ValueError("registry key")
    return True


def decide(terms, answers):
    validate_terms(terms)
    if set(answers) != {task["id"] for task in terms["tasks"]}:
        raise ValueError("result set")
    if any(value not in ("PASS", "FAIL", "UNKNOWN") for value in answers.values()):
        raise ValueError("result label")
    if any(task["critical"] and answers[task["id"]] == "FAIL" for task in terms["tasks"]):
        return {"status": "REJECTED", "score": 0}
    if "UNKNOWN" in answers.values():
        return {"status": "INCONCLUSIVE", "score": 0}
    score = sum(task["weight"] for task in terms["tasks"] if answers[task["id"]] == "PASS")
    return {"status": "APPROVED" if score == 100 else ("PARTIAL" if score else "REJECTED"), "score": score}


def allocate(deposit, score):
    """Arithmetic-only allocation model; custody remains disabled in WITLOCK."""
    if not isinstance(deposit, int) or deposit < 0 or not isinstance(score, int) or not 0 <= score <= 100:
        raise ValueError("amount")
    operator = deposit * score // 100
    return {"operator": operator, "client": deposit - operator}


def timeout_status(status, now, accept_deadline, delivery_deadline):
    if status == "DRAFT" and now > accept_deadline:
        return "EXPIRED"
    if status == "ACTIVE" and now > delivery_deadline:
        return "TIMED_OUT"
    raise ValueError("timeout not available")
