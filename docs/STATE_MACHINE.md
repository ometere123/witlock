# State machine

| From | Method | Caller | Guards | To |
| --- | --- | --- | --- | --- |
| none | `create_agreement` | requester | valid frozen terms, external issuers, ordered deadlines, zero funding while gate is closed | `DRAFT` |
| `DRAFT` | `fund_agreement` | requester | exact value and custody gate | `FUNDED` |
| `DRAFT` | `post_operator_bond` | provider | exact value and custody gate | `DRAFT` |
| `DRAFT` | `accept_agreement` | provider | funded/bond requirements and acceptance deadline | `FUNDED` → `ACTIVE` |
| `ACTIVE` | `publish_attestation` | nominated issuer | exact subject and immutable record | `ACTIVE` |
| `ACTIVE` | `submit_evidence` | requester/provider | before delivery deadline, existing case-scoped attestation | `ACTIVE` |
| `ACTIVE` / `DELIVERED` / `REVIEW` | `authenticate_evidence` | nominated issuer | exact digest and evidence binding | same |
| `ACTIVE` | `acknowledge_delivery` | requester | before delivery deadline | `DELIVERED` |
| `ACTIVE` / `DELIVERED` | `open_dispute` | requester/provider | valid reason digest and appeal window | `REVIEW` |
| `ACTIVE` / `DELIVERED` | `timeout_delivery` | anyone | after delivery deadline | `REVIEW` |
| `DELIVERED` / `REVIEW` | `seal_agreement` | requester/provider | every criterion authenticated | `SEALED` |
| `SEALED` | `adjudicate` | permissionless | bounded consensus over complete dossier | `DECIDED` → `APPEAL_WINDOW` |
| `REVIEW` | `finalize_inconclusive` | permissionless | deadline passed and at least one criterion is incomplete | `DECIDED` → `APPEAL_WINDOW` |
| `APPEAL_WINDOW` | `open_appeal` | requester/provider | one digest before appeal deadline | `APPEALED` |
| `APPEALED` | `resolve_appeal` | permissionless | authenticated dossier and bounded consensus | `DECIDED` → `APPEAL_WINDOW` |
| `APPEALED` | `expire_appeal` | permissionless | appeal resolution deadline passed | `FINAL_DECISION` blocked |
| `APPEAL_WINDOW` | `finalize_decision` | permissionless | deadline passed and no appeal | `FINAL_DECISION` |
| `FINAL_DECISION` | `begin_payment` | permissionless | custody gate, payable state, idempotent attempt | `PAYMENT_PENDING` |
| `PAYMENT_PENDING` | `reconcile_payment` | permissionless | verified receipt or explicit ambiguity | `RECONCILED` or unresolved |

The live contract currently reaches a zero-value reconciled state or an explicit blocked state because custody is disabled. No method changes recipients or frozen policy.