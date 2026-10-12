# Implementation audit

Audit date: 2026-10-12. Starting commit: `391bf9993d0fee1dc940c52c4dcec337a02aae88`.

## Original state

The repository contained two small contracts, one pure policy module, one nine-test policy suite, and a single Next.js client page. Custody was already disabled. The latest local frontend typecheck failed because `genlayer-js` 1.1.8 does not accept the `transport` client property, does not accept the stale `stateStatus` read option in its installed types, and the TypeScript target was below ES2020 for the bigint literal. The GitHub workflow compiled Python and built the frontend but did not lint or execute GenVM contracts.

## Findings and remediation

| Severity | Finding | Remediation | Status |
| --- | --- | --- | --- |
| Critical | No safe custody or transfer proof existed | Kept custody and payout paths disabled and documented the gate | Remediated by containment |
| High | Evidence registry was not part of authentication | Agreement now reads the registry and checks all immutable fields | Implemented; needs GenVM/live verification |
| High | Agreement had no deadlines, timeout state, appeal, or append-only history | Added ordered deadlines, timeout paths, bounded appeal, and history records | Implemented; needs GenVM/live verification |
| High | Bare exceptions made contract errors less stable | Replaced contract reverts with prefixed `gl.vm.UserError` codes | Implemented; lint passed |
| High | Consensus output was loosely parsed | Added JSON shape, exact criterion-set, and controlled-label checks | Implemented; Direct Mode covers deterministic paths, live consensus remains unproven |
| Medium | Registry allowed weakly bounded records | Added bounded key, subject, source, claim, and digest validation | Implemented; lint passed |
| Medium | Frontend used an incompatible `genlayer-js` transport API | Switched to the installed SDK's `chain`, `provider`, `account`, and `endpoint` interface | Implemented; typecheck passed |
| Medium | CI did not assert the approved CLI or contract lint | Added pinned CLI, preflight, contract lint, semantic validation, frontend typecheck, and build gates | Remediated |
| Low | Product views were concentrated in one page | Added deadline-aware creation plus explore, workspace, evidence, review, settlement, verification, and guide routes | Implemented as honest route surfaces |

## Evidence collected

- Repository-local `genlayer` package: `0.39.1`.
- Installed `genlayer-js`: `1.1.8`.
- Approved StudioNet endpoint and chain: `https://studio.genlayer.com/api`, `61999`.
- `genvm-lint lint` and `genvm-lint check` passed for both contract sources; reflection found the expected methods and constructor shape.
- Python policy and Direct Mode suites: 15 tests passed.
- Frontend preflight, TypeScript check, and production build passed after the SDK API correction.

## Open verification gates

Full validator consensus, StudioNet deployment, browser wallet execution, source parity, and payment recovery remain unproven until their actual commands and receipts are recorded. This document does not convert those gates into passes.
