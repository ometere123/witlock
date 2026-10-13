# StudioNet 61999 deployment protocol

1. Use the repository-local GenLayer CLI `0.39.1` and confirm stable StudioNet chain `61999` (`0xF22F`) at `https://studio.genlayer.com/api`.
2. Run the contract check, Direct Mode suite, policy suite, frontend receipt tests, TypeScript, production build, preflight, compileall, and dependency audit against the candidate.
3. Deploy only `contracts/Witlock.py`. Do not add a second contract, switch networks, or use the CLI's fee flag as application funding.
4. Read the deployed source with `gen_getContractCode`, compare exact UTF-8 bytes and SHA-256, and compare the schema with the local linter output.
5. Prove payable rejection before production use: an invalid funded call must finalize with successful execution, an explicit `REJECTED_FUNDED` return, and a value-bearing refund message.
6. Prove a distinct requester, provider, issuer, and independent verifier through source publication, immutable source verification, evidence authentication, adjudication, appeal, terminal finalization, and role-bound native dispatch.
7. Treat `FINALIZED`, `MAJORITY_AGREE`, execution result, leader execution, validator results, and value-bearing child messages as separate facts. Preserve failed receipts as failures.
8. Update every public frontend contract configuration only after the new contract passes the live proof. Verify the production URL after the deployment completes.

The current contract is `0x8d90aE2C95E320Ea61774a797D92ef84F6831bC2`, deployed by transaction `0xd38499ccb036e6188428a47707e5cdb71f289cd3e9dc47af7c3dc30e061cfe68`. The deployed source is 64,862 bytes and SHA-256 `93de46c2c0749f9016cd4297658679b0f25f12e0bce91ab6fe867d328835dff9`. The current Vercel public contract configuration is the same address. No keys or tokens belong in the repository.

Full receipts, source parity, browser status, and remaining limitations are recorded in [LIVE_PROOF.md](LIVE_PROOF.md) and [REVIEWER_EVIDENCE.md](REVIEWER_EVIDENCE.md).
