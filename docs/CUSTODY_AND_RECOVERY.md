# Custody and recovery

Custody is disabled by a hard capability gate. The monolith exposes exact funding, bond, payment, and reconciliation entry points so the interface is explicit, but `custody_enabled()` is `False`; non-zero agreement funding is rejected at creation, funding calls revert, and no outbound transfer is emitted. Plain unexpected transfers are not accepted by a fallback method.

The ledger schema still distinguishes required funding, received funding, provider/requester entitlements, confirmed paid, in-flight, unresolved, and remaining amounts. Its conservation equation is `funded = confirmed_paid + in_flight + unresolved + remaining`. No entitlement is cleared on submission, and no retry is permitted after an ambiguous attempt.

Enabling the gate requires live evidence on StudioNet 61999 for accepted and finalized parent messages, child creation, child execution success, recipient balance delivery, failed transfer behavior, delayed execution, duplicate calls, ambiguous receipts, restart recovery, and unsuccessful asynchronous children. Until that evidence is recorded, zero-value agreements are the only funding-safe path.