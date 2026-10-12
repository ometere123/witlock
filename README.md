# WITLOCK

WITLOCK is a proof-bound agreement and adjudication monolith for GenLayer StudioNet. It freezes weighted acceptance criteria, nominated issuers, independent source verifiers, provenance coordinates, deadlines, appeals, and an auditable decision history in one deployable `contracts/Witlock.py` contract.

The core path is:

`create_agreement` → `accept_agreement` → issuer `publish_attestation` → independent verifier `verify_attestation_source` → party `submit_evidence` → issuer `authenticate_evidence` → delivery/dispute → `seal_agreement` → GenLayer adjudication → structured appeal → independent appeal authentication → appeal resolution → final decision.

Consensus returns only `PASS`, `FAIL`, or `INCONCLUSIVE` per criterion. Contract code validates the schema and computes the result and integer allocation. A digest proves bytes, an issuer transaction proves publication, and an independent verifier transaction proves source-observation agreement; none alone proves factual truth or human independence.

Native GEN custody is contained behind `custody_enabled() == False`. Non-zero funding, bonds, and payment calls are rejected until StudioNet transfer, recipient delivery, and recovery semantics are proven. Zero-value agreements remain available for the evidence and adjudication lifecycle.

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

Each workflow page reads the relevant finalized state and keeps invalid actions disabled for the connected actor or lifecycle state.

## Current StudioNet deployment

The current source is deployed at [`0x825478432dFECd321C5E5C193829Ad1bAd88043a`](https://explorer-studio.genlayer.com/address/0x825478432dFECd321C5E5C193829Ad1bAd88043a) from contract commit `14315fa82ef6d6f5e2c077de51c93f266801b1cb`. The 62,629-byte on-chain source has SHA-256 `AB446841A8A16276ED30A431264DEEC015E87751FF594AE92392ECFACB2F7F35`, matching the repository byte-for-byte. Deployment transaction: [`0x2fb0f9f120d7531f76101472248b44899a7e2380049690f0d92fb5fb89d6a2d8`](https://explorer-studio.genlayer.com/tx/0x2fb0f9f120d7531f76101472248b44899a7e2380049690f0d92fb5fb89d6a2d8), finalized with `MAJORITY_AGREE`, one round, and successful leader execution.

Live StudioNet readbacks prove `APPROVED` 100, `PARTIAL` 50, `REJECTED` 0, and `INCONCLUSIVE` 0. The approved case also records a separately authenticated and resolved appeal at decision version 2. Custody remains disabled, so the live cases use zero-value agreements and report decision allocation only. See [docs/LIVE_PROOF.md](docs/LIVE_PROOF.md), [artifacts/live-61999/cases.json](artifacts/live-61999/cases.json), and the sanitized [deployment manifest](artifacts/live-61999/manifest.json).

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
npm run web:typecheck
npm run web:build
```

Deployment and evidence rules are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). The current live proof status is [docs/LIVE_PROOF.md](docs/LIVE_PROOF.md).
