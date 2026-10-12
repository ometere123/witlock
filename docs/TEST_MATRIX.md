# Test matrix

| Area | Command or evidence | Result |
| --- | --- | --- |
| Policy and invariants | `python -m pytest -q tests` | 24 passed |
| Direct Mode lifecycle/adversarial suite | `python -m pytest -q tests/test_contracts_direct.py` | Included in 24 passed; evidence gate, deadline, appeal, consensus, size, and custody attacks |
| Python syntax | `python -m compileall -q contracts policy` | Passed |
| GenVM lint | `python scripts/genvm_lint.py lint contracts/Witlock.py --json` | Passed, 3 checks |
| GenVM semantic/schema | `python scripts/genvm_lint.py check contracts/Witlock.py --json` | Passed; one constructorless `Witlock`, 37 methods, 13 views, 24 writes |
| Schema reflection | `python scripts/genvm_lint.py schema contracts/Witlock.py --json` | Passed |
| Network preflight | `npm run cli:version; npm run preflight` | CLI 0.39.1, StudioNet 61999, approved RPC |
| Dependency security | `npm ci; npm audit --audit-level=moderate` | Passed; 0 vulnerabilities |
| Frontend | `npm run web:typecheck; npm run web:build` | Passed on Next.js 16.4.0 |
| Live deployment | StudioNet receipt plus source/schema/readback comparison | Finalized deployment, successful execution, source parity, 37-method schema |
| Live lifecycle | Sanitized receipts in `artifacts/live-61999/manifest.json` | Successful finalization through appeal resolution; final-state receipt limitation recorded |
| Browser wallet | Injected EIP-1193 implementation and build | Guarded implementation verified; live browser transaction not recorded |
| Payment/recovery | Custody and transfer fault evidence | Custody disabled; recipient delivery and recovery not claimed |

The negative suite covers unauthorized parties, issuer substitution, missing independent verification, evidence after `open_dispute` or requester acknowledgement, premature sealing, malformed consensus labels/schema, oversized dossiers/results, appeal expiry, resolved-appeal finalization, draft expiry, payment recipient/amount substitution, and custody rejection.
