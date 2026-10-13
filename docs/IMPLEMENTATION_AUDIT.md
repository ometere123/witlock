# Implementation audit

Audit date: 2026-10-13. The canonical contract, route-first frontend, and current StudioNet deployment were audited and revalidated.

| Severity | Finding | Remediation or disposition | Verification |
| --- | --- | --- | --- |
| Critical | Native value could be stranded on a rejected payable call or paid twice | Funded rejection returns explicit value; role dispatch is frozen, saved before transfer, and one-use | Live funded-refusal probe, live dispatch, Direct Mode replay test |
| High | First adjudication after an expired agreement deadline could leave no meaningful appeal period | The first ruling captures `appeal_window_started_at` and raises the effective deadline to at least 900 seconds, once | Direct Mode delayed adjudication and live delayed ruling |
| High | Receipt metadata could mask an explicit execution failure or accept malformed consensus records | Top-level aliases must agree; explicit errors fail closed; `NO_MAJORITY` and malformed/inconsistent validator records reject; only explicit quorum cancellation is accepted | 13 frontend receipt tests |
| High | Evidence hash alone did not prove provenance | Immutable raw GitHub commit retrieval, byte digest comparison, provenance commitment, commit identity check, and independent verifier consensus | Direct Mode and live source observations |
| Medium | Wallet state was split across route components | One shared injected EIP-1193 wallet provider owns account, chain, disconnect, reconnect, and network messages | Typecheck, build, production browser session |

## Current verification

- Contract: `0xC2523f90a89B0A989a15BE81fA124b435f0190cF`
- Deployment: `0x68238f2d8b195d8f753a0a1ca4d9934bbded309d5b2cd7480e64ab34da13938f`
- Source SHA-256: `caea7d3d630581256f679010b946cad4204fac7f9f3148d639b73899b65a41eb`
- Local and deployed source: 72,967 exact bytes
- GenVM schema: 37 methods, 13 views, 24 writes, zero constructor parameters
- Direct Mode: 41 passed
- Frontend receipt tests: 13 passed
- Dependency audit: 0 vulnerabilities

The live lifecycle and browser evidence are reported separately in `docs/LIVE_PROOF.md`. Payment delivery remains an external observation, and ambiguous transfer recovery remains bounded by the seven-day incident path.
