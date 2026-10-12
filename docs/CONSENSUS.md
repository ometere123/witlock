# Consensus model

Deterministic contract code validates roles, immutable criteria, source coordinates, issuer addresses, evidence bounds, deadlines, state transitions, integer scoring, and settlement accounting. GenLayer is necessary for the remaining semantic question: whether each authenticated issuer claim supports its frozen criterion.

The leader receives a bounded dossier and must return JSON with exactly one `answers` object. Every frozen criterion ID appears once and every value is exactly `PASS`, `FAIL`, or `INCONCLUSIVE`. Claims, URLs, source text, and provenance are untrusted data; instructions inside them are ignored. `gl.eq_principle.prompt_comparative` compares the economically relevant mapping, so different explanations can agree while a conflicting label fails consensus.

Invalid JSON, missing or duplicate IDs, unexpected labels, disagreement, timeout, or execution failure abort the write. Contract arithmetic maps the labels to `APPROVED`, `PARTIAL`, `REJECTED`, or `INCONCLUSIVE`, and computes the provider/requester allocation from frozen integer weights. Direct Mode proves the call path and schema handling; it does not prove live validator independence.