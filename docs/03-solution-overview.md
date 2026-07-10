# 03 — Solution Overview

## What It Is

Avalanche Deploy Assurance is a read-only, independent diagnostics toolkit with three stages, mapped directly to the six problem categories in Document 02:

| Stage | Addresses | What It Does |
|---|---|---|
| **Pre-flight** | Category 3 (config mistakes surface late) | Validates AvalancheGo/VM/plugin version compatibility, configuration resolution, and port availability *before* a deploy is attempted. |
| **Post-deploy verification** | Categories 1, 2 (unverified success, unverified validators) | Independently queries live RPC and P-Chain state and compares it against what the deployment was configured to produce. |
| **Reporting** | Categories 4, 5, 6 (fragmented debugging, no confidence signal, no remediation) | Consolidates all check results into a single deployment confidence report with a health score and concrete next-step guidance for every failing check. |

## How It Fits Around Existing Tooling

The project deliberately does not reimplement anything that already works well:

- **Deployment execution** stays with `avalanche-cli` — this project observes and verifies, it does not deploy.
- **Infrastructure provisioning** stays with `avalanche-deploy` and `avalanche-network-runner` for teams operating at that layer.
- **Ongoing node/validator monitoring** stays with `avalanche-monitoring` and existing explorer/monitoring services.

This project owns the specific moment those tools don't: verifying that a deployment produced by `avalanche-cli` is actually correct, immediately after it happens.

## Core Design Commitment

Every check is read-only. No stage of this toolkit signs a transaction, submits a transaction, or modifies chain state or CLI configuration. This is both a security boundary (Document 21) and a trust boundary — a verification tool that can itself alter what it's verifying would undermine its own purpose.
