# Consensus model

Deterministic contract code validates roles, immutable criteria, source coordinates, issuer/verifier addresses, evidence bounds, deadlines, state transitions, integer scoring, and settlement accounting. GenLayer answers the remaining semantic question: whether each independently verified issuer claim supports its frozen criterion.

The leader receives a bounded dossier and returns exactly one answer per criterion. Every value is PASS, FAIL, or INCONCLUSIVE. Claims, URLs, source text, and provenance are untrusted data. Comparative consensus makes the economically relevant mapping agree; explanations can differ while a conflicting label fails agreement.

Invalid JSON, missing or duplicate IDs, unexpected labels, consensus exceptions, disagreement, timeout, or oversized output fail closed to INCONCLUSIVE. A funded case applies its immutable `inconclusive_provider_bps` recovery policy to that result only after the appeal window is terminal; a zero-funded case remains non-payable. Direct Mode tests exercise malformed schema, oversized input, failure behavior, and funded recovery splits. The current live payout records are definitive APPROVED, PARTIAL, and REJECTED cases; no fresh live INCONCLUSIVE payout is claimed.

Contract arithmetic—not a model—determines exact outcomes, recipients, and allocations. Live source observations prove retrieval and digest parity for the immutable GitHub commit; they do not prove that validator operators are independent humans or that an external source is factually true.
