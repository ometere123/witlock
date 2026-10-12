# Custody and recovery

Custody is disabled. The contracts do not accept GEN deposits, emit payouts, expose withdrawals, or provide privileged transfer methods. The frontend labels a transaction hash as submission evidence and never calls it a payment receipt.

This is a deliberate safety gate. GenLayer internal messages are asynchronous and a finalized parent does not by itself prove that a child transfer executed successfully or that an external recipient received the intended amount. Before enabling a settlement engine, WITLOCK must observe parent finality, child creation, child execution success, transfer receipts, recipient balance change, duplicate submission behavior, failed transfers, delayed children, and restart recovery on the exact 61999 stack.

Until that evidence exists, the correct recovery behavior is to keep the economic operation unavailable. Recreating missing custody in accounting, retrying an ambiguous transfer, or clearing an entitlement after emitting a message would violate conservation and no-double-payout requirements.
