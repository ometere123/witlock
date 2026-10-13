# Live proof

Current deployment: [WITLOCK on StudioNet stable](https://explorer-studio.genlayer.com/address/0x8d90aE2C95E320Ea61774a797D92ef84F6831bC2), chain 61999 (`0xF22F`), RPC `https://studio.genlayer.com/api`.

- Contract: `0x8d90aE2C95E320Ea61774a797D92ef84F6831bC2`
- Deployment: [`0xd38499ccb036e6188428a47707e5cdb71f289cd3e9dc47af7c3dc30e061cfe68`](https://explorer-studio.genlayer.com/tx/0xd38499ccb036e6188428a47707e5cdb71f289cd3e9dc47af7c3dc30e061cfe68)
- Deployment receipt: `FINALIZED`, `MAJORITY_AGREE`, successful leader execution
- Deployed source: 64,862 bytes, SHA-256 `93de46c2c0749f9016cd4297658679b0f25f12e0bce91ab6fe867d328835dff9`
- Exact source parity: `true`
- Schema: 35 methods, 13 views, 22 writes, zero constructor parameters
- Repository-local CLI: `0.39.1`
- `genlayer-js`: `1.1.8`
- `custody_enabled()`: `true`

## Terminal custody case

Case `custody-live-20261013-b` used requester `0x21892bba93381d94037fb4aab01cafbdf4453b56`, provider `0xa7eeae0e93793e3146cb14b0700251b8b0ebadfb`, issuer `0xb5ecd6dda36b370aca4af5e2005d8e2ae89c6db2`, and verifier `0xac3ac69dc0bde389256dd6748c75817ead9286d9`.

| Step | Transaction | Outcome |
| --- | --- | --- |
| Create | `0x99f87e996e61cec8539c43daead620d2e27d1be9e764650b95125d9ac5c3fcd3` | FINALIZED / MAJORITY_AGREE / successful leader |
| Exact funding, 0.001 GEN | `0x31b3319830a2afbef0f0737dc6f6669dfe9adff7f3daa7aba71d061d8ab6ced7` | FINALIZED / MAJORITY_AGREE / value credited |
| Accept | `0xa4f823b8d7cd142019f0b675979f50fd3b021c6813c0007d38c2e9ed6e3a5f16` | FINALIZED / MAJORITY_AGREE |
| Publish attestation | `0x463742e0c3eb84fe31aa2002dec6bc0bb6eb0deb93b365b8a67fbc9238ae4617` | FINALIZED / MAJORITY_AGREE |
| Verify immutable source | `0xf55beebc8d4421d5847868f813b7ea053dd2c43f183a5d5ff5500f8c6b6d5c75` | FINALIZED / MAJORITY_AGREE |
| Submit evidence | `0x0144bc2527c10ed9878c93fbe998ae3c78533e1d7f8267d194a1ac6c55eeed94` | FINALIZED / MAJORITY_AGREE |
| Authenticate evidence | Initial successful hash was not retained after an RPC polling failure; duplicate `0x9ebcf4dec0759bd2b6a7e4057c7fc23f13941bad0b132fa3ed2bd88c20b7d806` finalized with explicit `WL_EVIDENCE_ALREADY_AUTHENTICATED` | State readback authenticated |
| Delivery timeout | `0x74698d0a1ba6412f697f2a70cca21246878fb5cec5c7eca0f2361b63cce221ef` | FINALIZED / MAJORITY_AGREE |
| Seal | `0xbf2a07209455c409d34e7f8ced3d0e3af5c7ee92302a57548cbd79fe1ad26429` | FINALIZED / MAJORITY_AGREE |
| Delayed adjudication | `0x1887690cf768db5b205960f823d4a4491379f596ff7795ac776f51743d5ebd7b` | FINALIZED / MAJORITY_AGREE |
| Open appeal | `0x9f2b0e85b9e09da442cffd0869c4d6a062345387571f2dfa8d366051d91add79` | FINALIZED / MAJORITY_AGREE |
| Authenticate appeal | `0x0fc095e4902563bb353a3610ba703cdcba9603d5d95ae710806ea283459cb147` | FINALIZED / MAJORITY_AGREE |
| Resolve appeal | `0xb6d7195c2be4830533643b03a4b1ebce7fb8459d9bf6a1afb887b3e2640ddc2a` | FINALIZED / MAJORITY_AGREE |
| Terminal finalization | `0x383cf0ad3bd82b7f76221a43f959febf0f77d8ed6881bda49b33987ca433b610` | FINALIZED / MAJORITY_AGREE |
| Idempotent finalization | `0xf9c1cf45cc9b78d14af5be7d2f4c8cd83dc163da8221d3b72bde38daa1f56d1f` | FINALIZED / MAJORITY_AGREE; revision unchanged |
| Native dispatch | `0x31b2e1d048e3b6366686c8aab3e82d7916f2a9143eedce8a901c719435413b63` | FINALIZED / MAJORITY_AGREE; 0.001 GEN recipient delta |

The first ruling started at `1791916388`, after the original deadline `1791916379`, and set the effective deadline to `1791917288`, exactly 900 seconds later. The authenticated appeal resolved to a second decision version. Terminal readback is `FINAL_DECISION`, `REJECTED`, `appeal_status=FINALIZED`, `appeal_authenticated=true`, `decision_version=2`, `revision=13`. Final entitlements are provider `0`, requester `1000000000000000` wei.

Settlement readback is:

```json
{
  "custody_enabled": true,
  "status": "DISPATCHED_PENDING_DELIVERY",
  "funding_received": 1000000000000000,
  "paid": 0,
  "in_flight": 1000000000000000,
  "unresolved": 0,
  "payment_attempt": 1
}
```

Accounting readback is `funded=confirmed_paid+in_flight+unresolved+remaining` with funded `1000000000000000`, confirmed paid `0`, in flight `1000000000000000`, unresolved `0`, remaining `0`. The requester balance increased by exactly `1000000000000000` wei after the native dispatch. The child message and balance were observed externally; the contract deliberately keeps the state pending delivery.

The initial source was the immutable GitHub raw commit `7ce1517d82e711aa12604177ddadaa644c1691e8`, path `docs/source-fixtures/pass.txt`, 54 bytes, digest `13126b6e375490b80d6b081b3992a798dfcf5cd2b28a30b2d5959c6854109901`. The appeal source was commit `cbe4438d44abc6112a5714caf3c8c60ac80b1fbe`, path `docs/source-fixtures/reversal.txt`, 56 bytes, digest `8e29f1d1cf0b3f02bc57b1f65538d2d1bc118781c2d29334ad7d9f0eb3975005`, source class `GITHUB_RAW_COMMIT`.

## Funded rejection and refund

Case `refund-live-20261013-a` was created with `funding_required=0). Funding it with `1000000000000000` wei produced:

- transaction [`0x3b66251ea887766e97839ff2ebdc7dbdc1186b2361f6383266199da69c1aa190`](https://explorer-studio.genlayer.com/tx/0x3b66251ea887766e97839ff2ebdc7dbdc1186b2361f6383266199da69c1aa190)
- `FINALIZED` / `MAJORITY_AGREE` / successful leader
- leader return `REJECTED_FUNDED UserError(message='WL_FUNDING_ZERO')`
- value-bearing message to the sender, `onAcceptance=false`
- `funding_received=0`, requester net delta `0`, contract net delta `0`

This proves the candidate does not strand incoming value on a known funded rejection.

## Frontend status

Production is [https://witlock.vercel.app](https://witlock.vercel.app), with public configuration set to the current contract. In Chrome, `/verification` rendered the current address, StudioNet 61999, the approved RPC, metadata availability, and `NATIVE GEN DISPATCH · ENABLED · FINALIZED ONLY`; the same view showed wallet chain `0x1`, `WRONG NETWORK`, and the guarded `Switch network` action. `/new` rendered the funded creation flow, exact wei funding field, separate payable-signature explanation, and disabled operator bond. The browser automation surface did not expose `window.ethereum`, so no current-address wallet write, account change, signature rejection, interrupted transaction recovery, or persisted recovery is claimed. The route and wrong-network guard are observed; the injected-wallet paths remain pending independent reproduction.

## Limitations

The successful source-authentication transaction hash was lost during an RPC polling failure; the on-chain authenticated state and duplicate rejection receipt are preserved. StudioNet does not expose `gen_dbg_traceTransaction` through the approved RPC.
