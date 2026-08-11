# V2 — Future Features (Realistic Only)

Everything below is explicitly **contingent on v1 adoption evidence**, not committed. Each item states the evidence threshold that would justify building it.

## 1. `avalanche blockchain deploy` wrapper mode
Instead of running `preflight`/`verify` as separate manual steps, wrap the actual CLI invocation so pre- and post-checks run automatically around it. **Threshold to build:** requester feedback from at least 3 v1 beta users asking for this specifically (already a natural v1 beta question to ask directly, per Document 09 Week 7).

## 2. Support for `avalanche-network-runner` and `avalanche-deploy` (Terraform) flows
Extends the same check core (Document 03 §2.1's `state` abstractions are already designed to be deploy-path-agnostic) to production infra deploys. **Threshold to build:** evidence that production-infra teams, not just early-stage local/Fuji builders, are hitting the same class of state-desync bugs — not yet verified, would need its own issue-tracker pass against `avalanche-deploy`.

## 3. CI-native GitHub App / Action (not just a template)
A published GitHub Action rather than a copy-pasted YAML template, for lower-friction CI adoption. **Threshold to build:** the example CI template (v1) getting organic reuse — measurable via repo search/adoption, not assumed.

## 4. Watch/daemon mode for ongoing chain health
Moves from "is my deploy correct" to "is my chain still healthy," overlapping with `avalanche-monitoring`'s territory (Document 13). **Threshold to build:** explicit evidence this isn't redundant with existing node-monitoring tools — a real risk flagged honestly rather than assumed away, since `avalanche-monitoring` already exists for this problem class.

## 5. Smarter repair-suggestion engine
Move from the static fix-text mapping (v1) to suggestions that incorporate the specific diff detected (e.g., naming exactly which validator entries are missing, not just "validator set mismatch detected"). This is a natural incremental improvement to existing checks, not a new capability, and is the most likely V2 item to actually get built regardless of other adoption signals.

## 6. Upstream contribution to `avalanche-cli`
**[ASSUMPTION — VERIFY, high uncertainty]** Only pursued if a direct scoping conversation with Ava Labs maintainers (Document 09 Week 9 docs PR is the first contact point) indicates appetite for it despite maintenance-mode status. Not assumed, not promised in this proposal.

## What Is Deliberately Not on This List

A hosted SaaS version, a token, or any monetization path — see Document 14 (Business Case) for why this stays open source and non-commercial for the grant period and beyond by default.
