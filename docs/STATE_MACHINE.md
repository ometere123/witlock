# State machine

| From | Method | Caller | Guards | To |
| --- | --- | --- | --- | --- |
| none | `create_agreement` | requester | strict terms, distinct provider/issuer/verifier, ordered deadlines, zero value while custody is closed | `DRAFT` |
| `DRAFT` | `accept_agreement` | provider | correct provider, acceptance deadline, exact zero-value requirements | `ACTIVE` |
| `DRAFT` | `expire_draft` | permissionless | acceptance deadline elapsed and no value received | `EXPIRED` terminal |
| `ACTIVE` / `DELIVERED` / `REVIEW` | `publish_attestation` | nominated issuer | frozen task, immutable ID, bounded source/revision/claim, valid retrieval metadata | evidence registry |
| evidence registry | `verify_attestation_source` | independent verifier | frozen verifier, exact digest and provenance hash | source verified |
| `ACTIVE` / `DELIVERED` / `REVIEW` | `submit_evidence` | requester/provider | case-scoped attestation, source verified, before delivery deadline | evidence bound |
| `ACTIVE` / `DELIVERED` / `REVIEW` | `authenticate_evidence` | nominated issuer | exact digest, source verified, before delivery deadline | authenticated evidence |
| `ACTIVE` | `acknowledge_delivery` | requester | before delivery deadline | `DELIVERED` |
| `ACTIVE` / `DELIVERED` | `open_dispute` | requester/provider | reason digest, valid dispute window | `REVIEW` |
| `ACTIVE` / `DELIVERED` | `timeout_delivery` | permissionless | delivery deadline elapsed | `REVIEW` |
| `DELIVERED` / `REVIEW` | `seal_agreement` | requester/provider | every criterion source verified and issuer authenticated | `SEALED` |
| `SEALED` | `adjudicate` | permissionless | bounded dossier and comparative consensus | `APPEAL_WINDOW`, decision version +1 |
| `REVIEW` | `finalize_inconclusive` | permissionless | delivery deadline elapsed and incomplete evidence | `APPEAL_WINDOW`, blocked decision |
| `APPEAL_WINDOW` | `open_appeal` | requester/provider | one structured grounds object, matching decision version, before appeal deadline | `APPEALED` |
| `APPEALED` | `authenticate_appeal` | independent verifier | frozen grounds digest/provenance match, before resolution deadline | authenticated appeal |
| `APPEALED` | `resolve_appeal` | permissionless | authenticated appeal and bounded consensus | `APPEAL_WINDOW`, decision version +1, appeal `RESOLVED` |
| `APPEALED` | `expire_appeal` | permissionless | appeal resolution deadline elapsed | `FINAL_DECISION`, prior ruling preserved, appeal `EXPIRED` |
| `APPEAL_WINDOW` with appeal `NONE`/`RESOLVED` | `finalize_decision` | permissionless | appeal deadline elapsed | `FINAL_DECISION`, appeal `FINALIZED` |
| `FINAL_DECISION` | `begin_payment` | permissionless | custody enabled, payable entitlement, frozen role-derived recipient and amount, idempotent attempt | `PAYMENT_PENDING` |
| `PAYMENT_PENDING` | `confirm_payment_delivery` | permissionless | custody, recipient, receipt hash, and independent delivery evidence | delivery-attested payment |
| `PAYMENT_PENDING` | `reconcile_payment` | permissionless | authenticated delivery evidence and matching receipt; no boolean caller claim | `RECONCILED` |
| `PAYMENT_PENDING` | `mark_payment_ambiguous` | permissionless | transfer deadline elapsed and incident hash | `UNRESOLVED`, no re-credit or blind retry |

The state transitions are covered by Direct Mode tests. A historical superseded case reached `FINAL_DECISION` with `appeal_status=FINALIZED` and `BLOCKED_INCONCLUSIVE` zero-value settlement, but no current-source live case is claimed while StudioNet consensus is unavailable. Custody is disabled, so payment transitions are intentionally unreachable. No public method can change frozen recipients or policy.
