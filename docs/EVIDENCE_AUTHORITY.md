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

The independent verifier calls `verify_attestation_source` with the observed evidence and provenance digests. The transaction causes validators to retrieve the source during nondeterministic execution. The enabled class is an immutable raw GitHub file addressed by a full 40-character commit SHA: the response must be HTTP 200, UTF-8, non-empty, at most 2 KiB, its SHA-256 must match, the derived provenance commitment must match, and the GitHub commit API must return the exact commit object. Validators compare the complete bounded observation. Only after that transaction can a party submit the attestation, and only the nominated issuer can authenticate it. The record cannot be replaced after publication.

This proves wallet-level publication and exact source-observation commitments. It does not prove legal identity, domain ownership, human independence, factual truth, content availability, or that two wallets belong to different people. Redirects, deleted content, false claims, prompt injection, conflicting records, and correlated authorities remain trust assumptions. Consensus can classify the admitted claim as `INCONCLUSIVE`; the contract never treats a URL or hash as automatic truth.

Mutable branches, generic HTTPS pages, IPFS coordinates, and chain reads are not independently verified classes in this release and cannot pass `source_verified`. GitHub commit existence and repository coordinates are checked by the contract; release relationships, repository ownership, human identity, and ancestry beyond the exact commit object require external verification and are not inferred from a username string.
