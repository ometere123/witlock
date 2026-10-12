# Evidence authority

A digest proves byte integrity only. Each frozen criterion nominates an issuer wallet and a distinct independent verifier wallet. The issuer publishes an immutable case-scoped attestation containing:

- agreement and criterion subject;
- issuer sender address;
- evidence digest;
- bounded source coordinate;
- immutable source revision;
- retrieval method and timestamp;
- bounded claim; and
- provenance digest.

The independent verifier calls `verify_attestation_source` with the observed evidence and provenance digests. Only after that transaction can a party submit the attestation, and only the nominated issuer can authenticate it. The record cannot be replaced after publication.

This proves wallet-level publication and exact source-observation commitments. It does not prove legal identity, domain ownership, human independence, factual truth, content availability, or that two wallets belong to different people. Redirects, deleted content, false claims, prompt injection, conflicting records, and correlated authorities remain trust assumptions. Consensus can classify the admitted claim as `INCONCLUSIVE`; the contract never treats a URL or hash as automatic truth.

GitHub URLs and revisions are frozen coordinates in the record. Actual repository ownership, commit ancestry, release relationships, and human control require external verification by the nominated authorities and are not inferred from a username string.
