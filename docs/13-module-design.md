# 13 — Module Design

## The `Check` Interface as the Central Module Boundary

```go
type Check interface {
    ID() string
    Stage() Stage
    Run(ctx context.Context, s *state.Snapshot) Result
}
```

This is the single most important design decision in the project. Every problem category identified in Document 02 maps to one or more implementations of this interface, and every future problem category the community identifies maps to a new implementation, added the same way, without touching the CLI layer, the state layer, or the report layer.

## Module Registration

```go
// internal/checks/registry.go
func AllChecks() []Check {
    return []Check{
        preflight.VersionCompatibility{},
        preflight.ConfigValidation{},
        preflight.PortAvailability{},
        postdeploy.ValidatorVerification{},
        postdeploy.NetworkStateVerification{},
        postdeploy.GenesisConsistency{},
    }
}
```

Adding a check is a two-file change: the new check implementation, and one new line here.

## Module Independence Guarantee

No check may depend on the result of another check. Each `Run` call receives only the shared, read-only `state.Snapshot` and produces its own independent `Result`. This guarantees that checks can be run in parallel (a performance property) and, more importantly, that a bug in one check cannot corrupt or suppress the result of another — directly supporting the failure-isolation principle in Document 08.

## `state.Snapshot`

A single, immutable, read-only struct populated once per invocation by the state layer and passed to every check. This avoids each check independently re-querying the network, which would both be slower and risk checks observing slightly different states of a changing chain mid-run.

## Versioning Module Boundaries

The `pkg/compat` package (version compatibility data) is intentionally public and separately importable, since it is generically useful outside this tool — for instance, by other Avalanche tooling wanting a programmatic compatibility check without importing this project's CLI or check machinery.
