# Test matrix

| Area | Command or evidence | Result |
| --- | --- | --- |
| Contract and policy Direct Mode | `python -m pytest -q tests` | 41 passed |
| Python syntax | `python -m compileall -q contracts policy` | Passed |
| GenVM check | `python scripts/genvm_lint.py check contracts/Witlock.py --json` | Passed; 37 methods, 13 views, 24 writes, zero constructor parameters |
| Network preflight | `npm run cli:version`; `npm run preflight` | Passed; CLI 0.39.1, StudioNet 61999 |
| Dependency security | `npm audit --audit-level=moderate` | Passed; 0 vulnerabilities |
| Receipt classification | `npm run web:test` | 13 passed |
| Frontend type and production build | `npm run web:typecheck`; `npm run web:build` | Passed |
| Source parity | `gen_getContractCode` plus exact SHA-256 | Passed; 72,967 bytes, `caea7d3d630581256f679010b946cad4204fac7f9f3148d639b73899b65a41eb` |
| Deployment | StudioNet deployment receipt | `0x68238f2d8b195d8f753a0a1ca4d9934bbded309d5b2cd7480e64ab34da13938f`, FINALIZED, MAJORITY_AGREE, successful validator execution |
| Funded draft recovery | Sanitized live ledger and readbacks | `0x811894ef142d1e028c7069e34bd6f82a488097f61a0897a569d04b7e85cb994b`, exact requester refund dispatch after missed acceptance, one-use latch |
| Live funded settlement | Sanitized live ledger and readbacks | APPROVED provider payout, PARTIAL two-recipient split, REJECTED requester refund, delayed ruling with guaranteed appeal window, terminal finalization, and conservation readbacks |
| Browser wallet | Production route and injected EIP-1193 evidence | `/verification` and `/new` rendered with the current address; wrong-network blocking and network switching observed; injected connect, disconnect, reconnect, and a real signing attempt observed; account change, explicit wallet rejection, and persisted recovery after the interrupted attempt remain unverified |

| Mutation smoke | `npm run test:mutation` | 3/3 targeted mutants killed |

GitHub Actions source-validation run: [quality-gates 38481361248](https://github.com/ometere123/witlock/actions/runs/38481361248), commit `8900def89ff1257b48ba9eaf3a5285bc1b5b662b`; `policy` and `frontend` passed.

Direct Mode covers issuer/verifier independence, source-byte hashing, prompt injection, missing evidence, malformed answers, four-criteria partial outcomes, delayed adjudication, late appeals, expiry boundaries, appeal replay, state-transition replay, terminal idempotency, accounting conservation, and adversarial receipt fixtures. The live evidence is deliberately stronger for transfer/refund than the mocked Direct Mode environment.
