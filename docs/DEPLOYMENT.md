# StudioNet 61999 deployment protocol

1. Use the repository-local GenLayer CLI `0.39.1`; never use a global release candidate.
2. Assert StudioNet stable, chain `61999`, hex `0xF22F`, RPC `https://studio.genlayer.com/api`, and explorer `https://explorer-studio.genlayer.com`.
3. Run the Python suite, compilation, `genvm-lint` lint/check/schema, frontend typecheck, preflight, and production build at the exact Git SHA.
4. Hash `contracts/Witlock.py` and record the SHA-256, CLI version, network output, active account address, and source commit in a sanitized manifest. Do not record key material.
5. Deploy only `contracts/Witlock.py` with the local CLI. Record submission, accepted, finalized, and execution-success states separately.
6. Read deployed source and schema from the StudioNet explorer and compare them with local source and schema. A matching address alone is not source parity.
7. Use distinct requester, provider, and issuer wallets for lifecycle proof. Keep funding and payout methods blocked while the custody gate is false.
8. Preserve raw diagnostic output under `artifacts/live-61999/` locally; commit only sanitized evidence with no secrets.