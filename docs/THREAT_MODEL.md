# Threat model

WITLOCK assumes requesters, providers, issuers, and verifiers may lie, collude, race deadlines, reuse evidence, submit prompt-injection text, point to replaced content, or attempt duplicate settlement. It also assumes wallet addresses do not prove human identity or independence.

The contract responds with immutable roles and terms, distinct issuer/verifier nomination, case-scoped attestations, immutable source and retrieval coordinates, independent source verification, exact digest/provenance matching, bounded dossiers, controlled consensus labels, deterministic arithmetic, append-only decision versions, structured appeals, and deadline-checked recovery paths.

Adversarial tests cover unauthorized calls, issuer substitution, missing source verification, evidence after acknowledgement/dispute, malformed and oversized consensus data, incomplete criteria, duplicate records, draft expiry, appeal expiry, resolved appeal finalization, recipient/amount substitution, and custody rejection. Source URLs and claims remain untrusted input; unavailable or contradictory evidence can produce `INCONCLUSIVE`.

The principal unresolved threat is asynchronous native-token transfer semantics. Recipient delivery, failed-child behavior, ambiguous receipts, and restart recovery have not been proven on StudioNet 61999, so custody and payout operations remain disabled. The live finalization receipt also reports an execution error while readback shows final state; that discrepancy is preserved rather than hidden.
