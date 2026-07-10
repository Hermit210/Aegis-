# 21 — Security Model

## Threat Model

The toolkit's attack surface is deliberately minimal:

- **No private key handling.** No code path reads, requests, stores, or transmits private keys, seed phrases, or ledger interactions.
- **No transaction signing or submission.** Every check reads from public RPC/P-Chain endpoints or local, non-secret configuration files.
- **No network listener.** The tool is not a server or daemon (Document 19); it has no open port and is not a viable remote attack target.
- **Structurally read-only.** The `state` layer package (Document 11) has no write methods — this is enforced by the type system, not by convention or code review alone.

Given this, the worst-case outcome of a bug or compromise in this tool is an incorrect report — not fund loss, not unauthorized on-chain action, not credential exposure. That is a materially smaller blast radius than the tools it verifies, by deliberate design.

## Failure Modes

**False positives** (reporting an error that isn't real) — most likely from RPC/P-Chain query timing racing ahead of transaction finalization. Mitigated with a bounded retry-with-backoff before a post-deploy check escalates to Error severity, with the distinction between "not yet finalized" and "genuinely inconsistent" surfaced explicitly in output rather than collapsed into one generic failure.

**False negatives** (reporting pass when something is wrong) — most likely from a problem category not yet covered by an implemented check. Mitigated by the report always listing exactly which checks ran, so a clean result reads as "no issues found among these checks," not an implied guarantee of total correctness.

**Tool-internal errors vs. genuine chain-state errors** — kept structurally distinct in the report layer (Document 10), so a network timeout or bug in the tool itself is never rendered identically to an actual deployment problem.

## Safe Defaults

Conservative defaults throughout: local RPC preferred over remote when both are plausible candidates; no write retries, ever; JSON output scoped to avoid leaking unnecessary local file paths or hostnames beyond what a given check's message requires.
