# Live proof

## Verified deployment

The canonical monolith was deployed from Git SHA `b9204ef` on stable GenLayer StudioNet:

- Network: StudioNet, chain `61999` (`0xF22F`)
- RPC: `https://studio.genlayer.com/api`
- Explorer: `https://explorer-studio.genlayer.com`
- CLI: `0.39.1`
- SDK: `genlayer-js 1.1.8`
- Deployer account: `0x0d5540e0aD4B92Aa0ad4e5F1b8cD645ee1E363E7`
- Contract: `0x2581346995cd24dD38889F3b0c7638803DD9d3C3`
- Deployment transaction: `0x8e9a2d5293937f774a1e2bf9574e94e26411668074bdd7471dee32cb2972936a`
- Final status: `FINALIZED`
- Execution result: `SUCCESS`
- Consensus: one round, five `AGREE` votes
- Local contract SHA-256: `5EB2C4ADA4A78C22AC484E974FC5D457F042624661876422099CB04B07BBCF95`
- Deployed source SHA-256: `5EB2C4ADA4A78C22AC484E974FC5D457F042624661876422099CB04B07BBCF95`
- Source parity: exact byte match, 33,227 bytes
- Deployed schema: 31 methods, zero constructor parameters
- Read-back: `get_contract_info` returned `WITLOCK`, `monolith-v1`, chain 61999; `custody_enabled` returned `false`

Proof manifest: [`artifacts/live-61999/manifest.json`](../artifacts/live-61999/manifest.json).

## Boundaries of the proof

This proves deployment finalization, validator agreement, deployed source parity, schema parity, and the explicit custody gate. It does not claim browser wallet execution, a completed agreement lifecycle, recipient delivery, payment, or recovery. Native GEN custody remains disabled until those transfer and recovery behaviors have been proven end to end.

Raw CLI output is retained locally under `artifacts/live-61999/` and is ignored by Git. The committed manifest contains no private key, passphrase, or validator credential.
