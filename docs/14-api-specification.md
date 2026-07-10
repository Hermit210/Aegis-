# 14 — API Specification

## Command Output — Human-Readable (default)

```
Pre-Flight Checks — mychain

[PASS]    version-compatibility   AvalancheGo and VM plugin versions are compatible
[WARNING] config-validation       Multiple configuration sources detected;
                                   explicit --config flag value will be used
[PASS]    port-availability       Target port is available

Result: 2 passed, 1 warning, 0 errors — safe to deploy
```

```
Post-Deploy Verification — mychain

[ERROR]   validator-verification    Configured validator set does not match
                                     live P-Chain-reported validator set.
                                     Fix: confirm validator registration
                                     transactions have finalized; re-run
                                     `avalanche blockchain addValidator`
                                     if any are missing.
[PASS]    network-state-verification RPC responding and reachable
[PASS]    genesis-consistency        On-chain genesis matches local genesis.json

Result: 2 passed, 0 warnings, 1 error — deployment not fully verified
```

## Command Output — JSON

```json
{
  "chain": "mychain",
  "stage": "doctor",
  "timestamp": "2026-07-10T12:00:00Z",
  "toolVersion": "0.1.0",
  "healthScore": 0.83,
  "summary": { "pass": 4, "warning": 1, "error": 1 },
  "results": [
    {
      "checkId": "validator-verification",
      "stage": "post-deploy",
      "severity": "error",
      "message": "Configured validator set does not match live P-Chain-reported validator set.",
      "fix": "Confirm validator registration transactions have finalized; re-run avalanche blockchain addValidator if any are missing."
    }
  ]
}
```

## Schema Fields

| Field | Type | Description |
|---|---|---|
| `chain` | string | Target chain name |
| `stage` | string | `preflight`, `verify`, or `doctor` |
| `timestamp` | ISO 8601 string | Time the report was generated |
| `toolVersion` | string | Semantic version of the tool that produced the report |
| `healthScore` | float, 0.0–1.0 | See Document 10 for the computation and its stated limitations |
| `summary` | object | Counts of pass/warning/error |
| `results` | array | One entry per executed check |

## Configuration File Schema

```yaml
chain: mychain
rpcUrl: http://127.0.0.1:9650
expectedValidatorCount: 5
skipChecks:
  - port-availability
```

## Versioning Policy

Any change to this schema is a minor version bump at minimum, with `toolVersion` embedded in every JSON report so CI consumers can detect a schema change deliberately rather than discovering it as a silent breakage.
