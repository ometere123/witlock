# Test matrix

| Area | Command | Evidence target |
| --- | --- | --- |
| Pure policy and invariants | `python -m pytest -q tests` | deterministic validation and conservation |
| Direct Mode lifecycle | `python -m pytest -q tests/test_contracts_direct.py` | five GenVM contract tests, including bounded consensus |
| Python syntax | `python -m compileall -q contracts policy` | source compiles |
| GenVM AST safety | `python scripts/genvm_lint.py lint contracts/Witlock.py --json` | no safety warnings |
| GenVM semantic/schema | `python scripts/genvm_lint.py check contracts/Witlock.py --json` | one constructorless `Witlock`, 31 methods |
| Network preflight | `npm run cli:version; npm run preflight` | CLI 0.39.1 and StudioNet 61999 |
| Frontend | `npm run web:typecheck; npm run web:build` | installed SDK compatibility and production build |
| Live validator agreement | StudioNet receipt and explorer evidence | not recorded |
| Browser wallet lifecycle | injected EIP-1193 browser run | not recorded |
| Payment/recovery | real transfer and child fault evidence | custody intentionally blocked |

The negative suite covers unauthorized parties, issuer substitution, premature sealing, incomplete evidence, wrong deadlines, appeal expiry, malformed labels, duplicate evidence, non-zero custody attempts, and accounting conservation. Network-level transfer faults remain a documented unrun gate.