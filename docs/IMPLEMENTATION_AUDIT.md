# Implementation audit

Audit date: 2026-10-12. The repository was audited against the original handoff and then revalidated locally and on stable StudioNet 61999.

| Severity | Original defect | Remediation | Verification |
| --- | --- | --- | --- |
| Critical | Two deployable contracts made parity and custody boundaries ambiguous | One canonical `Witlock` monolith owns policy, evidence, adjudication, appeals, audit, and guarded settlement accounting | deployed schema, exact source parity |
| Critical | Custody and transfer recovery were unproven | Hard false custody gate, zero-value-only live path, frozen role-derived payment scaffolding, authenticated delivery evidence, ambiguity state, no blind retry | 24 Direct Mode tests, live `custody_enabled=false` |
| High | Evidence hash and issuer publication were treated as sufficient provenance | Frozen retrieval metadata plus an independent verifier transaction must match digest and provenance before evidence is admissible | adversarial Direct Mode tests, live verifier/authentication receipts |
| High | Provider evidence could be locked out by requester acknowledgement or dispute | Evidence submission/authentication stays open through `ACTIVE`, `DELIVERED`, and `REVIEW` until delivery deadline | Direct Mode regression tests |
| High | Resolved appeals could not be finalized and expiry could erase a ruling | Appeal status is explicit; resolution returns to `APPEAL_WINDOW`, finalization accepts `RESOLVED`, expiry preserves the prior ruling | Direct Mode appeal tests, live resolved appeal/readback |
| High | Consensus failures could revert unpredictably or truncate dossiers | Full bounded dossier, bounded result, strict mapping, exception handling, failed-closed `INCONCLUSIVE` | malformed/oversized consensus tests |
| Medium | CLI typed address/JSON arguments were incompatible with string contract fields | Normalize typed provider, issuer/verifier, terms, and grounds values before strict validation | live CLI/js deployment and lifecycle |
| Medium | Frontend reported writes without finalized successful receipts | Injected EIP-1193 account/chain guards, persistent pending transaction recovery, `FINALIZED` plus execution-success checks, explorer links | typecheck and production build |

## Verified release

- Git SHA: `e57424aa97817469385add4a426943dd67ca1d19`
- StudioNet contract: `0x4D39aBdF8F574B44Ff178CBf974042a36D70c9A0`
- Deployed source hash: `E71CF73539EB4A552C5CE120C29227F5197E89CE288DF09E344D5B93F64E8A81`
- Schema: 37 methods, 13 views, 24 writes, zero constructor parameters
- Local suite: 24 passed; dependency audit: 0 vulnerabilities

## Remaining proof boundaries

The final live readback is `FINAL_DECISION` with `appeal_status=FINALIZED` and audit revision 12, but the finalization transaction's leader receipt reports `execution_result=ERROR` despite a finalized majority consensus. This is retained as a limitation. Browser wallet execution, recipient-side payment, ambiguous transfer recovery, and production custody remain unproven and disabled.
