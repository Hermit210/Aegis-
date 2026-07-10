# 26 — Milestone Plan

**Week 0 (pre-grant, unpaid):** Validate the core assumptions underlying this proposal — confirm current `avalanche-cli` behavior against each problem category in Document 02, confirm the differentiation claims in Document 23 by reviewing `avalanche-deploy`'s health-check implementation directly, and confirm the version-compatibility data source for `pkg/compat`. This is the highest-leverage risk-reduction step available and is completed before any funded work begins.

**Weeks 1–3 (Milestone 1):** Repository scaffold (Document 09), `Check` interface and registry (Document 13), CI pipeline. Implement and test all three pre-flight checks. **Deliverable:** working `preflight` command.

**Weeks 4–6 (Milestone 2):** Implement `state/rpcclient` and `state/pchainclient`. Implement and test all three post-deploy checks, prioritizing `validator-verification` mid-milestone (not last) given it is the highest-value, highest-risk check to get right. **Deliverable:** working `verify` command.

**Weeks 7–8 (Milestone 3):** Report generation — health scoring, text and JSON renderers, schema validation (Document 14). Wire the `doctor` command. Recruit and run a beta with 5–10 real builders; incorporate feedback, fix any false positives/negatives found. **Deliverable:** working `doctor` command, beta feedback incorporated.

**Weeks 9–10 (Milestone 4):** Finalize documentation (README, usage/installation guides, contributor guide). Tag and publish v1.0. Publish a beta feedback summary and grant milestone report. **Deliverable:** public v1.0 release.

## Deliverables Summary

| Milestone | Weeks | Deliverable |
|---|---|---|
| M1 | 1–3 | `preflight` command |
| M2 | 4–6 | `verify` command |
| M3 | 7–8 | `doctor` command + beta feedback incorporated |
| M4 | 9–10 | Public v1.0 release, full documentation, grant report |
