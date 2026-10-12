# Threat model

WITLOCK assumes parties may lie, submit prompt-injection text, reuse records, race deadlines, switch recipients, or attempt duplicate settlement. It also assumes issuers can be correlated with parties and that public source content can disappear or change.

The contract responds with frozen roles and terms, case-scoped immutable attestations, exact issuer authentication, bounded dossiers, controlled consensus labels, deterministic arithmetic, append-only decisions, deadline guards, and a custody kill switch. A URL or address is treated as an input claim, not as proof of legal authority or independence.

The principal unresolved threat is asynchronous native-token transfer semantics. Because recipient delivery and failed-child recovery have not been proven on the target stack, the affected financial operation is disabled. This is an explicit containment boundary, not an economic guarantee.