# Test matrix

| Area | Command or method | Current evidence |
| --- | --- | --- |
| Pure policy and contract tests | `python -m pytest -q tests` | 15 passed |
| Python syntax | `python -m compileall -q contracts policy` | Passed |
| Contract AST safety | `python scripts/genvm_lint.py lint ...` | Passed for both contracts |
| Contract semantic validation | `python scripts/genvm_lint.py check ...` | Passed for both contracts; pinned runner bundle `v0.2.16` |
| Schema extraction | `python scripts/genvm_lint.py schema ... --json` | Passed; Registry has 4 methods and Agreement has 16 methods with one address constructor parameter |
| Direct Mode | `python -m pytest -q tests/test_contracts_direct.py` | 3 passed |
| Full consensus | Studio or local multi-validator test | Not yet run |
| Frontend preflight | `npm run preflight` | StudioNet 61999, `0xF22F`, approved RPC passed |
| Frontend types | `npm --workspace web run typecheck` | Passed after SDK correction |
| Production build | `npm --workspace web run build` | Passed; all required routes generated |
| Wallet negative cases | injected provider browser flow | Not yet run |
| Live proof | StudioNet 61999 receipts and explorer evidence | None recorded; no deployment claim |

The suite must include unauthorized parties, issuer substitution, registry replay, digest mismatch, missing/contradictory evidence, malformed consensus output, deadline abuse, appeal replay, wrong network, rejected wallet requests, and ambiguous transfer handling. Any unrun row remains unproven.
