# Test matrix

| Area | Command or evidence | Result |
| --- | --- | --- |
| Contract and policy Direct Mode | `python -m pytest -q tests` | 38 passed |
| Python syntax | `python -m compileall -q contracts policy` | Passed |
| GenVM check | `python scripts/genvm_lint.py check contracts/Witlock.py --json` | Passed; 35 methods, 13 views, 22 writes, zero constructor parameters |
| Network preflight | `npm run cli:version`; `npm run preflight` | Passed; CLI 0.39.1, StudioNet 61999 |
| Dependency security | `npm audit --audit-level=moderate` | Passed; 0 vulnerabilities |
| Receipt classification | `npm run web:test` | 13 passed |
| Frontend type and production build | `npm run web:typecheck`; `npm run web:build` | Passed |
| Source parity | `gen_getContractCode` plus exact SHA-256 | Passed; 64,862 bytes, `93de46c2c0749f9016cd4297658679b0f25f12e0bce91ab6fe867d328835dff9` |
| Deployment | StudioNet deployment receipt | `0xd38499ccb036e6188428a47707e5cdb71f289cd3e9dc47af7c3dc30e061cfe68`, FINALIZED, MAJORITY_AGREE, successful leader |
| Payable refusal | Live refund probe | `0x3b66251ea887766e97839ff2ebdc7dbdc1186b2361f6383266199da69c1aa190`, explicit `REJECTED_FUNDED`, value-bearing refund, zero net balance delta |
| Live settlement | Sanitized live ledger and readbacks | Delayed ruling, authenticated appeal, terminal finalization, idempotent replay, and native dispatch recorded |
| Browser wallet | Production route and injected EIP-1193 evidence | Public route and existing wallet route evidence recorded; new-address account-change, wrong-network, and signature-rejection paths remain untested |

Direct Mode covers issuer/verifier independence, source-byte hashing, prompt injection, missing evidence, malformed answers, four-criteria partial outcomes, delayed adjudication, late appeals, expiry boundaries, appeal replay, state-transition replay, terminal idempotency, accounting conservation, and adversarial receipt fixtures. The live evidence is deliberately stronger for transfer/refund than the mocked Direct Mode environment.
