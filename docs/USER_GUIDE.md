# User guide

1. Connect an injected EIP-1193 wallet and switch to GenLayer StudioNet `61999`.
2. Configure verified agreement and registry addresses in the public environment.
3. Create a case with a unique key, counterparty, SHA-256 terms commitment, external issuer wallets, and ordered deadlines.
4. Have the provider accept before the acceptance deadline.
5. Publish an exact issuer attestation in the registry, then submit the matching evidence reference from a party wallet.
6. Have the nominated issuer authenticate the record. The engine checks every registry field.
7. The requester seals the case. GenLayer validators classify each criterion as `PASS`, `FAIL`, or `UNKNOWN`.
8. Inspect the deterministic result and append-only history. Open one bounded appeal before its deadline if the policy allows it.

The current product does not hold or distribute GEN. A transaction hash may be accepted or finalized while execution fails, and neither state proves a payment. If evidence is unavailable or provenance is unresolved, the correct result is `UNKNOWN` or an inconclusive case.
