# Source parity

`contracts/Witlock.py` is the only canonical deployable source. The current source is Git SHA `14315fa82ef6d6f5e2c077de51c93f266801b1cb`, 62,629 bytes, SHA-256 `AB446841A8A16276ED30A431264DEEC015E87751FF594AE92392ECFACB2F7F35`.

There is no current deployed contract to compare. The latest current source attempt `0x20ef208035dd7c080fafc78759477335f575dda6962750eec7cc0de4539c3d24` and prior attempts finalized `NO_MAJORITY` with `consensus_data=null`; the latest lifecycle readback had no decision ID and a `NoOp` resolution. The network probe reports no consensus contracts deployed. Source parity therefore remains `NOT PROVEN` for the current source.

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
