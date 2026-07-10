# 20 — Future Roadmap

Every item below is contingent on evidence gathered after v1 ships — none are committed as part of the grant deliverable.

## 1. Deployment Pipeline Integration

Wrap `avalanche blockchain deploy` directly so pre-flight and post-deploy checks run automatically around it, rather than as separate manual steps. **Trigger to build:** direct feedback from early adopters requesting this specifically.

## 2. Support for Additional Deployment Paths

Extend the check core to `avalanche-network-runner` and `avalanche-deploy` (Terraform-based) flows. The state-layer abstractions (Document 07) are already designed to be deployment-path-agnostic, so this is an additive change, not a redesign. **Trigger to build:** evidence that production infrastructure teams, not just early-stage local/testnet builders, hit the same class of verification gap.

## 3. Native CI Integration (Published GitHub Action)

Rather than a copy-pasted YAML template, a maintained, versioned GitHub Action. **Trigger to build:** organic reuse of the v1 template, measured via public adoption rather than assumed.

## 4. Expanded Check Coverage via Community Contribution

The `Check` interface (Document 13) is designed specifically to make this the primary, low-friction growth path — new problem categories identified by real usage become new checks without any core redesign.

## 5. Smarter Remediation Guidance

Move from the static, curated fix-text mapping (v1) to remediation that incorporates the specific detected diff (e.g., naming exactly which validators are missing, not just that a mismatch exists). This is an incremental improvement to existing checks rather than a new capability, and is the most likely near-term addition regardless of other adoption signals.

## 6. Exploration of Upstream Integration

**Explicitly marked as uncertain.** Only pursued following a direct conversation with relevant maintainers about whether this class of check fits their current development priorities. Not assumed, not promised as part of this proposal.

## What Is Deliberately Not on This Roadmap

Any hosted or commercial offering. See Document 25 and the business-case discussion in Document 24 for why this project remains open source and non-commercial by design, not by current lack of opportunity.
