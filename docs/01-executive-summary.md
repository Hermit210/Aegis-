# Executive Summary — Avalanche Deploy Assurance

## Problem

`avalanche-cli` is the primary on-ramp every Avalanche L1 builder uses to create, deploy, and manage a chain — from local dev to Fuji testnet to mainnet. As of December 2025, the tool entered maintenance mode: Ava Labs will not build new features, will only address security patches and critical bugs, and has explicitly invited external contributions.

At the same time, the CLI's deploy workflow has a documented pattern of silent or misleading failure modes, verified directly against open GitHub issues:

- RPCChainVM protocol version mismatches between AvalancheGo and VM plugins, common enough to warrant a dedicated official troubleshooting page and compatibility table.
- Deploys that report success while the network status table shows `LOCAL NETWORK: No` (issue #2594).
- Validator-add transactions that log as succeeded, but the validator set queries back empty (issue #2526).
- `config.json` being silently ignored and ports randomizing after the Etna upgrade, breaking client reconnection, with the reporter noting the documentation is either not up to date or hard to locate (issue #2535).
- Ledger signature failures requiring a full command re-run, which re-charges subnet creation fees with no built-in resume path (issue #2458).

None of these are consensus-level bugs. They are **deploy-time verification gaps**: the CLI tells you what command it ran, not whether the result matches what you asked for. A builder currently has to manually cross-check RPC output, validator set state, and config resolution by hand — or ship a broken chain and find out during a grant demo or hackathon judging.

## Solution

Avalanche Deploy Assurance is a standalone, open-source diagnostics layer that wraps the `avalanche-cli` deploy workflow with three stages:

1. **Pre-flight** — checks AvalancheGo/VM/plugin version compatibility, config resolution, and port/dependency state *before* a deploy is attempted.
2. **Deploy-time integration** — runs alongside `avalanche blockchain deploy` without modifying it (wrapper, not a fork).
3. **Post-deploy verification** — independently queries the live RPC and P-Chain state and diffs it against what the CLI reported, catching exactly the class of bug in issues #2594, #2526, and #2535.

Output is a deployment report with a health score, categorized warnings/errors, and actionable fixes — not just a pass/fail.

## Why This, Not Something Else

This project was chosen after three other ideas (a HyperSDK StateKeys linter, a general property-testing framework, and a HyperSDK scheduler verification toolkit) were evaluated and rejected on evidence: the first two were already solved by the HyperSDK runtime itself, and the third, while technically sound, had no measurable visible demand — zero related GitHub issues or discussion threads found. Deploy Assurance is the one candidate that is simultaneously (a) tied to open, dated, reproducible GitHub issues, (b) affects every L1 builder rather than a narrow HyperSDK subset, and (c) has an explicit maintainer signal (maintenance mode + "external contributions welcome") that the gap will not be closed internally.

## Impact

- **Individual builders**: fewer silent failed deploys, faster debugging, lower first-deploy abandonment.
- **Team1 / Ava Labs**: a lower support burden for the exact class of issue currently filed against `avalanche-cli`, at zero cost to the core team, since this ships as a separate tool, not a PR that competes for maintenance-mode review bandwidth.
- **Ecosystem**: a credible, evidence-backed open-source contribution that can be pointed to as "the diagnostic layer the CLI currently lacks," with a realistic (not guaranteed) path to becoming a referenced or upstreamed standard, contingent on real adoption — not asserted as already true.

## What This Document Set Is, and Isn't

This is a complete planning and grant-application package. It is written to be evidence-first: every claim about existing gaps traces to a specific, cited GitHub issue or maintainer statement. Where a claim depends on something not yet verified (e.g., whether Ava Labs would accept a PR touching CLI internals), it is marked explicitly as an **[ASSUMPTION — VERIFY]** rather than stated as fact.
