# 18 — Usage Guide

## Basic Workflow

```bash
avalanche blockchain create mychain
avalanche-deploy-assurance preflight --chain mychain
avalanche blockchain deploy mychain --local
avalanche-deploy-assurance verify --chain mychain
```

## Combined Workflow

```bash
avalanche-deploy-assurance doctor --chain mychain
```

## CI Usage

```yaml
- name: Verify Avalanche L1 deployment
  run: |
    avalanche blockchain deploy mychain --local
    avalanche-deploy-assurance doctor --chain mychain --json > report.json
  # Non-zero exit code on Error severity fails the job automatically.
```

## Interpreting a Report

- **PASS** — the check found the live state consistent with configured intent.
- **WARNING** — an ambiguity or non-ideal condition that isn't necessarily wrong, but worth reviewing (e.g., multiple configuration sources resolving to the same effective value).
- **ERROR** — the live network state disagrees with configured intent. Every ERROR includes a `Fix:` line.

## Skipping Checks

```yaml
# .deploy-assurance.yaml
skipChecks:
  - port-availability
```

Useful for CI environments where a check's assumptions (e.g., local port binding) don't apply to the deployment target.
