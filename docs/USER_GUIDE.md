# User guide

1. Open `/verification` to check the configured StudioNet endpoint and current-source contract binding. Connect an injected EIP-1193 wallet and switch to StudioNet `61999` when signing is needed.
2. Use `/new` to create a zero-value agreement with a unique key, provider, details digest, ordered deadlines, and 1–2 criteria. Each criterion must nominate a distinct issuer and independent verifier. Funding and operator bond values must be zero while custody is disabled.
3. Open `/workspace` for the role-aware entry point, or enter the exact case key in `/explore`. The case links lead to separate agreement, evidence, review, and settlement pages.
4. On `/agreement/:id`, the provider accepts before the acceptance deadline. A draft can expire after that deadline without value received.
5. On `/evidence/:id`, the nominated issuer publishes a case-scoped attestation containing the digest, source coordinate, immutable revision, retrieval method/time, claim, and provenance digest.
6. The independent verifier calls `verify_attestation_source` with the observed digest and provenance hash. A party can then submit the attestation, and the issuer authenticates the exact digest.
7. The requester acknowledges delivery or either party opens a dispute. Evidence remains admissible after acknowledgement or dispute while the delivery deadline is open. Sealing requires every criterion to be verified and authenticated.
8. On `/review/:id`, `adjudicate` asks GenLayer validators to agree on a bounded `PASS`, `FAIL`, or `INCONCLUSIVE` mapping. Contract code owns the result and integer allocation.
9. A party may open one structured appeal before the appeal deadline. The frozen appeal grounds must identify the criterion, challenged decision version, source coordinates, retrieval metadata, claim, digest, and provenance. The independent verifier authenticates those grounds before `resolve_appeal`.
10. A resolved appeal returns to the appeal window and can be finalized after the deadline. An unresolved appeal expires by preserving the prior ruling. Inspect decision versions and audit history on the review route, and use `/activity` to recover pending or inspect finalized browser receipts.

Decision finality is not payment finality. Native GEN custody, recipient delivery, and transfer recovery are disabled until the target network proves those behaviors end to end. The frontend therefore shows custody as disabled and does not represent a decision allocation as a payment.
