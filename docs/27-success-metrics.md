# 27 — Success Metrics

## Correctness Metrics

- Each of the six MVP checks correctly identifies its target problem category against a constructed fixture representing that scenario (Document 09, Tests) — a concrete, checkable acceptance criterion rather than a subjective "works well" claim.
- Zero checks issue a write, a signature, or a transaction at any point during testing or real usage — verified both by code review and, ideally, static analysis in CI (Document 20, item under expanded roadmap).

## Adoption Metrics

- At least 10 external builders run the tool against a real deployment during the Week 7–8 beta window.
- At least one documented instance of a builder catching a real (not fixture-only) deployment issue using the tool before the grant period ends.

## Release Metrics

- Public v1.0 release, tagged, with binaries published, before the end of Week 10.
- CI integration example used or referenced by at least one external repository within the beta window.

## Community Metrics

- At least one external contribution (a new check, a bug fix, or a documentation improvement) merged within the first release cycle, validating that the `Check` interface (Document 13) is genuinely low-friction to contribute to, not just designed to be.

## Honesty Note on Metrics

These are the metrics this proposal will report against in its milestone updates. Where a metric is not met, the milestone report will state that directly rather than reframing the target after the fact — consistent with the evidence-first approach this entire document set is built on.
