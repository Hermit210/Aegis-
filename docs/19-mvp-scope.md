# 19 — MVP Scope

## Ships in v1

- `preflight` command: `version-compatibility`, `config-validation`, `port-availability` checks.
- `verify` command: `validator-verification`, `network-state-verification`, `genesis-consistency` checks.
- `doctor` command combining both stages.
- Text and JSON output, documented schema (Document 14).
- Health score (v1 formula explicitly labeled provisional, per Document 10).
- Confirmed support for local network and Fuji testnet deployments.
- CI integration examples (GitHub Actions template).
- Fixture-based regression tests representing each of the six problem categories from Document 02 as concrete, reproducible scenarios.

## Explicitly Out of Scope for v1

- **No daemon or watch mode.** Every invocation is a single, stateless check pass — a long-running monitor is a different reliability class of software and out of scope for an initial, solo-built release.
- **No automated repair or transaction signing.** The tool diagnoses; it never modifies chain state. This is a permanent trust-boundary decision, not a temporary MVP limitation.
- **No support for deployment flows outside `avalanche-cli`** (e.g., raw `avalanche-network-runner` or Terraform-based `avalanche-deploy` flows) in v1 — deferred pending evidence of demand at that layer (Document 20).
- **No guaranteed mainnet support.** Read-only checks are inherently low-risk against mainnet, but real-world behavior against production RPC rate limits is unverified pre-launch and is marked experimental rather than promised.
- **No dynamic or generative remediation suggestions.** Fix text is a curated, reviewed static mapping per check (Document 12) — accurate and reviewable, not adaptive, for v1.
- **No web dashboard.** CLI and JSON output only.

## Why This Scope

Every included check maps directly to one of the six structural problem categories in Document 02. Every excluded feature either changes the tool's trust model (signing, writing), targets a deployment workflow with less evidenced usage than the `avalanche-cli` flow, or adds complexity without a corresponding, identified problem category to justify it in an 8–10 week solo timeline.
