# Developer Documentation

> **Rewritten to match the actual implementation.** The original version of
> this document described `go install`/prebuilt-binary installation and a
> `preflight`/`verify`/`doctor` three-command CLI, none of which was built.
> What follows is how to actually install and use the real backend in
> `backend/`.

## Installation

Not published to npm yet — build from source:

```bash
git clone https://github.com/Hermit210/Aegis-.git
cd Aegis-/backend
npm install
npm run build
```

This produces `dist/`, with `dist/cli/index.js` runnable directly
(`package.json`'s `bin` field points here, so once published this would be
`npx @aegis/backend verify ...` or a global `aegis` command — not yet
published, so for now invoke the built file directly, or skip the build
step with `npm run dev:cli -- verify ...`).

**Requires Node.js >=20** (bumped from an earlier >=18 requirement — a
dependency of the P-Chain client, `@avalabs/avalanchejs`, requires it).

No dependency on any specific `avalanche-cli` version, and — unlike the
original design's plan — no dependency on `avalanche-cli` having run at
all: this tool never reads `avalanche-cli`'s local state files. It only
needs a target to check (a NodeID, a blockchain ID, an RPC URL, or a node
URL), supplied explicitly via CLI flags each run.

## Quick Start

```bash
# Public Fuji data only — no node of your own required
node dist/cli/index.js verify --network fuji --node-id NodeID-...

# Full six-check run against your own node (unlocks Info/Health/Admin-API checks)
node dist/cli/index.js verify --node-url http://localhost:9650 --node-id NodeID-...

# Machine-readable
node dist/cli/index.js verify --network fuji --node-id NodeID-... --json

# JSON API instead of the CLI
PORT=8787 node dist/api/server.js
curl -X POST localhost:8787/verify -H 'content-type: application/json' \
  -d '{"network":"fuji","nodeId":"NodeID-..."}'
```

There is no `preflight`/`doctor` split and no `--chain <name>` shortcut —
see `docs/04-technical-specification.md` §1 for the full real flag
reference and JSON schema.

## Configuration

**None.** No `.deploy-assurance.yaml` or equivalent exists — every target
is specified explicitly via CLI flags (or the API's JSON body) on each
invocation.

## Example: CI Integration

```yaml
# Adapted from .github/workflows/aegis-verify.yml.example in this repo
- name: Verify Avalanche L1 deployment
  run: |
    node dist/cli/index.js verify --network fuji --node-id NodeID-... --json > report.json
    cat report.json
- name: Enforce health score threshold
  run: |
    SCORE=$(node -e "console.log(JSON.parse(require('fs').readFileSync('report.json')).score ?? 0)")
    node -e "process.exit(Number('$SCORE') >= 0.8 ? 0 : 1)"
```

The exit code from `verify` itself is `1` only if a check actually `fail`s
(not on `unavailable` results) — for CI gating on the health score
specifically (which accounts for partial/warn results too), check `score`
in the JSON output as shown above, per the real example workflow.

## Example Output

Real output, captured against live Fuji testnet:

```
Aegis verification report
Target: {"network":"fuji","nodeId":"NodeID-...","blockchainId":"...","chainRpcUrl":"..."}

✓ Port availability — All 2 checked port(s) are free: 9651, 9650.
✓ Validator registration — NodeID-... is registered and connected (uptime 100.0000%).
✓ Genesis consistency — Live chain's chainId (43113) matches the chainId declared in its on-chain genesis-creation transaction. ...
✓ Network state — chain RPC reachable.
- AvalancheGo ↔ VM compatibility — No nodeUrl specified. The Info API is node-specific and not reachable via the public API server.
- Config resolution — No nodeUrl specified. The Admin API is node-specific and not reachable via the public API server.

Health score: 1.00
```

Green `✓` = pass, yellow `!` = warn, red `✗` = fail, gray `-` =
unavailable. No `Fix:` line under any result — no repair-suggestion engine
was built (see `docs/03-engineering-design.md` §7); a check's `message`
explains what was found and nothing more.

## FAQ

**Does this tool require my private key or ledger?**
No. Every check is read-only against public RPC/P-Chain data (or your own
node's APIs, if you point it at one). It never touches keys, and unlike
the original design, it doesn't even read `avalanche-cli`'s local
non-secret config files — only live network data plus whatever you pass on
the command line.

**Does this replace `avalanche-cli`?**
No. It's an independent, read-only diagnostic layer. All actual deploys and
transactions still go through `avalanche-cli` (or whatever tool you use);
this only reads.

**What if a check reports a problem but I believe my deploy is actually
fine?**
File an issue with the `--json` output attached.

**Does it work on mainnet?**
`--network mainnet` uses the same code path as Fuji for checks that
support the public-network shortcut, but mainnet hasn't been separately
integration-tested the way Fuji has (see
`docs/04-technical-specification.md` §4) — treat it as untested rather than
either "definitely fine" or "definitely broken."

**Why do some checks say `unavailable` against the public network?**
Three of the six checks (network-state's Health-API half, version
compatibility, config resolution) need AvalancheGo's Info/Health/Admin
APIs, which are **not exposed on Avalanche's public API server** — that's
a platform design choice, not a bug here. Point Aegis at your own node
(`--node-url`) to unlock them.
