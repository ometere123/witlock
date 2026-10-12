# Consensus model

Deterministic contract code validates roles, immutable criteria, source coordinates, issuer/verifier addresses, evidence bounds, deadlines, state transitions, integer scoring, and settlement accounting. GenLayer is necessary for the remaining semantic question: whether each independently verified issuer claim supports its frozen criterion.

The leader receives a bounded dossier and must return JSON with exactly one `answers` object. Every frozen criterion ID appears once and every value is exactly `PASS`, `FAIL`, or `INCONCLUSIVE`. Claims, URLs, source text, and provenance are untrusted data; instructions inside them are treated as data. `gl.eq_principle.prompt_comparative` compares the economically relevant mapping, so explanations can differ while a conflicting label fails agreement.

The contract does not truncate oversized dossiers or results. Invalid JSON, missing/duplicate IDs, unexpected labels, consensus exceptions, disagreement, timeout, or oversized output fail closed to `INCONCLUSIVE` with `FAILED_CLOSED` and `BLOCKED_CONSENSUS`; they do not create an allocation. Direct Mode tests exercise malformed schema, oversized input, and failure behavior. A historical superseded deployment recorded an `INCONCLUSIVE` mapping and appeal version, but it is not current-source proof; fresh StudioNet deployment is currently blocked before consensus.

Contract arithmetic—not a model—determines exact outcomes, recipients, and allocations. Direct Mode proves the call path and schema handling; it does not prove that validator operators are independent humans or that an external source is factually true.
