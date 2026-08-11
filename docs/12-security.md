# Security

## Threat Model

The tool's attack surface is intentionally minimal by design:

- **No private key handling.** The tool never reads, requests, stores, or transmits private keys, seed phrases, or ledger interactions. It has no code path that could.
- **No transaction signing or submission.** Every check is a read against public RPC/P-Chain endpoints or local non-secret CLI state files.
- **No network listener.** The tool is not a server or daemon in v1 (Document 10); it has no open port and cannot be a remote attack target.
- **Local file reads are scoped and read-only.** `state/cliconfig` only reads from the known `~/.avalanche-cli` paths and never writes to them.

Given this, the worst-case failure mode of a compromise or bug in this tool is an **incorrect report** — not fund loss, not unauthorized chain action, not credential exposure. That materially smaller blast radius, compared to `avalanche-cli` itself, is a deliberate architectural choice, not an accident.

## Failure Modes

### False Positives (tool reports an error that isn't real)
Most likely cause: RPC or P-Chain query timing — a check run immediately after a transaction is submitted may see pre-finalization state and misreport it as a mismatch. Mitigation: checks that read chain state after a deploy/validator-add action include a documented, bounded retry-with-backoff before reporting Error severity, distinguishing "not yet finalized" from "genuinely inconsistent." This distinction is called out explicitly in report output, not collapsed into a single generic error.

### False Negatives (tool reports pass when something is actually wrong)
Most likely cause: an issue class not yet covered by any implemented check (the v1 check set is deliberately narrow — Document 10). Mitigation: the report always states which checks ran, so a "no errors found" result is legible as "no errors found *among these six checks*," not an implied guarantee of total correctness. This framing is enforced in the text/JSON renderer, not left to documentation alone.

### Tool-Internal Errors vs. Chain-Level Errors
A check panicking or an RPC endpoint being unreachable must never render identically to a genuine chain-state Error (Document 03 §5) — conflating "the tool broke" with "your deployment is broken" would itself be a serious trust failure for a tool whose entire purpose is accurate reporting.

## Safe Defaults

- Default behavior is always the most conservative read (e.g., preferring a local RPC endpoint over a remote one when both are plausible, to avoid leaking chain topology assumptions).
- No check ever auto-retries a *write* action — retries are strictly limited to read-side finalization timing (see False Positives above).
- `--json` output never includes local file paths or hostnames beyond what's necessary for the specific check's message, to keep CI log output reasonably safe to share.

## Dependency Security

Standard Go module supply-chain practices: pinned `go.sum`, `govulncheck` in CI (Document 06), and no dependency on any unreviewed third-party RPC provider beyond what the builder explicitly configures.
