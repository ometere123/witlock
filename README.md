# WITLOCK

WITLOCK is a single GenLayer StudioNet contract for proof-bound agreements. It freezes weighted criteria, nominated issuers, independent source verifiers, immutable GitHub provenance, deadlines, appeals, terminal decisions, and native GEN settlement accounting in `contracts/Witlock.py`.

The workflow is:

`create_agreement` → optional exact-value `fund_agreement` → `accept_agreement` → issuer `publish_attestation` → independent verifier `verify_attestation_source` → party `submit_evidence` → issuer `authenticate_evidence` → delivery or timeout → `seal_agreement` → adjudication → appeal → independent appeal authentication → resolution → `finalize_decision` → role-bound payment dispatch.

Consensus returns only `PASS`, `FAIL`, or `INCONCLUSIVE` for each frozen criterion. The contract calculates the verdict, integer score, and entitlements. Source bytes are retrieved and hashed from immutable GitHub commit URLs. A source observation proves the committed bytes were retrieved; it does not prove the claim is true or that a wallet owner is a human.

Native GEN dispatch is enabled only after `FINAL_DECISION`. Funding must match the agreement exactly. Any funded rejection returns the incoming value through an explicit value-bearing message and reports `REJECTED_FUNDED`. Each beneficiary role has one dispatch latch, and the contract records `DISPATCHED` until an external observer confirms the child transfer and recipient balance. Operator bonds remain unsupported and are refunded.

If a funded draft reaches its acceptance deadline without provider acceptance, the requester can call `recover_expired_funding` once for an exact-value refund dispatch. Each agreement also freezes an INCONCLUSIVE provider share in basis points; the residual goes to the requester after terminal finalization. Both paths have bounded ambiguity handling and no retry-based second payout.

## Approved stack

- GenLayer StudioNet stable, chain `61999` (`0xF22F`)
- RPC `https://studio.genlayer.com/api`
- Explorer `https://explorer-studio.genlayer.com`
- repository-local GenLayer CLI `0.39.1`
- `genlayer-js` `1.1.8`
- Next.js App Router and injected EIP-1193 wallets only
- one deployable monolith: `contracts/Witlock.py`

## Current deployment

The current monolith is [`0xC2523f90a89B0A989a15BE81fA124b435f0190cF`](https://explorer-studio.genlayer.com/address/0xC2523f90a89B0A989a15BE81fA124b435f0190cF). Its deployment transaction is [`0x68238f2d8b195d8f753a0a1ca4d9934bbded309d5b2cd7480e64ab34da13938f`](https://explorer-studio.genlayer.com/tx/0x68238f2d8b195d8f753a0a1ca4d9934bbded309d5b2cd7480e64ab34da13938f). The deployed source is 72,967 bytes with SHA-256 `caea7d3d630581256f679010b946cad4204fac7f9f3148d639b73899b65a41eb`, and the readback source matches the candidate byte-for-byte. The schema is 37 methods, 13 views, 24 writes, and zero constructor parameters.

The production frontend is [witlock.vercel.app](https://witlock.vercel.app). Its public configuration targets the current address, StudioNet 61999, and the approved RPC. Exact lifecycle receipts and state readbacks are in [docs/LIVE_PROOF.md](docs/LIVE_PROOF.md), [docs/WITLOCK_MORE_INFO_CLOSEOUT.md](docs/WITLOCK_MORE_INFO_CLOSEOUT.md), [artifacts/live-61999/cases.json](artifacts/live-61999/cases.json), and [artifacts/live-61999/manifest.json](artifacts/live-61999/manifest.json).

## Frontend route map

- `/` — product entry point and route map
- `/new` — funded or zero-value agreement creation
- `/explore` — exact-key agreement lookup
- `/workspace` — role-aware case entry point
- `/agreement/:id` — agreement state and party actions
- `/evidence/:id` — publication, source verification, and evidence admission
- `/review/:id` — sealing, adjudication, appeal, and decision history
- `/settlement/:id` — entitlement dispatch and external delivery observation
- `/activity` — persisted pending and finalized transaction receipts
- `/verification` and `/guide` — deployment checks and protocol guidance

Wallet account, chain, disconnect, and message state are shared across the route shell. Every write requires an injected provider, the connected account, StudioNet 61999, and a finalized receipt with consistent execution and consensus metadata.

## Local verification

```powershell
npm ci
pip install -r requirements.txt
npm run cli:version
npm run preflight
python -m pytest -q tests
python -m compileall -q contracts policy
npm run contracts:lint
npm run contracts:check
npm audit --audit-level=moderate
npm run web:test
npm run web:typecheck
npm run web:build
npm run test:mutation
```

Deployment and source-parity rules are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). The custody state machine and recovery model are in [docs/CUSTODY_AND_RECOVERY.md](docs/CUSTODY_AND_RECOVERY.md). Security limitations are in [docs/SECURITY.md](docs/SECURITY.md).
