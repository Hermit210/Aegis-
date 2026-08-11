# Aegis Backend

The real verification engine behind [Avalanche Deploy Assurance](../README.md)
(this package's own name and CLI binary are `aegis` — see the root repo
README's Known Gaps section for the project-naming inconsistency that hasn't
been resolved yet): six independent checks against live Avalanche
infrastructure, a weighted 0.0–1.0 health score, a CLI, and a JSON API. No
mocked results — every check either returns a real pass/fail/warn, or
honestly reports `unavailable` when the API it needs isn't reachable.

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
| Genesis consistency | `--blockchain-id` + `--network`/`--node-url` (P-Chain), plus `--chain-rpc-url` or `--node-url`+`--blockchain-id` (chain RPC) — no local file needed | real Fuji P-Chain + C-Chain |
| Network state | chain-RPC half: `--chain-rpc-url` (public) or `--node-url`+`--blockchain-id`; Health-API half: `--node-url` (your own node) | chain-RPC reachability live-tested against Fuji C-Chain; Health API half still mocked only — needs a real node |
| Version compatibility | `--node-url` (your own node) | compatibility data verified against real subnet-evm compatibility.json; the check itself is mocked-only in tests — needs a real node to try live end-to-end |
| Config resolution | `--node-url` with `--api-admin-enabled=true` | mocked only — needs a real node to try live |

"Genesis consistency" sources genesis entirely on-chain — no local genesis
file needed. A blockchain's ID is the ID of the P-Chain transaction that
created it, so `platform.getTx` on that ID returns the exact genesis JSON
submitted at chain creation (base64-encoded in the tx's `genesisData`
field). That's compared against what the live chain currently reports. It's
intentionally scoped down from full genesis re-verification: fully
re-deriving a genesis block hash means reimplementing block-header RLP
encoding + Keccak hashing (real EVM client internals), so this compares
`config.chainId` specifically and surfaces the live genesis block hash as
informational context. See `src/checks/genesisConsistency.ts` for the full
reasoning, and its live-fetched verification of the `platform.getTx`
response shape against real Fuji data.

"Version compatibility" table (`src/checks/rpcChainVmCompatibility.ts`) is
sourced from subnet-evm's own published `compatibility.json` (real,
canonical, machine-readable — see the file for the source URL and fetch
date), mapping AvalancheGo's rpcProtocolVersion to compatible subnet-evm
versions. Covers subnet-evm specifically, the VM this project's
genesis-consistency check targets; other VMs would need their own published
compatibility feed to extend this.

## SDK usage

P-Chain reads (`platform.getCurrentValidators`, `platform.getTx`) go through
[`@avalabs/avalanchejs`](https://www.npmjs.com/package/@avalabs/avalanchejs)'s
`pvm.PVMApi` rather than hand-rolled JSON-RPC. Info/Health/Admin API calls and
chain-RPC (`eth_*`) calls stay on raw `fetch` (`src/lib/avalancheRpc.ts`) —
AvalancheJS is a P/X/C-Chain transaction/query SDK, it doesn't wrap those
other APIs at all, so there's nothing to switch there. **Requires Node
>=20** (the SDK's own engines requirement — bumped from the previous >=18).

Note: the package's published `.d.ts` files use extensionless relative
specifiers (`export * from './vms'`) that don't resolve under this
project's `moduleResolution: "NodeNext"` — a real upstream packaging bug
(confirmed via `tsc --traceResolution`), not a local misconfiguration.
Worked around with a minimal ambient module declaration in
`src/types/avalanchejs.d.ts`, scoped to only the methods actually used here,
typed against real captured Fuji responses rather than guessed.

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
