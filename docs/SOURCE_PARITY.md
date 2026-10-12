# Source parity

contracts/Witlock.py is the only canonical deployable source.

- Contract source commit: 14315fa82ef6d6f5e2c077de51c93f266801b1cb
- Release commit: 38edb83c9fa4fcdf94e9147a9d11b61412d966f2
- Local and deployed source bytes: 62,629
- Local and deployed SHA-256: AB446841A8A16276ED30A431264DEEC015E87751FF594AE92392ECFACB2F7F35
- Current address: https://explorer-studio.genlayer.com/address/0x825478432dFECd321C5E5C193829Ad1bAd88043a
- Deployment: https://explorer-studio.genlayer.com/tx/0x2fb0f9f120d7531f76101472248b44899a7e2380049690f0d92fb5fb89d6a2d8
- Schema: 37 methods, 13 views, 24 writes, zero constructor parameters

The parity check used the repository-local CLI and built-in studionet chain definition:

    npx --no-install genlayer network set studionet
    npx --no-install genlayer code 0x825478432dFECd321C5E5C193829Ad1bAd88043a > deployed.py
    Get-FileHash contracts/Witlock.py -Algorithm SHA256
    Get-FileHash deployed.py -Algorithm SHA256
    npx --no-install genlayer schema 0x825478432dFECd321C5E5C193829Ad1bAd88043a

The deployed source hash and schema match the repository. genlayer trace remains unavailable because the RPC returns method-not-found for gen_dbg_traceTransaction. The old address 0x4D39aBdF8F574B44Ff178CBf974042a36D70c9A0 is historical and is not parity evidence.
