# Live proof

The current WITLOCK source is live on GenLayer StudioNet stable, chain 61999 (0xF22F).

- Contract: https://explorer-studio.genlayer.com/address/0x825478432dFECd321C5E5C193829Ad1bAd88043a
- Deployment: https://explorer-studio.genlayer.com/tx/0x2fb0f9f120d7531f76101472248b44899a7e2380049690f0d92fb5fb89d6a2d8
- Deployment receipt: FINALIZED, MAJORITY_AGREE, one round, leader SUCCESS
- Source commit: 14315fa82ef6d6f5e2c077de51c93f266801b1cb
- Route-first release commit: 38edb83c9fa4fcdf94e9147a9d11b61412d966f2
- On-chain source: 62,629 bytes, SHA-256 AB446841A8A16276ED30A431264DEEC015E87751FF594AE92392ECFACB2F7F35
- Schema parity: 37 methods, 13 views, 24 writes, zero constructor parameters
- get_contract_info identifies WITLOCK, StudioNet, chain 61999, and the immutable GitHub source model
- custody_enabled is false

The verifier and adjudicator source observation for the live cases used the immutable raw GitHub commit URL for web/app/layout.tsx. The contract recorded repository, commit, path, 407-byte content size, and digest 8ef0926d47ea523a8a3a99b604b10231a23ec96586ac91e4c1e51e9ec83fe563.

## Live verdicts

| Case | Result | Score | Readback |
| --- | ---: | ---: | --- |
| live-cli-string-test | APPROVED | 100 | source=PASS, appeal resolved and verified at version 2 |
| live-rejected-clear-20261012 | REJECTED | 0 | source=FAIL for the deliberately false “only the word NO” claim |
| live-partial-clear-20261012 | PARTIAL | 50 | shell=PASS, literal=FAIL |
| live-rejected-20261012 | INCONCLUSIVE | 0 | authenticated evidence remained intact; the live adjudicator returned INCONCLUSIVE |

Every listed lifecycle transaction was finalized with MAJORITY_AGREE. Sampled deployment, case creation, appeal resolution, and final adjudication receipts have successful leader execution. Some validators report cancellation-after-quorum after a majority is reached; those are expected quorum cancellation records.

The approved case proves the live path through create, acceptance, issuer publication, independent source verification, evidence authentication, sealing, adjudication, appeal opening, appeal authentication, and appeal resolution. The cases use zero-value agreements because native GEN custody remains disabled.

## Local verification

- Direct Mode: 34 tests passed.
- GenVM lint/check: 37 methods, 13 views, 24 writes, zero constructor parameters.
- Frontend typecheck, transaction tests, production build, dependency audit, and StudioNet preflight pass.
- Route smoke covered /, /new, /explore, /workspace, /activity, /verification, /guide, and the dynamic agreement, evidence, review, and settlement routes.
- The Chrome profile exposed an injected EIP-1193 wallet on chain 0xf22f. Browser creation transaction https://explorer-studio.genlayer.com/tx/0xef85a36028a4dc8bad7468de3ec4c71e66769fe08f2b9da585321bc1399ccd9c finalized with MAJORITY_AGREE; the authoritative readback is browser-proof-20261012 in DRAFT with the browser account as requester.

genlayer trace is preserved as a limitation: the StudioNet RPC returned method-not-found for gen_dbg_traceTransaction. The full sanitized records are in artifacts/live-61999/manifest.json and artifacts/live-61999/cases.json.

Historical NO_MAJORITY attempts and the superseded address 0x4D39aBdF8F574B44Ff178CBf974042a36D70c9A0 remain historical evidence only.
