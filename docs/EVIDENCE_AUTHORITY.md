# Evidence authority

A digest proves byte integrity only. Each frozen criterion nominates an external issuer wallet and the monolith requires that issuer to publish an immutable record containing:

- agreement/criterion subject;
- issuer sender address;
- evidence digest;
- bounded source URL or coordinate;
- immutable source revision;
- bounded claim; and
- provenance digest.

The submitting party cannot publish as the issuer or authenticate its own record. `publish_attestation` checks the frozen nominated issuer, and `submit_evidence` binds one case-scoped attestation to one criterion. `authenticate_evidence` is a second transaction from the nominated issuer and checks the exact digest. Records cannot be replaced after publication.

This model proves wallet publication and exact record binding. It does not prove legal identity, domain ownership, human independence, or factual truth. Redirects, deletion, false claims, unavailable sources, prompt injection, and correlated issuers remain trust boundaries. They must produce `INCONCLUSIVE` or a failed deterministic outcome rather than an automatic pass.