# Reviewer evidence

## Repository and deployment

- One canonical deployable source: `contracts/Witlock.py`, class `Witlock`.
- Repository-local CLI `0.39.1`; `genlayer-js` `1.1.8`; StudioNet stable chain `61999`; RPC `https://studio.genlayer.com/api`.
- Current contract: [`0x8B6e64A6C5c5Bccc3a64Cba4Bd8982218381330d`](https://explorer-studio.genlayer.com/address/0x8B6e64A6C5c5Bccc3a64Cba4Bd8982218381330d).
- Deployment: [`0x298e3e7eed4ec8ad25017600f87f49608cdc5bfb94b5d7eadf0cb0dbfabace1`](https://explorer-studio.genlayer.com/tx/0x298e3e7eed4ec8ad25017600f87f49608cdc5bfb94b5d7eadf0cb0dbfabace1), `FINALIZED`, `MAJORITY_AGREE`, leader `SUCCESS`.
- Exact normalized source parity: 64,131 bytes, SHA-256 `04352A02F6BFBD7BEF7C5C00BE93FD5779ABD5BC340941C62863BF2ABB1E8C79`.
- Schema parity: 37 methods, 13 views, 24 writes, zero constructor parameters.

## Contract hardening evidence

- First adjudication after the original deadline creates a single effective appeal deadline at least 900 seconds after the ruling.
- `open_appeal()` accepts through the effective deadline; `finalize_decision()` accepts at and after it. Replay cannot extend it.
- Top-level receipt aliases must agree. Explicit execution errors, `NO_MAJORITY`, unknown execution, inconsistent validator records, malformed fields, and leader errors fail closed. Only explicit idle validator cancellation after a successful quorum is accepted.
- Direct Mode covers delayed rulings, late appeals, exact expiry boundaries, replay, finalization idempotency, source immutability, prompt injection, missing evidence, malformed answers, accounting conservation, and custody shutdown.

## Live lifecycle

The complete delayed lifecycle is `live-final-7ce-3`: finalized create, acceptance, issuer publication, independent source verification, evidence authentication, sealing, delayed adjudication, appeal opening, authenticated immutable-source appeal, appeal resolution, terminal finalization, and idempotent replay. The terminal readback is `FINAL_DECISION`, `REJECTED`, appeal version `2`, `appeal_status=FINALIZED`, `settlement_status=RECONCILED_NO_CUSTODY`, and `payment_status=CUSTODY_DISABLED`. Exact hashes and authoritative readbacks are in [LIVE_PROOF.md](LIVE_PROOF.md) and [the sanitized ledger](../artifacts/live-61999/cases.json).

The current source observation used `docs/source-fixtures/pass.txt` at commit `7ce1517d82e711aa12604177ddadaa644c1691e8`; the appeal observation used `docs/source-fixtures/reversal.txt` at commit `cbe4438d44abc6112a5714caf3c8c60ac80b1fbe`. Issuer and verifier wallets are distinct. No native transfer or recipient-delivery proof is claimed.

## Frontend and browser verification

- Production: [https://witlock.vercel.app](https://witlock.vercel.app).
- READY Vercel deployment: [`dpl_8a146cUK4yvfsSzACK6RApz1r79g`](https://vercel.com/delealufejoel-4184s-projects/witlock/8a146cUK4yvfsSzACK6RApz1r79g).
- `/`, `/verification`, `/agreement/live-final-7ce-2`, and `/agreement/browser-wrong-network` rendered publicly; the verification page showed StudioNet 61999, `0xf22f`, the current contract, and `DISABLED` custody.
- Real injected-wallet evidence: account `0x81301dd9c3605a7da743d87b803156d8445620b0`, successful browser creation transaction [`0xbdd7bea2be10198d7a426d9712591f35fa7302f5775932e0c7adf98d20e0f051`](https://explorer-studio.genlayer.com/tx/0xbdd7bea2be10198d7a426d9712591f35fa7302f5775932e0c7adf98d20e0f051), disconnect/reconnect state, and finalized chain readback.
- Browser-local persisted receipt recovery, wrong-network blocking, account switching, and explicit signature rejection were not independently reproduced in the current Chrome session; automated tests cover rejection and pending recovery.

## CI and limitations

- Local: 37 Python tests, 11 frontend receipt tests, typecheck, production build, GenVM check, compileall, preflight, and 0 dependency audit vulnerabilities passed.
- GitHub Actions `quality-gates` passed for release commit `d930cb028716ac5bcbd5a623d8916662410f7aad`: [run 38386507863](https://github.com/ometere123/witlock/actions/runs/38386507863), with `frontend` and `policy` successful.
- `gen_dbg_traceTransaction` is unavailable on the approved RPC.
- Custody is permanently disabled; no operational GEN escrow or successful payment is claimed.

