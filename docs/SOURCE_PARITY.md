# Source parity

`contracts/Witlock.py` is the only canonical deployable source. The current source is Git SHA `56332feeabec917255ea3d8cb13b21198d27344d`, 60,636 bytes, SHA-256 `144042E9A8B0C62A3F2E820A094A39ADAEE9463AEFD21352AD3B4102CFAF3D30`.

There is no current deployed contract to compare. The latest current source attempt `0x85a76d80e00c0fa97d290cb71d98b36009c2131c98c53f09cc287c133d257171` and the preceding attempt `0xaf8744c306dec999ac3861c9da45af53f7f47e889dc08bc35797e9db28bebde0` finalized `NO_MAJORITY` with `consensus_data=null`; earlier controls reached the same pre-consensus boundary. The network probe reports no consensus contracts deployed. Source parity therefore remains `NOT PROVEN` for the current source.

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
