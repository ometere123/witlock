# Security model

WITLOCK targets StudioNet stable `61999` through the repository-local CLI `0.39.1`, with RPC `https://studio.genlayer.com/api` and explorer `https://explorer-studio.genlayer.com`.

The monolith does not accept non-zero funding while custody is unproven, does not emit payouts, and has no administrator transfer or hidden withdrawal path. A digest proves bytes, an issuer transaction proves wallet publication, and a consensus decision classifies admitted evidence; none alone proves a recipient received GEN.

The state machine rejects unauthorized callers, issuer substitution, duplicate evidence, premature sealing, early timeouts, malformed consensus, appeal replay, and ambiguous payment reconciliation. The frontend uses injected EIP-1193 only and hard-blocks writes on the wrong chain or without a configured contract.

Remaining proof gates are live validator independence, deployment source parity, browser transaction finality, and network-level transfer/recovery semantics.