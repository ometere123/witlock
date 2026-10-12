# Security model

WITLOCK targets stable StudioNet `61999` through the repository-local CLI `0.39.1`, with RPC `https://studio.genlayer.com/api` and explorer `https://explorer-studio.genlayer.com`.

The monolith freezes parties, criteria, issuer wallets, independent verifier wallets, source coordinates, retrieval metadata, deadlines, and entitlements. It rejects unauthorized calls, issuer/verifier substitution, duplicate records, early deadlines, unverified sources, malformed consensus, oversized dossiers/results, appeal replay, and arbitrary payment recipient/amount inputs.

Consensus is bounded to criterion labels. The contract calculates the verdict, integer score, and role-derived allocations. Consensus exceptions and invalid output fail closed to `INCONCLUSIVE` with `BLOCKED_CONSENSUS`; no model output selects a recipient or amount.

The frontend uses injected EIP-1193 only, checks account and chain before every write, distinguishes accepted from finalized transactions, verifies execution success, persists pending hashes for recovery, and links finalized transactions to the StudioNet explorer.

Native custody is disabled. No administrator transfer, hidden withdrawal, or fallback deposit path exists. A digest proves integrity, an issuer call proves publication, and an independent verifier call proves source-observation agreement; none proves human independence, legal authority, factual truth, or recipient payment.

The current source has no live deployment claim. Fresh deployment attempts reached `FINALIZED` with `NO_MAJORITY` and no consensus data because the StudioNet probe reports no consensus contracts deployed. Browser signing, recipient delivery, transfer recovery, and live current-source lifecycle outcomes remain unproven and are not presented as available.
