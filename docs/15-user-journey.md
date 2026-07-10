# 15 — User Journey

## Journey: First-Time L1 Builder

1. Follows Avalanche's standard onboarding docs and installs `avalanche-cli`.
2. Defines a chain with `avalanche blockchain create`.
3. Runs `avalanche-deploy-assurance preflight` before attempting a deploy — catches a version mismatch that would otherwise have surfaced as a confusing runtime error (Problem Category 3).
4. Fixes the flagged issue, deploys with `avalanche blockchain deploy`.
5. Runs `avalanche-deploy-assurance verify` — confirms validator registration and network state independently, rather than manually checking an explorer (Problem Categories 1, 2, 4).
6. Gets a single confidence report to reference in a hackathon submission or grant milestone update (Problem Category 5).

## Journey: Builder Debugging an Unclear Failure

1. A deployment appears to succeed, but something feels off — an RPC call is timing out, or a teammate says a validator isn't showing up.
2. Instead of manually checking logs, config files, and RPC output in sequence, the builder runs `avalanche-deploy-assurance doctor`.
3. The report immediately isolates the actual point of disagreement (e.g., validator set mismatch) rather than requiring the builder to reconstruct that finding by hand (Problem Category 4).
4. The `Fix:` guidance gives a concrete next step rather than leaving the builder to search documentation or ask in a community channel.
