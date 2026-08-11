# Landing Page Copy

## Hero

**Avalanche Deploy Assurance**
Your `avalanche-cli` deploy said it succeeded. Did it actually?

Independent, read-only verification for Avalanche L1 deploys — catches the gap between what the CLI reports and what's actually true on-chain.

`avalanche-deploy-assurance doctor --chain mychain`

## The Problem (short version)

`avalanche-cli` is in maintenance mode. Meanwhile, open issues show deploys that report success while the network status is wrong, validator-add transactions that "succeed" but leave the validator set empty, and config resolution that's hard to trust after the Etna upgrade. Nobody's actively fixing this at the CLI layer right now — so we built the layer on top.

## Features

- **Pre-flight checks** — catch AvalancheGo/VM version mismatches, config ambiguity, and port conflicts *before* you deploy.
- **Post-deploy verification** — independently re-queries RPC and the P-Chain and diffs it against what the CLI told you.
- **Actionable fixes** — every warning and error ships with a concrete next step, not just a red X.
- **Read-only, always** — no private keys, no signing, no writes to your chain or your CLI config. Ever.
- **CI-ready** — JSON output and exit codes designed to gate your deploy pipeline.

## Why It Exists

Built after finding five specific, dated GitHub issues where `avalanche-cli`'s own reported deploy status disagreed with reality — not a hypothesis, a documented pattern. Full evidence and methodology are public in the project's docs.

## Developer Journey

1. `avalanche blockchain create mychain`
2. `avalanche-deploy-assurance preflight --chain mychain`
3. `avalanche blockchain deploy mychain --local`
4. `avalanche-deploy-assurance verify --chain mychain`
5. Ship with confidence — or fix exactly what's wrong, with a fix suggestion in hand.

## Footer CTA

Open source, MIT licensed. Built for the Avalanche builder community, funded by a Team1 Mini Grant. [View on GitHub] [Read the docs]
