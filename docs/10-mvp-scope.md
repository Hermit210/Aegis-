# MVP — Exactly What v1 Ships

## Ships in v1

- `preflight` command with 3 checks: `rpcchainvm-compat`, `config-resolution`, `port-availability`.
- `verify` command with 3 checks: `validator-set-diff`, `network-status-diff`, `genesis-consistency`.
- `doctor` command combining both.
- Text and JSON output, documented schema.
- Health scoring (simple weighted average, explicitly labeled as v1/provisional in output).
- Local network + Fuji testnet support, confirmed working.
- CI example templates (GitHub Actions).
- Fixture-based regression tests reproducing issues #2594, #2526, #2535.

## Explicitly Does NOT Ship in v1

- **No daemon/watch mode.** Every run is a single stateless check pass. A long-running monitor is a different reliability class of software (uptime guarantees, alerting infra) and is out of scope for an 8–10 week solo build.
- **No transaction signing or repair automation.** The tool diagnoses; it never fixes chain state directly. This is a deliberate trust-boundary decision (Document 12), not a missing feature.
- **No support for `avalanche-network-runner` or `avalanche-deploy` (Terraform) flows.** v1 targets `avalanche-cli` specifically, since that's where the cited issues live and where the highest volume of early-stage builders operate.
- **No mainnet guarantee.** Read-only checks should work on mainnet, but it's marked experimental, not promised, until tested for real (Document 04 §5).
- **No dynamic/generative repair suggestions.** Fix text is a static, pre-written mapping (Document 03 §7) — accurate and reviewable, not clever.
- **No web dashboard/UI.** CLI + JSON only. A dashboard is a plausible V2 feature (Document 11) but doubles the surface area for an already time-boxed MVP.

## Why This Scope

Every included check maps directly to a cited, reproducible GitHub issue (Document 08 evidence table). Every excluded feature either (a) changes the trust model by adding write/signing capability, (b) targets a different tool's workflow than the one with documented evidence of the problem, or (c) is a nice-to-have with no cited demand evidence — the same standard applied when rejecting the earlier HyperSDK scheduler idea for low visible demand is applied here to keep scope honest.
