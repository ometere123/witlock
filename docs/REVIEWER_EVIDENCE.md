# Reviewer evidence

## Verified local and live evidence

- One canonical deployable source: `contracts/Witlock.py`, class `Witlock`.
- Local CLI package `0.39.1`; `genlayer-js` `1.1.8`.
- StudioNet constants: chain `61999`, hex `0xF22F`, RPC `https://studio.genlayer.com/api`, explorer `https://explorer-studio.genlayer.com`.
- GenVM lint, semantic validation, schema reflection, Python tests, and frontend type/build checks pass.
- Direct Mode executes five tests covering roles, issuer authority, evidence-bound sealing, custody rejection, bounded consensus, timeout closure, and appeal expiry.
- Deployment transaction `0x8e9a2d5293937f774a1e2bf9574e94e26411668074bdd7471dee32cb2972936a` finalized with execution result `SUCCESS` and five `AGREE` validator votes.
- Contract `0x2581346995cd24dD38889F3b0c7638803DD9d3C3` returns the expected monolith metadata and `custody_enabled=false`.
- Deployed source is an exact byte match for local `contracts/Witlock.py`; both hash to `5EB2C4ADA4A78C22AC484E974FC5D457F042624661876422099CB04B07BBCF95`.

## Unproven gates

Browser wallet transactions, a completed agreement lifecycle on the target network, recipient-side payment, recovery behavior, and production custody remain unproven. Custody stays disabled and allocation fields are not presented as payments.

## Independent review

Clone the exact Git SHA, install the lockfile and Python requirements, run every command in `docs/TEST_MATRIX.md`, inspect the generated schema, compare the deployed source hash with the manifest, and treat every absent lifecycle receipt as `NOT PROVEN`.

## Submission summary

WITLOCK is a proof-bound GenLayer StudioNet agreement monolith. It freezes weighted criteria and external issuer wallets, stores immutable case-scoped attestations, requires issuer authentication, and asks validators to agree on a bounded PASS/FAIL/INCONCLUSIVE mapping. Contract arithmetic derives results and integer allocations while append-only decisions and audit history preserve reviewability. Native custody is contained behind a false capability gate until StudioNet transfer, recipient delivery, and recovery behavior are proven.
