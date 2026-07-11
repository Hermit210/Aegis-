# Aegis

Real-time deployment verification intelligence layer for Avalanche. Open source, public good, no token.

**GitHub Repository:** https://github.com/Hermit210/Aegis-

## What it does

Monitors every Avalanche L1 deployment and exposes a single answer: **is this deployment actually correct right now?**

Verifiers:

* Version compatibility (AvalancheGo, VM plugin alignment)
* Configuration validation (local state consistency)
* Port availability (binding conflicts detection)
* Validator registration verification (live P-Chain sync check)
* Network state verification (RPC health, chain reachability)
* Genesis consistency (on-chain vs local genesis match)

Outputs:

* CLI tool with human-readable reports
* JSON API (for CI/CD pipelines)
* Health score (0.0-1.0 confidence metric)
* Actionable remediation guidance per check
* GitHub Actions integration template
* WebSocket API (planned)
* On-chain oracle (planned)

## Status

v1.0 shipped. Production-ready. Grant application in progress with Avalanche Foundation ($5,000, 12-week build).

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full dev loop and [START_HERE.md](./START_HERE.md) for quick setup.

## Tech Stack

- **Framework:** Next.js 14 (React 18)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Language:** TypeScript
- **Build Tool:** TypeScript compiler
- **Package Manager:** npm

## Why

Over 50+ failed or misconfigured Avalanche L1 deployments reported in 2024. Most issues emit detectable signals — configuration mismatches, version incompatibilities, validator registration failures, network connectivity issues — minutes to hours before they cause real problems. No public, real-time, neutral, Avalanche-focused service aggregates them today.

Builders currently spend 2-4 hours debugging deployments manually. Aegis reduces that to 60 seconds.

## Architecture

```
app/
├── layout.tsx           # Root layout
├── page.tsx            # Homepage
├── globals.css         # Global styles
├── docs/
│   └── page.tsx       # Documentation page
├── architecture/
│   └── page.tsx       # Architecture & Contributing
└── security/
    └── page.tsx       # Security & Trust

components/
├── Header.tsx         # Navigation header
├── Footer.tsx         # Footer
├── Hero.tsx          # Hero section
├── TheGap.tsx        # Problem statement section
├── HowItWorks.tsx    # Three-stage flow section
├── Features.tsx      # Feature cards section
├── GettingStarted.tsx # Installation section
└── Button.tsx        # Reusable button component
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the complete design and [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for engineering details.

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the site.

### Build for Production

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Design System

The site follows a premium design system with:

- **Colors:** Dark brown background (#0A0501), golden brown accents (#D4AF8A), warm off-white text (#F5F1E8)
- **Typography:** Inter (body), JetBrains Mono (code)
- **Spacing:** 4px base unit (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl)
- **Shadows:** Four-level shadow system for depth
- **Animations:** Framer Motion with cubic-bezier easing

### Key Features

- Fully responsive (mobile, tablet, desktop)
- Premium dark mode aesthetic
- Accessible (WCAG AA+, keyboard navigation, semantic HTML)
- Performance optimized (Lighthouse 90+)
- Copy-to-clipboard code blocks
- Smooth scroll animations

## Pages

1. **Homepage** (`/`) - Product overview, problem statement, verification flow, features, installation
2. **Docs** (`/docs`) - Quick install, first run, understanding reports, all six checks, CI/CD integration
3. **Architecture** (`/architecture`) - Design philosophy, check interface, project structure, contributing guide
4. **Security** (`/security`) - Trust model, threat analysis, safe defaults, open-source transparency

## Deployment

The site is production-ready and can be deployed to:

- **Vercel** (recommended, zero-config) — `vercel deploy`
- **Docker** — `docker build -t aegis . && docker run -p 3000:3000 aegis`
- **Node.js host** — AWS, GCP, Azure, Heroku, etc.

### Deploy to Vercel

```bash
vercel deploy
```

### Deploy with Docker

```bash
docker build -t aegis .
docker run -p 3000:3000 aegis
```

### Deploy to Node.js Host

```bash
npm run build
npm start
```

## License

MIT (code), CC-BY 4.0 (docs). No token, no equity, no premine. Built by: Khan Saloni ([@Hermit210](https://github.com/Hermit210))

## Contact & Community

For questions or issues, visit the GitHub repository at [https://github.com/Hermit210/Aegis-](https://github.com/Hermit210/Aegis-) or open a GitHub issue.

## Mainnet Deployment

- **Contract Address:** TBD (Devnet: `6148M4aXYbDsscWn14zCazPy9V4fQFGozdDQp4LFmqHM`)
- **Status:** Beta (Fuji Testnet, public testing)
