# Live proof

This release is deployed on GenLayer StudioNet stable, chain 61999 (`0xF22F`), at [the canonical contract](https://explorer-studio.genlayer.com/address/0x8B6e64A6C5c5Bccc3a64Cba4Bd8982218381330d).

- Contract: `0x8B6e64A6C5c5Bccc3a64Cba4Bd8982218381330d`
- Deployment transaction: [`0x298e3e7eed4ec8ad25017600f87f49608cdc5bfb94b5d7eadf0cb0dbfabace1`](https://explorer-studio.genlayer.com/tx/0x298e3e7eed4ec8ad25017600f87f49608cdc5bfb94b5d7eadf0cb0dbfabace1)
- Deployment receipt: `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS`; three agreeing validators and two explicit idle quorum-cancellation validators
- Release source commit: `7ce1517d82e711aa12604177ddadaa644c1691e8`
- Deployed source: 64,131 normalized bytes, SHA-256 `04352A02F6BFBD7BEF7C5C00BE93FD5779ABD5BC340941C62863BF2ABB1E8C79`
- Exact normalized source parity: `true`
- Schema: 37 methods, 13 views, 24 writes, zero constructor parameters
- RPC: `https://studio.genlayer.com/api`
- Repository-local CLI: `0.39.1`
- `custody_enabled`: `false`

## Delayed adjudication and terminal proof

The authoritative successful lifecycle is `live-final-7ce-3`. It uses distinct requester `0x21892bba93381d94037fb4aab01cafbdf4453b56`, provider `0xa7eeae0e93793e3146cb14b0700251b8b0ebadfb`, issuer `0xb5ecd6dda36b370aca4af5e2005d8e2ae89c6db2`, and independent verifier `0xac3ac69dc0bde389256dd6748c75817ead9286d9`.

The case was created with original appeal deadline `1791887316`. The real clock passed it before adjudication. The first ruling recorded `appeal_window_started_at=1791887373` and effective `appeal_deadline=1791888273`, exactly 900 seconds after the ruling and later than the original deadline. The deadline stayed `1791888273` after the appeal resolution.

| Step | Transaction | Final receipt and outcome |
| --- | --- | --- |
| Create | `0x5fcb6f9893c736c6519291f905c9fdaee8ee5c463ffc3c7b75d5a6f563328d72` | `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS` |
| Accept | `0xd7fc5df8f693301c6fe8d0d86f4b32676eeac52be684ce8dc6124877659755eb` | `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS` |
| Publish issuer attestation | `0x0eb08d774cedc20f99196a85c1bc0740543d71ab30e723154aa26023cc0c4dec` | `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS` |
| Verify immutable source | `0x3430a5c92fbf02c43a5e26d4d8c0ff62ca76b3f8063e7901475cbf3a478a003f` | `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS`; one idle validator cancelled after quorum |
| Submit evidence | `0x8e3692cfb1fdf713e30dc0a1e896cac22b8739e49fc5d0115cb8acdee08ad1de` | `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS` |
| Authenticate evidence | `0x8a470726cb89fd0ba463c4b3074757be5d3c7da037add3986c41142b01e23706` | `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS`; one idle validator cancelled after quorum |
| Acknowledge delivery | `0x998d9097f4fdc91d71e37f46b40256095b47c5ea9e2978a1334e26049a60adc2` | `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS` |
| Seal | `0x5efcfc36ee0d63afab563696b02c832bb5fca4f49ec4b59cff04c832aca8185b` | `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS`; one idle validator cancelled after quorum |
| Delayed adjudicate | [`0x08952b202f0c647973c3414124785220e4263fa9804a2d6582d4b08142e9eeac`](https://explorer-studio.genlayer.com/tx/0x08952b202f0c647973c3414124785220e4263fa9804a2d6582d4b08142e9eeac) | `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS`; two idle validators cancelled after quorum; result `APPROVED`, score `100`, decision version `1` |
| Open authenticated appeal | `0xc69968cc8cda76ec29497e14f24f0d8e8b60ba1c6c75d50a1600f4a9ac488d2c` | `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS`; one idle validator cancelled after quorum |
| Authenticate appeal | `0xb05ab4818080a077cab444cc3fb28c10669f1355b78d4e520a5269ae29189733` | `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS`; two idle validators cancelled after quorum |
| Resolve appeal | `0x7d3e726b23df263d38934bd19f2144917b1c8ff3b22b9e47cf095c632569d245` | `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS`; one idle validator cancelled after quorum; result `REJECTED`, score `0`, decision version `2` |
| Terminal finalize | [`0xc112b995fa09eea2d8358b43efcad1569bce6db17a846d30dfaccca9e670abca`](https://explorer-studio.genlayer.com/tx/0xc112b995fa09eea2d8358b43efcad1569bce6db17a846d30dfaccca9e670abca) | `FINALIZED`, `MAJORITY_AGREE`, leader and all validators `SUCCESS` |
| Idempotent finalize | `0xcf1dd65af3012d9a87b2341f7cde4ede818e354eb005bbfa8c98b31107d3864e` | `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS`; two idle validators cancelled after quorum; revision unchanged |

The final `get_agreement` readback is `status=FINAL_DECISION`, `result=REJECTED`, `score=0`, `appeal_status=FINALIZED`, `appeal_verification_status=VERIFIED`, `appeal_authenticated=true`, `decision_version=2`, `appeal_deadline=1791888273`, and `revision=12`. The final decision readback is `answers.source=FAIL`, `appeal=true`, `consensus_status=AGREED`, `version=2`, and `payment_status=CUSTODY_DISABLED`. The settlement readback is `custody_enabled=false`, `status=RECONCILED_NO_CUSTODY`, `funding_received=0`, `funding_required=0`, `paid=0`, `in_flight=0`, `unresolved=0`, and both entitlements zero.

History revision 11 is `APPEAL_WINDOW_REOPENED`; revision 12 is `FINAL_DECISION` at `1791888340`. Calling `finalize_decision` again succeeded as a no-op and left revision 12 unchanged.

The initial source observation was the immutable GitHub raw commit `7ce1517d82e711aa12604177ddadaa644c1691e8`, `docs/source-fixtures/pass.txt`, 54 bytes, digest `13126b6e375490b80d6b081b3992a798dfcf5cd2b28a30b2d5959c6854109901`. The authenticated appeal observed `docs/source-fixtures/reversal.txt` at its actual introducing commit `cbe4438d44abc6112a5714caf3c8c60ac80b1fbe`, 56 bytes, digest `8e29f1d1cf0b3f02bc57b1f65538d2d1bc118781c2d29334ad7d9f0eb3975005`, and recorded source class `GITHUB_RAW_COMMIT`.

## Preserved failed live attempt

Case `live-final-7ce-2` proves the delayed-window write itself but is preserved as a failed appeal setup. Adjudication `0x3c5b2457713ec4f89bc01c86996a16fd89e8677d1de2d1fb4f42e18b0dfaa8f7` recorded `appeal_window_started_at=1791886267` and deadline `1791887167`. Its appeal used an invalid source revision and the verifier recorded `GITHUB_COMMIT_NOT_FOUND`; the subsequent resolve transaction `0x7855c772ef772cdd53386604d344c65d4736100777856dba63796da84c924ec5` returned explicit `WL_APPEAL_NOT_AUTHENTICATED`. It is not included in any success claim.

## Frontend and browser evidence

Production is [https://witlock.vercel.app](https://witlock.vercel.app), with Vercel deployment [`dpl_8a146cUK4yvfsSzACK6RApz1r79g`](https://vercel.com/delealufejoel-4184s-projects/witlock/8a146cUK4yvfsSzACK6RApz1r79g). HTTP checks returned 200 for `/`, `/verification`, and `/agreement/live-final-7ce-2`; the browser also rendered `/agreement/browser-wrong-network` from finalized chain state.

The real Chrome injected EIP-1193 session showed account `0x81301dd9c3605a7da743d87b803156d8445620b0`, wallet chain `0xf22f`, StudioNet 61999, the current contract address, and custody `DISABLED` on `/verification`. The shared wallet state was tested through disconnect and reconnect: the UI changed to `Wallet disconnected from this interface. Reconnect to resume signing.` and then returned to the injected account. A browser write from that account finalized as [`0xbdd7bea2be10198d7a426d9712591f35fa7302f5775932e0c7adf98d20e0f051`](https://explorer-studio.genlayer.com/tx/0xbdd7bea2be10198d7a426d9712591f35fa7302f5775932e0c7adf98d20e0f051), `FINALIZED`, `MAJORITY_AGREE`; `browser-wrong-network` read back as `DRAFT`, requester equal to that account, revision 1, and custody disabled.

An interrupted browser write visibly entered `Waiting for finality…`; after reload the form recovered and `/activity` showed no pending hash. The chain later finalized the write above, so the browser-local pending-to-finalized recovery UI was not independently observed. Account switching, wrong-network blocking, and explicit signature rejection were not reproduced in this Chrome session because the injected wallet remained on the approved chain and the wallet extension confirmation/account controls were not exposed through the safe browser surface. Automated receipt tests cover wallet rejection and pending recovery.

## Local and CI verification

- Direct Mode and policy suite: 37 passed.
- Frontend receipt tests: 11 passed.
- GenVM check: 37 methods, 13 views, 24 writes, zero constructor parameters.
- Python compileall, frontend typecheck, production build, StudioNet preflight, and `npm audit --audit-level=moderate`: passed; audit reported 0 vulnerabilities.
- GitHub Actions `quality-gates` passed for release commit `d930cb028716ac5bcbd5a623d8916662410f7aad`: [run 38386507863](https://github.com/ometere123/witlock/actions/runs/38386507863), with `frontend` and `policy` successful.

StudioNet does not implement `gen_dbg_traceTransaction`; trace output is therefore unavailable. Native GEN escrow, successful payment, recipient delivery, and payment recovery remain intentionally unclaimed.

