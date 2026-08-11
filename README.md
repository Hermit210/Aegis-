# Avalanche Deploy Assurance

> Independent, read-only verification for Avalanche L1 deploys — six checks, a weighted health score, a CLI, and a JSON API, run directly against live RPC and P-Chain data instead of trusting any deploy tool's own status report. Plus the Next.js marketing/docs site that explains why.

`avalanche-cli` is the tool most Avalanche L1 builders use to create, deploy, and manage a chain. It entered maintenance mode in December 2025 — no new Ava Labs-built features, only security/critical fixes, external contributions welcomed. Meanwhile, open issues document a real pattern: the CLI sometimes reports a deploy or validator-add as successful when the underlying chain state disagrees.

| Issue | Problem | Impact |
|---|---|---|
| [#2594](https://github.com/ava-labs/avalanche-cli/issues/2594) | CLI reports deploy success while local network status disagrees | Chain appears broken when it isn't, or vice versa |
| [#2526](https://github.com/ava-labs/avalanche-cli/issues/2526) | `addValidator` transaction succeeds but the validator set query comes back empty | Fees charged, validator never actually added |
| [#2535](https://github.com/ava-labs/avalanche-cli/issues/2535) | `config.json` silently ignored, ports randomize after the Etna upgrade | Port mismatch, clients can't reconnect |
| [#2458](https://github.com/ava-labs/avalanche-cli/issues/2458) | A Ledger signature failure forces a full re-run and re-charges subnet fees | Builder loses funds with no recovery path |

This repo closes that gap without touching the CLI itself: it reads directly from the live RPC and P-Chain, never trusting a deploy tool's own status report as ground truth. Every check either returns a real pass/fail/warn or honestly reports `unavailable` when the data it needs isn't reachable — it never fabricates a passing result.

```bash
cd backend
npm install && npm run build
node dist/cli/index.js verify --network fuji --node-id <NodeID>
```

## This is a monorepo

Two things live here together, not as separate repos:

- **`backend/`** — the real verification engine (this README's main subject below): six checks, a health score, a CLI, and a JSON API. Node/TypeScript, not a Go binary — see [Known gaps](#known-gaps) for why some older design docs say otherwise.
- **`src/`** — the Next.js marketing/docs site (Tech Stack / Getting Started / Project Structure for *this* part are further down, under [The frontend](#the-frontend)).

## Status: this is real, working, and live-tested

Everything in `backend/` is implemented, not planned:

- **51 unit tests pass** (`npm test` inside `backend/` — fast, mocked, no network).
- **4 integration tests pass against real Fuji testnet infrastructure right now** (`npm run test:integration`) — genesis consistency and validator registration are verified against live P-Chain and C-Chain data, not fixtures.
- Typecheck and build are clean.
- The frontend (`src/`) is built and deployable, but **is not yet wired to the live backend** — its "six checks" section (`src/lib/checks.ts`) is static copy, and its check names don't match the real backend's check IDs (see [Known gaps](#known-gaps)). The homepage's interactive dashboard is a simulated demo, not a live call to `backend`'s `/verify` API.

## The six checks

| Check | What it does | What it needs | Live-tested against |
|---|---|---|---|
| **Port availability** | Local socket test on Avalanche's default staking (9651) and API (9650) ports | Nothing | Local sockets — always works |
| **Validator registration** | Queries `platform.getCurrentValidators` for a NodeID's registration, connection, uptime, and weight | `--network` (public P-Chain) or `--node-url` (your own node) | Real Fuji testnet data |
| **Genesis consistency** | Looks up the on-chain genesis-creation transaction (a blockchain's ID *is* the ID of the P-Chain `CreateChainTx` that created it) and compares its declared `chainId` against what the live chain currently reports — no local genesis file needed | `--blockchain-id` + `--network`/`--node-url` (P-Chain), plus `--chain-rpc-url` or `--node-url`+`--blockchain-id` (chain RPC) | Real Fuji P-Chain + C-Chain, full round trip |
| **Network state** | Two independent halves: the node's own Health API (`/ext/health`), and direct RPC reachability on the target chain (`eth_blockNumber`) | Chain-RPC half: `--chain-rpc-url` or `--node-url`+`--blockchain-id` (public-reachable); Health-API half: `--node-url` (your own node — not exposed on the public gateway) | Chain-RPC half live-tested against Fuji C-Chain; Health API half needs a real node to try live |
| **Version compatibility** | Compares a node's reported `rpcProtocolVersion` (`info.getNodeVersion`) against subnet-evm's own published `compatibility.json` | `--node-url` (Info API is node-specific, not on the public gateway) | Compatibility data sourced from real subnet-evm release data; the check itself needs a real node to try live end-to-end |
| **Config resolution** | Checks the Admin API's resolved config (`admin.getConfig`) for a handful of well-known flags — no canonical schema is published by Ava Labs, so this is a project-owned, intentionally narrow schema | `--node-url` with `--api-admin-enabled=true` (disabled by default even on your own node) | Needs a real node to try live |

Three checks (network state, version compatibility, config resolution) need Info/Health/Admin APIs that **AvalancheGo does not expose on the public API server** — that's a platform design decision, not a limitation of this tool. Point Aegis at your own node (`--node-url`) to unlock them. No check ever fabricates a pass: if the data it needs isn't reachable, it returns `unavailable` with a specific reason.

Full detail and design rationale for each check: [`backend/README.md`](./backend/README.md).

## Health score

A single 0.0–1.0 number, computed in `backend/src/score/computeHealthScore.ts`:

| Check | Weight | Why |
|---|---|---|
| Genesis consistency | 0.30 | Hardest failure to recover from; the check no other tool covers |
| Validator registration | 0.20 | A validator silently missing/disconnected means the deploy isn't actually securing anything, even if everything else looks fine |
| Network state | 0.20 | An unhealthy node or unreachable chain RPC means nothing else in the report can be trusted as current |
| Version compatibility | 0.15 | Real risk, but well-documented with a clear fix (upgrade one side) |
| Config resolution | 0.10 | Usually a misconfiguration to fix, not evidence the chain is broken; also the narrowest-scoped check |
| Port availability | 0.05 | Almost always transient and trivially fixable |

Scoring: pass = full credit, warn = half credit, fail = zero credit. A check that returns `unavailable` is excluded from both the numerator and the weight total — the remaining weights are renormalized across whatever actually ran, and every `unavailable` check is listed in the report's `skipped` array with its reason. A score never gets inflated by silently dropping checks the caller doesn't notice are missing.

## CLI

```bash
cd backend
node dist/cli/index.js verify [nodeUrl] [options]

  --node-url <url>          AvalancheGo node base URL, for Info/Health/Admin API checks
  --network <network>       mainnet | fuji | local — used for P-Chain checks when no nodeUrl is given
  --node-id <nodeId>        NodeID to look up in the validator set
  --subnet-id <subnetId>    Subnet ID to scope validator/health checks to
  --blockchain-id <id>      Blockchain ID, for genesis consistency / network state via nodeUrl
  --chain-rpc-url <url>     The chain's own RPC URL, for genesis consistency / network state
  --ports <ports>           Comma-separated ports to check for availability
  --json                    Output the full report as JSON instead of a human-readable summary
```

Exit code is `1` if any check returned `fail`, `0` otherwise (an `unavailable` check is not treated as failure).

```bash
# Public Fuji data only
node dist/cli/index.js verify --network fuji --node-id NodeID-... --json

# Against your own node — unlocks network-state / version-compatibility / config-resolution
node dist/cli/index.js verify --node-url http://localhost:9650 --node-id NodeID-...
```

## JSON API

```bash
cd backend
PORT=8787 node dist/api/server.js

curl -X POST localhost:8787/verify -H 'content-type: application/json' \
  -d '{"network":"fuji","nodeId":"<NodeID>"}'
```

Response shape (`VerifyReport`, `backend/src/verify.ts`):

```json
{
  "target": { "network": "fuji", "nodeId": "NodeID-..." },
  "results": [
    { "id": "port-availability", "name": "Port availability", "status": "pass", "message": "...", "details": {}, "durationMs": 3 }
  ],
  "score": 0.85,
  "skipped": [{ "id": "network-state", "reason": "No nodeUrl specified..." }],
  "timestamp": "2026-08-11T14:00:00.000Z"
}
```

CLI and API share the exact same `verify()` function so their output can never drift apart.

## Repository structure

```
avalanche-deploy-assurance-website/   # this repo
├── src/                              # Next.js frontend — see "The frontend" below
├── backend/                          # the real verification engine
│   ├── src/
│   │   ├── checks/                   # the six checks
│   │   ├── score/computeHealthScore.ts
│   │   ├── api/server.ts             # Fastify JSON API
│   │   ├── cli/index.ts              # commander CLI
│   │   ├── lib/avalancheRpc.ts       # shared RPC helpers
│   │   ├── types/                    # CheckTarget/CheckResult + avalanchejs ambient types
│   │   └── verify.ts                 # shared orchestrator (CLI + API both call this)
│   ├── test/                         # unit (mocked) + integration (live Fuji)
│   └── README.md                     # backend-specific documentation
├── .github/workflows/                # includes aegis-verify.yml.example — CI gate template
└── README.md                         # this file
```

## Testing the backend

```bash
cd backend
npm test                 # 51 tests, fast, mocked, no network — the default
npm run test:integration # 4 tests, hits real Fuji testnet infrastructure
npm run typecheck
```

## What it is not

- Not a fork or modification of `avalanche-cli`.
- Not a transaction signer — it never handles private keys, never signs, never submits transactions.
- Not a monitoring daemon — every run is a stateless, one-shot check pass.

## Known gaps

Tracked honestly rather than silently left for someone to discover:

- **Frontend isn't wired to the backend.** `src/lib/checks.ts` is static marketing copy, not a live call to `backend`'s `/verify`. Its check IDs and grouping (a `preflight`/`postdeploy` two-stage model) also don't match the real backend's flat six-check `verify()` run — e.g. the frontend's `vm-compat` is the backend's `version-compatibility`, `validator-set-verification` is `validator-registration`, `network-status-diff` is `network-state` (and doesn't actually diff against a CLI claim the way its copy describes).
- **Project naming is inconsistent.** The GitHub repo is `Aegis-`, the backend package is `@aegis/backend` with CLI binary `aegis`, but this file's own page title/metadata (`src/app/layout.tsx`) say "Avalanche Deploy Assurance," which is what this README uses. Not yet resolved which name is canonical.
- **Older design docs describing a different, unbuilt architecture exist outside this repository** — locally, on the machine this was developed on, there's a `docs/` folder (executive summary, engineering design, technical spec, repository structure, developer docs, and more) plus a root `README.md`, `CONTRIBUTING.md`, and `QUICKSTART.md` one directory above this repo. **None of that is tracked by this git repository or pushed to GitHub** — this repo's actual root has only ever contained what's listed under [Repository structure](#repository-structure) above. Some of those local-only docs describe a Go binary (`go install`), a three-command CLI (`preflight`/`verify`/`doctor`), a `.deploy-assurance.yaml` config file, and a check registry reading `avalanche-cli`'s own local state files — none of which was built. What's actually implemented is everything in `backend/` as documented in this README. Whether those local docs should be imported into this repo (and rewritten to match reality first) is an open decision.

## The frontend

**Tech stack:** [Next.js 16](https://nextjs.org) (App Router, Turbopack), [React 19](https://react.dev), TypeScript, [Tailwind CSS v4](https://tailwindcss.com), [Framer Motion](https://www.framer.com/motion), [Lucide React](https://lucide.dev).

**Getting started:**

```bash
git clone https://github.com/Hermit210/Aegis-.git
cd Aegis-
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Hot-reloads as you edit `src/`.

**Scripts:** `npm run dev` (hot reload), `npm run build` (production build), `npm run start` (serve production build), `npm run lint` (ESLint).

**Structure:** each nav item is its own route.

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
        ├── Demo.tsx           # Interactive SIMULATED verification run — on homepage, not wired to backend/
        ├── Architecture.tsx   # Four-layer system design — /architecture
        ├── Roadmap.tsx        # Delivery timeline — /roadmap
        ├── OpenSource.tsx     # OSS commitments, how to contribute — /docs
        └── CTA.tsx            # Install commands, final call to action
```

**Design system:** colors are defined once as CSS custom properties in `src/app/globals.css` and consumed everywhere through Tailwind's `@theme inline` mapping.

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

Semantic colors (`--success`, `--warning`, `--error`, `--info`) are defined separately, kept distinct from the brand palette so status messaging stays unambiguous.

> **Note on the reset rule:** the global `* { margin: 0; padding: 0; }` reset in `globals.css` lives inside `@layer base`. Per the CSS Cascade Layers spec, an *unlayered* rule would silently beat every Tailwind utility (`px-*`, `py-*`, etc.) regardless of specificity — keep it layered if you touch this file.

**Deployment:**

```bash
# Vercel (recommended) — connect this repo for automatic deploys on push to main, or:
vercel deploy

# Self-hosted
npm run build && npm run start
```

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

For the verification engine: new checks are the primary contribution surface — add a file to `backend/src/checks/`, register it in `backend/src/checks/index.ts`, and give it a weight in `backend/src/score/computeHealthScore.ts`. See [`backend/README.md`](./backend/README.md).

For the frontend: fork, branch, keep colors flowing through the CSS tokens in `globals.css` rather than hardcoding them in components, run `npm run lint` before opening a PR.

Wiring the homepage's simulated demo up to the real backend and reconciling `src/lib/checks.ts`'s check names with the backend's actual check IDs (see [Known gaps](#known-gaps)) are open, well-scoped contributions.

## License

MIT — see [`LICENSE`](./LICENSE).

---

Built for the Avalanche L1 builder community.
