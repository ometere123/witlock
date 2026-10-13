# WITLOCK

WITLOCK is a proof-bound agreement and adjudication monolith for GenLayer StudioNet. It freezes weighted acceptance criteria, nominated issuers, independent source verifiers, provenance coordinates, deadlines, appeals, and an auditable decision history in one deployable `contracts/Witlock.py` contract.

The core path is:

`create_agreement` → `accept_agreement` → issuer `publish_attestation` → independent verifier `verify_attestation_source` → party `submit_evidence` → issuer `authenticate_evidence` → delivery/dispute → `seal_agreement` → GenLayer adjudication → structured appeal → independent appeal authentication → appeal resolution → final decision.

Consensus returns only `PASS`, `FAIL`, or `INCONCLUSIVE` per criterion. Contract code validates the schema and computes the result and integer allocation. A digest proves bytes, an issuer transaction proves publication, and an independent verifier transaction proves source-observation agreement; none alone proves factual truth or human independence.

Native GEN custody is permanently disabled in this release. `custody_enabled() == False`, non-zero funding/bond/payment paths remain guarded, and live agreements are zero-value evidence and adjudication records. WITLOCK makes no operational escrow or payment-delivery claim.

## Approved stack

- GenLayer StudioNet stable, chain `61999` (`0xF22F`)
- RPC `https://studio.genlayer.com/api`
- Explorer `https://explorer-studio.genlayer.com`
- repository-local GenLayer CLI `0.39.1`
- `genlayer-js` `1.1.8`
- Next.js App Router and injected EIP-1193 wallet

## Frontend route map

The frontend uses addressable workflow pages behind one shared navigation shell:

- `/` — product entry point and route map
- `/new` — guided zero-value agreement creation
- `/explore` — exact-key agreement lookup
- `/workspace` — role-aware case entry point
- `/agreement/:id` — agreement state and party actions
- `/evidence/:id` — publication, source verification, and evidence admission
- `/review/:id` — sealing, adjudication, appeal, and decision history
- `/settlement/:id` — allocation readback and custody boundary
- `/activity` — persisted pending and finalized transaction receipts
- `/verification` and `/guide` — deployment checks and protocol guidance

Wallet account, chain, disconnect, and message state are owned by one shared provider. Writes require the injected provider, the connected account, StudioNet 61999, and a finalized successful receipt.

## Current StudioNet deployment

The current source is deployed at [`0x8B6e64A6C5c5Bccc3a64Cba4Bd8982218381330d`](https://explorer-studio.genlayer.com/address/0x8B6e64A6C5c5Bccc3a64Cba4Bd8982218381330d) from release commit `7ce1517d82e711aa12604177ddadaa644c1691e8`. `contracts/Witlock.py` is 64,131 bytes with SHA-256 `04352A02F6BFBD7BEF7C5C00BE93FD5779ABD5BC340941C62863BF2ABB1E8C79`; normalized deployed bytes match exactly. Deployment transaction: [`0x298e3e7eed4ec8ad25017600f87f49608cdc5bfb94b5d7eadf0cb0dbfabace1`](https://explorer-studio.genlayer.com/tx/0x298e3e7eed4ec8ad25017600f87f49608cdc5bfb94b5d7eadf0cb0dbfabace1), finalized with `MAJORITY_AGREE` and successful leader execution.

The release adds a minimum first appeal window of 900 seconds when adjudication occurs after the original deadline. The effective deadline is captured once at the first ruling and reused by `open_appeal()` and `finalize_decision()`; replay cannot extend it. Receipt validation fails closed for contradictory top-level execution/consensus metadata and accepts idle validators only for explicit post-quorum cancellation.

Live proof, exact transaction hashes, state readbacks, source parity, browser observations, and limitations are maintained in [docs/LIVE_PROOF.md](docs/LIVE_PROOF.md), [artifacts/live-61999/cases.json](artifacts/live-61999/cases.json), and the sanitized [deployment manifest](artifacts/live-61999/manifest.json).

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
```

Deployment and evidence rules are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). The current live proof status is [docs/LIVE_PROOF.md](docs/LIVE_PROOF.md).
