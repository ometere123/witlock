# Invariants

1. **Frozen policy:** key, parties, criteria, issuer addresses, weights, critical flags, details digest, and deadlines cannot change after creation.
2. **Role separation:** requester, provider, and every nominated issuer are distinct.
3. **Bounded input:** keys, questions, claims, source coordinates, criterion count, and dossier size are capped.
4. **Issuer binding:** only the nominated issuer can publish and authenticate its criterion record.
5. **Case-scoped evidence:** one criterion has one immutable evidence binding; an attestation cannot be replaced after publication.
6. **Deterministic economics:** consensus supplies labels only; integer score and provider/requester allocation are contract calculations.
7. **Consensus schema:** every criterion appears exactly once with `PASS`, `FAIL`, or `INCONCLUSIVE`.
8. **Deadline safety:** acceptance, delivery timeout, appeal, and appeal-resolution methods reject early calls.
9. **Append-only history:** every transition and decision version receives a new audit key.
10. **Custody containment:** `custody_enabled()` is false; non-zero funding and outbound payment paths revert.
11. **Accounting conservation:** `funded = confirmed_paid + in_flight + unresolved + remaining`, with no negative component.
12. **No ambiguous retry:** an unresolved payment attempt cannot be silently retried or marked paid.