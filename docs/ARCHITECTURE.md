# WITLOCK architecture

`contracts/Witlock.py` is the only deployable source and its class is `Witlock(gl.Contract)`. It owns agreement creation, frozen criteria, issuer/verifier authority, attestation and evidence bindings, GenLayer adjudication, appeals, audit history, and settlement accounting.

Creation freezes the requester, provider, 1–2 weighted criteria, external issuer and independent verifier wallets, details digest, and ordered deadlines. The nominated issuer publishes a case-scoped attestation. The independent verifier separately verifies the source digest and provenance. A party binds the attestation to the case and the issuer authenticates the exact digest. This proves wallet transactions and frozen commitments while leaving factual truth to bounded GenLayer judgment.

Evidence remains admissible through `ACTIVE`, `DELIVERED`, and `REVIEW` before the delivery deadline, so requester acknowledgement or an open dispute cannot lock the provider out of the evidence path. Sealing requires all criteria to be source-verified and issuer-authenticated.

`gl.nondet.exec_prompt` interprets the admitted dossier and `gl.eq_principle.prompt_comparative` requires validators to agree on the complete `PASS` / `FAIL` / `INCONCLUSIVE` mapping. Invalid or oversized consensus data fails closed. The contract calculates the result and integer allocation; models cannot choose money or recipients. Decision versions and transitions are append-only.

Funding and payout entry points exist only behind `custody_enabled()`. The current implementation returns `False`, rejects non-zero funding and bonds, and leaves payment methods unreachable. The ledger still describes role-derived entitlements, delivery evidence, in-flight, unresolved, and recovery states so a future custody implementation cannot silently treat an emitted transfer as paid.
