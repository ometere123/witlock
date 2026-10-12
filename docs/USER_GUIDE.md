# User guide

1. Connect an injected EIP-1193 wallet and switch to GenLayer StudioNet `61999`.
2. Configure only `NEXT_PUBLIC_WITLOCK_CONTRACT` after source and schema parity are verified.
3. Create an agreement with a unique key, provider, terms digest, external issuer wallets, and ordered deadlines. Funding and operator bond values must remain zero while the custody gate is closed.
4. The provider accepts before the acceptance deadline.
5. The nominated issuer publishes an immutable case-scoped attestation containing the source coordinate, revision, claim, and provenance digest.
6. A party submits that attestation; the issuer authenticates the exact digest.
7. The requester acknowledges delivery or either party opens a dispute. Sealing requires every criterion to be authenticated.
8. Adjudication returns a bounded `PASS`, `FAIL`, or `INCONCLUSIVE` mapping; contract code calculates the result and integer allocation.
9. A party may open one appeal before the deadline. An unresolved appeal expires into an explicit blocked final state.
10. Inspect agreement state, decision versions, audit revisions, and settlement accounting.

Decision finality is not payment finality. The current product does not accept or distribute GEN and will not claim recipient delivery until the target network's transfer and recovery behavior is proven.