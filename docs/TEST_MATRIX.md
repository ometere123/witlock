# Test matrix

| Area | Command or evidence | Result |
| --- | --- | --- |
| Policy and invariants | `python -m pytest -q tests` | 27 passed |
| Direct Mode lifecycle/adversarial suite | `python -m pytest -q tests/test_contracts_direct.py` | Passed; immutable retrieval, evidence authority, appeals, consensus, size, finalization replay, and custody attacks |
| Python syntax | `python -m compileall -q contracts policy` | Passed |
| GenVM lint | `python scripts/genvm_lint.py lint contracts/Witlock.py --json` | Passed, 3 checks |
| GenVM semantic/schema | `python scripts/genvm_lint.py check contracts/Witlock.py --json` | Passed; one constructorless `Witlock`, 37 methods, 13 views, 24 writes |
| Network preflight | `npm run cli:version; npm run preflight` | Passed; StudioNet 61999 and approved RPC |
| Dependency security | `npm ci; npm audit --audit-level=moderate` | Passed; 0 vulnerabilities |
| Frontend transaction behavior | `npm run web:test` | Passed; SDK success enum, failed execution, and multiple pending recovery |
| Frontend | `npm run web:typecheck; npm run web:build` | Passed on Next.js 16.4.0 |
| Current live deployment | StudioNet receipts | NOT PROVEN; fresh attempts finalized `NO_MAJORITY`, `consensus_data=null` |
| Current source parity | `genlayer code` plus SHA-256 comparison | NOT PROVEN; no current contract address |
| Browser wallet | Chrome injected provider | Account and chain detection visible on `0xf22f`; live browser signing NOT PROVEN |
| Payment/recovery | Custody and transfer fault evidence | Custody disabled; recipient delivery and recovery not claimed |

The negative suite covers unauthorized parties, issuer substitution, missing independent verification, altered source bytes, mutable branches, appeal-source mutation, evidence after dispute or acknowledgement, premature sealing, malformed consensus labels/schema, oversized dossiers/results, appeal expiry, resolved-appeal finalization, draft expiry, payment recipient/amount substitution, and custody rejection.
