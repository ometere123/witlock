# WITLOCK hardening closeout

Audit date: 2026-10-13. This release keeps one `Witlock` intelligent contract on stable StudioNet, the route-first Next.js frontend, injected EIP-1193 wallets, source-backed adjudication, and explicit limits around asynchronous native child delivery.

## Release identity

- Network: StudioNet stable, chain `61999` (`0xF22F`), RPC `https://studio.genlayer.com/api`.
- Repository-local CLI: `0.39.1`.
- Contract: [`0xC2523f90a89B0A989a15BE81fA124b435f0190cF`](https://explorer-studio.genlayer.com/address/0xC2523f90a89B0A989a15BE81fA124b435f0190cF).
- Deployment: [`0x68238f2d8b195d8f753a0a1ca4d9934bbded309d5b2cd7480e64ab34da13938f`](https://explorer-studio.genlayer.com/tx/0x68238f2d8b195d8f753a0a1ca4d9934bbded309d5b2cd7480e64ab34da13938f).
- Source parity: 72,967 local bytes and remote bytes, SHA-256 `caea7d3d630581256f679010b946cad4204fac7f9f3148d639b73899b65a41eb`, exact byte comparison `true`.
- Schema: 37 methods, 13 views, 24 writes, zero constructor parameters.

## Contract changes

- A funded draft that reaches the acceptance deadline without provider acceptance has a requester-only `recover_expired_funding` path. The exact funding is latched once, the draft becomes terminal before the child dispatch, and a seven-day observation deadline prevents retry-based double payment. `mark_funding_refund_ambiguous` moves one unobserved child to unresolved accounting without authorizing another transfer.
- Each agreement freezes an `inconclusive_provider_bps` recovery rule. A funded conclusive failure can therefore distribute the exact balance between provider and requester after terminal finalization; the rule cannot be changed by a party after creation.
- First adjudication captures `appeal_window_started_at` once and raises the effective appeal deadline to at least 900 seconds after the ruling. `open_appeal()` and `finalize_decision()` use that same deadline, and terminal finalization remains idempotent.
- Accounting now reads `self.balance` and exposes global liability counters, lower and upper liability bounds, and `balance_matches_bookkeeping`. The boolean is a solvency check against the observed contract balance, not a claim that asynchronous child delivery has been authenticated on-chain.
- Receipt handling rejects contradictory top-level metadata, explicit execution errors, `NO_MAJORITY`, malformed validator results, and inconsistent validator records. A successful quorum cancellation is accepted only when it is explicitly identifiable as post-quorum validator cancellation.

## Verification

- Direct Mode: 41 tests, including four-criterion maximum questions, authority separation, immutable source bytes, prompt injection, missing and malformed evidence, delayed rulings, late appeals, expiry boundaries, replay, terminal idempotency, funded draft recovery, funded INCONCLUSIVE allocation, and accounting conservation.
- Frontend receipt tests: 13 Vitest tests, including successful finality, SDK `FINISHED_WITH_RETURN`, explicit errors, `NO_MAJORITY`, validator contradictions, quorum cancellation, pending recovery, wallet rejection, and funded refusal.
- Mutation smoke: 3/3 targeted mutants killed.
- TypeScript, production build, GenVM lint/check/schema, compileall, preflight, and dependency audit: passed locally. The final GitHub Actions run URL is recorded in `docs/TEST_MATRIX.md` after the `main` push.

## Scope and limits

Native GEN settlement is role-bound and available only after terminal decision. The contract stores every outbound attempt before emitting the child and never retries an ambiguous dispatch. A reviewer must use the finalized parent receipt, child message, recipient balance, and `get_accounting()` balance readback together. Operator bonds and arbitrary recipients remain unsupported.

Publisher and verifier authority is authenticated by wallet transactions and frozen case roles. GitHub Actions identity is documented as an external reproducibility signal because this GenVM release has no verified workflow-attestation primitive. Source retrieval proves exact immutable bytes and provenance coordinates; it does not prove human identity, factual truth, or independence of wallet owners.

Production is [https://witlock.vercel.app](https://witlock.vercel.app). The public verification route and creation route expose the fresh contract address, chain, RPC, exact-value funding, and frozen INCONCLUSIVE recovery rule. Browser testing confirmed injected-wallet connect, wrong-network blocking, network switch, disconnect, reconnect, and a real signing attempt that remained pending. Account switching, explicit wallet rejection, and persisted recovery after that interrupted attempt remain separately marked in the evidence record where the browser surface did not expose a controllable wallet prompt.