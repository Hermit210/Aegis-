# Business Case

## Should It Remain Open Source?

Yes, unconditionally, for the grant period and by default beyond it. Reasoning:

1. **The problem is ecosystem infrastructure, not a product.** A diagnostics tool that builders can't trust to be free of hidden incentives (e.g., steering them toward a paid tier or a specific RPC provider) undermines its own core value proposition — being a neutral, independent verifier of what `avalanche-cli` reports.
2. **Grant funding and commercialization are structurally in tension for this category.** Team1's own grant framework is explicitly aimed at MVP-to-first-users, not extraction; a tool positioning itself as "the trust layer for deploys" that later paywalls core checks would damage the credibility the whole pitch depends on.
3. **Distribution depends on being embeddable in CI and docs without friction** (Document 09, Week 9 Builder Hub docs PR) — a closed or metered tool is a much harder sell for that kind of organic, docs-level adoption.

## How Should Maintenance Work?

- **During the grant period (Weeks 1–10):** solo-maintained, with maintenance capacity stated honestly in the README (Document 16) rather than implied to be more than it is.
- **Post-grant:** maintenance continues on a best-effort basis unless real adoption (Document 09 success metrics) justifies seeking a follow-on grant or Team1 Accelerator tier specifically for maintenance funding — this is a future decision point, not committed now.
- **Issue triage:** labeled by severity matching the tool's own `Severity` enum internally (bug reports about false positives/negatives get priority, per Document 12).

## How Should Contributors Join?

See Document 18 (Contributor Guide) for full detail. Summary: the `Check` interface (Document 03 §8) is the primary contribution surface — a new check is a self-contained PR that doesn't require understanding the rest of the codebase, which is the same "low blast radius, easy to review" property that made the rejected HyperSDK scheduler idea attractive as an upstream contribution, applied here to this project's own contributor experience instead.

## What This Project Deliberately Is Not

Not a business. Not a stepping stone to a token or a paid SaaS tier. This is stated explicitly, not left ambiguous, because Team1 Mini Grants target early-stage builder trust-building, and an ambiguous monetization story would undercut the grant application's credibility more than clarifying it costs.
