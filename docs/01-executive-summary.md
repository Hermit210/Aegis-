# 01 — Executive Summary

## The Gap

Avalanche provides strong tooling at three distinct layers: deployment (`avalanche-cli`), infrastructure provisioning (`avalanche-deploy`, `avalanche-network-runner`), and node/validator monitoring (`avalanche-monitoring`, third-party explorers). Each layer is solved reasonably well by an existing tool. What does not exist between them is a **deployment assurance layer**: something that tells a builder, immediately after deploying an Avalanche L1, whether the deployment is actually correct — not whether the CLI command exited without an error, but whether the resulting chain matches the configuration the builder intended.

This gap shows up as a recurring set of developer problems, not a single bug:

- A deployment can appear to complete successfully while still requiring several independent manual checks before a builder can trust it.
- Validator registration must be manually re-verified against live network state; there is no automated confirmation step.
- Configuration mistakes (version mismatches, port conflicts, malformed genesis) are typically discovered *after* deployment, not before.
- Debugging a failed or uncertain deployment currently requires manually cross-referencing CLI output, local config files, node logs, and RPC responses — there is no single, unified view.
- There is no deployment confidence report, no health score, and no guided remediation path. A builder either understands enough of the stack to self-diagnose, or asks for help.

## The Solution

Avalanche Deploy Assurance is an independent, open-source, read-only diagnostics toolkit that sits between the deploy step and the monitoring step. It performs pre-flight validation before a deployment is attempted, and independent post-deployment verification afterward — checking version compatibility, configuration correctness, validator registration, and chain health — and produces a single deployment confidence report with a health score and actionable remediation guidance.

## Why Now

Avalanche's L1 model (sovereign L1s, validator manager contracts, RPCChainVM plugins) shifted meaningful deployment complexity onto individual builders. At the same time, `avalanche-cli` — the tool most builders use for this — has moved into a maintenance-focused posture, with the maintaining team prioritizing security and critical fixes over new feature development, and explicitly welcoming external contributions to fill remaining gaps. This is the moment where an independent assurance layer has the most room to matter, and the lowest risk of duplicating work already planned internally.

## Impact

- **Builders** get a fast, trustworthy answer to "did my deployment actually work," replacing a manual, multi-tool verification process with one report.
- **The ecosystem** gains a lower barrier to a correct first deployment, which matters disproportionately for hackathon and grant-track builders whose credibility is judged on a working demo.
- **Existing tooling** is complemented, not duplicated — this project explicitly does not reimplement deployment, provisioning, or monitoring; it verifies the handoff between them.

This document set is written to be evidence-first and self-critical. Claims about the current developer experience are grounded in the actual `avalanche-cli` workflow and Avalanche's own published troubleshooting guidance, not asserted from assumption. Where a claim would benefit from further validation with real builders, that is stated explicitly rather than smoothed over.
