# Implementation audit

Audit date: 2026-10-13. The canonical contract, route-first frontend, and current StudioNet deployment were audited and revalidated.

| Severity | Defect | Remediation | Verification |
| --- | --- | --- | --- |
| Critical | Multiple deployable contracts made parity and custody boundaries ambiguous | One canonical Witlock monolith owns policy, evidence, adjudication, appeals, audit, and guarded settlement accounting | source and GenVM schema check |
| Critical | Custody and transfer recovery were unproven | Hard false custody gate, zero-value-only path, explicit payment scaffolding, authenticated delivery evidence, and ambiguity state | Direct Mode suite; custody remains disabled |
| High | Evidence hash alone did not prove provenance | Immutable raw GitHub commit retrieval, byte digest comparison, provenance commitment, commit identity check, and independent verifier consensus | 35 Direct Mode tests and live source observations |
| High | Consensus failures could truncate dossiers or invent labels | Bounded full dossier, strict labels, comparative consensus, and failed-closed INCONCLUSIVE mapping | Direct Mode adversarial tests and live inconclusive case |
| Medium | Frontend reported writes before finality | Injected wallet guards, finalized receipt polling, execution-result checks, pending recovery, and guided route/state consoles | frontend tests, typecheck, build, route smoke |

## Current verification

- Current contract: 0x825478432dFECd321C5E5C193829Ad1bAd88043a
- Deployment: 0x2fb0f9f120d7531f76101472248b44899a7e2380049690f0d92fb5fb89d6a2d8
- Source commit: 14315fa82ef6d6f5e2c077de51c93f266801b1cb
- Source SHA-256: AB446841A8A16276ED30A431264DEEC015E87751FF594AE92392ECFACB2F7F35
- Local and deployed source: 62,629 bytes
- Live readbacks: APPROVED, PARTIAL, REJECTED, INCONCLUSIVE
- Local suite: 35 passed
- GenVM schema: 37 methods, 13 views, 24 writes, zero constructor parameters
- Dependency audit: 0 vulnerabilities

Browser wallet account and chain detection were observed on 0xf22f in the prior browser proof, and browser-proof-20261012 was created through injected-wallet signing with a FINALIZED, MAJORITY_AGREE receipt. The current browser run verified public route rendering and lost its debugger during wallet reconnect, so no fresh signing claim is made. Live terminal finalization was independently verified for final-proof-20261013 at transaction 0x32f4a74c66e08e99354493c121f24309185e62fbc17e8fb248e189e6a51c4944. Native custody and transfer recovery remain disabled and unclaimed. The sanitized evidence is in artifacts/live-61999/manifest.json and artifacts/live-61999/cases.json.
