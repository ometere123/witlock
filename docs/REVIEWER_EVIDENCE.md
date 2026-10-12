# Reviewer evidence

## Current local evidence

- One canonical deployable source: `contracts/Witlock.py`, class `Witlock`.
- Local CLI package `0.39.1`; `genlayer-js` `1.1.8`.
- StudioNet constants: chain `61999`, hex `0xF22F`, RPC `https://studio.genlayer.com/api`, explorer `https://explorer-studio.genlayer.com`.
- GenVM lint, semantic validation, and schema reflection pass for the monolith.
- Direct Mode executes five tests covering roles, issuer authority, evidence-bound sealing, custody rejection, bounded consensus, timeout closure, and appeal expiry.
- Frontend preflight and SDK type/build checks are required for the exact commit.

## Unproven gates

Live deployment and source parity, multi-validator behavior on the target network, browser wallet transactions, and recipient-side payment/recovery remain unproven until receipts and explorer links are recorded. Custody stays disabled.

## Independent review

Clone the exact Git SHA, install the lockfile and Python requirements, run every command in `docs/TEST_MATRIX.md`, inspect the generated schema, and treat every absent receipt as `NOT PROVEN`.

## Submission summary

WITLOCK is a proof-bound GenLayer StudioNet agreement monolith. It freezes weighted criteria and external issuer wallets, stores immutable case-scoped attestations, requires issuer authentication, and asks validators to agree on a bounded PASS/FAIL/INCONCLUSIVE mapping. Contract arithmetic derives results and integer allocations while append-only decisions and audit history preserve reviewability. Native custody is contained behind a false capability gate until StudioNet transfer, recipient delivery, and recovery behavior are proven.