# Engineering Design Document

> **Rewritten to match the actual implementation.** The original version of
> this document described a Go binary that was never built. What was
> actually built is a Node/TypeScript backend, documented below. See
> `docs/20-critical-review.md` and the root README's Known Gaps section for
> the history of that divergence.

## 1. Architecture Overview

Language: **Node/TypeScript** (`type: "module"`, ES2022 target). Not Go —
the earlier plan assumed Go for parity with `avalanche-cli`/`avalanchego`,
but the actual build prioritized fast iteration on a stateless, read-only
RPC-querying service, where Go's advantages (shared P-Chain client types,
`go install` distribution) mattered less than they would for a tool that
also reads `avalanche-cli`'s own on-disk state — which, notably, this
implementation does **not** do (see §2 below).

Package layout, all under `backend/`:

```
src/
├── checks/     → the six check implementations + the compatibility table
├── score/      → health score computation
├── api/        → Fastify JSON API
├── cli/        → commander CLI
├── lib/        → shared RPC helpers (avalancheRpc.ts)
├── types/      → CheckTarget/CheckResult/Check interfaces + avalanchejs ambient types
└── verify.ts   → orchestrator: runs all checks, computes the score, shared by CLI + API
```

## 2. Modules

### 2.1 `src/lib/avalancheRpc.ts`

Unlike the original Go design's `internal/state` layer, there is **no
reader for `avalanche-cli`'s local state files** (`~/.avalanche-cli/*`,
`config.json`, `chain.json`, `subnet.json`). Every check queries live
RPC/P-Chain/Info/Health/Admin APIs directly; nothing reads the CLI's own
on-disk cache. This is a real scope difference from the original design,
not just a language swap — it means checks compare live chain state against
*what the caller explicitly tells Aegis to expect* (a NodeID, a genesis
file's declared chainId is no longer even needed — see genesis-consistency
below — a target chain-RPC URL, etc.), not against what `avalanche-cli`
itself most recently reported. `resolveNodeBaseUrl` / `resolveChainRpcUrl`
in this file resolve a target's node/chain endpoints from `CheckTarget`
fields (`nodeUrl`, `network`, `chainRpcUrl`, `blockchainId`) uniformly
across checks.

P-Chain reads (`platform.getCurrentValidators`, `platform.getTx`) go
through [`@avalabs/avalanchejs`](https://www.npmjs.com/package/@avalabs/avalanchejs)'s
`pvm.PVMApi`. Info/Health/Admin API calls and chain-RPC (`eth_*`) calls use
raw `fetch`-based JSON-RPC, since AvalancheJS doesn't wrap those APIs.

### 2.2 `src/checks/`

Each check implements a common interface (`src/types/check.ts`):

```ts
export type CheckStatus = 'pass' | 'fail' | 'warn' | 'unavailable'

export type CheckResult = {
  id: string
  name: string
  status: CheckStatus
  message: string
  details?: Record<string, unknown>
  durationMs: number
}

export type CheckTarget = {
  nodeUrl?: string
  network?: 'mainnet' | 'fuji' | 'local'
  chainRpcUrl?: string
  subnetId?: string
  blockchainId?: string
  nodeId?: string
  ports?: number[]
}

export type Check = {
  id: string
  name: string
  run(target: CheckTarget): Promise<CheckResult>
}
```

`unavailable` is a fourth status beyond the original design's three-tier
Pass/Warning/Error — added because a real requirement ("never fabricate a
passing result") needs a way to say "this check could not run" that is
distinct from "this check ran and found a problem." A check that can't
reach the API it needs (e.g. no `nodeUrl` given for a node-specific API)
returns `unavailable`, not a guessed `pass` or a punitive `fail`.

There is no stage split (`PreFlight` / `PostDeploy`) in the implementation
— all six checks run together in a single flat pass (`src/checks/index.ts`,
`runAllChecks`). The original design's two-stage, 3+3 check grouping was
not built; see §3 for what that means for CLI design, and the root
README's Known Gaps for the fact that the frontend still describes the
old two-stage model.

The six checks, by ID:

- `port-availability` — local socket test on Avalanche's default staking
  (9651) and API (9650) ports. No external API. Matches the original
  design's `port-availability` 1:1.
- `validator-registration` — `platform.getCurrentValidators`, checking a
  NodeID's presence, connection, weight, and uptime. Corresponds to the
  original design's `validator-set-diff`, but doesn't diff against any
  CLI-reported claim — there's nothing to diff against, since no CLI state
  is read. It reports the live P-Chain validator set state directly.
- `genesis-consistency` — sources genesis entirely on-chain. A blockchain's
  ID is the ID of the P-Chain `CreateChainTx` that created it, so
  `platform.getTx` on that ID returns the genesis JSON submitted at chain
  creation (base64-encoded in the tx's `genesisData` field). That's
  compared against what the live chain currently reports via `eth_chainId`.
  No local genesis file is read — a bigger scope difference from the
  original design's "on-chain genesis vs. local genesis.json" comparison.
  Deliberately scoped to `config.chainId` only, not a full genesis hash
  re-derivation (would require reimplementing block-header RLP encoding +
  Keccak hashing — real EVM client internals, not attempted without
  near-certainty of correctness).
- `network-state` — two independent halves: the node's Health API
  (`/ext/health`) and direct chain-RPC reachability (`eth_blockNumber`).
  Corresponds to the original design's `network-status-diff`, again without
  a CLI-claim to diff against.
- `version-compatibility` — `info.getNodeVersion`'s `rpcProtocolVersion`
  against subnet-evm's own published `compatibility.json`. Corresponds to
  `rpcchainvm-compat` in the original design.
- `config-validation` — `admin.getConfig` checked against a small,
  project-owned set of expected keys (no canonical schema is published).
  Corresponds to `config-resolution` in the original design, but reads the
  Admin API directly rather than resolving CLI flags/config-file precedence
  locally (again: no CLI state reading).

### 2.3 `src/score/computeHealthScore.ts`

Weighted health score, 0.0–1.0, not the original design's simple
`Pass=1/Warning=0.5/Error=0` average. Weights (sum to 1.0):

| Check | Weight | Why |
|---|---|---|
| genesis-consistency | 0.30 | Hardest failure to recover from; the check no other tool covers |
| validator-registration | 0.20 | A validator silently missing/disconnected means the deploy isn't actually securing anything |
| network-state | 0.20 | An unhealthy node or unreachable chain RPC means nothing else in the report can be trusted as current |
| version-compatibility | 0.15 | Real risk, but well-documented with a clear fix |
| config-validation | 0.10 | Usually a misconfiguration to fix, not evidence the chain is broken |
| port-availability | 0.05 | Almost always transient and trivially fixable |

pass = full credit, warn = half credit, fail = zero credit.
`unavailable` results are excluded from both the numerator and the weight
total and the remaining weights renormalized — a score reflects only what
actually ran. Every `unavailable` result is listed in the report's
`skipped` array with its reason, so nothing is silently dropped. If nothing
could run, `score` is `null`, not `0` (a `0` would misleadingly imply
everything failed rather than nothing ran).

Two renderers: human-readable terminal (CLI default, color/icon-coded by
status) and `--json` (CLI) / the JSON API's native response — both backed
by the same `VerifyReport` object from `src/verify.ts`, so they can't drift
apart the way separately-implemented renderers could.

## 3. CLI Design

```
aegis verify [nodeUrl] [options]
```

A single flat command, not the original design's `preflight` / `verify` /
`doctor` three-command split — there's no stage distinction in the
implementation to split on (§2.2). If a pre-flight/post-deploy distinction
is wanted later, it would need to be built as a filter over which of the
six checks run, not as separately-implemented commands, since all six
share the same `verify()` orchestrator today.

Exit code: `1` if any check result is `fail`, `0` otherwise (an
`unavailable` result is not treated as a failure for exit-code purposes).

## 4. Configuration

No config file. The original design's `.deploy-assurance.yaml` (or any
equivalent) was not built — every `CheckTarget` field comes from CLI flags
(or the JSON API's POST body) explicitly, each run. There is also no
auto-detection of "the most recently deployed chain," since there's no
`avalanche-cli` local state to detect it from.

## 5. Error Handling & Logging

Checks are isolated by construction: each `Check.run()` is independently
`await`ed inside `Promise.all` (`runAllChecks`), and every check's own
try/catch converts a thrown error into an `unavailable` `CheckResult`
rather than letting it propagate and abort the others. No `recover()`
equivalent is needed since there's no shared mutable state between checks.
No structured logging framework is used — the CLI writes directly to
stdout; the API uses Fastify's built-in (disabled by default,
`logger: false`) logger.

## 6. Report Generation & Health Scoring

Score is a genuinely weighted computation (§2.3), not the original design's
"deliberately simple, explicitly provisional" flat average — the ASSUMPTION
label from the original doc no longer applies as written, but the
underlying caution still does: `docs/20-critical-review.md` §4 flagged the
weights as unvalidated against real usage, and that's still true here; only
the reasoning is now documented per-weight rather than absent.

## 7. Repair Suggestion Engine

**Not built.** No check returns a `Fix:` string or links to a remediation
command — `CheckResult` has no `fix` field. `message` describes what was
found, nothing more. This is a real scope gap versus the original design,
not a naming difference; worth deciding whether it's still wanted.

## 8. Extensibility

New checks are added by implementing the `Check` interface, adding the
file to `src/checks/`, and registering it in `ALL_CHECKS` in
`src/checks/index.ts`. A weight must also be added to `DEFAULT_WEIGHTS` in
`src/score/computeHealthScore.ts`, or the check runs but never affects the
score (its result would just be included in `results` with weight 0 -
effectively invisible to `score`, though still visible per-check). This
two-file requirement (register + weight) is a slightly bigger contribution
surface than the original design's single-file `registry.go` — no
resulting build failure protects against forgetting the weight, so PR
review is where this to catch.
