# Custody and recovery

Custody is disabled by a hard capability gate. `custody_enabled()` returns `False`; non-zero creation funding, funding calls, operator bonds, and outbound payment calls revert. No fallback deposit path accepts unexpected value.

The ledger still models required funding, received funding, provider/requester entitlements, confirmed paid, in-flight, unresolved, and remaining obligations. Its intended conservation equation is:

`funded = confirmed_paid + in_flight + unresolved + remaining`

`begin_payment` derives recipient and amount from frozen role entitlements. `confirm_payment_delivery` requires a receipt hash and separate delivery-evidence hash. `reconcile_payment` accepts only authenticated delivery evidence with a matching receipt. `mark_payment_ambiguous` records an incident after a deadline and does not re-credit or authorize a blind retry.

No live transfer or recovery proof is recorded. Enabling custody requires finalized StudioNet evidence for parent/child finality, recipient balance delivery, failed and delayed transfers, duplicate calls, ambiguous receipts, restart recovery, and unsuccessful asynchronous children. Until then, zero-value agreement decisions are the only enabled economic path.
