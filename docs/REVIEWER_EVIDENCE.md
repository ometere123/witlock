# Reviewer evidence

## Proven locally

- One canonical deployable source: `contracts/Witlock.py`, class `Witlock`.
- Repository-local CLI `0.39.1`, `genlayer-js` `1.1.8`, StudioNet chain `61999`, and approved RPC.
- `31 passed` Python/Direct Mode tests, GenVM lint/check, frontend typecheck, frontend transaction tests, Next production build, StudioNet preflight, and `npm audit --audit-level=moderate` with 0 vulnerabilities.
- The source-verification tests exercise actual mocked `gl.nondet.web.get` retrieval and fail closed on altered bytes, mutable branches, mismatched commit identity, and mutated appeal sources.
- The frontend uses SDK `TransactionStatus.FINALIZED` and `ExecutionResult.FINISHED_WITH_RETURN`, retains failed finalized receipts, recovers multiple pending entries, and routes writes through guided role/state consoles.

## Live boundary

No current contract address is claimed. The latest current-source deployment `0x85a76d80…d257171`, the prior current-source deployment `0xaf8744c3…bebde0`, and earlier attempts finalized `NO_MAJORITY` with no consensus data. The StudioNet balance probe reports no consensus contracts deployed. The superseded address `0x4D39aBdF8F574B44Ff178CBf974042a36D70c9A0` is not source parity evidence for the current source.

The Chrome profile exposes an injected EIP-1193 wallet on chain `0xf22f`, but no browser transaction is claimed because StudioNet has no current consensus layer and the environment example intentionally leaves the contract address empty.

Native GEN custody, recipient-side delivery, ambiguous-transfer recovery, current-source deployment, live source retrieval, live APPROVED/PARTIAL/REJECTED/INCONCLUSIVE cases, and successful current-source finalization remain `NOT PROVEN`.

The sanitized record is [`artifacts/live-61999/manifest.json`](../artifacts/live-61999/manifest.json).
