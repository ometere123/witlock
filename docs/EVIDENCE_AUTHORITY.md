# Evidence authority

An evidence digest proves byte integrity only. WITLOCK therefore requires a nominated issuer wallet for every criterion and an immutable registry record with:

- the agreement criterion subject;
- the issuer sender address;
- the exact digest;
- the bounded source coordinate; and
- the issuer claim.

The submitting party cannot authenticate its own evidence. The agreement engine rejects issuer addresses equal to either party, rejects registry-key reuse, and requires the nominated issuer to call `authenticate_evidence`. The registry is permissionless: anyone can publish a record under an unused key, so the agreement's frozen issuer address and the actual sender are the authority boundary.

The registry does not establish that an issuer controls a domain, represents a company, is independent from a participant, or tells the truth. A valid record with false content remains a validly published false claim. Deleted web content, redirects, fake ownership, prompt injection, contradictory sources, and unavailable URLs are resolved only as the bounded semantic evidence permits; unresolved cases must remain `UNKNOWN` or fail consensus.
