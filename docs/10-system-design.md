# 10 — System Design

## End-to-End Flow

```mermaid
flowchart TD
    A[Builder defines chain spec] --> B[avalanche blockchain create]
    B --> C{deploy-assurance preflight}
    C -->|Pass/Warning| D[avalanche blockchain deploy]
    C -->|Error| E[Fix configuration before deploying]
    D --> F{deploy-assurance verify}
    F -->|Confirmed healthy| G[Deployment Confidence Report: green]
    F -->|Issues found| H[Deployment Confidence Report: fix guidance]
    H --> D
```

## Module Interaction

```mermaid
flowchart LR
    subgraph CLI Layer
        cmd[cmd/*.go]
    end
    subgraph Checks Layer
        reg[checks/registry.go]
        pf[preflight checks]
        pd[postdeploy checks]
    end
    subgraph State Layer
        cliconf[state/cliconfig]
        rpc[state/rpcclient]
        pchain[state/pchainclient]
    end
    subgraph Report Layer
        score[report/scoring]
        render[report/render]
    end

    cmd --> reg --> pf & pd
    pf --> cliconf & rpc
    pd --> cliconf & rpc & pchain
    pf & pd --> score --> render --> cmd
```

## Sequence — `doctor`

```mermaid
sequenceDiagram
    participant U as Builder
    participant T as deploy-assurance
    participant CLIState as Local CLI state
    participant RPC as Live RPC
    participant PChain as P-Chain API

    U->>T: doctor --chain mychain
    T->>CLIState: read local config
    T->>RPC: query health, chainId, blockHeight
    T->>PChain: query validator set, conversion status
    T->>T: diff intended vs. actual state
    T->>T: compute health score
    T-->>U: report (text/JSON) + exit code
```

## Health Score Computation

Documented explicitly rather than left opaque: each check contributes `1.0` (Pass), `0.5` (Warning), or `0.0` (Error) to a simple average, displayed alongside — never instead of — the raw pass/warning/error counts. This formula is stated as a first version, explicitly subject to revision based on real usage feedback (Document 19, MVP Scope), not presented as a finished, validated metric.

## Data Flow Guarantee

No component reads from or writes to chain state or CLI configuration except as an explicit, documented read. This is enforced structurally: the `state` layer package has no write methods at all — there is no code path by which a check could mutate anything, by construction rather than by convention.
