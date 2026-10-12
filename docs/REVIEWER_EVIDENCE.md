# Reviewer evidence

## Verified

- One canonical deployable source: `contracts/Witlock.py`, class `Witlock`.
- Repository-local CLI `0.39.1`, `genlayer-js` `1.1.8`, StudioNet chain `61999`, and approved RPC.
- `24 passed` Python/Direct Mode tests, compileall, GenVM lint/check/schema, `npm audit --audit-level=moderate`, frontend typecheck, and Next production build.
- Deployment `0x727050425edb3591f6438b6b4a88f2f7e8efcd160444f073062b9317e430b53f` is `FINALIZED` with execution `SUCCESS` and `MAJORITY_AGREE`; contract is `0x4D39aBdF8F574B44Ff178CBf974042a36D70c9A0`.
- Local/deployed source parity is exact at SHA-256 `E71CF73539EB4A552C5CE120C29227F5197E89CE288DF09E344D5B93F64E8A81`; deployed schema is 37 methods, zero constructor parameters.
- Real StudioNet case `live-20261012-03` finalized create, accept, attestation publication, independent source verification, evidence submission/authentication, delivery acknowledgement, sealing, adjudication, structured appeal, appeal authentication, and appeal resolution transactions.
- Live readback proves `FINAL_DECISION`, `appeal_status=FINALIZED`, decision version 2, source/evidence authentication, audit revision 12, and `BLOCKED_INCONCLUSIVE` zero-value settlement.

## Receipt limitation

The finalization transaction is `FINALIZED` but its leader receipt reports `execution_result=ERROR` even though the consensus result is `MAJORITY_AGREE`. The contract state and final audit entry are visible on-chain, but this receipt is not counted as successful execution. The manifest and [LIVE_PROOF](LIVE_PROOF.md) preserve this limitation.

## Unproven gates

Native GEN custody, recipient-side delivery, ambiguous transfer recovery, and a live browser-wallet transaction remain unproven. Custody is disabled, so allocation fields are not presented as payments.

## Independent review

Clone the exact Git SHA, install the lockfile and Python requirements, run every command in `docs/TEST_MATRIX.md`, inspect the generated schema, compare the deployed source hash with the manifest, and treat every absent or unsuccessful receipt as `NOT PROVEN`.

## Submission summary

WITLOCK is a proof-bound GenLayer StudioNet agreement monolith. It freezes weighted criteria, nominated issuers, independent source verifiers, immutable provenance, and deadlines; requires authenticated evidence before adjudication; and asks validators to agree on a bounded PASS/FAIL/INCONCLUSIVE mapping. Contract arithmetic owns outcomes and allocations, while append-only decisions and structured appeals preserve reviewability. Native custody remains disabled until StudioNet transfer and recovery behavior is proven.
