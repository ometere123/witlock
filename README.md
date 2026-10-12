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

- Contract: `0x4D39aBdF8F574B44Ff178CBf974042a36D70c9A0`
- Deployment transaction: `0x727050425edb3591f6438b6b4a88f2f7e8efcd160444f073062b9317e430b53f`
- Source Git SHA: `e57424aa97817469385add4a426943dd67ca1d19`
- Source SHA-256: `E71CF73539EB4A552C5CE120C29227F5197E89CE288DF09E344D5B93F64E8A81`
- Deployed schema: 37 methods, zero constructor parameters
- Deployment and source-parity evidence: [docs/LIVE_PROOF.md](docs/LIVE_PROOF.md)

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
