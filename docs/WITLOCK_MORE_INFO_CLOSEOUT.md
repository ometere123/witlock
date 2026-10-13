# WITLOCK more-info closeout

Audit date: 2026-10-13. This closeout preserves one canonical Intelligent Contract, stable StudioNet 61999, the route-first Next.js frontend, injected EIP-1193 wallets, source-backed adjudication, and explicit limits around asynchronous child delivery.

## A. Reviewer limitations closed

| Original limitation | Correction | Evidence | Status |
| --- | --- | --- | --- |
| Custody was disabled and settlement was allocation-only | `fund_agreement`, `begin_payment`, native `_Payee(...).emit_transfer`, bounded funding, role-derived recipients, and conservation fields were implemented in `contracts/Witlock.py` | Live 0.001 GEN funding, native dispatch, recipient balance delta, and funded refusal refund | CLOSED for the proven paths; full multi-verdict payment matrix remains partial |
| Payout could be confused with adjudication finality | Entitlements remain provisional until `finalize_decision`; payment begins only from `FINAL_DECISION` and uses frozen decision version and role data | Terminal finalization receipt, idempotent replay, and final state readback | CLOSED |
| The original two-criterion bound disagreed with policy | The safe bound is four criteria, with bounded prompts and dossier size; contract, policy, Direct Mode, and frontend copy now agree | `MAX_TASKS=4`, schema/check output, four-criterion partial test, UI limit | CLOSED |
| Evidence authority was only wallet separation | Immutable GitHub raw commit, source-byte digest, provenance hash, issuer/verifier separation, and duplicate authentication protection remain enforced | Live source readbacks and duplicate `WL_EVIDENCE_ALREADY_AUTHENTICATED` receipt | PARTIAL: CI or publisher authority is not authenticated by the contract |
| Settlement paths were unreachable or decorative | Payable funding, explicit funded rejection/refund, role-bound dispatch, asynchronous observation, ambiguity marking, and idempotent latches are reachable; unsafe caller-supplied delivery confirmation was removed | Contract schema, Direct Mode accounting/replay cases, live funding/refund/dispatch | CLOSED for the implemented model |
| Frontend/UX had no meaningful proof | Added funded creation, exact-value payable flow, receipt outcome classification, finalized-only dispatch, settlement observation, and current-address production route evidence | Production `/verification` and `/new` browser observations; frontend tests/build | PARTIAL: current-address injected-wallet writes and recovery paths still need independent reproduction |

## B. Economic security

Incoming funding uses the payable `fund_agreement` entry point and `gl.message.value`. The requester, agreement key, and exact funding amount are checked before state is committed. Because StudioNet credits incoming value before GenVM execution, invalid funded calls return a machine-readable `REJECTED_FUNDED` result and emit the exact value back to the original sender instead of reverting.

Outgoing settlement uses the frozen entitlement and frozen role address. `begin_payment` is permissionless but cannot accept an arbitrary recipient or amount. It writes the payment attempt, in-flight amount, decision version, and one-use latch before emitting the native `_Payee` transfer. The current contract leaves the attempt `DISPATCHED_PENDING_DELIVERY` until a reviewer independently observes the child transfer and recipient balance. It does not accept a caller-supplied receipt hash as delivery proof.

The live dispatch was a rejected decision, so the requester was entitled to `1000000000000000` wei and the provider was entitled to zero. The requester balance increased by exactly that amount. The accounting equation was `funded = confirmed_paid + in_flight + unresolved + remaining`, with `1000000000000000 = 0 + 1000000000000000 + 0 + 0`.

Appeals capture the first ruling time exactly once. A delayed ruling receives an effective deadline at least 900 seconds after that ruling, and both `open_appeal` and `finalize_decision` use the same captured deadline. An appeal reversal creates a new decision version before terminal finalization; the live case finalized version 2 and dispatched only the requester-side entitlement from the final rejected decision.

An unresolved child is not silently retried. After the bounded observation deadline, `mark_payment_ambiguous` moves the attempt to an explicit unresolved state and preserves the conservation record. The remaining residual risk is that StudioNet does not expose a safe in-contract child-finality primitive, so delivery confirmation remains an independently inspectable external observation rather than an asserted contract state.

## C. Live proof table

| Case | Evidence | Result |
| --- | --- | --- |
| Terminal appeal reversal with funding | `custody-live-20261013-b`; create `0x99f87e996e61cec8539c43daead620d2e27d1be9e764650b95125d9ac5c3fcd3`; fund `0x31b3319830a2afbef0f0737dc6f6669dfe9adff7f3daa7aba71d061d8ab6ced7`; appeal/finalize `0x9f2b0e85b9e09da442cffd0869c4d6a062345387571f2dfa8d366051d91add79`, `0xb6d7195c2be4830533643b03a4b1ebce7fb8459d9bf6a1afb887b3e2640ddc2a`, `0x383cf0ad3bd82b7f76221a43f959febf0f77d8ed6881bda49b33987ca433b610` | `FINAL_DECISION`, `REJECTED`, appeal `FINALIZED`, authenticated appeal, decision version 2; requester-side dispatch `0x31b2e1d048e3b6366686c8aab3e82d7916f2a9143eedce8a901c719435413b63` and exact recipient balance increase |
| Funded refusal | `refund-live-20261013-a`; `0x3b66251ea887766e97839ff2ebdc7dbdc1186b2361f6383266199da69c1aa190` | `FINALIZED` / `MAJORITY_AGREE`, successful leader, `REJECTED_FUNDED WL_FUNDING_ZERO`, exact 0.001 GEN refund, zero net balance change |
| Deployment/source parity | Deploy `0xd38499ccb036e6188428a47707e5cdb71f289cd3e9dc47af7c3dc30e061cfe68` to `0x8d90aE2C95E320Ea61774a797D92ef84F6831bC2` | `FINALIZED` / `MAJORITY_AGREE`, successful leader; 64,862 bytes and SHA-256 `93de46c2c0749f9016cd4297658679b0f25f12e0bce91ab6fe867d328835dff9` match exactly |
| Approved, independent partial, and standalone rejected settlement matrices | No complete fresh WITLOCK live receipts were obtained for every requested verdict class | Direct Mode covers the decision and accounting branches; live proof remains partial and does not claim missing provider or split-payment receipts |

The full transaction ledger and readbacks are in [LIVE_PROOF.md](LIVE_PROOF.md) and [../artifacts/live-61999/cases.json](../artifacts/live-61999/cases.json).

## D. Test results

| Area | Result |
| --- | --- |
| Direct Mode and adversarial cases | PASS: 38 Python tests, including authority separation, immutable source hashing, prompt injection, malformed/missing evidence, four-criterion partial classification, delayed adjudication, late appeal, expiry, replay, conservation, and receipt fixtures |
| Mutation testing | SKIP: no mutation runner is configured in the repository; no mutation score is claimed |
| Frontend receipt tests | PASS: 13 Vitest tests, including real SDK numeric execution fields, contradictory metadata, `NO_MAJORITY`, explicit errors, quorum cancellation, pending recovery, wallet rejection, and funded refusal |
| TypeScript and production build | PASS: `npm run web:typecheck`; `npm run web:build` |
| GenVM lint/check/schema | PASS: 35 methods, 13 views, 22 writes, zero constructor parameters |
| Preflight and dependency audit | PASS: StudioNet 61999 at the approved RPC; `npm audit --audit-level=moderate` found 0 vulnerabilities |
| GitHub Actions | PASS: [quality-gates run 38453389688](https://github.com/ometere123/witlock/actions/runs/38453389688), final policy and frontend jobs successful |
| Browser | PARTIAL: current production `/verification` and `/new` rendered; wrong-network UI was exercised with wallet chain `0x1`; the automation surface did not expose `window.ethereum`, so current-address signing, account-change, rejection, disconnect/reconnect, interrupted-write, and persisted-recovery paths are unclaimed |

## E. Deployment

- Verified source commit on `main`: `a370dade0b65ac67e38c09b0b94cae01a435ca3c`; the final closeout commit is documentation-only.
- Working tree: clean; remote `main` resolves to the same SHA.
- Contract: [`0x8d90aE2C95E320Ea61774a797D92ef84F6831bC2`](https://explorer-studio.genlayer.com/address/0x8d90aE2C95E320Ea61774a797D92ef84F6831bC2).
- Deployment: [`0xd38499ccb036e6188428a47707e5cdb71f289cd3e9dc47af7c3dc30e061cfe68`](https://explorer-studio.genlayer.com/tx/0xd38499ccb036e6188428a47707e5cdb71f289cd3e9dc47af7c3dc30e061cfe68).
- Network: StudioNet stable, chain 61999, RPC `https://studio.genlayer.com/api`, repository-local CLI `0.39.1`.
- Source: 64,862 bytes, SHA-256 `93de46c2c0749f9016cd4297658679b0f25f12e0bce91ab6fe867d328835dff9`; deployed source matches byte-for-byte.
- Vercel: production is [https://witlock.vercel.app](https://witlock.vercel.app); the latest observed production deployment was Ready and aliased to that URL.
- Wallet functionality: the public route and wrong-network guard were observed. Current-address injected-wallet read/write and signing behavior remains unverified in the available browser automation surface.

## F. Reviewer reassessment rationale

WITLOCK now has a material GenLayer consequence: validator-backed, source-authenticated adjudication determines frozen native GEN entitlements, while appeal finality gates payment initiation. The contract preserves role separation, immutable source coordinates, complete-label agreement, deterministic scoring, versioned appeals, and append-only history. The economic model is bounded, role-bound, replay-protected, and conservative about asynchronous children.

The contract quality case is materially stronger because the live release proves payable funding, safe funded refusal, a finalized appeal reversal, a native dispatch, recipient balance movement, exact conservation, and idempotent finalization. Engineering quality is supported by the aligned four-criterion policy, adversarial Direct Mode coverage, hardened receipt classifier, exact source parity, and reproducible CI. Frontend quality is supported by the route-first funded flow, exact-value transaction UX, finalized-only dispatch gating, public production configuration, and observed wrong-network blocking, with wallet-path evidence still required for a complete independent frontend assessment.

## G. Final verdict

**PARTIAL — ADDITIONAL EVIDENCE REQUIRED**

The custody-enabled candidate is safe enough to preserve as the current documented deployment because the critical incoming refund, native dispatch, role binding, appeal-finality, conservation, and replay gates passed. The closeout is partial because the requested complete live APPROVED/PARTIAL/REJECTED matrix and current-address injected-wallet browser suite were not obtained. No successful payment, browser signature, or independent authority guarantee is claimed beyond the evidence listed above.
