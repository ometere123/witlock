# WITLOCK

WITLOCK is a proof-bound agreement decision engine for GenLayer StudioNet. It freezes weighted acceptance criteria, requires each criterion to name an external issuer wallet, binds submitted evidence to an immutable registry record, and uses GenLayer consensus for the bounded semantic classification `PASS`, `FAIL`, or `UNKNOWN`.

WITLOCK deliberately separates evidence integrity from truth and transaction finality from business success. A digest proves bytes; an issuer sender proves which wallet published an attestation; neither proves that the issuer is a human or that a claim is true. The contract therefore keeps native GEN custody, withdrawals, and payout claims disabled until the actual StudioNet transfer lifecycle is independently proven.

## Current implementation

- `contracts/WitlockRegistry.py` stores one immutable attestation per registry key.
- `contracts/WitlockAgreement.py` enforces parties, issuer nomination, deadlines, one-use attestations, registry matching, append-only transition history, semantic consensus, timeout handling, and one bounded appeal.
- `policy/rules.py` contains deterministic scoring, validation, and timeout helpers used by the test suite.
- `web/` is a Next.js App Router client using injected EIP-1193 wallets and `genlayer-js` 1.1.8. It hard-blocks wrong-network and unconfigured-contract writes.

## Development

```powershell
npm install
npm run cli:version       # repository-local GenLayer CLI; must be 0.39.1
python -m pytest -q tests
python -m compileall -q contracts policy
npm run contracts:lint
npm run contracts:check
npm run preflight
npm --workspace web run typecheck
npm --workspace web run build
```

The approved target is StudioNet chain `61999` (`0xF22F`) at `https://studio.genlayer.com/api`. Do not use chain 61997, preview RPCs, a global CLI, private keys in the browser, or a backend signing service.

Set `NEXT_PUBLIC_WITLOCK_CONTRACT` and `NEXT_PUBLIC_WITLOCK_REGISTRY` only after independently verifying the deployed source and schema. A transaction hash is displayed as a submission reference; the interface does not treat it as finalized successful execution or payment proof.

The implementation and evidence status are recorded in [docs/IMPLEMENTATION_AUDIT.md](docs/IMPLEMENTATION_AUDIT.md), [docs/LIVE_PROOF.md](docs/LIVE_PROOF.md), and [docs/REVIEWER_EVIDENCE.md](docs/REVIEWER_EVIDENCE.md).
