# Aegis

# Aegis

**Deployment Verification & Assurance Toolkit for Avalanche L1 Builders**

Aegis is an open-source, read-only diagnostics tool for Avalanche L1 builders. It sits between deployment and production, and answers one question every builder currently has to answer by hand: *does this deployment actually match what I configured?*

🌐 Landing page: [aegis-psi-dun.vercel.app](https://aegis-psi-dun.vercel.app)
📄 License: MIT
🚫 No token. No equity. No premine. Public good, open source from day one.

---

## The Problem

Avalanche provides strong tooling for deploying an L1 (`avalanche-cli`), provisioning infrastructure, and monitoring live nodes and validators. What's missing is a layer that verifies, independently, whether a specific deployment actually succeeded — not whether the CLI reported success, but whether the resulting chain matches what was configured.

Today, confirming that is a manual process:

- A deployment can report success while validator registration, network state, or configuration still silently disagree with what was intended.
- Validators have to be manually re-checked against live network state, with no automated confirmation step.
- Version and configuration mistakes usually surface *after* deployment, not before.
- Debugging means manually cross-referencing CLI output, RPC responses, validator sets, and logs — with no single source of truth.
- There's no unified confidence signal a builder can point to, and no guided fix when something's wrong.

## The Solution

Aegis closes that gap with a read-only CLI that runs in three stages:

1. **Pre-flight** — checks version compatibility, configuration resolution, and port availability *before* a deployment is attempted.
2. **Post-deploy verification** — independently re-reads live RPC and P-Chain state and compares it against configured intent, rather than trusting any tool's self-reported status.
3. **Reporting** — one health-scored report with clear pass/warning/error results and a concrete fix for every issue found.

### Verification Modules (Planned CLI — see Status below)

| Module | What it checks |
|---|---|
| Version Compatibility | AvalancheGo and VM plugin version alignment |
| Configuration Validation | Local config resolution, ambiguity detection |
| Port Availability | Binding conflicts before deployment |
| Validator Verification | Configured validator set vs. live P-Chain state |
| Network State Verification | RPC health and reachability vs. CLI-reported status |
| Genesis Consistency | On-chain genesis vs. local genesis file |

### Output

- Human-readable terminal reports
- JSON output with a documented schema (for CI/CD pipelines)
- Health score (0.0–1.0) alongside raw pass/warning/error counts — never as a replacement for them
- Plain-language, actionable fix for every non-passing check
- CI integration examples (GitHub Actions)

## What Aegis Does *Not* Do

Aegis is strictly read-only, by architecture, not convention:

- ❌ No private key handling
- ❌ No transaction signing or submission
- ❌ No writes to chain state
- ❌ No writes to `avalanche-cli` or any other tool's configuration
- ❌ No on-chain component of any kind — Aegis has no contract, no program, and nothing to "deploy" to mainnet or testnet; it is a local CLI that reads public data

The worst-case failure mode of a bug in Aegis is an inaccurate report — never fund loss or an unauthorized on-chain action.

## Status

**Current:** This repository presently contains the project's landing page and documentation site (Next.js/TypeScript) — [aegis-psi-dun.vercel.app](https://aegis-psi-dun.vercel.app) — covering the problem statement, architecture, and security model. **The Go-based CLI and its verification engine are in active development and have not shipped yet.**

**Funding:** Applying for a Team1 Mini Grant ($6,500 USD, 8-week build) to fund development of the CLI through a public v1.0 release. Full proposal available on request.

**Why this is scoped as an 8-week, $6,500 build:** the MVP is deliberately narrow — six verification checks, terminal and JSON reporting, and CI examples — see [Roadmap](#roadmap) below for exactly what's in and out of v1.

## Why This Project Exists

`avalanche-cli` — the primary deployment tool most Avalanche L1 builders use — entered a maintenance-focused posture: the maintaining team is prioritizing security and critical fixes over new feature development, and has explicitly welcomed external contributions to close remaining gaps. Aegis is scoped specifically to fill one of those gaps: independent deployment verification.

This isn't a duplicate of existing tooling:

| Layer | Existing tool | Aegis |
|---|---|---|
| Deployment execution | `avalanche-cli` | Verifies what it reports — never deploys anything itself |
| Infrastructure provisioning | `avalanche-deploy`, `avalanche-network-runner` | Operates one layer up, after infra/network is already running |
| Ongoing monitoring | `avalanche-monitoring`, explorer-based dashboards | One-time, point-in-time deployment check — not continuous monitoring |

## Roadmap

### v1 (MVP — funded by this grant, if approved)
- All 6 verification modules listed above
- Terminal and JSON reporting with a documented, versioned schema
- Health score (v1 formula, explicitly labeled provisional)
- Local network + Fuji testnet support
- CI integration examples

### Explicitly out of scope for v1
- No daemon or continuous monitoring mode
- No automated repair or transaction signing
- No support for non-CLI deployment workflows
- No hosted API or web dashboard beyond this landing page
- No AI-generated remediation suggestions

### Future (v2+, contingent on real usage evidence — not committed)
- Weighted, evidence-based health scoring
- Markdown report output
- Community-contributed verification modules
- Optional local-only API + richer web viewer for reports
- Exploration of deployment workflows beyond the standard CLI path

## Tech Stack

**Landing page (this repo, current):**
- Next.js 14 (React 18), TypeScript
- Tailwind CSS, Framer Motion, Lucide React

**CLI (in development, separate build):**
- Go — matches `avalanche-cli`, `avalanchego`, and `hypersdk`; compiles to a single static binary with no runtime dependency
- Cobra — same CLI framework `avalanche-cli` itself uses

## Development (Landing Page)

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
npm install
npm run dev
```
Open [http://localhost:3001](http://localhost:3001).

### Build for production
```bash
npm run build
npm start
```

### Type checking & linting
```bash
npm run type-check
npm run lint
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full dev workflow.

## Architecture (Landing Page)

```
app/
├── layout.tsx           # Root layout
├── page.tsx             # Homepage
├── globals.css          # Global styles
├── docs/page.tsx         # Documentation page
├── architecture/page.tsx # Architecture & Contributing
└── security/page.tsx     # Security & Trust

components/
├── Header.tsx
├── Footer.tsx
├── Hero.tsx
├── TheGap.tsx            # Problem statement section
├── HowItWorks.tsx        # Three-stage flow section
├── Features.tsx
├── GettingStarted.tsx
└── Button.tsx
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full design writeup, including the planned CLI's internal architecture (state layer, check layer, report layer).

## Deployment (Landing Page)

- **Vercel** (recommended): `vercel deploy`
- **Docker**: `docker build -t aegis . && docker run -p 3000:3000 aegis`
- **Node.js host**: any standard Node hosting (AWS, GCP, Azure, etc.)

## Security

Full threat model and false-positive/negative handling documented in [`/security`](https://aegis-psi-dun.vercel.app/security) on the landing page. In short: Aegis is read-only by architecture — there is no code path that handles keys, signs transactions, or writes to chain state or external configuration.

## Contributing

Contributions welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md). Once the CLI ships, the primary contribution surface will be adding new verification checks via a documented, self-contained interface.

## License

MIT (code) · CC-BY 4.0 (docs)

Built by [Saloni](https://github.com/Hermit210) ([@Saloniii0987](https://x.com/Saloniii0987))




## Contact

Questions or feedback — open a GitHub issue on this repository.

## Contact & Community

For questions or issues, visit the GitHub repository at [https://github.com/Hermit210/Aegis-](https://github.com/Hermit210/Aegis-) or open a GitHub issue.

