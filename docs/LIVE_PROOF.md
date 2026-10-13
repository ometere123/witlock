# WITLOCK live proof

This record covers the fresh monolith on stable StudioNet 61999 (`0xF22F`) at `https://studio.genlayer.com/api`.

## Deployment and parity

- Contract: [`0xC2523f90a89B0A989a15BE81fA124b435f0190cF`](https://explorer-studio.genlayer.com/address/0xC2523f90a89B0A989a15BE81fA124b435f0190cF)
- Deployment: [`0x68238f2d8b195d8f753a0a1ca4d9934bbded309d5b2cd7480e64ab34da13938f`](https://explorer-studio.genlayer.com/tx/0x68238f2d8b195d8f753a0a1ca4d9934bbded309d5b2cd7480e64ab34da13938f)
- Deployment outcome: `FINALIZED`, `MAJORITY_AGREE`; validator execution readbacks were successful.
- Production frontend deployment: [`dpl_PfPcoQk1w5koNhF5AoLLrKyhsrEM`](https://vercel.com/delealufejoel-4184s-projects/witlock/PfPcoQk1w5koNhF5AoLLrKyhsrEM), aliased to [https://witlock.vercel.app](https://witlock.vercel.app), `READY`.
- Local and deployed source: 72,967 bytes, SHA-256 `caea7d3d630581256f679010b946cad4204fac7f9f3148d639b73899b65a41eb`, exact byte comparison `true`.
- Schema: 37 methods, 13 views, 24 writes, zero constructor parameters.
- Repository-local CLI: `0.39.1`.
- `custody_enabled()`: `true`.

The sanitized machine-readable records are [`../artifacts/live-61999/cases.json`](../artifacts/live-61999/cases.json), [`../artifacts/live-61999/manifest.json`](../artifacts/live-61999/manifest.json), and the four case files beside them.

## Funded APPROVED provider payout

Case `live-approved-1791927477837` used walletB as requester, walletA as provider, the authenticated termsmet wallet as issuer, and party_a as independent verifier. The one criterion used the immutable pass fixture.

| Step | Transaction | Readback |
| --- | --- | --- |
| Create | `0x5879bc74a1289cb986d9c95243df72ae464291b631d8a7ee43b9945281c5384f` | finalized majority agreement |
| Fund exact `100000000000000` wei | `0xe0934ed4cab33533c98ff618f0a91b3f72fcae651933919bf8d25f780f4218bd` | funded |
| Accept | `0xbe4b07087409a7791f735e5154cd0ac0ce4e180c439475750fe89b0131e8a190` | active |
| Publish / verify / submit / authenticate | `0xba0c7cdd1646d59521c9a4ed81041f6041559bb9cf91991df4b4ac8e6153be36`, `0x8258f5bd3569ab7e8c4277202beb8e7542a23f64548563ed140dc95e68d7f4ab`, `0x2a7ee30ca4c0dbce8c26a14cadb5e381280c2cc46fdd8d9194795030835e49e32`, `0xca5ec8a9e1d54b97f82ce2157e5f78de4bcb2e1f4ca6ee7e730b133c889ec2ab` | source authenticated |
| Acknowledge / seal / adjudicate | `0x3f0701b40069970d5f2e71f2ee797173d801bad788990c3058b2e40b5e29ce87`, `0xb84f0e377eb0c67579364c56a39b750321bbb425e79fecf22a04ed9e30807b3d`, `0xd0310adeea53cb7b8546b2124af7e3e12448066f76bffb4e1080d97db69be98b` | `APPROVED`, score 100 |
| Terminal finalization | `0xd1a58a1adfc169e47c8f8a86228cdeefcf9d836423279a22b9c84e9badc2bf05` | `FINAL_DECISION`, `appeal_status=FINALIZED`, version 1 |
| Provider dispatch | `0x4f6388b631a79fd0427b204f7ee402a1601f05ca168ddabfd0f7f38bb57c98eb` | child to `0x951e6B75530774fF82321a5ae54e14F778F0C855`, value `100000000000000` wei |

The provider balance delta was exactly `100000000000000` wei and the contract balance delta was `-100000000000000` wei. The requester entitlement was zero. The parent receipt included the value-bearing child message; settlement remains `DISPATCHED_PENDING_DELIVERY` because child delivery is externally observed.

## Funded PARTIAL two-recipient split

Case `partial-1791928102021` used two non-critical criteria with equal weights. The pass and reversal fixtures produced `PARTIAL`, with provider and requester entitlements of `50000000000000` wei each.

- Finalization: `0xd16b17cbe191fa6f36400f18101da10a55b7d28cfb9e1ca728baeac7ec8dd497`
- Provider dispatch: `0x2c5d45047e47adce198799198554cfa94541535f8ee2d24cd24d16bd26ed5b96`
- Requester dispatch: `0xac0b01e2dafe869eef5aae1264c7b72482c516d95a18e8d991287ebadacd3328`
- Provider recipient delta: `50000000000000` wei; contract delta: `-50000000000000` wei.
- Requester recipient delta: `50000000000000` wei; contract delta: `-50000000000000` wei.
- Terminal readback: `FINAL_DECISION`, `appeal_status=FINALIZED`, version `1`, settlement `DISPATCHED_PENDING_DELIVERY`.

The first ruling was delayed past the original appeal deadline: `appeal_window_started_at=1791929610`, original deadline `1791930002`, effective deadline `1791930510`. This is the live proof that the first ruling gets a full 900-second minimum window and that finalization waits for that captured deadline.

## Funded REJECTED requester refund

Case `rejected-1791929685702` used the reversal fixture and produced `REJECTED` with provider entitlement `0` and requester entitlement `100000000000000` wei.

- Finalization: `0xf4fd5c017c50e07145741f5d872074844d1d97ada8109ef61e218092000dacb8`
- Requester dispatch: `0xf1241c40c7293169f357aa35ab7ca9545642d07a1eb4191737fe86afef3c95dd`
- Recipient: `0x24fAe7cD031Ed702Be63BDeA8912141805B996bd`
- Recipient delta: `100000000000000` wei; contract delta: `-100000000000000` wei.
- Terminal readback: `FINAL_DECISION`, `appeal_status=FINALIZED`, version `1`, settlement `DISPATCHED_PENDING_DELIVERY`.

## Funded draft recovery

Case `live-draft-recovery-1791928120240` was funded exactly and left unaccepted. After the acceptance deadline, `recover_expired_funding` finalized at `0x811894ef142d1e028c7069e34bd6f82a488097f61a0897a569d04b7e85cb994b` with the quorum-cancellation metadata recorded separately. Readback is `EXPIRED`, `funding_refund_attempt=1`, `funding_refund_status=DISPATCHED`, `funding_refund_in_flight=100000000000000`, and `settlement_status=REFUND_PENDING_DELIVERY`. The requester balance increased by exactly `100000000000000` wei. Replay is latched off; the seven-day ambiguity deadline is recorded on-chain.

## Source fixtures and accounting

- Pass fixture: commit `7ce1517d82e711aa12604177ddadaa644c1691e8`, 54 bytes, digest `13126b6e375490b80d6b081b3992a798dfcf5cd2b28a30b2d5959c6854109901`.
- Reversal fixture: commit `cbe4438d44abc6112a5714caf3c8c60ac80b1fbe`, 56 bytes, digest `8e29f1d1cf0b3f02bc57b1f65538d2d1bc118781c2d29334ad7d9f0eb3975005`.
- Each live accounting readback reported `conservation_holds=true`, with `actual_contract_balance` inside the reported liability range. The global counters include other deliberately retained live test agreements on this deployment, so the per-case child deltas and the global balance readback are both recorded.

## Browser evidence

Production is [https://witlock.vercel.app](https://witlock.vercel.app). Public HTTP checks returned 200 for `/`, `/verification`, `/new`, and `/settlement/browser-proof`; the settlement page no longer shows “Deposit unavailable”. The verification route rendered the current address, chain 61999, approved RPC, and the wrong-network guard. In Chrome, an injected wallet connected, switched from wallet chain `0x1` to StudioNet, disconnected, reconnected, and submitted a real zero-value `create_agreement` signing attempt against the current address. The UI remained in `Waiting for finality`, and a fresh creation route did not show a finalized browser receipt.

Account switching and explicit wallet rejection were not independently controllable in the available injected-wallet surface. Persisted recovery after the interrupted browser attempt was not claimed because the refreshed activity route showed no stored pending hash. Those paths remain clearly unverified.
