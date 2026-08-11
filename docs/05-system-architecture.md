# System Architecture

## High-Level Flow

```mermaid
flowchart TD
    A[Builder runs avalanche-cli] -->|blockchain create| B[Local chain config]
    B --> C{deploy-assurance preflight}
    C -->|Pass/Warning| D[avalanche blockchain deploy]
    C -->|Error| E[Fix issues before deploying]
    D --> F{deploy-assurance verify}
    F -->|All checks pass| G[Deployment confirmed healthy]
    F -->|Errors found| H[Actionable fix report]
    H --> D
```

## Module Interaction

```mermaid
flowchart LR
    subgraph CLI Layer
        cmd[cmd/*.go - cobra commands]
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
        render[report/render - text + json]
    end

    cmd --> reg
    reg --> pf
    reg --> pd
    pf --> cliconf
    pf --> rpc
    pd --> cliconf
    pd --> rpc
    pd --> pchain
    pf --> score
    pd --> score
    score --> render
    render --> cmd
```

## Sequence Diagram — `doctor` Command

```mermaid
sequenceDiagram
    participant U as Builder
    participant T as deploy-assurance
    participant CLIState as ~/.avalanche-cli state
    participant RPC as Local/Remote RPC
    participant PChain as P-Chain API

    U->>T: avalanche-deploy-assurance doctor --chain mychain
    T->>CLIState: read config.json, chain.json, subnet.json
    T->>RPC: query health, chainId, blockHeight
    T->>PChain: query validator set, L1 conversion status
    T->>T: diff CLI-reported state vs live state
    T->>T: compute health score
    T-->>U: render report (text or JSON), exit code
```

## Deployment Flow — Where Each Check Fires

```mermaid
sequenceDiagram
    participant U as Builder
    participant CLI as avalanche-cli
    participant T as deploy-assurance

    U->>T: preflight
    T-->>U: version/config/port report
    U->>CLI: blockchain deploy
    CLI-->>U: "Deployment Results" table
    U->>T: verify
    T->>CLI: read locally cached deploy result
    T->>T: independently query live chain
    T-->>U: agreement/disagreement report
```

## Data Flow Notes

- No component in this architecture writes to chain state or to `avalanche-cli`'s own files. All arrows into `CLIState`, `RPC`, and `PChain` in the sequence diagrams are reads.
- The tool has no persistent daemon or background process in v1 — every invocation is a fresh, stateless check run. This is a deliberate simplicity choice for MVP; a watch/daemon mode is a V2 candidate (Document 11), not v1 scope.
