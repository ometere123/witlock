# Reviewer evidence

## Deployment and parity

- One deployable source: `contracts/Witlock.py`, class `Witlock`.
- Stable StudioNet: chain `61999`, RPC `https://studio.genlayer.com/api`, repository-local CLI `0.39.1`.
- Current contract: [`0x8d90aE2C95E320Ea61774a797D92ef84F6831bC2`](https://explorer-studio.genlayer.com/address/0x8d90aE2C95E320Ea61774a797D92ef84F6831bC2).
- Deployment: [`0xd38499ccb036e6188428a47707e5cdb71f289cd3e9dc47af7c3dc30e061cfe68`](https://explorer-studio.genlayer.com/tx/0xd38499ccb036e6188428a47707e5cdb71f289cd3e9dc47af7c3dc30e061cfe68), finalized with majority agreement and successful leader execution.
- Exact source parity: 64,862 bytes, SHA-256 `93de46c2c0749f9016cd4297658679b0f25f12e0bce91ab6fe867d328835dff9`.
- Schema: 35 methods, 13 views, 22 writes, zero constructor parameters.

## Contract evidence

The first ruling captures `appeal_window_started_at` exactly once. When adjudication is delayed past the agreement's original deadline, `appeal_deadline` becomes at least 900 seconds after that ruling. `open_appeal()` and `finalize_decision()` use the same captured deadline; appeal resolution does not extend it and terminal finalization is idempotent.

The Direct Mode suite covers source provenance, issuer/verifier independence, prompt injection, missing evidence, malformed answers, four-criterion partial classification, delayed rulings, late appeals, expiry boundaries, replay, accounting conservation, and receipt fixtures. The frontend suite covers SDK and StudioNet receipt shapes, quorum cancellation, explicit execution errors, NO_MAJORITY, malformed validator records, pending recovery, wallet rejection, and funded-refusal classification.

## Live lifecycle

The authoritative current case is `custody-live-20261013-b`. Its requester is `0x21892bba93381d94037fb4aab01cafbdf4453b56`, provider `0xa7eeae0e93793e3146cb14b0700251b8b0ebadfb`, issuer `0xb5ecd6dda36b370aca4af5e2005d8e2ae89c6db2`, and verifier `0xac3ac69dc0bde389256dd6748c75817ead9286d9`.

| Step | Receipt |
| --- | --- |
| Create | `0x99f87e996e61cec8539c43daead620d2e27d1be9e764650b95125d9ac5c3fcd3` |
| Exact funding, 0.001 GEN | `0x31b3319830a2afbef0f0737dc6f6669dfe9adff7f3daa7aba71d061d8ab6ced7` |
| Accept | `0xa4f823b8d7cd142019f0b675979f50fd3b021c6813c0007d38c2e9ed6e3a5f16` |
| Publish attestation | `0x463742e0c3eb84fe31aa2002dec6bc0bb6eb0deb93b365b8a67fbc9238ae4617` |
| Verify immutable source | `0xf55beebc8d4421d5847868f813b7ea053dd2c43f183a5d5ff5500f8c6b6d5c75` |
| Submit evidence | `0x0144bc2527c10ed9878c93fbe998ae3c78533e1d7f8267d194a1ac6c55eeed94` |
| Authenticate evidence | Successful state readback is preserved; the initial receipt hash was not retained after an RPC polling failure. Duplicate attempt `0x9ebcf4dec0759bd2b6a7e4057c7fc23f13941bad0b132fa3ed2bd88c20b7d806` correctly finalized with `WL_EVIDENCE_ALREADY_AUTHENTICATED`. |
| Delivery timeout and seal | `0x74698d0a1ba6412f697f2a70cca21246878fb5cec5c7eca0f2361b63cce221ef`, `0xbf2a07209455c409d34e7f8ced3d0e3af5c7ee92302a57548cbd79fe1ad26429` |
| Delayed adjudication | `0x1887690cf768db5b205960f823d4a4491379f596ff7795ac776f51743d5ebd7b` |
| Open appeal | `0x9f2b0e85b9e09da442cffd0869c4d6a062345387571f2dfa8d366051d91add79` |
| Authenticate appeal | `0x0fc095e4902563bb353a3610ba703cdcba9603d5d95ae710806ea283459cb147` |
| Resolve appeal | `0xb6d7195c2be4830533643b03a4b1ebce7fb8459d9bf6a1afb887b3e2640ddc2a` |
| Terminal finalization | `0x383cf0ad3bd82b7f76221a43f959febf0f77d8ed6881bda49b33987ca433b610` |
| Idempotent finalization | `0xf9c1cf45cc9b78d14af5be7d2f4c8cd83dc163da8221d3b72bde38daa1f56d1f` |
| Native dispatch | `0x31b2e1d048e3b6366686c8aab3e82d7916f2a9143eedce8a901c719435413b63` |

Every listed successful receipt was `FINALIZED`, `MAJORITY_AGREE`, and successful leader execution. The final readback is `FINAL_DECISION`, `REJECTED`, `appeal_status=FINALIZED`, `appeal_authenticated=true`, `decision_version=2`, and `revision=13`. Accounting is `funded=1000000000000000`, `confirmed_paid=0`, `in_flight=1000000000000000`, `unresolved=0`, `remaining=0`. The requester balance increased by exactly 0.001 GEN after the dispatch. The contract reports `DISPATCHED_PENDING_DELIVERY` because delivery is observed outside the contract.

The source evidence is `docs/source-fixtures/pass.txt` at commit `7ce1517d82e711aa12604177ddadaa644c1691e8`, 54 bytes, digest `13126b6e375490b80d6b081b3992a798dfcf5cd2b28a30b2d5959c6854109901`; the appeal source is `docs/source-fixtures/reversal.txt` at commit `cbe4438d44abc6112a5714caf3c8c60ac80b1fbe`, 56 bytes, digest `8e29f1d1cf0b3f02bc57b1f65538d2d1bc118781c2d29334ad7d9f0eb3975005`.

## Funded rejection evidence

Case `refund-live-20261013-a` used receipt `0x3b66251ea887766e97839ff2ebdc7dbdc1186b2361f6383266199da69c1aa190` with a 0.001 GEN call against a zero-funded agreement. It finalized with `MAJORITY_AGREE`, successful leader execution, and return `REJECTED_FUNDED ... WL_FUNDING_ZERO`. Its message sent exactly 0.001 GEN to the sender with `onAcceptance=false`; `funding_received` remained zero and requester and contract balances had zero net change.

## Frontend and browser status

The production URL is [https://witlock.vercel.app](https://witlock.vercel.app), configured for the current address. Automated route/build checks passed. Existing Chrome evidence proved injected wallet detection, StudioNet chain detection, disconnect/reconnect, and a finalized browser write against the superseded noncustodial address. A new-address browser session still needs independent reproduction of account switching, wrong-network blocking, signature rejection, interrupted writes, and persisted recovery; those paths are not marked as passed here.

## CI and limitations

- Local checks: 38 Python tests, 13 frontend receipt tests, typecheck, production build, contract check, compileall, preflight, and dependency audit.
- The post-push GitHub Actions run for the final commit must be linked in the manifest when available.
- StudioNet does not expose `gen_dbg_traceTransaction` through the approved RPC.
- The first live source-authentication hash was lost to an RPC polling failure; the successful on-chain state and the duplicate rejection receipt are retained.
