# 11 — Component Design

## `internal/state/cliconfig`

Responsible for locating and parsing local `avalanche-cli` chain and configuration state. Designed to be tolerant of missing, partial, or ambiguous configuration — detecting and reporting that ambiguity is the job of the `config-validation` check, not something this component should fail on internally.

## `internal/state/rpcclient`

A thin, minimal client for querying a live chain's health endpoint, chain ID, and current block height. No write methods exist on this type.

## `internal/state/pchainclient`

Queries the P-Chain directly for validator set membership and subnet/L1 conversion status. This is the component that makes independent verification possible — it never reads from the CLI's local cache of "what I believe I did," only from the network's own record of what actually happened.

## `internal/checks/preflight/*`

Three initial components:
- `version_compatibility` — cross-references installed AvalancheGo and VM plugin versions against known-compatible combinations.
- `config_validation` — surfaces which configuration source(s) actually resolve for a given invocation, addressing Problem Category 3.
- `port_availability` — detects port conflicts or unexpected binding behavior before deploy.

## `internal/checks/postdeploy/*`

Three initial components:
- `validator_verification` — compares intended validator registration against the live P-Chain-reported validator set, addressing Problem Category 2.
- `network_state_verification` — independently confirms RPC liveness and cross-references it against CLI-reported deployment status, addressing Problem Category 1.
- `genesis_consistency` — confirms the live chain's genesis matches the locally configured genesis.

## `internal/report`

Consumes a slice of `Result` values from all executed checks and produces both the health score and the two supported output formats (text, JSON). Contains no knowledge of any specific check's internals — a genuinely new check type requires zero changes here.
