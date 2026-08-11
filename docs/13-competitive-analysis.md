# Competitive Analysis

## Comparison Table

| Tool | Layer | Deploy-time verification? | Post-deploy correctness diff? | Read-only? | Target user |
|---|---|---|---|---|---|
| `avalanche-cli` | Deploy execution | Reports its own status only (the thing being checked) | No independent re-verification | No (signs/submits txs) | All L1 builders |
| `avalanche-monitoring` | Running node infra | No | No — monitors node metrics, not deploy correctness | Read-only | Node operators |
| `avalanche-deploy` | Production infra (Terraform/Ansible/K8s) | Has an ops "health checks" guide, but scoped to production infra deploys, not the `avalanche-cli` local/Fuji flow | Partial, within its own infra scope | Mixed (deploys infra) | Production infra teams |
| `avalanche-network-runner` | Local network orchestration | No — it starts networks, doesn't verify them | No | N/A (orchestration tool) | Tooling authors, CLI itself |
| `avaxtoolkit` | Mainnet dashboard (explorer, wallet, validator staking) | No | "Status Diagnostics" — but scoped to staking uptime/reward-threshold tracking, not deploy correctness [description-level finding, not verified against source] | Read-only | Validator operators tracking staking rewards |
| Avascan / VScout / AllNodes | Explorers / monitoring services | No | No — uptime/reward tracking, post-deploy, production | Read-only | Validator operators |
| **Avalanche Deploy Assurance (this project)** | `avalanche-cli` deploy workflow | **Yes — pre-flight, before deploy is attempted** | **Yes — independently re-queries RPC/P-Chain and diffs against CLI-reported state** | **Yes, always** | Early-stage L1 builders using `avalanche-cli` |

## Where This Project Fits

The existing ecosystem splits cleanly into two moments: **before deploy** (`avalanche-network-runner` provisions infra) and **long after deploy** (`avalanche-monitoring`, `avaxtoolkit`, and the explorer services track live validator uptime and rewards). `avalanche-deploy` is the closest by name, but it operates one layer up — production Terraform/Kubernetes infrastructure for teams already running validators at scale, not the local/Fuji `avalanche-cli blockchain deploy` flow that most early-stage builders (including grant-track solo builders) actually use day to day.

No existing tool independently re-verifies whether a specific `avalanche-cli` deploy or validator-add transaction produced the state the CLI reported. That is the gap this project fills, and it is a narrower, more specific claim than "no deployment tooling exists" — which would be false, given the table above.

## Verification Note

The `avaxtoolkit` entry is marked as a description-level finding: its "Status Diagnostics" feature was assessed from its README, not from reading the component source directly. Before finalizing this competitive claim in a public grant application, cloning the repo and confirming the diagnostics logic is staking-uptime-scoped (not deploy-correctness-scoped) is a same-day task that should happen during Week 0 (Document 09), alongside re-verifying the cited `avalanche-cli` issues are still current.
