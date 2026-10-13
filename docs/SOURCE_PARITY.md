# Source parity record

The current monolith is deployed on GenLayer StudioNet stable (chain 61999, RPC `https://studio.genlayer.com/api`).

- Current address: [`0x8d90aE2C95E320Ea61774a797D92ef84F6831bC2`](https://explorer-studio.genlayer.com/address/0x8d90aE2C95E320Ea61774a797D92ef84F6831bC2)
- Deployment: [`0xd38499ccb036e6188428a47707e5cdb71f289cd3e9dc47af7c3dc30e061cfe68`](https://explorer-studio.genlayer.com/tx/0xd38499ccb036e6188428a47707e5cdb71f289cd3e9dc47af7c3dc30e061cfe68)
- Local source: 64,862 bytes
- Local and deployed SHA-256: `93de46c2c0749f9016cd4297658679b0f25f12e0bce91ab6fe867d328835dff9`
- Schema: 35 methods, 13 views, 22 writes, zero constructor parameters
- Exact byte comparison: `true`

The parity check was performed with repository-local CLI 0.39.1 using `genlayer code` and `genlayer schema`; CLI framing and line-ending differences were removed before comparing source bytes. The complete sanitized deployment and lifecycle evidence is in [LIVE_PROOF.md](LIVE_PROOF.md) and [the manifest](../artifacts/live-61999/manifest.json).
