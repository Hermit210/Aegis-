# 05 — Whitepaper

## Abstract

Avalanche's L1 deployment workflow is well-served at the execution layer (`avalanche-cli`), the infrastructure layer (`avalanche-deploy`, `avalanche-network-runner`), and the long-running operations layer (`avalanche-monitoring`, explorer-based validator tracking). No existing tool independently verifies the specific handoff between "a deployment was executed" and "a deployment is operationally correct." This whitepaper describes that gap, why it is structural rather than incidental, and proposes Avalanche Deploy Assurance as the missing verification layer.

## Introduction

Deploying a sovereign Avalanche L1 involves a sequence of distinct technical steps: chain specification, VM plugin installation, subnet and chain creation transactions, validator manager configuration, and — for sovereign L1s — conversion and validator registration against the P-Chain. `avalanche-cli` abstracts this sequence into a small number of high-level commands. Abstraction reduces the number of steps a builder must think about; it does not, by itself, guarantee that the resulting state matches intent. Verifying that match is currently the builder's own manual responsibility.

## Background: The Current Deployment Workflow

1. **Specification** — a builder defines a chain's genesis, VM choice, and validator management approach locally.
2. **Deployment** — the CLI installs the correct plugin version, provisions or joins a network, and submits the relevant chain-creation and (for sovereign L1s) conversion transactions.
3. **Validator registration** — the builder submits transactions to register validators against the deployed validator manager.
4. **Operation** — the builder is expected to independently confirm the chain is healthy and correctly configured, typically through manual RPC calls, explorer lookups, or trial and error.

Step 4 is where the tooling gap lives. Nothing in steps 1–3 independently confirms its own correctness before handing off to the builder.

## The Problem, By Category

See Document 02 for the full breakdown. In summary: unverified deployment success, unverified validator registration, late-surfacing configuration errors, fragmented debugging across multiple tools, absence of a unified confidence signal, and absence of guided remediation. These are workflow-completeness gaps, present regardless of which specific `avalanche-cli` version a builder is running, which is why this project is scoped around them rather than around any particular release's bug list.

## Design Philosophy

1. **Verify independently, never modify.** The toolkit reads from live network state and local configuration; it never alters CLI behavior, chain state, or signs anything.
2. **Read-only by default, always.** This is a security posture (Document 21) and a trust posture — a verification tool must not itself be a source of risk to the thing it verifies.
3. **Report disagreement clearly, not just failure.** When the toolkit's independent check of live state disagrees with what a deployment was configured to produce, that disagreement is the primary signal the report is built around — not a generic pass/fail.

## Architecture

Three composable stages — pre-flight, post-deploy verification, and reporting — built on a shared core that reads local configuration state, live RPC state, and P-Chain state. Full detail in Documents 07, 08, and 10.

## Security

No private key handling, no transaction signing, no write access to chain state or CLI configuration. Full threat model in Document 21.

## Developer Experience

A single CLI binary, a zero-configuration default path for the common local/testnet case, machine-readable JSON output for CI integration, and human-readable terminal output with concrete next-step guidance for every failing check.

## Future Roadmap

Deployment-pipeline integration, expanded check coverage contributed by the community, and — contingent on real adoption, not promised — exploration of upstream integration with `avalanche-cli` itself. Full detail in Document 20.

## Benefits

Faster, more trustworthy first deployments; a single artifact builders can point to as evidence their chain is correctly configured; and a verification layer that complements rather than duplicates every existing piece of Avalanche deployment and monitoring tooling.

## Conclusion

Avalanche has strong tooling at every layer except the one connecting deployment to operational confidence. This project is scoped specifically to close that one gap, built around durable, structural developer-experience problems rather than any single tool's current bug list.
