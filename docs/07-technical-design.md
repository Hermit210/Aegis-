# 07 — Technical Design Document

## Language and Runtime

Go — matches `avalanche-cli`, `avalanchego`, and `hypersdk`, allowing reuse of existing P-Chain and RPC client patterns and keeping the installation model (`go install`) consistent with what builders already use.

## Layered Design

```
cmd/            → CLI entrypoints
internal/checks → check implementations, grouped by stage
internal/state  → read-only accessors for local config, RPC, P-Chain
internal/report → scoring, formatting, output rendering
```

## The Check Abstraction

Every validation — pre-flight or post-deploy — implements one interface:

```go
type Check interface {
    ID() string
    Stage() Stage // PreFlight | PostDeploy
    Run(ctx context.Context, s *state.Snapshot) Result
}

type Result struct {
    CheckID  string
    Severity Severity // Pass | Warning | Error
    Message  string
    Fix      string
}
```

This single abstraction is what maps every problem category in Document 02 to a concrete, independently testable, independently contributable unit of code — new checks are added without touching any other part of the system (see Document 13, Module Design).

## State Layer

- **Local configuration reader** — parses `avalanche-cli`'s local chain/config state. Tolerant of missing or ambiguous files by design, since detecting configuration ambiguity is itself a check target, not an error condition for the tool.
- **RPC client** — queries live chain health, chain ID, and block height.
- **P-Chain client** — queries validator set and subnet/L1 conversion status directly from the network, independent of any locally cached CLI state.

## Report Layer

Consolidates check results into a health score (see Document 10 for the scoring formula) and renders either human-readable terminal output or a documented JSON schema (Document 14) for CI consumption.
