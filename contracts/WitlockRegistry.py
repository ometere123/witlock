# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""Bounded issuer registry for WITLOCK evidence records.

The registry proves that a particular wallet published an immutable record. It
does not prove that the wallet represents a human, owns a domain, or made the
claim truthfully. The decision contract must still nominate the issuer and
bind the record to one agreement criterion.
"""

from genlayer import *
from genlayer import gl
import json


class WitlockRegistry(gl.Contract):
    records: TreeMap[str, str]
    record_count: u256

    def __init__(self):
        self.record_count = u256(0)

    def _reject(self, code: str) -> None:
        raise gl.vm.UserError("WL_REGISTRY_" + code)

    def _bounded(self, value: str, minimum: int, maximum: int) -> bool:
        return isinstance(value, str) and minimum <= len(value) <= maximum

    def _digest(self, value: str) -> bool:
        return (
            isinstance(value, str)
            and len(value) == 64
            and all(char in "0123456789abcdef" for char in value)
        )

    @gl.public.write
    def attest(
        self,
        key: str,
        subject: str,
        evidence_hash: str,
        source: str,
        claim: str,
    ) -> None:
        """Publish one immutable issuer record.

        The sender is the issuer identity. A record cannot be replaced, which
        makes replay and source substitution detectable by the decision engine.
        """
        if not self._bounded(key, 1, 96):
            self._reject("KEY")
        if not self._bounded(subject, 1, 128):
            self._reject("SUBJECT")
        if not self._digest(evidence_hash):
            self._reject("DIGEST")
        if not self._bounded(source, 1, 400):
            self._reject("SOURCE")
        if not self._bounded(claim, 1, 800):
            self._reject("CLAIM")
        if self.records.get(key, ""):
            self._reject("KEY_USED")

        self.records[key] = json.dumps(
            {
                "key": key,
                "subject": subject,
                "issuer": gl.message.sender_address.as_hex.lower(),
                "digest": evidence_hash,
                "source": source,
                "claim": claim,
            },
            sort_keys=True,
        )
        self.record_count = u256(int(self.record_count) + 1)

    @gl.public.view
    def get_attestation(self, key: str) -> str:
        return self.records.get(key, "")

    @gl.public.view
    def count(self) -> int:
        return int(self.record_count)

    @gl.public.view
    def custody_enabled(self) -> bool:
        return False
