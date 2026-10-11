# StudioNet 61999 deployment protocol
1. Install dependencies and pin repository-local genlayer CLI 0.39.1.
2. Run tests, contract lint, and frontend typecheck/build. Do not substitute global 0.40.0rc.
3. Verify network info points to chain 61999 and RPC https://studio.genlayer.com/api.
4. Deploy contracts from exact hashed sources; record transaction hash and finality.
5. Independently confirm sources and contract addresses in https://explorer-studio.genlayer.com.
6. Test all permission checks, issuer authentication, receipt states and wallet rejection in live browser.
7. Do not solicit or accept GEN deposits: no custody release is implemented.
