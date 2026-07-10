# Contributing to Avalanche Deploy Assurance

This project is early-stage and maintained part-time. Response times may be slower than a larger project — stated here honestly rather than implied otherwise.

## The Easiest Way to Contribute: A New Check

The `Check` interface (see [`docs/13-module-design.md`](./docs/13-module-design.md)) is designed so a new check is a self-contained, low-friction addition:

```go
type Check interface {
    ID() string
    Stage() Stage
    Run(ctx context.Context, s *state.Snapshot) Result
}
```

1. Implement the interface in `internal/checks/preflight/` or `internal/checks/postdeploy/`.
2. Register it in `internal/checks/registry.go` — one line.
3. Add a fixture-based unit test in `testdata/fixtures/` representing a real, plausible scenario — ideally tied to a genuine developer-experience problem you or someone else has actually encountered, not a synthetic edge case.
4. Ensure every non-passing result includes a concrete `Fix:` message — this is a hard requirement, not a suggestion (see [`docs/11-12-component-and-cli-design.md`](./docs/11-12-component-and-cli-design.md)).
5. Open a PR.

## Coding Standards

- Standard Go formatting (`gofmt`), enforced in CI.
- No check may write to chain state, sign a transaction, or write to local CLI configuration — a hard, structural boundary (see [`docs/21-22-security-and-risk.md`](./docs/21-22-security-and-risk.md)), not a style preference.
- Every check must isolate its own internal failures — no panics escaping to the top-level report (see [`docs/07-08-technical-design-and-architecture.md`](./docs/07-08-technical-design-and-architecture.md)).

## Branch Strategy

- `main` is always releasable.
- Feature branches (`check/<name>`, `fix/<issue>`), merged via squash-merge PR.
- Tags cut from `main` following semantic versioning.

## Reporting False Positives / Negatives

These are treated as priority-one bug reports, not general issues — please include `--json` output. See [`docs/21-22-security-and-risk.md`](./docs/21-22-security-and-risk.md) for why this category is prioritized.

## Code of Conduct

Standard respectful open-source collaboration norms apply. Disagreements about technical approach should be about the evidence and the code, not the person.
