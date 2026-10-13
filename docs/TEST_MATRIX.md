# Test matrix

| Area | Command or evidence | Result |
| --- | --- | --- |
| Policy, invariants, and adversarial Direct Mode | `python -m pytest -q tests` | 37 passed |
| Python syntax | `python -m compileall -q contracts policy` | Passed |
| GenVM lint and semantic check | `python scripts/genvm_lint.py check contracts/Witlock.py --json` | Passed; 37 methods, 13 views, 24 writes, zero constructor parameters |
| Network preflight | `npm run cli:version`; `npm run preflight` | Passed; repository CLI 0.39.1, StudioNet 61999 |
| Dependency security | `npm audit --audit-level=moderate` | Passed; 0 vulnerabilities |
| Frontend receipt tests | `npm run web:test` | 11 passed |
| Frontend | `npm run web:typecheck`; `npm run web:build` | Passed |
| Production routes | HTTP and Chrome route smoke | Public `/`, `/verification`, and dynamic live-case route rendered without application error |
| Source parity | StudioNet `code` plus normalized SHA-256 comparison | Proven; 64,131-byte exact match, SHA-256 `04352A02F6BFBD7BEF7C5C00BE93FD5779ABD5BC340941C62863BF2ABB1E8C79` |
| Deployment | StudioNet receipt | `0x298e3e7eed4ec8ad25017600f87f49608cdc5bfb94b5d7eadf0cb0dbfabace1`, FINALIZED, MAJORITY_AGREE, successful leader |
| Live lifecycle | Sanitized live ledger and authoritative readbacks | Delayed adjudication, guaranteed appeal window, authenticated appeal, resolution, terminal finalization, and idempotency recorded in `docs/LIVE_PROOF.md` |
| Browser wallet | Chrome injected EIP-1193 session | Real StudioNet account/chain detection plus disconnect/reconnect observed; signing interruption and route recovery recorded with exact limitations |
| Custody | Contract and live readbacks | Permanently disabled; no GEN escrow or successful payment claim |
| Release CI | GitHub Actions `quality-gates` | Final run recorded in `docs/LIVE_PROOF.md` after this release commit is pushed |
| Production deployment | Vercel Production | READY at [witlock.vercel.app](https://witlock.vercel.app) |

The Direct Mode negative suite covers unauthorized parties, issuer substitution, correlated issuer/verifier nomination, missing independent verification, altered source bytes, mutable branches, prompt injection, malformed answers and receipts, appeal replay, delayed adjudication, late appeal attempts, exact deadline boundaries, terminal-state idempotency, and accounting conservation.

