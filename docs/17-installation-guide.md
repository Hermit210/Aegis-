# 17 — Installation Guide

## Requirements

- Go 1.22+ (if installing via `go install`), or no local dependency at all if using a prebuilt binary.
- An existing `avalanche-cli` installation and at least one defined chain, since this tool reads `avalanche-cli`'s local state rather than managing its own.

## Install via Go

```bash
go install github.com/<org>/avalanche-deploy-assurance/cmd@latest
```

## Install via Prebuilt Binary

```bash
curl -sSfL https://raw.githubusercontent.com/<org>/avalanche-deploy-assurance/main/scripts/install.sh | sh
```

## Verifying Installation

```bash
avalanche-deploy-assurance --version
```

No configuration is required for the default case — the tool auto-detects `avalanche-cli`'s local state directory and the most recently deployed chain.
