# Reviewer evidence

## Repository and deployment

- One canonical deployable source: contracts/Witlock.py, class Witlock.
- Repository-local CLI 0.39.1, genlayer-js 1.1.8, StudioNet stable chain 61999, and https://studio.genlayer.com/api.
- Current contract: https://explorer-studio.genlayer.com/address/0x825478432dFECd321C5E5C193829Ad1bAd88043a.
- Deployment: https://explorer-studio.genlayer.com/tx/0x2fb0f9f120d7531f76101472248b44899a7e2380049690f0d92fb5fb89d6a2d8, FINALIZED, MAJORITY_AGREE, leader SUCCESS.
- Exact source parity: 62,629 bytes and SHA-256 AB446841A8A16276ED30A431264DEEC015E87751FF594AE92392ECFACB2F7F35; deployed source commit 14315fa82ef6d6f5e2c077de51c93f266801b1cb.

## Live lifecycle

The sanitized case ledger in artifacts/live-61999/cases.json links lifecycle transactions and readbacks for all four required verdicts:

- APPROVED 100 with a verified, resolved appeal at version 2.
- REJECTED 0 with a critical FAIL.
- PARTIAL 50 with one PASS and one FAIL.
- INCONCLUSIVE 0 with authenticated evidence and an explicit inconclusive adjudicator result.

The live source observation records the immutable GitHub commit, repository, path, content size, and digest. The nominated issuer and independent verifier are distinct public accounts. custody_enabled=false; no native transfer or recipient-delivery proof is claimed.

## Local and browser verification

- 34 passed Python/Direct Mode tests.
- GenVM lint/check, frontend typecheck, frontend transaction tests, Next production build, StudioNet preflight, and npm audit with 0 vulnerabilities.
- Route smoke covered the public and dynamic App Router routes.
- The Chrome profile exposed an injected EIP-1193 wallet on chain 0xf22f. Browser creation transaction https://explorer-studio.genlayer.com/tx/0xef85a36028a4dc8bad7468de3ec4c71e66769fe08f2b9da585321bc1399ccd9c finalized with MAJORITY_AGREE and four successful validator executions; readback confirms browser-proof-20261012.
- Finalized transaction handling uses the SDK FINISHED_WITH_RETURN enum and the pinned StudioNet validator execution shape, preserves failed finalized receipts, recovers pending entries, and links receipts to the StudioNet explorer.

genlayer trace is unavailable because the approved RPC does not implement gen_dbg_traceTransaction. Earlier NO_MAJORITY deployments and the old contract address remain historical.
