# Security model

WITLOCK targets stable StudioNet 61999 through repository-local CLI 0.39.1, RPC https://studio.genlayer.com/api, and explorer https://explorer-studio.genlayer.com.

The monolith freezes parties, criteria, issuer wallets, independent verifier wallets, source coordinates, retrieval metadata, deadlines, and entitlements. It rejects unauthorized calls, issuer/verifier substitution, duplicate records, early deadlines, unverified sources, malformed consensus, oversized dossiers/results, appeal replay, and arbitrary payment recipient/amount inputs.

Consensus is bounded to criterion labels. The contract calculates the verdict, integer score, and role-derived allocations. Consensus exceptions and invalid output fail closed to INCONCLUSIVE with no allocation.

The frontend uses injected EIP-1193 only, checks account and chain before every write, distinguishes accepted from finalized transactions, verifies execution success, persists pending hashes for recovery, and links finalized transactions to the StudioNet explorer. The route-first UI makes workflow state and role actions addressable by URL.

Native custody is disabled. No administrator transfer, hidden withdrawal, or fallback deposit path exists. The live source and verdict evidence are recorded in the sanitized live-61999 artifacts. Browser signing, recipient delivery, transfer recovery, and ambiguous-transfer handling remain unclaimed.
