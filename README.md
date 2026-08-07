# Avalanche Deploy Assurance

**Independent, read-only verification for `avalanche-cli` deployments.**

`avalanche-cli` can report a deployment as successful while the underlying chain
disagrees — validators that were "added" don't show up in the validator set,
config files get silently ignored, ports get reassigned after an upgrade. This
site makes the case for a verification layer that never trusts a tool's own
status report: it independently re-reads on-chain and RPC state and diffs it
against what was actually configured.

This repository is the marketing/demo site for that idea — a Next.js app that
explains the problem, walks through the proposed three-stage verification flow
(pre-flight → deploy → post-deploy verify), and includes an interactive,
simulated dashboard so the workflow is easy to picture before the underlying
CLI tool exists.

## Table of Contents

- [The Problem](#the-problem)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## The Problem

Four documented `avalanche-cli` issues drive the site's messaging:

| Issue | Problem | Impact |
|---|---|---|
| [#2594](https://github.com/ava-labs/avalanche-cli/issues/2594) | CLI reports deploy success while local network status disagrees | Chain appears broken when it isn't, or vice versa |
| [#2526](https://github.com/ava-labs/avalanche-cli/issues/2526) | `addValidator` transaction succeeds but the validator set query comes back empty | Fees charged, validator never actually added |
| [#2535](https://github.com/ava-labs/avalanche-cli/issues/2535) | `config.json` silently ignored, ports randomize after the Etna upgrade | Port mismatch, clients can't reconnect |
| [#2458](https://github.com/ava-labs/avalanche-cli/issues/2458) | A Ledger signature failure forces a full re-run and re-charges subnet fees | Builder loses funds with no recovery path |

The proposed fix is a **read-only, three-stage verification layer**:

1. **Pre-flight** — checks version compatibility, config resolution, and port
   availability before a deployment is attempted.
2. **Deploy** — your standard `avalanche-cli` commands, unmodified.
3. **Post-deploy verify** — independently re-reads live RPC and P-Chain state
   and diffs it against configured intent, rather than trusting any tool's
   self-reported status.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion) for animation
- [Lucide React](https://lucide.dev) for icons

## Getting Started

**Prerequisites:** Node.js 18+ and npm 9+.

```bash
git clone https://github.com/Hermit210/Aegis-.git
cd Aegis-
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The page hot-reloads as
you edit files under `src/`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with hot reload (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project Structure

Each nav item is its own route — the homepage is a focused landing page
(Hero, interactive demo, CTA), and the Problem/Solution/Features/
Architecture/Docs/Roadmap content each live on their own page.

```
src/
├── app/
│   ├── page.tsx          # Homepage — Hero + Demo + CTA
│   ├── layout.tsx        # Root layout, metadata
│   ├── globals.css       # Design tokens (colors, base styles)
│   ├── problem/page.tsx
│   ├── solution/page.tsx
│   ├── features/page.tsx
│   ├── architecture/page.tsx
│   ├── docs/page.tsx
│   └── roadmap/page.tsx
└── components/
    ├── Navigation.tsx    # Sticky header
    ├── Footer.tsx        # Footer with links
    └── sections/
        ├── Hero.tsx           # Headline + animated terminal preview
        ├── Problem.tsx        # The four GitHub issues above — /problem
        ├── Solution.tsx       # Before/after workflow comparison — /solution
        ├── Features.tsx       # Capability grid — /features
        ├── Demo.tsx           # Interactive simulated verification run — on homepage
        ├── Architecture.tsx   # Four-layer system design — /architecture
        ├── Roadmap.tsx        # Delivery timeline — /roadmap
        ├── OpenSource.tsx     # OSS commitments, how to contribute — /docs
        └── CTA.tsx            # Install commands, final call to action
```

## Design System

Colors are defined once as CSS custom properties in `src/app/globals.css` and
consumed everywhere through Tailwind's `@theme inline` mapping — change a
value there and it propagates across the whole site.

**Bold Black & Maroon**

| Token | Value | Use |
|---|---|---|
| `--background` | `#0A0808` | Page background |
| `--surface` | `#150F10` | Alternating section background |
| `--card` | `#1E1516` | Card backgrounds |
| `--primary` | `#9E1B32` | Brand color — buttons, links, accents |
| `--secondary` | `#C4283F` | Hover states, gradient partner |
| `--highlight` | `#FF4667` | Emphasis text, code accents |
| `--foreground` | `#F5EDEE` | Primary text |
| `--text-secondary` | `#C9B8BB` | Secondary text |
| `--text-tertiary` | `#8F7A7D` | Meta/tertiary text |
| `--border` | `#2E2225` | Borders and dividers |

Semantic colors (`--success`, `--warning`, `--error`, `--info`) are defined
separately and kept distinct from the brand palette so status messaging stays
unambiguous.

> **Note on the reset rule:** the global `* { margin: 0; padding: 0; }` reset
> in `globals.css` lives inside `@layer base`. Per the CSS Cascade Layers
> spec, an *unlayered* rule would silently beat every Tailwind utility
> (`px-*`, `py-*`, etc.) regardless of specificity — keep it layered if you
> touch this file.

## Deployment

### Vercel (recommended)

```bash
vercel deploy
```

Or connect this repository to Vercel for automatic deployments on push to `main`.

### Self-hosted

```bash
npm run build
npm run start
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

## Contributing

This is a frontend-only site — there's no backend and no real CLI in this
repository yet, so most contributions will be to copy, design, or new
sections. To propose a change:

1. Fork the repo and create a branch.
2. Keep changes to the design system flowing through the CSS tokens in
   `globals.css` rather than hardcoding colors in components.
3. Run `npm run lint` before opening a PR.
4. Open a PR describing what changed and why.

## License

[MIT](./LICENSE) — permissive, no strings attached.

---

Built for the Avalanche L1 builder community.
