# Source parity

`contracts/Witlock.py` is the only canonical deployable source. The current source is Git SHA `96edcdbbd1025541b5d00d5b6d82ecd28b46ab55`, 60,059 bytes, SHA-256 `F9E08ADA6D39E083B681221B05489E3A45E18E9A96FE455B2E05F6ABFC82188`.

There is no current deployed contract to compare. Fresh StudioNet deployment attempts `0xcb4b0a…c8514` and `0x4b94eb…2c159` finalized `NO_MAJORITY` with `consensus_data=null`; the network probe reports no consensus contracts deployed. Source parity therefore remains `NOT PROVEN` for the current source.

Once StudioNet consensus is available, reproduce the comparison with:

```powershell
npm ci
npm run cli:version
python scripts/genvm_lint.py check contracts/Witlock.py --json
genlayer deploy --contract contracts/Witlock.py --rpc https://studio.genlayer.com/api --wallet keystore
genlayer code <fresh-contract-address> --rpc https://studio.genlayer.com/api > deployed.py
Get-FileHash contracts/Witlock.py -Algorithm SHA256
Get-FileHash deployed.py -Algorithm SHA256
genlayer schema <fresh-contract-address> --rpc https://studio.genlayer.com/api
```

The old address `0x4D39aBdF8F574B44Ff178CBf974042a36D70c9A0` and its 45,334-byte source hash are historical artifacts from a superseded release. They must not be substituted for the current source parity check.
