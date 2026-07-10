# 23 — Competitive Analysis

## Comparison

| Tool | Layer | Deployment execution | Deployment-time verification | Ongoing monitoring | Read-only |
|---|---|---|---|---|---|
| `avalanche-cli` | Deployment execution | Yes — this is its core function | Reports its own status; no independent re-verification | No | No — signs and submits transactions |
| `avalanche-network-runner` | Local network orchestration | Starts and manages local networks | No | No | N/A (orchestration tool) |
| `avalanche-deploy` | Production infrastructure (Terraform/Ansible/Kubernetes) | Yes, at the infrastructure level | Includes an operations health-check guide, scoped to production infra rather than the standard `avalanche-cli` local/testnet flow | Partial, within its own infra scope | Mixed — deploys infrastructure |
| `avalanche-monitoring` | Node/validator infrastructure monitoring | No | No | Yes — node-level metrics and dashboards | Read-only |
| Validator dashboards / explorer-based tools | Mainnet validator operations | No | No | Yes — uptime and staking-reward tracking for live validators | Read-only |
| **Avalanche Deploy Assurance** | Deployment verification (this project) | No — deliberately does not deploy anything | **Yes — this is the core function** | No — scoped to the deployment moment, not long-running operations | **Yes, always** |

## Where This Project Fits

Avalanche's existing tooling clusters around two moments: before deployment (network orchestration and infrastructure provisioning) and long after deployment (node and validator operations monitoring). Nothing currently occupies the moment in between — confirming that a specific deployment produced the state it was configured to produce. That is a distinct layer, not a duplication of any tool in the table above: it does not execute deployments (leaving that to `avalanche-cli` and `avalanche-network-runner`), it does not manage infrastructure (leaving that to `avalanche-deploy`), and it does not provide long-running operational monitoring (leaving that to `avalanche-monitoring` and validator dashboards).

## On `avalanche-deploy`'s Existing Health Checks

The closest conceptual overlap is `avalanche-deploy`'s own operations guide, which includes health checks. The distinction is architectural: those checks are built for and coupled to production Terraform/Kubernetes infrastructure deployments, serving infrastructure teams standing up validators at scale. This project targets the `avalanche-cli` local/testnet deployment flow specifically — a different deployment method, a different and larger population of users (most early-stage L1 builders), and a correspondingly different implementation surface, even though the underlying goal (confidence that a deployment is correct) is conceptually related.

## Honest Note on Verification

This comparison is based on each tool's published documentation and stated scope, not a full line-by-line review of every tool's source code. Before this comparison is used in a grant submission, a direct review of `avalanche-deploy`'s health-check implementation is worth doing, to confirm the differentiation described above holds in practice and not just in each project's stated intent.
