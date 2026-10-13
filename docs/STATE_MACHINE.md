# State machine

| From | Method | Caller | Guards | To |
| --- | --- | --- | --- | --- |
| none | `create_agreement` | requester | strict terms, distinct provider/issuer/verifier, ordered deadlines, funding bounds, zero operator bond | `DRAFT` |
| `DRAFT` | `fund_agreement` | requester | exact required value; every rejection returns funded value | `DRAFT` funded |
| `DRAFT` | `accept_agreement` | provider | correct provider and acceptance deadline | `ACTIVE` |
| `DRAFT` | `expire_draft` | permissionless | acceptance deadline elapsed and no value received | `EXPIRED` terminal |
| `DRAFT` funded | `recover_expired_funding` | requester | acceptance deadline elapsed, exact funding received, one-use refund latch | `EXPIRED`, refund pending delivery |
| `EXPIRED` refund pending | `mark_funding_refund_ambiguous` | permissionless | seven-day refund observation deadline elapsed and incident digest | `UNRESOLVED_PAYMENT`, no retry |
| `ACTIVE` / `DELIVERED` / `REVIEW` | `publish_attestation` | nominated issuer | frozen task, immutable ID, bounded source/revision/claim, valid retrieval metadata | evidence registry |
| evidence registry | `verify_attestation_source` | independent verifier | frozen verifier, exact digest and provenance hash | source verified |
| `ACTIVE` / `DELIVERED` / `REVIEW` | `submit_evidence` | requester/provider | case-scoped attestation, source verified, before delivery deadline | evidence bound |
| `ACTIVE` / `DELIVERED` / `REVIEW` | `authenticate_evidence` | nominated issuer | exact digest, source verified, before delivery deadline | authenticated evidence |
| `ACTIVE` | `acknowledge_delivery` | requester | before delivery deadline | `DELIVERED` |
| `ACTIVE` / `DELIVERED` | `open_dispute` | requester/provider | reason digest, valid dispute window | `REVIEW` |
| `ACTIVE` / `DELIVERED` | `timeout_delivery` | permissionless | delivery deadline elapsed | `REVIEW` |
| `DELIVERED` / `REVIEW` | `seal_agreement` | requester/provider | every criterion source verified and issuer authenticated | `SEALED` |
| `SEALED` | `adjudicate` | permissionless | bounded dossier and comparative consensus | `APPEAL_WINDOW`, decision version +1 |
| `REVIEW` | `finalize_inconclusive` | permissionless | delivery deadline elapsed and incomplete evidence | `APPEAL_WINDOW`, fixed INCONCLUSIVE recovery split |
| `APPEAL_WINDOW` | `open_appeal` | requester/provider | one structured grounds object, matching decision version, before appeal deadline | `APPEALED` |
| `APPEALED` | `authenticate_appeal` | independent verifier | frozen grounds digest/provenance match, before resolution deadline | authenticated appeal |
| `APPEALED` | `resolve_appeal` | permissionless | authenticated appeal and bounded consensus | `APPEAL_WINDOW`, decision version +1, appeal `RESOLVED` |
| `APPEALED` | `expire_appeal` | permissionless | appeal resolution deadline elapsed | `FINAL_DECISION`, prior ruling preserved, appeal `EXPIRED` |
| `APPEAL_WINDOW` with appeal `NONE`/`RESOLVED` | `finalize_decision` | permissionless | appeal deadline elapsed | `FINAL_DECISION`, appeal `FINALIZED` |
| `FINAL_DECISION` | `begin_payment` | permissionless | payable entitlement, frozen role-derived recipient and amount, one-use role latch | `DISPATCHED_PENDING_DELIVERY` |
| `DISPATCHED_PENDING_DELIVERY` | `mark_payment_ambiguous` | permissionless | transfer deadline elapsed and incident hash | `UNRESOLVED`, no re-credit or blind retry |

The state transitions are covered by Direct Mode tests. The current-source live ledger records a funded rejected ruling, a resolved appeal returning to `APPEAL_WINDOW`, terminal finalization, idempotent replay, and a native dispatch. No public method can change frozen recipients or policy.
