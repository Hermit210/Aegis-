# 02 — Problem Statement

This document describes the developer-experience problems this project addresses, framed as durable problem categories rather than point-in-time bug reports. Each category is a structural gap in the current workflow, not a defect that will be patched away by the next `avalanche-cli` release.

## Category 1: Deployment Success Is Reported, Not Verified

`avalanche-cli` reports whether the commands it issued completed without error. It does not independently confirm that the resulting on-chain state matches what the builder intended. A command completing is evidence that a transaction was submitted and accepted by the mempool — it is not evidence that the chain is now in the configured state. Builders currently close this gap by manually checking RPC responses, block explorers, and CLI status tables by hand, every time, with no standard procedure for doing so.

## Category 2: Validator Registration Requires Manual Re-Verification

Adding a validator to an L1 is a multi-step process (transaction submission, signature aggregation, P-Chain finalization). A builder currently has no automated way to confirm that a validator they believe they registered is actually present and active in the live validator set. This has to be checked by hand against the P-Chain, using a separate tool or a manual API call, every time.

## Category 3: Configuration Mistakes Surface Late

Version incompatibility between AvalancheGo and a VM plugin, incorrect or ambiguous local configuration files, and port conflicts are all currently discoverable primarily *after* a deployment attempt fails or behaves unexpectedly — not before. There is no pre-flight step that validates the builder's environment and configuration against known-compatible combinations before a deploy is attempted.

## Category 4: Debugging Requires Manually Correlating Multiple Sources of Truth

When something does go wrong, there is no single place a builder can look. Diagnosing an issue currently means moving between CLI output, local config files, node logs, RPC responses, and documentation, manually cross-referencing them to form a hypothesis about what actually happened. This is slow even for experienced builders and is a significant barrier for newer ones.

## Category 5: No Unified Deployment Confidence Signal

Even when a deployment is actually correct, there is no single artifact a builder can point to that says so — no health score, no consolidated pass/fail report, nothing to attach to a grant milestone report, a hackathon submission, or a CI pipeline as evidence the chain is in the state it's supposed to be in.

## Category 6: No Guided Remediation

When a check does fail — manually or otherwise — the builder is generally on their own to figure out the fix. There is no standard mapping from "this is what's wrong" to "this is what you should do about it" built into the existing tooling.

## What These Categories Have in Common

None of these are consensus-layer bugs, and none are specific to a single `avalanche-cli` release. They are gaps in workflow completeness: Avalanche's tooling handles deployment execution, infrastructure provisioning, and long-running node monitoring well, but nothing currently owns the moment in between — confirming that a specific deployment did what it was supposed to do. That is the layer this project is built to occupy.
