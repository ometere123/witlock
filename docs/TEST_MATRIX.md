# Test matrix

| Area | Command or evidence | Result |
| --- | --- | --- |
| Policy and invariants | python -m pytest -q tests | 35 passed |
| Direct Mode adversarial suite | python -m pytest -q tests/test_contracts_direct.py | Passed |
| Python syntax | python -m compileall -q contracts policy | Passed |
| GenVM lint and semantic check | scripts/genvm_lint.py | Passed; 37 methods, 13 views, 24 writes |
| Network preflight | npm run cli:version; npm run preflight | Passed; StudioNet 61999 |
| Dependency security | npm ci; npm audit --audit-level=moderate | Passed; 0 vulnerabilities |
| Frontend transaction behavior | npm run web:test | Passed; 7 tests |
| Frontend | npm run web:typecheck; npm run web:build | Passed |
| Route smoke | Chrome public deployment smoke | Passed for `/`, `/explore`, `/new`, `/workspace`, `/activity`, `/verification`, `/guide`; no 404 or application error |
| Current live deployment | StudioNet receipt | Proven; FINALIZED, MAJORITY_AGREE, leader SUCCESS |
| Current source parity | deployed code and SHA-256 comparison | Proven; exact 62,629-byte match |
| Live verdicts | sanitized live-61999 case ledger | Proven; APPROVED, PARTIAL, REJECTED, INCONCLUSIVE |
| Browser wallet | Prior Chrome injected-provider evidence plus current production route smoke | Prior evidence: chain `0xf22f`, browser-proof-20261012 finalized with `MAJORITY_AGREE`; current wallet reconnect was not reproduced after the browser debugger disconnected |
| Payment/recovery | custody and transfer fault evidence | Custody disabled; no transfer claim |

The negative suite covers unauthorized parties, issuer substitution, correlated issuer/verifier nomination, missing independent verification, altered source bytes, mutable branches, appeal-source mutation, evidence after dispute or acknowledgement, premature sealing, malformed consensus, reachable maximum dossier bounds, oversized results, appeal expiry, resolved-appeal finalization, draft expiry, payment substitution, and custody rejection.
