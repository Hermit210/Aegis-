# Technical Specification

> **Rewritten to match the actual implementation.** The original version of
> this document described `preflight`/`verify`/`doctor` commands, a
> `.deploy-assurance.yaml` config file, and a `chain`/`stage`/`toolVersion`
> JSON schema, none of which was built. What follows is the real CLI, real
> JSON API, and real output shapes, as implemented in `backend/`.

## 1. Command

There is one command, not three:

```
aegis verify [nodeUrl] [options]
```

Runs all six checks (§2.2 of Document 03) in a single flat pass — there is
no separate `preflight` or `doctor` command, and no stage argument. `[nodeUrl]`
is a positional shorthand for `--node-url`.

### Flags

| Flag | Description |
|---|---|
| `--node-url <url>` | AvalancheGo node base URL, for Info/Health/Admin API checks |
| `--network <network>` | `mainnet` \| `fuji` \| `local` — used for public P-Chain checks when no `nodeUrl` is given |
| `--node-id <nodeId>` | NodeID to look up in the validator set |
| `--subnet-id <subnetId>` | Subnet ID to scope validator/health checks to |
| `--blockchain-id <id>` | Blockchain ID, for genesis consistency / network state |
| `--chain-rpc-url <url>` | The target chain's own RPC URL, for genesis consistency / network state |
| `--ports <ports>` | Comma-separated ports to check for availability |
| `--json` | Output the full report as JSON instead of a human-readable summary |

There is no `--chain <name>` flag (nothing to resolve a name against — no
local `avalanche-cli` state is read), no `--config <path>` (no config file
exists, §4), and no `-v` verbose flag (no structured logging layer, per
Document 03 §5).

### Example: human-readable output (real, captured against live Fuji)

```
Aegis verification report
Target: {"network":"fuji","nodeId":"NodeID-...","blockchainId":"...","chainRpcUrl":"..."}

✓ Port availability — All 2 checked port(s) are free: 9651, 9650.
✓ Validator registration — NodeID-... is registered and connected (uptime 100.0000%).
✓ Genesis consistency — Live chain's chainId (43113) matches the chainId declared in its on-chain genesis-creation transaction. Genesis block hash currently reported is 0x31ce...ca96b (informational — not independently re-derived from genesisData).
✓ Network state — chain RPC reachable.
- AvalancheGo ↔ VM compatibility — No nodeUrl specified. The Info API is node-specific and not reachable via the public API server.
- Config resolution — No nodeUrl specified. The Admin API is node-specific and not reachable via the public API server.

Health score: 1.00
```

Colors: green `✓` (pass), yellow `!` (warn), red `✗` (fail), gray `-`
(unavailable). Not the original design's `[PASS]`/`[WARNING]`/`[ERROR]`
bracket-prefix format, and there is no `Fix:` line under any result —
Document 03 §7 covers why (no repair-suggestion engine was built).

Exit code: `1` if any result's `status` is `fail`, `0` otherwise. There is
no third exit code for warnings — the original design's `0`/`1`/`2` mapping
(pass / warning-only / error) does not exist; a `warn`-only run exits `0`.

## 2. JSON API

Fastify server, `backend/src/api/server.ts`. Two routes:

- `GET /health` → `{ "ok": true }` (server liveness, unrelated to the
  network-state check's use of the term).
- `POST /verify` → runs all six checks against the `CheckTarget` in the
  request body, returns a `VerifyReport`.

```bash
curl -X POST localhost:8787/verify -H 'content-type: application/json' \
  -d '{"network":"fuji","nodeId":"NodeID-..."}'
```

### `CheckTarget` (request body / CLI flags, `src/types/check.ts`)

```ts
type CheckTarget = {
  nodeUrl?: string
  network?: 'mainnet' | 'fuji' | 'local'
  chainRpcUrl?: string
  subnetId?: string
  blockchainId?: string
  nodeId?: string
  ports?: number[]
}
```

### `VerifyReport` (response body, `src/verify.ts`)

```json
{
  "target": { "network": "fuji", "nodeId": "NodeID-..." },
  "results": [
    {
      "id": "port-availability",
      "name": "Port availability",
      "status": "pass",
      "message": "All 2 checked port(s) are free: 9651, 9650.",
      "details": { "ports": [9651, 9650], "taken": [] },
      "durationMs": 3
    }
  ],
  "score": 0.85,
  "skipped": [
    { "id": "network-state", "reason": "No nodeUrl (for the Health API) and no chain RPC target..." }
  ],
  "timestamp": "2026-08-11T14:00:00.000Z"
}
```

Not the original design's `{chain, stage, toolVersion, healthScore,
summary: {pass, warning, error}, results: [{checkId, stage, severity,
message, fix}]}` shape. Key differences: `status` (not `severity`) is one
of four values including `unavailable` (not three); no `stage` field
anywhere, since checks aren't grouped into stages; `score` can be `null`
(not just a number) when nothing could run; `skipped` is a new top-level
array with no equivalent in the original schema; no `fix` field on results
(Document 03 §7); no `toolVersion` field.

CLI (`--json`) and the API return the exact same `VerifyReport` shape —
both call the same `verify()` function in `src/verify.ts`.

## 3. Configuration File

**None.** The original design's `.deploy-assurance.yaml` was not built.
Every `CheckTarget` field is passed explicitly per invocation, via CLI
flags or the API's JSON body.

## 4. Supported Environments

- **Fuji testnet** — live-tested. Port availability, validator
  registration, and genesis consistency are integration-tested against
  real Fuji P-Chain and C-Chain infrastructure (`npm run test:integration`
  in `backend/`).
- **Your own node** (`--node-url`, any network including mainnet or a
  local network) — unlocks network-state's Health-API half,
  version-compatibility, and config-validation, none of which are exposed
  on Avalanche's public API server. Not live-tested against a real node as
  part of this project's own test suite (would require standing one up);
  each of those checks' request/response handling is unit-tested against
  mocked responses instead.
- **Mainnet** via `--network mainnet` — same code path as Fuji for the
  checks that support a public-network shortcut (validator registration,
  genesis consistency's P-Chain half), not separately tested against real
  mainnet infrastructure as part of this project.

## 5. Non-Goals

Unchanged from the original design and still true of the actual
implementation:

- No transaction signing or submission, ever.
- No modification of any local state — this implementation additionally
  never *reads* `avalanche-cli` local state either (Document 03 §2.1), a
  stronger form of the original's "no modification" non-goal.
- No WebSocket API, no on-chain oracle (see root README's roadmap — both
  explicitly deferred).
