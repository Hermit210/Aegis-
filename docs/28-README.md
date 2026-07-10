# Avalanche Deploy Assurance

> The missing deployment assurance layer for Avalanche L1 builders.

Avalanche provides strong tooling for deployment execution (`avalanche-cli`), infrastructure provisioning (`avalanche-deploy`, `avalanche-network-runner`), and node/validator monitoring (`avalanche-monitoring`, explorer-based tools). There is currently no unified workflow that verifies, independently, whether a specific L1 deployment actually produced the state it was configured to produce.

Avalanche Deploy Assurance is a read-only, open-source CLI that closes that gap: pre-flight checks before you deploy, independent post-deploy verification after, and a single deployment confidence report with actionable fixes for anything that's wrong.

```bash
avalanche blockchain create mychain
avalanche-deploy-assurance preflight --chain mychain
avalanche blockchain deploy mychain --local
avalanche-deploy-assurance verify --chain mychain
```

Or run both stages together:

```bash
avalanche-deploy-assurance doctor --chain mychain
```

## Why This Exists

Deploying an Avalanche L1 currently ends with the builder manually verifying the result: cross-referencing CLI output, config files, logs, and RPC responses by hand, with no single source of truth for whether the deployment is actually correct. This project exists to replace that manual process with one command and one report. Full problem analysis in [`docs/02-problem-statement.md`](./docs/02-problem-statement.md).

## What It Is Not

- Not a replacement for `avalanche-cli`, `avalanche-deploy`, or `avalanche-network-runner` — it verifies what they produce, it doesn't replace what they do.
- Not a transaction signer — no private keys, no signing, no writes to chain state or CLI configuration, ever.
- Not a monitoring daemon — every run is a single, stateless check pass.

See [`docs/21-22-security-and-risk.md`](./docs/21-22-security-and-risk.md) for the full security model.

## Installation

```bash
go install github.com/<org>/avalanche-deploy-assurance/cmd@latest
```

Full instructions in [`docs/17-18-installation-and-usage.md`](./docs/17-18-installation-and-usage.md).

## Documentation

| Doc | Contents |
|---|---|
| [01 Executive Summary](./docs/01-executive-summary.md) | Problem, solution, impact |
| [02 Problem Statement](./docs/02-problem-statement.md) | The six structural developer-experience gaps |
| [03–04 Solution & Product Vision](./docs/03-04-solution-and-vision.md) | What the tool does, long-term direction |
| [05 Whitepaper](./docs/05-whitepaper.md) | Full technical positioning |
| [06 Litepaper](./docs/06-litepaper.md) | One-page summary |
| [07–08 Technical Design & Architecture](./docs/07-08-technical-design-and-architecture.md) | Layered design, principles |
| [09 Repository Structure](./docs/09-repository-structure.md) | Full repo layout |
| [10 System Design](./docs/10-system-design.md) | Mermaid diagrams |
| [11–12 Component & CLI Design](./docs/11-12-component-and-cli-design.md) | Every component, every command |
| [13 Module Design](./docs/13-module-design.md) | The `Check` interface |
| [14 API Specification](./docs/14-api-specification.md) | Output formats, JSON schema |
| [15–16 User & Developer Journey](./docs/15-16-user-and-developer-journey.md) | Real usage walkthroughs |
| [17–18 Installation & Usage](./docs/17-18-installation-and-usage.md) | Setup and commands |
| [19 MVP Scope](./docs/19-mvp-scope.md) | Exactly what v1 ships |
| [20 Future Roadmap](./docs/20-future-roadmap.md) | Evidence-gated future work |
| [21–22 Security & Risk](./docs/21-22-security-and-risk.md) | Threat model, risk table |
| [23 Competitive Analysis](./docs/23-competitive-analysis.md) | vs. every adjacent Avalanche tool |
| [24 Grant Proposal](./docs/24-grant-proposal.md) | Team1 Mini Grant application |
| [25 Budget Justification](./docs/25-budget-justification.md) | Line-item budget |
| [26 Milestone Plan](./docs/26-milestone-plan.md) | Week-by-week |
| [27 Success Metrics](./docs/27-success-metrics.md) | Checkable acceptance criteria |
| [30 License Recommendation](./docs/30-license-recommendation.md) | Why MIT |

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md). New checks are the primary contribution surface — see [Module Design](./docs/13-module-design.md).

## License

MIT — see [`LICENSE`](./LICENSE).

## Status

Early-stage, built as part of a Team1 Mini Grant application. Maintenance capacity is part-time and stated honestly, not overstated — see the maintenance discussion in [Document 24](./docs/24-grant-proposal.md).
