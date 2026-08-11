# Aegis Backend

The real verification engine behind the [Aegis marketing site](../README.md):
six independent checks against live Avalanche infrastructure, a weighted
0.0–1.0 health score, a CLI, and a JSON API. No mocked results — every check
either returns a real pass/fail/warn, or honestly reports `unavailable` when
the API it needs isn't reachable.

## Status: which checks actually work right now

Two of Avalanche's node-level APIs (Info, Health) are **confirmed not
available on the public API server** — they only work against a node you
point Aegis at directly. Admin API is additionally disabled by default even
on your own node. This isn't a limitation of Aegis; it's how AvalancheGo is
designed. So:

| Check | Needs | Live-tested against |
|---|---|---|
| Port availability | nothing | local sockets (always works) |
| Validator registration | `--network` (public) or `--node-url` | real Fuji testnet data |
| Genesis consistency | local genesis file + `--chain-rpc-url` (public for chains with a public RPC) | real Fuji C-Chain |
| Network state | `--node-url` (your own node) | mocked only — needs a real node to try live |
| Version compatibility | `--node-url` (your own node) | mocked only — needs a real node to try live |
| Config resolution | `--node-url` with `--api-admin-enabled=true` | mocked only — needs a real node to try live |

"Genesis consistency" is intentionally scoped down from full on-chain genesis
verification: fully re-deriving a genesis block hash means reimplementing
block-header RLP encoding + Keccak hashing (real EVM client internals).
Instead it compares the local genesis file's `config.chainId` against what
the live chain reports, and surfaces the live genesis block hash as
informational context. See `src/checks/genesisConsistency.ts` for the full
reasoning.

"Version compatibility" ships with an intentionally near-empty compatibility
table (`src/checks/rpcChainVmCompatibility.ts`) rather than fabricated
version-number mappings — no canonical machine-readable feed exists (Ava Labs
publishes compatibility as release-note prose), so this needs to be populated
from the actual AvalancheGo release notes for the versions you care about.

## Quick start

```bash
npm install
npm run build

# CLI — human-readable report
node dist/cli/index.js verify --network fuji --node-id <NodeID>

# CLI — machine-readable
node dist/cli/index.js verify --network fuji --node-id <NodeID> --json

# Against your own node (unlocks network-state / version-compatibility / config-resolution)
node dist/cli/index.js verify --node-url http://localhost:9650 --node-id <NodeID>

# JSON API
PORT=8787 node dist/api/server.js
curl -X POST localhost:8787/verify -H 'content-type: application/json' \
  -d '{"network":"fuji","nodeId":"<NodeID>"}'
```

Or without building first: `npm run dev:cli -- verify ...` / `npm run dev:api`.

## Health score

Weighted sum documented in `src/score/computeHealthScore.ts`: genesis
mismatch (0.30) weighs heaviest since it's the hardest failure to recover
from and the check no other tool covers; port conflicts (0.05) weigh
lightest since they're almost always transient. `unavailable` checks are
excluded and the remaining weights renormalized — a score reflects only what
actually ran, and the `skipped` array in every report says what didn't and
why, so nothing is silently dropped.

## Testing

```bash
npm test               # fast, mocked, no network — the default
npm run test:integration   # hits real Fuji testnet infrastructure
npm run typecheck
```

## Not built yet (by design)

Per the project's own non-goals: no WebSocket API, no on-chain oracle. Both
are explicitly deferred until this CLI/API is validated by real users — see
the root README's roadmap.

## CI

`.github/workflows/aegis-verify.yml.example` at the repo root is a template
for gating a deploy pipeline on the health score. Copy it into your own
repo's `.github/workflows/` and adjust the target.
