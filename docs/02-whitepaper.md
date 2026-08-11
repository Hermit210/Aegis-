# Avalanche Deploy Assurance — Whitepaper

## Abstract

Avalanche L1 deployment currently relies on `avalanche-cli` reporting its own success or failure. This whitepaper documents a verified gap between what the CLI reports and what is actually true on-chain, backed by open GitHub issues, and proposes an independent verification layer — Avalanche Deploy Assurance — that performs pre-flight compatibility checks, wraps the deploy flow, and independently re-verifies post-deploy state against the live network rather than trusting CLI output alone.

## Introduction

Avalanche's L1 model (post-Etna, sovereign L1s via ACP-77) shifted significant deployment complexity onto builders: validator manager contracts, signature aggregators, RPCChainVM plugin versioning, and P-Chain conversion transactions are now steps every L1 builder executes directly, most commonly through `avalanche-cli`. The CLI abstracts this into a small number of commands (`blockchain create`, `blockchain deploy`, `blockchain addValidator`), but abstraction is not the same as verification: a command completing without a thrown error is not proof that the resulting chain is in the state the builder intended.

## Background: The Current Avalanche Deployment Workflow

1. `avalanche blockchain create` — defines a chain spec locally (genesis, VM choice, validator management type).
2. `avalanche blockchain deploy` — installs the appropriate VM plugin version, boots a local/Fuji/mainnet network or joins an existing one, issues `CreateSubnetTx` and `CreateChainTx`, and for sovereign L1s, `ConvertSubnetToL1Tx`.
3. `avalanche blockchain addValidator` — issues validator registration transactions against the validator manager contract.
4. Ongoing operation — the builder is expected to independently verify RPC availability, validator set correctness, and chain health, generally by hand or via third-party explorers (Avascan, VScout) that are designed for production validator monitoring, not fresh-deploy verification.

Steps 2–3 are where the CLI's own status reporting and the actual network state have been shown to diverge.

## Problems, With Evidence

| # | Problem | Evidence |
|---|---|---|
| 1 | RPCChainVM protocol version mismatch between AvalancheGo and VM plugin | Official Builder Hub troubleshooting doc and compatibility table exist specifically because this recurs |
| 2 | Deploy reports "flawless" completion, but `LOCAL NETWORK` status shows `No` | avalanche-cli issue #2594 |
| 3 | Validator-add transaction logs success; validator set query returns empty | avalanche-cli issue #2526 |
| 4 | `config.json` silently ignored; ports randomize post-Etna, breaking reconnection; reporter states docs are unclear or outdated | avalanche-cli issue #2535 |
| 5 | Ledger signature failure forces a full re-run, re-charging `CreateSubnetTx` fees, with no resume path | avalanche-cli issue #2458 |
| 6 | CLI itself is in maintenance mode: no new Ava Labs-built features, only security/critical fixes | avalanche-cli release notes, December 2025 |

## Design Philosophy

Three principles guide the architecture:

1. **Independent verification, not modification.** The tool never modifies `avalanche-cli`'s deploy logic or signing flow. It observes CLI output and independently queries RPC/P-Chain endpoints. This keeps the tool safe to run against any CLI version and avoids the blast-radius concerns that would make a fork or patch harder to trust.
2. **Read-only by default.** No stage of pre-flight, deploy-wrap, or post-deploy verification issues a transaction or modifies chain state. This is a deliberate security and trust boundary (see Document 12, Security).
3. **Fail loud, not silent.** Where the CLI currently reports ambiguous or misleading success (issues #2594, #2526), the tool's job is specifically to disagree with the CLI's own report when the underlying chain state doesn't match, and say so clearly.

## Architecture (Summary — full detail in Document 05)

Three independent, composable stages sharing a common state-diffing core:

```
avalanche-deploy-assurance preflight   → compatibility + config checks, before deploy
avalanche-deploy-assurance verify      → post-deploy state diff, after deploy
avalanche-deploy-assurance doctor      → runs both + produces a unified report
```

Each stage is a pure read operation against: (a) local CLI-generated config/state files, (b) the local or remote RPC endpoint, (c) the P-Chain API for validator set and subnet/L1 conversion status.

## Security

Threat model, false-positive/negative handling, and safe-default behavior are detailed in Document 12. In summary: because the tool is read-only and never handles private keys or signs transactions, its worst-case failure mode is an incorrect report, not a loss of funds or unauthorized action — a materially smaller attack surface than the CLI itself.

## Developer Experience

Single binary, zero required configuration for the common case (auto-detects `~/.avalanche-cli` state), machine-readable JSON output alongside human-readable terminal output, and a non-zero exit code on any failed check for CI integration.

## Future Roadmap

Post-MVP, contingent on real adoption evidence rather than assumed: CI/CD integration templates, a `blockchain deploy` pre/post wrapper mode, and — only if usage data supports it — exploration of whether the checks belong upstream in `avalanche-cli` itself. See Document 11 (V2) for the honestly-scoped version of this list.

## Benefits

- Reduces first-deploy failure debugging time for builders who currently have no way to distinguish "the CLI lied to me" from "I misconfigured something."
- Closes a gap Ava Labs has explicitly signaled it will not close internally (maintenance mode).
- Zero incremental maintenance burden for Ava Labs, since it ships independently.

## Conclusion

Avalanche Deploy Assurance is not a hypothesis about a possible future problem. It is a response to five specific, dated, reproducible GitHub issues and one explicit maintainer policy change, scoped to what a single developer can credibly ship and verify in 8–10 weeks.
