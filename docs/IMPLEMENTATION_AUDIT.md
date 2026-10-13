# Implementation audit

Audit date: 2026-10-13. The canonical contract, route-first frontend, and current StudioNet deployment were audited and revalidated.

| Severity | Finding | Remediation or disposition | Verification |
| --- | --- | --- | --- |
| Critical | Custody could be mistaken for an operational payment feature | `custody_enabled()` remains false; non-zero funding, bond, and payment paths reject | Direct Mode, live zero-value readbacks, frontend copy |
| High | First adjudication after an expired agreement deadline could leave no meaningful appeal period | The first ruling captures `appeal_window_started_at` and raises the effective deadline to at least 900 seconds, once | Direct Mode delayed adjudication and live delayed ruling |
| High | Receipt metadata could mask an explicit execution failure or accept malformed consensus records | Top-level aliases must agree; explicit errors fail closed; `NO_MAJORITY` and malformed/inconsistent validator records reject; only explicit quorum cancellation is accepted | 11 frontend receipt tests |
| High | Evidence hash alone did not prove provenance | Immutable raw GitHub commit retrieval, byte digest comparison, provenance commitment, commit identity check, and independent verifier consensus | Direct Mode and live source observations |
| Medium | Wallet state was split across route components | One shared injected EIP-1193 wallet provider owns account, chain, disconnect, reconnect, and network messages | Typecheck, build, Chrome session |

## Current verification

- Contract: `0x8B6e64A6C5c5Bccc3a64Cba4Bd8982218381330d`
- Deployment: `0x298e3e7eed4ec8ad25017600f87f49608cdc5bfb94b5d7eadf0cb0dbfabace1`
- Source commit: `7ce1517d82e711aa12604177ddadaa644c1691e8`
- Source SHA-256: `04352A02F6BFBD7BEF7C5C00BE93FD5779ABD5BC340941C62863BF2ABB1E8C79`
- Local and normalized deployed source: 64,131 bytes
- GenVM schema: 37 methods, 13 views, 24 writes, zero constructor parameters
- Direct Mode: 37 passed
- Frontend receipt tests: 11 passed
- Dependency audit: 0 vulnerabilities

The live lifecycle and browser evidence are reported separately in `docs/LIVE_PROOF.md`. The custody boundary is explicit: no operational GEN escrow, payment delivery, or recovery semantics are claimed.
