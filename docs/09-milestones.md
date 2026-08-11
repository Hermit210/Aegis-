# Milestones — Week by Week

**Week 0 (pre-commitment, unpaid, before grant funds are requested):**
Verify against the current `avalanche-cli` release whether issues #2594, #2526, #2535, and #2458 are still reproducible. This is the single highest-leverage risk-reduction step available and must happen before Week 1 work is billed — see Document 20, Critical Review.

**Week 1:** Repo scaffold (Document 06 structure), CLI skeleton (cobra), `Check` interface, registry pattern, CI pipeline (test + lint) running on an empty check set.

**Week 2:** `state/cliconfig` reader — parses `config.json`/`chain.json`/`subnet.json` against real fixtures captured from Week 0's reproduction attempts. `rpcchainvm-compat` check implemented against the published compatibility table.

**Week 3:** `config-resolution` and `port-availability` checks implemented. Pre-flight stage feature-complete. Unit tests against fixtures. Deliverable: `avalanche-deploy-assurance preflight` usable end-to-end.

**Week 4:** `state/rpcclient` and `state/pchainclient` built. `network-status-diff` check implemented, tested against a reproduction of #2594.

**Week 5:** `validator-set-diff` check implemented, tested against a reproduction of #2526. This is the highest-value single check in the project — prioritized mid-project rather than last, so there's runway to fix it if the reproduction proves harder than expected.

**Week 6:** `genesis-consistency` check implemented. Post-deploy stage feature-complete. Deliverable: `avalanche-deploy-assurance verify` usable end-to-end.

**Week 7:** Report generation — health scoring, text renderer, JSON renderer + schema validation. `doctor` command wiring both stages. Begin beta outreach (Superteam/Team1/Discord channels) — recruit 5–10 real builders.

**Week 8:** Incorporate beta feedback. Fix false positives/negatives found by real usage (expect at least one — see Document 12). CI templates (`examples/ci-github-actions.yml`) finalized.

**Week 9:** Documentation pass — README, developer docs, contributor guide finalized. Draft PR against Avalanche Builder Hub troubleshooting docs referencing the tool for the RPCChainVM and config-resolution errors it already documents.

**Week 10:** v0.1 public release (tagged, binaries via goreleaser), grant milestone report, submit Builder Hub docs PR, publish beta feedback summary.

## Deliverables Summary by Milestone

| Milestone | Weeks | Concrete Deliverable |
|---|---|---|
| M1 | 1–3 | Working `preflight` command |
| M2 | 4–6 | Working `verify` command |
| M3 | 7–8 | Working `doctor` command + beta feedback incorporated |
| M4 | 9–10 | Public v0.1 release, docs, Builder Hub PR, grant report |
