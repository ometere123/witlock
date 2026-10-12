# WITLOCK

WITLOCK is a proof-bound agreement and adjudication monolith for GenLayer StudioNet. It freezes weighted acceptance criteria, nominated external issuers, source provenance, deadlines, appeals, and an auditable decision history in one deployable `contracts/Witlock.py` contract.

The core path is:

`create_agreement` → `accept_agreement` → issuer `publish_attestation` → party `submit_evidence` → issuer `authenticate_evidence` → delivery/dispute → `seal_agreement` → GenLayer adjudication → appeal window → final decision.

Consensus returns only `PASS`, `FAIL`, or `INCONCLUSIVE` per criterion. Contract code validates the schema and computes the result and integer allocation. A digest proves bytes, and an issuer transaction proves wallet publication; neither proves factual truth by itself.

Native GEN custody is contained behind `custody_enabled() == False`. Non-zero funding, bonds, and payment calls are rejected until StudioNet transfer, recipient delivery, and recovery semantics are proven. Zero-value agreements remain available for the evidence and adjudication lifecycle.

## Approved stack

- GenLayer StudioNet stable, chain `61999` (`0xF22F`)
- RPC `https://studio.genlayer.com/api`
- Explorer `https://explorer-studio.genlayer.com`
- repository-local GenLayer CLI `0.39.1`
- `genlayer-js` `1.1.8`
- Next.js App Router and injected EIP-1193 wallet

## Current StudioNet deployment

- Contract: `0x2581346995cd24dD38889F3b0c7638803DD9d3C3`
- Deployment transaction: `0x8e9a2d5293937f774a1e2bf9574e94e26411668074bdd7471dee32cb2972936a`
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
npm run web:typecheck
npm run web:build
```

Deployment and evidence rules are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). The current live proof status is [docs/LIVE_PROOF.md](docs/LIVE_PROOF.md).
