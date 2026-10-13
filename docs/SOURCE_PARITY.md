# Source parity record

The current monolith is deployed on GenLayer StudioNet stable (chain 61999, RPC `https://studio.genlayer.com/api`).

- Current address: [`0x8B6e64A6C5c5Bccc3a64Cba4Bd8982218381330d`](https://explorer-studio.genlayer.com/address/0x8B6e64A6C5c5Bccc3a64Cba4Bd8982218381330d)
- Deployment: [`0x298e3e7eed4ec8ad25017600f87f49608cdc5bfb94b5d7eadf0cb0dbfabace1`](https://explorer-studio.genlayer.com/tx/0x298e3e7eed4ec8ad25017600f87f49608cdc5bfb94b5d7eadf0cb0dbfabace1)
- Release source commit: `7ce1517d82e711aa12604177ddadaa644c1691e8`
- Local source: 64,131 bytes
- Local and normalized deployed SHA-256: `04352A02F6BFBD7BEF7C5C00BE93FD5779ABD5BC340941C62863BF2ABB1E8C79`
- Schema: 37 methods, 13 views, 24 writes, zero constructor parameters
- Exact normalized byte comparison: `true`

The parity check was performed with repository-local CLI 0.39.1 using `genlayer code` and `genlayer schema`; CLI framing and line-ending differences were removed before comparing source bytes. The complete sanitized deployment and lifecycle evidence is in [LIVE_PROOF.md](LIVE_PROOF.md) and [the manifest](../artifacts/live-61999/manifest.json).
