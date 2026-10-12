# Invariants

1. **Frozen policy:** key, parties, criteria, issuer/verifier wallets, weights, critical flags, details digest, and deadlines cannot change after creation.
2. **Role separation:** requester, provider, issuer, and independent verifier must be distinct where required.
3. **Bounded input:** keys, questions, claims, source coordinates, criterion count, dossier, and consensus result are capped.
4. **Independent source gate:** evidence requires source verification and issuer authentication before sealing.
5. **Case scope:** one criterion binds one immutable attestation; records cannot be replaced or replayed across cases.
6. **Deterministic economics:** consensus supplies labels only; integer score and role-derived allocation are contract calculations.
7. **Consensus schema:** every criterion appears exactly once with `PASS`, `FAIL`, or `INCONCLUSIVE`; failures close safely to no allocation.
8. **Deadline safety:** acceptance, delivery, appeal, appeal resolution, draft expiry, and finalization methods reject early calls.
9. **Append-only history:** every transition and decision version receives a new audit key.
10. **Appeal safety:** structured grounds are frozen, independently authenticated, resolved appeals return to the window, and expiry preserves the prior ruling.
11. **Custody containment:** `custody_enabled()` is false; non-zero funding and outbound payment paths revert.
12. **Accounting conservation:** `funded = confirmed_paid + in_flight + unresolved + remaining`, with no negative component.
13. **No ambiguous retry:** an unresolved payment attempt cannot be silently retried or marked paid.

The Direct Mode suite demonstrates the zero-value evidence and adjudication invariants locally. A current-source StudioNet proof is not recorded because fresh deployment has no consensus round; native-token transfer and recovery remain unproven because the custody gate is disabled.
