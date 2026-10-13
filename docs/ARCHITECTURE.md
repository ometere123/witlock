# WITLOCK architecture

`contracts/Witlock.py` is the only deployable source and its class is `Witlock(gl.Contract)`. It owns agreement creation, frozen criteria, issuer/verifier authority, attestation and evidence bindings, GenLayer adjudication, appeals, audit history, and settlement accounting.

Creation freezes the requester, provider, 1–4 weighted criteria, external issuer and independent verifier wallets, details digest, and ordered deadlines. The nominated issuer publishes a case-scoped attestation. The independent verifier separately verifies the source digest and provenance. A party binds the attestation to the case and the issuer authenticates the exact digest. This proves wallet transactions and frozen commitments while leaving factual truth to bounded GenLayer judgment.

Evidence remains admissible through `ACTIVE`, `DELIVERED`, and `REVIEW` before the delivery deadline, so requester acknowledgement or an open dispute cannot lock the provider out of the evidence path. Sealing requires all criteria to be source-verified and issuer-authenticated.

`gl.nondet.exec_prompt` interprets the admitted dossier and `gl.eq_principle.prompt_comparative` requires validators to agree on the complete `PASS` / `FAIL` / `INCONCLUSIVE` mapping. Invalid or oversized consensus data fails closed. The contract calculates the result and integer allocation; models cannot choose money or recipients. Decision versions and transitions are append-only.

Funding is exact-value and requester-only. Funded rejection paths return the value through an explicit `_Payee` message. After terminal finalization, payout dispatch reads only the frozen role recipient and entitlement, saves a one-use dispatch record, and emits a native transfer. The ledger keeps `in_flight` until external child-message and recipient-balance observation; an emitted transfer is never silently treated as paid.
