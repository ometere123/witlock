# StudioNet 61999 deployment protocol

1. Use the repository-local GenLayer CLI `0.39.1`.
2. Assert stable StudioNet chain `61999`, hex `0xF22F`, RPC `https://studio.genlayer.com/api`, and explorer `https://explorer-studio.genlayer.com`.
3. Run contract, Direct Mode, frontend, typecheck, production build, preflight, and dependency checks at the release SHA.
4. Hash `contracts/Witlock.py` and compare normalized deployed source bytes and schema with the local source. Never record key material.
5. Deploy only the single `contracts/Witlock.py` monolith. Treat `ACCEPTED`, `FINALIZED`, consensus result, and contract execution result as separate fields.
6. Use distinct requester, provider, issuer, and independent verifier accounts for lifecycle proof. Keep funding and payment calls blocked while custody is false.
7. Preserve failed or contradictory receipts as failures; accept a lifecycle step only when final consensus and execution evidence support it.

The current production frontend is `https://witlock.vercel.app`. Public configuration is StudioNet 61999, RPC `https://studio.genlayer.com/api`, and contract `0x8B6e64A6C5c5Bccc3a64Cba4Bd8982218381330d`. Wallet credentials and hosting tokens are never committed.

Current deployment and lifecycle evidence: [docs/LIVE_PROOF.md](LIVE_PROOF.md) and [the sanitized manifest](../artifacts/live-61999/manifest.json).
