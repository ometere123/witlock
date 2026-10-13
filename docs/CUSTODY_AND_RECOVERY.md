# Custody and recovery

WITLOCK has native GEN settlement enabled on the current monolith. The contract never exposes an administrator withdrawal or arbitrary recipient/amount input. All amounts and recipients come from the frozen agreement and terminal decision.

## Incoming funding

`create_agreement` records an exact `funding_required` amount. `fund_agreement` accepts only a draft agreement, the requester, and the exact amount. StudioNet credits incoming value before GenVM execution, so a rejected funded call must complete successfully and emit a refund. The contract returns `REJECTED_FUNDED <reason>` and dispatches the same value to the sender. A live zero-funding probe proved `WL_FUNDING_ZERO` returned the full 0.001 GEN and left both the agreement and balances unchanged.

Operator bonds are unsupported in this release. `post_operator_bond` refunds any incoming value and returns `REJECTED_FUNDED WL_BOND_UNSUPPORTED`.

## Outgoing dispatch

After `FINAL_DECISION`, `begin_payment(key, role)` reads the frozen role entitlement and frozen role address. A positive entitlement can be dispatched once for that role. The contract saves the payment record and conservation state before emitting the native value transfer through the `_Payee` interface. A second call for the same role fails with `PAYMENT_NOT_IDEMPOTENT`.

The contract records `DISPATCHED`, `in_flight`, and `delivery_status=EXTERNAL_OBSERVATION_REQUIRED`. It does not accept a caller-supplied receipt hash as proof of payment. A reviewer must inspect the finalized parent receipt, the value-bearing child message, and the recipient balance. The live proof shows a 0.001 GEN requester balance increase and an exact conservation equation, while the contract settlement status remains `DISPATCHED_PENDING_DELIVERY` until that external observation is recorded by the reviewer.

If a dispatch remains unresolved beyond its seven-day observation deadline, `mark_payment_ambiguous` moves it to `AMBIGUOUS`, decreases `in_flight`, increases `unresolved`, and requires a digest-bound incident record. No retry path can create a second payout. `RECONCILED_DELIVERED` is reserved for an authenticated in-contract delivery state and is not claimed by the current StudioNet proof.

## Evidence

- Candidate contract: `0x8d90aE2C95E320Ea61774a797D92ef84F6831bC2`
- Terminal case: `custody-live-20261013-b`
- Funding/refund case: `refund-live-20261013-a`
- Exact receipts and readbacks: [LIVE_PROOF.md](LIVE_PROOF.md)
- Sanitized machine-readable ledger: [../artifacts/live-61999/manifest.json](../artifacts/live-61999/manifest.json)
