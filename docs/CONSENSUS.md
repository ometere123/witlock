# Consensus model

Deterministic contract code validates roles, immutable criteria, source coordinates, issuer/verifier addresses, evidence bounds, deadlines, state transitions, integer scoring, and settlement accounting. GenLayer answers the remaining semantic question: whether each independently verified issuer claim supports its frozen criterion.

The leader receives a bounded dossier and returns exactly one answer per criterion. Every value is PASS, FAIL, or INCONCLUSIVE. Claims, URLs, source text, and provenance are untrusted data. Comparative consensus makes the economically relevant mapping agree; explanations can differ while a conflicting label fails agreement.

Invalid JSON, missing or duplicate IDs, unexpected labels, consensus exceptions, disagreement, timeout, or oversized output fail closed to INCONCLUSIVE with no allocation. The live deployment returned both definitive verdicts and an explicit INCONCLUSIVE readback. Direct Mode tests exercise malformed schema, oversized input, and failure behavior.

Contract arithmetic—not a model—determines exact outcomes, recipients, and allocations. Live source observations prove retrieval and digest parity for the immutable GitHub commit; they do not prove that validator operators are independent humans or that an external source is factually true.
