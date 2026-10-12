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

## Current StudioNet deployment

No deployment of the current source is claimed yet. The repository is pinned to Git SHA `96edcdbbd1025541b5d00d5b6d82ecd28b46ab55`; `contracts/Witlock.py` is 60,059 bytes with SHA-256 `F9E08ADA6D39E083B681221B05489E3A45E18E9A96FE455B2E05F6ABFC82188`.

Two fresh deployment attempts for the current source finalized as `NO_MAJORITY` with no consensus data, and an exact old-source control deployment produced the same zero-round result. The StudioNet balance probe currently reports that consensus contracts are unavailable. The old contract at `0x4D39aBdF8F574B44Ff178CBf974042a36D70c9A0` is superseded and must not be used as parity evidence for this source.

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
