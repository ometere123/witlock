# Source parity

`contracts/Witlock.py` is the only canonical deployable source. The current StudioNet address is `0x4D39aBdF8F574B44Ff178CBf974042a36D70c9A0`, deployed by `0x727050425edb3591f6438b6b4a88f2f7e8efcd160444f073062b9317e430b53f` from Git SHA `e57424aa97817469385add4a426943dd67ca1d19`.

The local source and `gen_getContractCode` response are both 45,334 bytes and hash to `E71CF73539EB4A552C5CE120C29227F5197E89CE288DF09E344D5B93F64E8A81`. The deployed schema exposes 37 methods and zero constructor parameters. `get_contract_info` reports `monolith-v2`, StudioNet, chain `61999`, and `custody_enabled=false`.

Reproduce the comparison with:

```powershell
npm ci
npm run cli:version
python scripts/genvm_lint.py schema contracts/Witlock.py --json
npx --no-install genlayer code 0x4D39aBdF8F574B44Ff178CBf974042a36D70c9A0 --rpc https://studio.genlayer.com/api > deployed.py
Get-FileHash contracts/Witlock.py -Algorithm SHA256
Get-FileHash deployed.py -Algorithm SHA256
```

The sanitized deployment record is [`artifacts/live-61999/manifest.json`](../artifacts/live-61999/manifest.json). The deployed source was normalized only for CLI output line endings and footer removal before comparison; the byte content matches the local source exactly.
