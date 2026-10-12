# StudioNet 61999 deployment protocol

1. Install the lockfile and run the repository-local CLI through `npm run cli:version`; require `0.39.1`. The global CLI is not an acceptable substitute.
2. Assert chain ID `61999`, chain hex `0xF22F`, and RPC `https://studio.genlayer.com/api` before any deployment command. Abort on mismatch.
3. Run Python tests, Python compilation, GenVM lint and semantic validation, Direct Mode, frontend typecheck, and production build on the exact Git commit.
4. Hash both contract files and retain the SHA-256 values with the commit SHA.
5. Deploy the registry and then the agreement engine with the registry address as constructor input. Record submitted, accepted, finalized, and execution-success states separately.
6. Read source and schema from `https://explorer-studio.genlayer.com` and compare them to the local hashes and ABI.
7. Use distinct wallet identities for requester, provider, and issuer. Test wrong-network blocking, wallet rejection, unauthorized callers, replay, deadline, malformed consensus, and page-refresh recovery.
8. Keep custody disabled. Do not solicit or accept GEN deposits, emit payouts, or claim recipient delivery until the transfer and recovery evidence in [CUSTODY_AND_RECOVERY.md](CUSTODY_AND_RECOVERY.md) exists.
