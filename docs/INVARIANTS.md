# Invariants

1. **Frozen policy:** a case key, parties, task set, issuer addresses, weights, critical flags, digests, and deadlines are immutable after `create_case`.
2. **Role separation:** requester, provider, and each nominated issuer must be distinct.
3. **Bounded input:** keys, questions, claims, sources, evidence JSON, task count, and dossier size have explicit limits.
4. **Issuer binding:** `authenticate_evidence` is accepted only from the nominated issuer and only when the registry record matches issuer, subject, digest, source, and claim exactly.
5. **No evidence replay:** a registry key can be used once across the agreement engine.
6. **Deterministic economics:** score and status are calculated from frozen integer weights; consensus cannot output recipients or money.
7. **Consensus schema:** the consensus result must contain every criterion exactly once and each value must be `PASS`, `FAIL`, or `UNKNOWN`.
8. **Deadline safety:** timeout methods reject calls made before their corresponding deadline.
9. **History:** every agreement transition creates a new immutable history entry with a monotonically increasing revision.
10. **Custody gate:** `custody_enabled()` is false and no withdrawal or administrator transfer path exists.

The first six invariants are directly exercised by pure policy tests. Contract-level and live-network verification are separate gates and are not inferred from those tests.
