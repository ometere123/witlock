# Reviewer evidence

## Verified in the current workspace

- The repository is the existing WITLOCK history beginning at commit `391bf99`.
- The local npm dependency tree contains GenLayer CLI `0.39.1` and `genlayer-js` `1.1.8`.
- The approved network constants are chain `61999`, hex `0xF22F`, RPC `https://studio.genlayer.com/api`, and explorer `https://explorer-studio.genlayer.com`.
- Contract AST lint passes for `WitlockAgreement.py` and `WitlockRegistry.py` with no warnings after the hardening pass.
- Contract semantic validation passes for both sources using the pinned `v0.2.16` runner bundle.
- Direct Mode tests pass for registry immutability, role separation, acceptance, and timeout behavior.
- The frontend StudioNet preflight, TypeScript check, and production build pass against the installed SDK.

## Not yet evidence-backed

Full validator consensus, live StudioNet deployment, deployed source parity, browser execution, and all transfer/recovery behavior remain pending. The custody gate stays closed until those results exist.

## Independent review procedure

1. Clone the exact Git commit.
2. Install the repository lockfile and Python requirements.
3. Assert the local CLI version is `0.39.1`.
4. Run the checks in `docs/TEST_MATRIX.md`.
5. Review the contract schema and source bytes.
6. Test every negative authorization, deadline, evidence, consensus, and replay case.
7. Treat every missing live receipt as `NOT PROVEN`.

## Submission summary

WITLOCK is a GenLayer StudioNet agreement engine that binds weighted acceptance criteria to nominated issuer wallets and immutable registry records. Parties can freeze terms, accept, submit bounded evidence, authenticate exact source claims, seal a case, obtain bounded validator classification as PASS/FAIL/UNKNOWN, inspect deterministic outcomes and append-only history, time out inactive cases, and open one appeal. WITLOCK separates byte integrity from truth and transaction finality from payment proof. Native GEN custody remains disabled until parent/child transfer execution, recipient delivery, failure, ambiguity, and recovery are proven on chain.
