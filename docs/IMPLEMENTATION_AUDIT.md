# Implementation audit

Audit date: 2026-10-13. The canonical contract, route-first frontend, and current StudioNet deployment were audited and revalidated.

| Severity | Finding | Remediation or disposition | Verification |
| --- | --- | --- | --- |
| Critical | Native value could be stranded on a rejected payable call or paid twice | Funded rejection returns explicit value; role dispatch is frozen, saved before transfer, and one-use | Live funded-refusal probe, live dispatch, Direct Mode replay test |
| High | First adjudication after an expired agreement deadline could leave no meaningful appeal period | The first ruling captures `appeal_window_started_at` and raises the effective deadline to at least 900 seconds, once | Direct Mode delayed adjudication and live delayed ruling |
| High | Receipt metadata could mask an explicit execution failure or accept malformed consensus records | Top-level aliases must agree; explicit errors fail closed; `NO_MAJORITY` and malformed/inconsistent validator records reject; only explicit quorum cancellation is accepted | 13 frontend receipt tests |
| High | Evidence hash alone did not prove provenance | Immutable raw GitHub commit retrieval, byte digest comparison, provenance commitment, commit identity check, and independent verifier consensus | Direct Mode and live source observations |
| Medium | Wallet state was split across route components | One shared injected EIP-1193 wallet provider owns account, chain, disconnect, reconnect, and network messages | Typecheck, build, Chrome session |

## Current verification

- Contract: `0x8d90aE2C95E320Ea61774a797D92ef84F6831bC2`
- Deployment: `0xd38499ccb036e6188428a47707e5cdb71f289cd3e9dc47af7c3dc30e061cfe68`
- Source SHA-256: `93de46c2c0749f9016cd4297658679b0f25f12e0bce91ab6fe867d328835dff9`
- Local and deployed source: 64,862 exact bytes
- GenVM schema: 35 methods, 13 views, 22 writes, zero constructor parameters
- Direct Mode: 38 passed
- Frontend receipt tests: 13 passed
- Dependency audit: 0 vulnerabilities

The live lifecycle and browser evidence are reported separately in `docs/LIVE_PROOF.md`. Payment delivery remains an external observation, and ambiguous transfer recovery remains bounded by the seven-day incident path.
