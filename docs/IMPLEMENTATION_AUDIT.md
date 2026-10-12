# Implementation audit

Audit date: 2026-10-12. The repository was inspected at the existing `main` history before this monolith pass, then deployed and read back from stable StudioNet.

## Findings addressed

| Severity | Finding | Remediation | Evidence |
| --- | --- | --- | --- |
| Critical | Two deployable contracts made deployment and source parity ambiguous | Consolidated all responsibilities into `contracts/Witlock.py` | Live source hash and schema parity |
| Critical | Custody and transfer recovery were unproven | Added an explicit false custody gate, exact-value guards, accounting fields, and blocked payout methods | Direct Mode, live `custody_enabled=false` |
| High | Evidence authority was separate and replay-prone | Case-scoped immutable attestations, nominated issuer checks, and a second authentication transaction now live in the monolith | Direct Mode and deployed schema |
| High | Sealing and inconclusive closure were too permissive | Sealing requires the correct delivery/review state and complete authenticated evidence; inconclusive closure requires a passed deadline and incomplete evidence | Direct Mode |
| High | Decision history could be overwritten | Decisions are keyed by agreement and monotonically increasing version | Direct Mode append-only check |
| High | Appeal resolution could remain stuck | Appeal expiry produces an explicit blocked final decision after its resolution deadline | Direct Mode |
| Medium | Consensus labels were uncontrolled | Exact bounded `PASS` / `FAIL` / `INCONCLUSIVE` schema and comparative equivalence | lint, Direct Mode |
| Medium | Frontend referenced a second address and old methods | Frontend now targets one contract and `create_agreement`; environment contains one deployed address | typecheck/build and live schema |

## Verified locally and live

- CLI package: `0.39.1`; genlayer-js: `1.1.8`.
- Stable network constants: StudioNet `61999`, `0xF22F`, approved RPC and explorer.
- Monolith lint, semantic validation, and schema reflection pass.
- Direct Mode executes five contract tests, including a mocked bounded consensus path.
- Deployment finalized with execution `SUCCESS` and five validator `AGREE` votes.
- Live source parity is exact at SHA-256 `5EB2C4ADA4A78C22AC484E974FC5D457F042624661876422099CB04B07BBCF95`.

## Remaining proof boundaries

Browser wallet flow, a target-network agreement lifecycle, recipient-side payment, and recovery remain separate proof gates. Custody is intentionally disabled until those behaviors are proven.
