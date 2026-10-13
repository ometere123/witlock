# Custody and recovery

WITLOCK has native GEN settlement enabled on the current monolith. The contract never exposes an administrator withdrawal or arbitrary recipient/amount input. All amounts and recipients come from the frozen agreement and terminal decision.

## Incoming funding

`create_agreement` records an exact `funding_required` amount. `fund_agreement` accepts only a draft agreement, the requester, and the exact amount. StudioNet credits incoming value before GenVM execution, so a rejected funded call must complete successfully and emit a refund. The contract returns `REJECTED_FUNDED <reason>` and dispatches the same value to the sender. A live zero-funding probe proved `WL_FUNDING_ZERO` returned the full 0.001 GEN and left both the agreement and balances unchanged.

If the provider never accepts, `recover_expired_funding` is available to the requester only after the acceptance deadline. It marks the draft terminal, latches one exact-value refund dispatch, and prevents later acceptance or replay. The refund has its own seven-day observation deadline; an unobserved child can be marked ambiguous once, preserving the amount as unresolved without authorizing a retry. `expire_draft` remains the zero-funding path and rejects funded drafts with `WL_DRAFT_FUNDED_RECOVERY_REQUIRED`.

Operator bonds are unsupported in this release. `post_operator_bond` refunds any incoming value and returns `REJECTED_FUNDED WL_BOND_UNSUPPORTED`.

## Outgoing dispatch

After `FINAL_DECISION`, `begin_payment(key, role)` reads the frozen role entitlement and frozen role address. A positive entitlement can be dispatched once for that role. The contract saves the payment record and conservation state before emitting the native value transfer through the `_Payee` interface. A second call for the same role fails with `PAYMENT_NOT_IDEMPOTENT`.

The contract records `DISPATCHED`, `in_flight`, and `delivery_status=EXTERNAL_OBSERVATION_REQUIRED`. It does not accept a caller-supplied receipt hash as proof of payment. A reviewer must inspect the finalized parent receipt, the value-bearing child message, and the recipient balance. The current live evidence shows exact `100000000000000` wei provider/refund movements and two exact `50000000000000` wei split movements, while the contract settlement status remains `DISPATCHED_PENDING_DELIVERY` until that external observation is recorded by the reviewer.

If a dispatch remains unresolved beyond its seven-day observation deadline, `mark_payment_ambiguous` moves it to `AMBIGUOUS`, decreases `in_flight`, increases `unresolved`, and requires a digest-bound incident record. No retry path can create a second payout. `RECONCILED_DELIVERED` is reserved for an authenticated in-contract delivery state and is not claimed by the current StudioNet proof.

## INCONCLUSIVE recovery

Each agreement freezes an `inconclusive_provider_bps` policy from 0 to 10000. A consensus failure, missing dossier, or semantically INCONCLUSIVE ruling applies that fixed split to the funded amount: `floor(funded * bps / 10000)` to the provider and the exact residual to the requester. The policy cannot be changed after creation, is applied before the appeal window opens, and follows the same one-use terminal payout latches. A zero-funded INCONCLUSIVE result remains non-payable.

`get_accounting()` now reports both the agreement ledger and global contract liabilities. `actual_contract_balance` is read from `self.balance`; `balance_matches_bookkeeping` is true only when the live balance lies within the stored liability range after accounting for in-flight and unresolved children. Direct Mode may report a zero synthetic balance for attached value, so live balance readbacks remain required for solvency evidence.

## Evidence

- Current contract: `0xC2523f90a89B0A989a15BE81fA124b435f0190cF`
- Terminal cases: `live-approved-1791927477837`, `partial-1791928102021`, and the fresh rejected case recorded in `artifacts/live-61999/cases.json`
- Funding recovery case: `live-draft-recovery-1791928120240`
- Exact receipts and readbacks: [LIVE_PROOF.md](LIVE_PROOF.md)
- Sanitized machine-readable ledger: [../artifacts/live-61999/manifest.json](../artifacts/live-61999/manifest.json)
