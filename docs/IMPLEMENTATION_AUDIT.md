# Implementation audit

Audit date: 2026-10-12. The repository was inspected at the existing `main` history before this monolith pass.

## Findings addressed

| Severity | Finding | Remediation | Evidence |
| --- | --- | --- | --- |
| Critical | Two deployable contracts made deployment and source parity ambiguous | Consolidated all responsibilities into `contracts/Witlock.py` | `genvm_lint check` and schema reflection |
| Critical | Custody and transfer recovery were unproven | Added an explicit false custody gate, exact-value guards, accounting fields, and blocked payout methods | Direct Mode and custody docs |
| High | Evidence authority was separate and replay-prone | Case-scoped immutable attestations, nominated issuer checks, and a second authentication transaction now live in the monolith | Direct Mode |
| High | Sealing and inconclusive closure were too permissive | Sealing requires the correct delivery/review state and complete authenticated evidence; inconclusive closure requires a passed deadline and incomplete evidence | Direct Mode |
| High | Decision history could be overwritten | Decisions are keyed by agreement and monotonically increasing version | Direct Mode append-only check |
| High | Appeal resolution could remain stuck | Appeal expiry produces an explicit blocked final decision after its resolution deadline | Direct Mode |
| Medium | Consensus labels were uncontrolled | Exact bounded `PASS` / `FAIL` / `INCONCLUSIVE` schema and comparative equivalence | lint, Direct Mode |
| Medium | Frontend referenced a second address and old methods | Frontend now targets one contract and `create_agreement`; environment contains one address | typecheck/build/preflight |

## Verified locally

- CLI package: `0.39.1`; genlayer-js: `1.1.8`.
- Stable network constants: StudioNet `61999`, `0xF22F`, approved RPC and explorer.
- Monolith lint, semantic validation, and schema reflection pass.
- Direct Mode executes five contract tests, including a mocked bounded consensus path.
- Live deployment, browser wallet flow, source parity, and recipient payment remain separate proof gates until actual evidence is recorded.