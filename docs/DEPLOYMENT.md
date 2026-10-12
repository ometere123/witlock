# StudioNet 61999 deployment protocol

1. Use the repository-local GenLayer CLI `0.39.1`; do not use a global release candidate.
2. Assert stable StudioNet chain `61999`, hex `0xF22F`, RPC `https://studio.genlayer.com/api`, and explorer `https://explorer-studio.genlayer.com`.
3. Run Python tests, compileall, GenVM lint/check/schema, dependency audit, frontend typecheck/build, and preflight at the exact Git SHA.
4. Hash `contracts/Witlock.py` and record only the source SHA, CLI/SDK versions, network, account address, schema, and finalization results. Never record key material.
5. Deploy only `contracts/Witlock.py`. Treat submission, `ACCEPTED`, `FINALIZED`, consensus result, and contract execution result as separate fields.
6. Read deployed source and schema from StudioNet and compare the normalized source bytes and schema with local output. A matching address is not source parity.
7. Use distinct requester, provider, issuer, and independent verifier accounts for lifecycle proof. Keep funding and payment calls blocked while custody is false.
8. For each lifecycle write, poll with one pinned `genlayer-js` client until `FINALIZED`; accept the result only when the recorded execution evidence is successful. Preserve unsuccessful or contradictory receipts as limitations.
9. Keep raw output under `artifacts/live-61999/` locally. Commit only the sanitized `manifest.json`.

Current deployment and lifecycle evidence: [docs/LIVE_PROOF.md](LIVE_PROOF.md) and [the sanitized manifest](../artifacts/live-61999/manifest.json).
