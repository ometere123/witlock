# Live proof

The current WITLOCK source is live on GenLayer StudioNet stable, chain 61999 (0xF22F).

- Contract: https://explorer-studio.genlayer.com/address/0x825478432dFECd321C5E5C193829Ad1bAd88043a
- Deployment: https://explorer-studio.genlayer.com/tx/0x2fb0f9f120d7531f76101472248b44899a7e2380049690f0d92fb5fb89d6a2d8
- Deployment receipt: FINALIZED, MAJORITY_AGREE, one round, leader SUCCESS
- Source commit: 14315fa82ef6d6f5e2c077de51c93f266801b1cb
- Release source commit used for the live case: ae3903773396defc18b5c3682e7a6c0c67cd4527
- On-chain source: 62,629 bytes, SHA-256 AB446841A8A16276ED30A431264DEEC015E87751FF594AE92392ECFACB2F7F35
- Schema parity: 37 methods, 13 views, 24 writes, zero constructor parameters
- get_contract_info identifies WITLOCK, StudioNet, chain 61999, and the immutable GitHub source model
- custody_enabled is false

The verifier and adjudicator source observation for the terminal proof used the immutable raw GitHub commit URL for `docs/source-fixtures/pass.txt`. The contract recorded repository `ometere123/witlock`, commit `ae3903773396defc18b5c3682e7a6c0c67cd4527`, 54 bytes, and digest `13126b6e375490b80d6b081b3992a798dfcf5cd2b28a30b2d5959c6854109901`.

## Live verdicts

| Case | Result | Score | Readback |
| --- | ---: | ---: | --- |
| live-cli-string-test | APPROVED | 100 | source=PASS, appeal resolved and verified at version 2 |
| live-rejected-clear-20261012 | REJECTED | 0 | source=FAIL for the deliberately false “only the word NO” claim |
| live-partial-clear-20261012 | PARTIAL | 50 | shell=PASS, literal=FAIL |
| live-rejected-20261012 | INCONCLUSIVE | 0 | authenticated evidence remained intact; the live adjudicator returned INCONCLUSIVE |

Every listed lifecycle transaction was finalized with MAJORITY_AGREE. Sampled deployment, case creation, appeal resolution, and final adjudication receipts have successful leader execution. Some validators report cancellation-after-quorum after a majority is reached; those are expected quorum cancellation records.

The approved case proves the live path through create, acceptance, issuer publication, independent source verification, evidence authentication, sealing, adjudication, appeal opening, appeal authentication, and appeal resolution. The cases use zero-value agreements because native GEN custody remains disabled.

## Terminal finalization proof

The canonical approved case remains an historical appeal-window example with a year-2100 deadline. A legitimate short-window approved case was used for terminal proof instead: `final-proof-20261013`.

| Step | Transaction | Result |
| --- | --- | --- |
| Create | `0xec138bd6d2bc216d040487cba59da56faa9171e4d56b0dfc6ec48cd7a119805c` | `FINALIZED`, `MAJORITY_AGREE`, source terms stored |
| Accept | `0xfde3ae7c56248abd3e43b9e740076be7485d90529f3b865e239dc46104dd7c45` | `FINALIZED`, `MAJORITY_AGREE` |
| Publish | `0xc2c2c94a240414a138c330c3c940e6dafb3a26071d2e31bc36847a3fede6d89a` | issuer attestation stored |
| Verify source | `0x0b472b70d433cbf2bbc735a82896403c08075ac66bd84b458f5537f4dcb55cfe` | independent verifier recorded `VERIFIED`, digest and commit matched |
| Submit evidence | `0x2d4d3a39bbf0c9930b950c0b19df8d8e17a15f42a41bb32554245a3cb19dc754` | evidence admitted |
| Authenticate | `0xa47ed6828bedd3a9c610387d6e7932c5b555d879930b4eaf801637a65bef19e1` | issuer authentication stored |
| Acknowledge | `0x6761ca23925f295ffe16689cfb007f7ad868ca6b208f907e241a2ab087a71559` | delivery acknowledged |
| Seal | `0x1c86b1388b19f6697179ff80a771e5143e64f1f49eb7d107b40560f431e4d7a2` | evidence-complete dossier sealed |
| Adjudicate | `0x667199b25bc52c5ee112f5156daa9888b395c904a347ed925c87bb2ba006d393` | `APPROVED`, score `100`, answer `source=PASS` |
| Finalize | [`0x32f4a74c66e08e99354493c121f24309185e62fbc17e8fb248e189e6a51c4944`](https://explorer-studio.genlayer.com/tx/0x32f4a74c66e08e99354493c121f24309185e62fbc17e8fb248e189e6a51c4944) | `FINALIZED`, `MAJORITY_AGREE`, leader and all validators `SUCCESS` |

The appeal deadline was `1791853932`; finalization was submitted only after a live read showed `now=1791853946`. Final readbacks were `status=FINAL_DECISION`, `result=APPROVED`, `score=100`, `appeal_status=FINALIZED`, `decision_version=1` unchanged from adjudication, `settlement_status=RECONCILED_NO_CUSTODY`, `payment_status=CUSTODY_DISABLED`, and `custody_enabled=false`. History revision 7 was `APPEAL_WINDOW_OPENED`; revision 8 was `FINAL_DECISION`.

The first setup attempt, [`0x55cce651b6706ce78352909454bf22f2c607268ca574dace123354e896ebe2b7`](https://explorer-studio.genlayer.com/tx/0x55cce651b6706ce78352909454bf22f2c607268ca574dace123354e896ebe2b7), reached `MAJORITY_AGREE` but had explicit `WL_TERMS_JSON` execution errors and created no case. It remains recorded as a failed execution and was not used for any success claim.

## Local verification

- Direct Mode: 35 tests passed.
- GenVM lint/check: 37 methods, 13 views, 24 writes, zero constructor parameters.
- Frontend typecheck, 7 transaction tests, production build, dependency audit, and StudioNet preflight pass.
- Current public deployment route smoke covered `/`, `/explore`, `/new`, `/workspace`, `/activity`, `/verification`, and `/guide`; each rendered without a 404 or application error. The current browser debugger disconnected during wallet reconnect, so fresh signing, rejection, account-change, and refresh-recovery browser paths are untested in this run.
- Production dynamic routes `/agreement/final-proof-20261013`, `/evidence/final-proof-20261013`, `/review/final-proof-20261013`, and `/settlement/final-proof-20261013` also returned HTTP 200 after the Vercel redeployment. The successful release CI run is [quality-gates 38331421267](https://github.com/ometere123/witlock/actions/runs/38331421267), and the READY Vercel deployment is [9PKFCgE4qi88MrkaNMNubanNKnLS](https://vercel.com/delealufejoel-4184s-projects/witlock/9PKFCgE4qi88MrkaNMNubanNKnLS).
- The Chrome profile exposed an injected EIP-1193 wallet on chain 0xf22f. Browser creation transaction https://explorer-studio.genlayer.com/tx/0xef85a36028a4dc8bad7468de3ec4c71e66769fe08f2b9da585321bc1399ccd9c finalized with MAJORITY_AGREE; the authoritative readback is browser-proof-20261012 in DRAFT with the browser account as requester.

genlayer trace is preserved as a limitation: the StudioNet RPC returned method-not-found for gen_dbg_traceTransaction. The full sanitized records are in artifacts/live-61999/manifest.json and artifacts/live-61999/cases.json.

Historical NO_MAJORITY attempts and the superseded address 0x4D39aBdF8F574B44Ff178CBf974042a36D70c9A0 remain historical evidence only.
