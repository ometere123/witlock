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

No current-source deployment address exists. The contract source is pinned at Git SHA `14315fa82ef6d6f5e2c077de51c93f266801b1cb`; `contracts/Witlock.py` is 62,629 bytes with SHA-256 `AB446841A8A16276ED30A431264DEEC015E87751FF594AE92392ECFACB2F7F35`.

The latest current-source deployment attempt `0x20ef2080…c3d24` finalized with `NO_MAJORITY`, zero rounds, null consensus data, and no contract address. The lifecycle readback stored `Finalized` with `NoOp` and no decision ID. Earlier current-source attempts reached the same pre-consensus boundary. The StudioNet balance probe reports that consensus contracts are unavailable. The old contract at `0x4D39aBdF8F574B44Ff178CBf974042a36D70c9A0` is superseded and must not be used as parity evidence for this source.

The current environment example therefore leaves `NEXT_PUBLIC_WITLOCK_CONTRACT` empty until a fresh deployment returns `FINALIZED` with `FINISHED_WITH_RETURN`. See [docs/LIVE_PROOF.md](docs/LIVE_PROOF.md) and the sanitized [deployment manifest](artifacts/live-61999/manifest.json) for the exact evidence boundary.

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
