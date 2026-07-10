# 09 — Repository Structure

```
avalanche-deploy-assurance/
├── cmd/
│   ├── root.go
│   ├── preflight.go
│   ├── verify.go
│   └── doctor.go
├── internal/
│   ├── checks/
│   │   ├── check.go
│   │   ├── registry.go
│   │   ├── preflight/
│   │   │   ├── version_compatibility.go
│   │   │   ├── config_validation.go
│   │   │   └── port_availability.go
│   │   └── postdeploy/
│   │       ├── validator_verification.go
│   │       ├── network_state_verification.go
│   │       └── genesis_consistency.go
│   ├── state/
│   │   ├── cliconfig/
│   │   ├── rpcclient/
│   │   └── pchainclient/
│   └── report/
│       ├── scoring.go
│       ├── render_text.go
│       └── render_json.go
├── pkg/
│   └── compat/              # public: version compatibility data, importable by others
├── testdata/
│   ├── fixtures/
│   └── golden/
├── docs/                     # this document set
├── examples/
│   ├── ci-github-actions.yml
│   └── sample-config.deploy-assurance.yaml
├── .github/workflows/
│   ├── test.yml
│   ├── lint.yml
│   └── release.yml
├── go.mod
├── go.sum
├── Makefile
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── CHANGELOG.md
```

## Naming Conventions

Package names are lowercase, no underscores, matching Go and Avalanche ecosystem convention. Check IDs are kebab-case and match their source filename, so every line of report output is directly traceable to the code that produced it.

## Tests

Every check ships with a unit test against fixtures in `testdata/fixtures/`, constructed to represent each problem category from Document 02 as a concrete, reproducible scenario — not tied to any specific historical bug report, but to the general condition (e.g., a fixture representing "validator registration transaction present locally, absent from live P-Chain query" for the validator-verification check).

## CI

`test.yml` runs the full suite on push/PR; `lint.yml` runs `golangci-lint` and `govulncheck`; `release.yml` builds and publishes tagged binaries via `goreleaser`.
