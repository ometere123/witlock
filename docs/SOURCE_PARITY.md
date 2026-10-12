# Source parity

`contracts/Witlock.py` is the only canonical deployable source. Before a deployment is called verified, record the exact Git SHA, local SHA-256 of the contract, deployment transaction, deployed source response, and schema response. Compare source bytes and public method signatures independently.

The frontend uses one public `NEXT_PUBLIC_WITLOCK_CONTRACT` address and contains no signer key or backend write service. A configured address without matching explorer source and schema is marked unverified.