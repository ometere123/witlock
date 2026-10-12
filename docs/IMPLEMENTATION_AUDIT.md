# Implementation audit

Audit date: 2026-10-12. The repository was audited against the handoff and revalidated locally. Current StudioNet deployment proof is blocked by the network reporting no consensus contracts.

| Severity | Original defect | Remediation | Verification |
| --- | --- | --- | --- |
| Critical | Two deployable contracts made parity and custody boundaries ambiguous | One canonical `Witlock` monolith owns policy, evidence, adjudication, appeals, audit, and guarded settlement accounting | local source and GenVM check |
| Critical | Custody and transfer recovery were unproven | Hard false custody gate, zero-value-only path, explicit payment scaffolding, authenticated delivery evidence, ambiguity state, no blind retry | Direct Mode suite; live transfer remains unproven |
| High | Evidence hash and issuer publication were treated as sufficient provenance | Immutable raw GitHub commit retrieval, byte digest comparison, provenance commitment, GitHub commit identity check, and independent verifier consensus | 31 Direct Mode tests |
| High | Provider evidence could be locked out by requester acknowledgement or dispute | Evidence submission/authentication stays open through `ACTIVE`, `DELIVERED`, and `REVIEW` until delivery deadline | Direct Mode regression tests |
| High | Resolved appeals could not be finalized and expiry could erase a ruling | Explicit appeal status; resolution returns to `APPEAL_WINDOW`; finalization accepts `RESOLVED`; expiry preserves the prior ruling | Direct Mode appeal tests |
| High | Consensus failures could revert unpredictably or truncate dossiers | Bounded full dossier, strict labels, independent source observations, failed-closed `INCONCLUSIVE`, and pre-seal budget check | Direct Mode adversarial tests |
| Medium | Frontend reported writes without finalized successful receipts | Injected EIP-1193 account/chain guards, multiple pending transaction recovery, `FINALIZED` plus SDK `ExecutionResult.FINISHED_WITH_RETURN`, saved failed receipts, guided role/state consoles | frontend tests, typecheck, build |

## Current verification

- Git SHA: `2882e1fc17e07f36d389e028551a1aa7eec58761`
- Source SHA-256: `5A22F179E7D41CA12A501C0C2443AAF3C5FC088AF230DC7190B6542E9595D58D`
- Local suite: 31 passed
- GenVM schema check: 37 methods, 13 views, 24 writes, zero constructor parameters
- Dependency audit: 0 vulnerabilities
- Current contract address: none claimed

## External limitation

The current-source deployment attempt and earlier controls finalized `NO_MAJORITY` with no consensus data. The network probe says no consensus contracts are deployed. A successful current-source deployment, live cases, current-source parity, browser signing, and successful finalization therefore remain `NOT PROVEN` until the StudioNet consensus layer is restored.
