# WITLOCK architecture

WITLOCK has two logical data planes.

The registry is an immutable issuer record store. Its `attest` call records the sender wallet, subject, digest, source coordinate, and claim under a unique key. It proves publication by that wallet and prevents replacement. It does not establish legal identity, domain ownership, factual truth, or independence from a participant.

The agreement engine owns the policy and state machine. The requester freezes 1–8 criteria, exact weights, critical flags, nominated issuer wallets, an agreement digest, and ordered accept, delivery, and appeal deadlines. The provider accepts. A party submits a bounded evidence reference, then the nominated issuer must authenticate it by calling the agreement with the same digest. The engine reads the registry record and requires an exact issuer, subject, source, claim, and digest match.

After sealing, GenLayer validators independently rerun the evidence assessment. Consensus is constrained to a criterion map using `PASS`, `FAIL`, or `UNKNOWN`; contract arithmetic determines the score and status. A model cannot choose recipients, money, or policy. The history map records every state transition with actor and deterministic VM time.

Native custody is intentionally outside the active architecture. The current decision contract returns `custody_enabled() == False`, and there is no deposit, withdrawal, administrator transfer, or payout method. This keeps the decision engine from making a financial claim that the asynchronous StudioNet transfer behavior has not established.
