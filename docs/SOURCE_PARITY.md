# Source parity record

The current monolith is deployed on GenLayer StudioNet stable (chain 61999, RPC `https://studio.genlayer.com/api`).

- Current address: [`0xC2523f90a89B0A989a15BE81fA124b435f0190cF`](https://explorer-studio.genlayer.com/address/0xC2523f90a89B0A989a15BE81fA124b435f0190cF)
- Deployment: [`0x68238f2d8b195d8f753a0a1ca4d9934bbded309d5b2cd7480e64ab34da13938f`](https://explorer-studio.genlayer.com/tx/0x68238f2d8b195d8f753a0a1ca4d9934bbded309d5b2cd7480e64ab34da13938f)
- Local source: 72,967 bytes
- Local and deployed SHA-256: `caea7d3d630581256f679010b946cad4204fac7f9f3148d639b73899b65a41eb`
- Schema: 37 methods, 13 views, 24 writes, zero constructor parameters
- Exact byte comparison: `true`

The parity check was performed with repository-local CLI 0.39.1 using `genlayer code` and `genlayer schema`; CLI framing and line-ending differences were removed before comparing source bytes. The complete sanitized deployment and lifecycle evidence is in [LIVE_PROOF.md](LIVE_PROOF.md) and [the manifest](../artifacts/live-61999/manifest.json).
