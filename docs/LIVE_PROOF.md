# Live proof

## Current status

A fresh StudioNet proof for the current source is **blocked by the network state**. The current source is Git SHA `96edcdbbd1025541b5d00d5b6d82ecd28b46ab55`; `contracts/Witlock.py` is 60,059 bytes and hashes to `F9E08ADA6D39E083B681221B05489E3A45E18E9A96FE455B2E05F6ABFC82188`.

The exact deployment attempts were:

- `0xcb4b0ab413314360f6a636df82add34218efdd06cc4f69223f5c8b44899c8514`: `FINALIZED`, `NO_MAJORITY`, `consensus_data=null`, no contract address.
- `0x4b94eba2f3c6b2842a3851a9181bd98bb8af91996dad753aa2cf0db08a72c159`: `FINALIZED`, `NO_MAJORITY`, `consensus_data=null`, no contract address.
- Exact old-source control `0x12b6e36941ddcf9472b360138ffb85eb52418a6a153c2d8fc355a43186109bca`: `FINALIZED`, `NO_MAJORITY`, `consensus_data=null`.

The StudioNet balance probe reports that no consensus contracts are deployed. Because the failure occurs before a consensus round and before a contract address exists, it cannot establish source parity, live retrieval, lifecycle outcomes, or successful finalization for the current source. The old address `0x4D39aBdF8F574B44Ff178CBf974042a36D70c9A0` and its prior receipts are retained only as superseded historical evidence.

## What is proven locally

- GenVM lint/check: 37 methods, 13 views, 24 writes, zero constructor parameters.
- Direct Mode suite: 27 tests passed, including actual mocked `gl.nondet.web.get` retrieval, immutable GitHub commit validation, altered-byte rejection, mutable-branch rejection, appeal-source mutation rejection, dossier budget enforcement, and idempotent finalization.
- Frontend typecheck, transaction tests, production build, dependency audit, and StudioNet preflight pass.
- The Chrome browser profile exposes an injected EIP-1193 wallet and reports chain `0xf22f`; no browser transaction is claimed because no current contract is configured and StudioNet has no consensus contracts available.
- Custody remains disabled in the contract and environment configuration.

The sanitized record is [`artifacts/live-61999/manifest.json`](../artifacts/live-61999/manifest.json). It records every unsuccessful attempt and does not present the superseded contract as current.

## Historical superseded proof

An earlier contract at `0x4D39aBdF8F574B44Ff178CBf974042a36D70c9A0` was deployed from an older source and reached a finalized state for case `live-20261012-03`. Its finalization receipt reported leader `execution_result=ERROR` even though the readback showed `FINAL_DECISION`; that receipt was never a successful execution proof. It is not reused for the current source because its code and source model predate immutable raw GitHub retrieval and the runtime-safe hashing change.
