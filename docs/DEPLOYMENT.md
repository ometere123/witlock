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

The production frontend is `https://witlock.vercel.app`. Its build-time configuration must include `NEXT_PUBLIC_WITLOCK_CONTRACT=0x825478432dFECd321C5E5C193829Ad1bAd88043a`, `NEXT_PUBLIC_RPC_URL=https://studio.genlayer.com/api`, and `NEXT_PUBLIC_CHAIN_ID=61999` in the Vercel Production environment. These values are public configuration; wallet credentials and Vercel tokens must never be committed.

Current deployment and lifecycle evidence: [docs/LIVE_PROOF.md](LIVE_PROOF.md) and [the sanitized manifest](../artifacts/live-61999/manifest.json).
