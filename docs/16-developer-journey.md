# 16 — Developer Journey

## Journey: Contributor Adding a New Check

1. Identifies a problem category not yet covered (e.g., a genesis field commonly misconfigured that isn't yet checked).
2. Implements the `Check` interface in the appropriate `internal/checks/` subdirectory (Document 13).
3. Writes a fixture-based test representing the scenario.
4. Registers the check in `registry.go` — a one-line change.
5. Opens a PR; CI runs lint, tests, and vulnerability scanning automatically (Document 09).
6. No other part of the codebase needs to change — the check is live in the next release.

## Journey: Maintainer Reviewing a Contribution

1. Reviews whether the new check is read-only (a hard requirement, checked both by code review and, ideally, by future static analysis — see Document 20).
2. Confirms the fixture test represents a real, plausible scenario rather than a synthetic one with no grounding.
3. Confirms the `Fix:` text is concrete and actionable, not generic.
4. Merges — low blast radius, since the check is isolated by construction (Document 13).
