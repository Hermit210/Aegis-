# 08 — Engineering Architecture

## Principles

1. **Independent verification over trust.** Every post-deploy check re-derives ground truth from the live network rather than trusting any tool's self-reported status, including this toolkit's own prior runs.
2. **Isolation of failure.** A single check erroring internally (e.g., an RPC timeout) must never be rendered identically to a genuine on-chain inconsistency. These are different failure classes and are kept visually and structurally distinct in the report layer.
3. **Statelessness.** Every invocation is a fresh check pass with no persistent daemon or background process in the initial release — a deliberate simplicity choice, revisited only if justified by real usage (Document 20).
4. **Extensibility as the primary design constraint.** The `Check` interface exists specifically so that closing a newly identified problem category doesn't require redesigning the system — it requires writing one new file and one registry entry.

## Component Boundaries

The state layer, check layer, and report layer are strictly separated: checks never format output, and the report layer never queries external state directly. This keeps each layer independently testable and keeps the report format changeable without touching check logic, or vice versa.

## Cross-Cutting Concerns

- **Logging**: structured, `log/slog`, verbosity-gated.
- **Error handling**: `recover()`-wrapped per check, per the isolation principle above.
- **Configuration**: zero-config default with an optional YAML override file for CI environments (Document 12, CLI Design).
