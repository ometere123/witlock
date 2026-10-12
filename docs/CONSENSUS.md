# Consensus model

GenLayer is necessary for the remaining semantic judgment: whether authenticated issuer claims support the natural-language acceptance questions. Deterministic checks handle roles, source commitments, exact registry matching, evidence bounds, deadlines, scores, and state changes.

The leader calls `gl.nondet.exec_prompt(..., response_format="json")` with a bounded dossier. Claims, URLs, and source text are explicitly treated as untrusted data and prompt instructions inside them are ignored. The result must contain an `answers` object with the frozen criterion IDs and only `PASS`, `FAIL`, or `UNKNOWN` labels. `gl.eq_principle.prompt_comparative` reruns the classification and compares the economically relevant mapping, allowing prose differences.

An invalid result, missing criterion, unexpected label, consensus disagreement, or execution failure aborts the decision transaction. Contract arithmetic then maps all `PASS`/`FAIL`/`UNKNOWN` labels to `APPROVED`, `PARTIAL`, `REJECTED`, or `INCONCLUSIVE`; the model never computes a payment or selects a beneficiary.

Direct Mode exercises deterministic contract logic but does not prove validator behavior. A full consensus test and StudioNet proof are required before any claim of live validator agreement.
