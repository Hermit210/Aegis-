# 12 — CLI Design

## Commands

```
avalanche-deploy-assurance preflight [--chain <name>] [--json]
avalanche-deploy-assurance verify    [--chain <name>] [--json]
avalanche-deploy-assurance doctor    [--chain <name>] [--json]
```

`doctor` runs both stages and is the primary entrypoint for most usage; `preflight` and `verify` exist independently for CI pipelines or workflows that only need one stage.

## Flags

| Flag | Description |
|---|---|
| `--chain <name>` | Target chain, as known to `avalanche-cli`. Defaults to the most recently deployed chain. |
| `--json` | Machine-readable output (schema in Document 14). |
| `--config <path>` | Explicit path to an optional `.deploy-assurance.yaml` override file. |
| `--rpc-url <url>` | Override RPC auto-detection, for CI or remote deployments. |
| `-v` | Verbose logging. |

## Exit Codes

`0` — all checks passed. `1` — one or more warnings, no errors. `2` — one or more errors. This mapping is deliberate: it allows a CI pipeline to gate on errors while still surfacing warnings without failing the build.

## Output Design Principle

Every non-passing check includes a `Fix:` line. This is a hard requirement for any check merged into the project (Document 29, Contributing) — a check that can detect a problem but offers no guidance toward resolving it only partially closes Problem Category 6 (no guided remediation).
