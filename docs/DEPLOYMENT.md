# StudioNet 61999 deployment protocol

1. Use the repository-local GenLayer CLI `0.39.1` and confirm stable StudioNet chain `61999` (`0xF22F`) at `https://studio.genlayer.com/api`.
2. Run the contract check, Direct Mode suite, policy suite, frontend receipt tests, TypeScript, production build, preflight, compileall, and dependency audit against the candidate.
3. Deploy only `contracts/Witlock.py`. Do not add a second contract, switch networks, or use the CLI's fee flag as application funding.
4. Read the deployed source with `gen_getContractCode`, compare exact UTF-8 bytes and SHA-256, and compare the schema with the local linter output.
5. Prove payable rejection before production use: an invalid funded call must finalize with successful execution, an explicit `REJECTED_FUNDED` return, and a value-bearing refund message.
6. Prove a distinct requester, provider, issuer, and independent verifier through source publication, immutable source verification, evidence authentication, adjudication, appeal, terminal finalization, and role-bound native dispatch.
7. Treat `FINALIZED`, `MAJORITY_AGREE`, execution result, leader execution, validator results, and value-bearing child messages as separate facts. Preserve failed receipts as failures.
8. Update every public frontend contract configuration only after the new contract passes the live proof. Verify the production URL after the deployment completes.

The current contract is `0xC2523f90a89B0A989a15BE81fA124b435f0190cF`, deployed by transaction `0x68238f2d8b195d8f753a0a1ca4d9934bbded309d5b2cd7480e64ab34da13938f`. The deployed source is 72,967 bytes and SHA-256 `caea7d3d630581256f679010b946cad4204fac7f9f3148d639b73899b65a41eb`. The current Vercel public contract configuration is the same address. No keys or tokens belong in the repository.

Full receipts, source parity, browser status, and remaining limitations are recorded in [LIVE_PROOF.md](LIVE_PROOF.md) and [REVIEWER_EVIDENCE.md](REVIEWER_EVIDENCE.md).
