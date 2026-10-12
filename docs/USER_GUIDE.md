# User guide

1. Connect an injected EIP-1193 wallet and switch to GenLayer StudioNet `61999`.
2. Configure `NEXT_PUBLIC_WITLOCK_CONTRACT` only with a fresh address recorded after current-source parity is verified in the live manifest. The checked-in example is intentionally empty while StudioNet consensus is unavailable. The frontend blocks writes without an injected provider, with a different account, or on another chain.
3. Create an agreement with a unique key, provider, details digest, ordered deadlines, and 1–4 criteria. Each criterion must nominate a distinct issuer and independent verifier. Funding and operator bond values must be zero while custody is disabled.
4. The provider accepts before the acceptance deadline. A draft can expire after that deadline without value received.
5. The nominated issuer publishes a case-scoped attestation containing the digest, source coordinate, immutable revision, retrieval method/time, claim, and provenance digest.
6. The independent verifier calls `verify_attestation_source` with the observed digest and provenance hash. A party can then submit the attestation, and the issuer authenticates the exact digest.
7. The requester acknowledges delivery or either party opens a dispute. Evidence remains admissible after acknowledgement or dispute while the delivery deadline is open. Sealing requires every criterion to be verified and authenticated.
8. `adjudicate` asks GenLayer validators to agree on a bounded `PASS`, `FAIL`, or `INCONCLUSIVE` mapping. Contract code owns the result and integer allocation.
9. A party may open one structured appeal before the appeal deadline. The frozen appeal grounds must identify the criterion, challenged decision version, source coordinates, retrieval metadata, claim, digest, and provenance. The independent verifier authenticates those grounds before `resolve_appeal`.
10. A resolved appeal returns to the appeal window and can be finalized after the deadline. An unresolved appeal expires by preserving the prior ruling. Inspect decision versions and audit history to verify the terminal path.

Decision finality is not payment finality. Native GEN custody, recipient delivery, and transfer recovery are disabled until the target network proves those behaviors end to end. The frontend therefore shows custody as disabled and does not represent a decision allocation as a payment.
