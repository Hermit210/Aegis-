# Team1 Mini Grant Proposal — Avalanche Deploy Assurance

## Problem

`avalanche-cli` — the primary deployment tool for Avalanche L1 builders — entered maintenance mode in December 2025: Ava Labs will not build new features, only security/critical fixes, and has explicitly invited external contributions. Meanwhile, open issues document a recurring pattern: the CLI reports deploy success while the underlying network state disagrees (issues #2594, #2526), and configuration resolution is unreliable enough that a reporter stated the documentation is either not up to date or hard to locate (#2535).

## Evidence

| Claim | Source |
|---|---|
| CLI is in maintenance mode, external contributions invited | avalanche-cli release notes, Dec 2025 |
| Deploy reports success while local network status is falsely "No" | avalanche-cli #2594 |
| Validator-add transactions succeed but validator set queries empty | avalanche-cli #2526 |
| Config resolution ambiguity / port randomization post-Etna | avalanche-cli #2535 |
| RPCChainVM version mismatches common enough to need official docs | Builder Hub troubleshooting page + compatibility table |
| No existing tool fills this specific gap | Competitive analysis, Document 13 — closest tools operate at production infra (avalanche-deploy) or post-deploy staking-uptime (avaxtoolkit) layers, not deploy-time correctness |

## Why Team1 Should Fund This

1. **It targets a documented, maintainer-acknowledged gap**, not a hypothesis — every problem claim above traces to a dated, public GitHub issue or an official maintainer statement.
2. **Zero cost to Ava Labs' maintenance-mode bandwidth.** It ships as an independent tool, not a PR competing for review time against a team explicitly conserving its own.
3. **Benefits every L1 builder**, not a narrow subset — this is the highest-traffic on-ramp in the ecosystem.
4. **Realistically scoped** — read-only diagnostics, no consensus/signing changes, testable against real fixtures derived from the cited issues.

## Milestones (summary — full week-by-week in Document 09)

| Milestone | Weeks | Deliverable |
|---|---|---|
| M1 | 1–3 | Pre-flight checks (version compat, config resolution, port availability) + CLI skeleton |
| M2 | 4–6 | Post-deploy checks (validator-set diff, network-status diff, genesis consistency) |
| M3 | 7–8 | Report generation, JSON schema, health scoring, CI templates, beta with real builders |
| M4 | 9–10 | Docs, Builder Hub troubleshooting-doc PR, public v0.1 release, grant report |

## Budget ($10,000 — indicative breakdown)

| Category | Amount |
|---|---|
| Solo developer time (8–10 weeks, part-time alongside coursework) | $8,000 |
| Beta testing incentives / feedback bounty for 5–10 real builders | $1,000 |
| Infra (RPC provider costs for CI mainnet/testnet checks, domain, CI minutes) | $500 |
| Contingency | $500 |

## Success Metrics

- Tool correctly reproduces and flags all three cited historical bugs (#2594, #2526, #2535 fixtures) — a concrete, checkable acceptance criterion, not a vague "works well."
- At least 10 external builders run the tool during the beta window (Week 7–8) and provide feedback.
- v0.1 public release with CI templates, published before Week 10.
- At least one PR opened against Builder Hub troubleshooting docs referencing the tool.

## Open Source Commitment

MIT-licensed (rationale in Document 14/17) from day one, public repo from Week 1 (not held back until "done"), all check logic contributable via the documented extension interface (Document 03 §8).

## Maintenance Plan

See Document 14 (Business Case) — summary: solo-maintained through the grant period with a documented issue-triage process, contributor guide published at v0.1, explicit statement in README about current maintenance capacity so users have accurate expectations.

## Risk Analysis

See Document 12 (Security) for false-positive/negative risk, and Document 20 (Critical Review) for a deliberately adversarial review of this proposal's weakest points — including the honest possibility that some cited issues may already be patched in the newest CLI release and require re-verification before Week 1 work begins.
