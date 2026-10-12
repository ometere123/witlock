# Source parity

`contracts/Witlock.py` is the only canonical deployable source. The current source is Git SHA `2882e1fc17e07f36d389e028551a1aa7eec58761`, 60,447 bytes, SHA-256 `5A22F179E7D41CA12A501C0C2443AAF3C5FC088AF230DC7190B6542E9595D58D`.

There is no current deployed contract to compare. The current source attempt `0xaf8744c306dec999ac3861c9da45af53f7f47e889dc08bc35797e9db28bebde0` finalized `NO_MAJORITY` with `consensus_data=null`; two earlier pre-identity-check attempts reached the same result. The network probe reports no consensus contracts deployed. Source parity therefore remains `NOT PROVEN` for the current source.

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
