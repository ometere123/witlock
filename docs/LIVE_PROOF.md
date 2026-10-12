# Live proof

## Verified deployment

The canonical `Witlock` monolith was deployed from Git SHA `e57424aa97817469385add4a426943dd67ca1d19` to stable StudioNet:

- Network: StudioNet, chain `61999` (`0xF22F`)
- RPC: `https://studio.genlayer.com/api`
- Explorer: `https://explorer-studio.genlayer.com`
- Repository-local CLI: `0.39.1`
- `genlayer-js`: `1.1.8`
- Deployer: `0x0d5540e0aD4B92Aa0ad4e5F1b8cD645ee1E363E7`
- Contract: [`0x4D39aBdF8F574B44Ff178CBf974042a36D70c9A0`](https://explorer-studio.genlayer.com/address/0x4D39aBdF8F574B44Ff178CBf974042a36D70c9A0)
- Deployment transaction: [`0x727050425edb3591f6438b6b4a88f2f7e8efcd160444f073062b9317e430b53f`](https://explorer-studio.genlayer.com/tx/0x727050425edb3591f6438b6b4a88f2f7e8efcd160444f073062b9317e430b53f)
- Deployment status: `FINALIZED`
- Deployment execution: `SUCCESS`
- Deployment consensus result: `MAJORITY_AGREE`
- Local and deployed source: `45,334` bytes, SHA-256 `E71CF73539EB4A552C5CE120C29227F5197E89CE288DF09E344D5B93F64E8A81`
- Source parity: exact byte match
- Deployed schema: 37 methods, zero constructor parameters
- Read-back: `get_contract_info` returned `WITLOCK`, `monolith-v2`, `StudioNet`, chain `61999`; `custody_enabled` returned `false`

## Real finalized lifecycle

Case `live-20261012-03` used distinct requester, provider, issuer, and independent verifier wallets. The one-process `genlayer-js 1.1.8` runner required every write to report `FINALIZED` and leader execution `SUCCESS` before recording it. The finalized-success sequence was:

1. `create_agreement` — [`0x88c18567…a834314`](https://explorer-studio.genlayer.com/tx/0x88c18567a867a12fb861dce974179381b5155b3dc74308a6f0c7ba744a834314)
2. `accept_agreement` — [`0x6ced3d35…9ae67b8f`](https://explorer-studio.genlayer.com/tx/0x6ced3d353a873de1061d74b442154259b0d6aeed2cfc91957ff804dc9ae67b8f)
3. `publish_attestation` — [`0xcb2ddf63…f73eaa88b`](https://explorer-studio.genlayer.com/tx/0xcb2ddf638e9ce341d0611d68fd57a6e396118ec0206a22e0a212a12f73eaa88b)
4. `verify_attestation_source` — [`0x7809d558…f28eaa62`](https://explorer-studio.genlayer.com/tx/0x7809d558d329b217b0900fed643e11ce13d8230894a1e13cd6a5905cf28eaa62)
5. `submit_evidence` — [`0xaa5a812c…4aebcdd8`](https://explorer-studio.genlayer.com/tx/0xaa5a812c297e0c8f74c76a53e949d38d6e2cc100f725ab646e9bb18f4aebcdd8)
6. `authenticate_evidence` — [`0x56871a92…000a8480`](https://explorer-studio.genlayer.com/tx/0x56871a92cfaf6698ca6528a2d8c274d5126f03373ebcb0b42292dbd9000a8480)
7. `acknowledge_delivery` — [`0x673ea0af…ce949ed`](https://explorer-studio.genlayer.com/tx/0x673ea0af26838811bfb6cfedbbb062842417bfccbda0dc99a831038f6ce949ed)
8. `seal_agreement` — [`0x5bcc637b…5b5409`](https://explorer-studio.genlayer.com/tx/0x5bcc637ba0ce501ace3fe1e6da882d82f920ce75a5f885434387073bc95b5409)
9. `adjudicate` — [`0x6d44c663…a28d92ec`](https://explorer-studio.genlayer.com/tx/0x6d44c66314b0095f80775cb6466767afc0c93131b971da2adf069344a28d92ec)
10. `open_appeal` — [`0x6d9439d5…54de9c1`](https://explorer-studio.genlayer.com/tx/0x6d9439d5c4003342e15cbc5617766879a1532ec80afec5af080e771fc54de9c1)
11. `authenticate_appeal` — [`0x65e5361e…9cfbacb8`](https://explorer-studio.genlayer.com/tx/0x65e5361e4aa628bc2ef29d103492056b3817f965664ce83161868ae89cfbacb8)
12. `resolve_appeal` — [`0x66ca6673…6042aa7`](https://explorer-studio.genlayer.com/tx/0x66ca667361a5c31422f42e0cb2f887265a9ce1dbb63e1ad0217b46d7c6042aa7)

The live readbacks after those transactions prove `source_verified=true`, `authenticated=true`, two append-only decision versions, and an authenticated structured appeal. Decision version 1 and appeal version 2 were both `INCONCLUSIVE` with `consensus_status=AGREED`; the contract computed zero allocation and `BLOCKED_INCONCLUSIVE` because custody is disabled.

The permissionless `finalize_decision` transaction [`0xb2d78079…b40f8d`](https://explorer-studio.genlayer.com/tx/0xb2d780791761e5fef0b18902eacb1898113a933c71ac328811183098a2b40f8d) is `FINALIZED` and the contract readback contains `FINAL_DECISION`, `appeal_status=FINALIZED`, and audit revision 12 after the appeal deadline. Its leader receipt reports `execution_result=ERROR` despite a `MAJORITY_AGREE` consensus result. This is recorded as a receipt limitation and is not claimed as a successful finalization execution.

## Proof boundaries

The live proof covers deployment, source parity, schema parity, evidence publication, independent source verification, authenticated evidence, adjudication, structured appeal, appeal authentication, appeal resolution, final-state readback, and the custody gate. It does not prove recipient-side GEN transfer, child transfer delivery, ambiguous-transfer recovery, or a live browser-wallet transaction. Those paths remain disabled or explicitly unrecorded.

The sanitized manifest is [`artifacts/live-61999/manifest.json`](../artifacts/live-61999/manifest.json). Raw node and CLI logs remain local and ignored; they are not treated as source-parity or payment proof.
