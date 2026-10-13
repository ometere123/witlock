# Reviewer evidence

## Deployment and parity

- One deployable source: `contracts/Witlock.py`, class `Witlock`.
- Stable StudioNet: chain `61999`, RPC `https://studio.genlayer.com/api`, repository-local CLI `0.39.1`.
- Current contract: [`0xC2523f90a89B0A989a15BE81fA124b435f0190cF`](https://explorer-studio.genlayer.com/address/0xC2523f90a89B0A989a15BE81fA124b435f0190cF).
- Deployment: [`0x68238f2d8b195d8f753a0a1ca4d9934bbded309d5b2cd7480e64ab34da13938f`](https://explorer-studio.genlayer.com/tx/0x68238f2d8b195d8f753a0a1ca4d9934bbded309d5b2cd7480e64ab34da13938f), finalized with majority agreement and successful leader execution.
- Exact source parity: 72,967 bytes, SHA-256 `caea7d3d630581256f679010b946cad4204fac7f9f3148d639b73899b65a41eb`, exact byte comparison `true`.
- Schema: 37 methods, 13 views, 24 writes, zero constructor parameters.

## Contract and test evidence

The first ruling captures `appeal_window_started_at` exactly once. When adjudication is delayed past the agreement's original deadline, `appeal_deadline` becomes at least 900 seconds after that ruling. `open_appeal()` and `finalize_decision()` use the same captured deadline; appeal resolution does not extend it and terminal finalization is idempotent.

The Direct Mode suite has 41 passing tests covering source provenance, issuer/verifier independence, prompt injection, missing evidence, malformed answers, maximum four-criterion classification, delayed rulings, late appeals, expiry boundaries, replay, accounting conservation, funded draft recovery, funded INCONCLUSIVE allocation, executable payout lifecycles, and receipt fixtures. Frontend receipt tests have 13 passing cases covering SDK and StudioNet receipt shapes, quorum cancellation, explicit execution errors, NO_MAJORITY, malformed validator records, pending recovery, wallet rejection, contradictory metadata, and funded-refusal classification. Mutation smoke tests killed 3/3 targeted mutations.

## Live funded lifecycle evidence

The authoritative machine-readable records are [`artifacts/live-61999/cases.json`](../artifacts/live-61999/cases.json), [`artifacts/live-61999/manifest.json`](../artifacts/live-61999/manifest.json), and the four case JSON files beside them.

| Case | Terminal finalization | Settlement proof |
| --- | --- | --- |
| APPROVED provider payout | `0xd1a58a1adfc169e47c8f8a86228cdeefcf9d836423279a22b9c84e9badc2bf05` | Provider dispatch `0x4f6388b631a79fd0427b204f7ee402a1601f05ca168ddabfd0f7f38bb57c98eb`; provider delta and contract delta were `+100000000000000` and `-100000000000000` wei. |
| PARTIAL two-recipient split | `0xd16b17cbe191fa6f36400f18101da10a55b7d28cfb9e1ca728baeac7ec8dd497` | Provider dispatch `0x2c5d45047e47adce198799198554cfa94541535f8ee2d24cd24d16bd26ed5b96`; requester dispatch `0xac0b01e2dafe869eef5aae1264c7b72482c516d95a18e8d991287ebadacd3328`; both recipient deltas were `50000000000000` wei. |
| REJECTED requester refund | `0xf4fd5c017c50e07145741f5d872074844d1d97ada8109ef61e218092000dacb8` | Requester dispatch `0xf1241c40c7293169f357aa35ab7ca9545642d07a1eb4191737fe86afef3c95dd`; requester delta and contract delta were `+100000000000000` and `-100000000000000` wei. |
| Funded draft recovery | `0x811894ef142d1e028c7069e34bd6f82a488097f61a0897a569d04b7e85cb994b` | `EXPIRED`, refund attempt `1`, exact `100000000000000` wei in flight, requester delta `+100000000000000` wei, and replay latched off. |

All three adjudicated cases read back `FINAL_DECISION`, `appeal_status=FINALIZED`, unchanged `decision_version=1`, and `DISPATCHED_PENDING_DELIVERY`; the contract explicitly reports child delivery as pending because native child delivery is observed outside the parent contract. Each live accounting readback reported `conservation_holds=true` and exposed the actual contract balance separately from the internal counters.

The PARTIAL case delayed the ruling beyond the original deadline: `appeal_window_started_at=1791929610`, original deadline `1791930002`, effective deadline `1791930510`. This proves the guaranteed minimum appeal window. The live evidence proves the window and terminal finalization; it does not claim a fresh authenticated appeal on these new payout cases.

Source fixtures are immutable repository files: pass commit `7ce1517d82e711aa12604177ddadaa644c1691e8`, 54 bytes, SHA-256 `13126b6e375490b80d6b081b3992a798dfcf5cd2b28a30b2d5959c6854109901`; reversal commit `cbe4438d44abc6112a5714caf3c8c60ac80b1fbe`, 56 bytes, SHA-256 `8e29f1d1cf0b3f02bc57b1f65538d2d1bc118781c2d29334ad7d9f0eb3975005`.

## Frontend and browser status

Production is [https://witlock.vercel.app](https://witlock.vercel.app), deployed as [`dpl_PfPcoQk1w5koNhF5AoLLrKyhsrEM`](https://vercel.com/delealufejoel-4184s-projects/witlock/PfPcoQk1w5koNhF5AoLLrKyhsrEM) with `READY` status. Public HTTP checks cover `/`, `/verification`, `/new`, and `/settlement/browser-proof`; `/new` uses the four-criterion flow and the settlement page no longer shows “Deposit unavailable”. In Chrome, an injected wallet connected, switched from wallet chain `0x1` to StudioNet 61999, disconnected, reconnected, and submitted a real zero-value `create_agreement` signing attempt against the current contract. The UI remained pending and a fresh route did not show a finalized browser receipt.

Account switching, explicit signature rejection, and persisted recovery after the interrupted signing attempt were not independently reproduced in the available injected-wallet surface and remain unverified. The live docs do not claim those paths passed.

## CI and limitations

- Local checks: 41 Direct Mode tests, 13 frontend tests, mutation smoke 3/3 killed, TypeScript, production build, dependency audit, preflight, GenVM lint/check/schema, and Python compileall.
- GitHub Actions URL and commit are added here after the final push and completed run.
- No on-chain GitHub Actions attestation is claimed; repository commit provenance and source hashes are recorded.
- StudioNet native child delivery and ambiguous delivery remain externally observed states; custody is not presented as settled until the child outcome is known.
