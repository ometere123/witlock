# Source parity

`contracts/Witlock.py` is the only canonical deployable source. The deployed address is `0x2581346995cd24dD38889F3b0c7638803DD9d3C3`, created by deployment transaction `0x8e9a2d5293937f774a1e2bf9574e94e26411668074bdd7471dee32cb2972936a` from Git SHA `b9204ef`.

The local source and StudioNet `getContractCode` response are both 33,227 bytes and hash to `5EB2C4ADA4A78C22AC484E974FC5D457F042624661876422099CB04B07BBCF95`. The deployed schema exposes the expected 31 methods, zero constructor parameters, and the same public signatures as the local schema reflection. The sanitized evidence is in [`artifacts/live-61999/manifest.json`](../artifacts/live-61999/manifest.json).

The frontend uses one public `NEXT_PUBLIC_WITLOCK_CONTRACT` address and contains no signer key or backend write service. Source parity is verified for this deployment; a new deployment requires a new manifest and hash comparison.
