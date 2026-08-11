# Contributing to Avalanche Deploy Assurance

> **Rewritten to match the actual implementation.** The original version of
> this document described contributing to a Go codebase (`internal/checks/`,
> `registry.go`, `gofmt`, `testdata/fixtures/`) that was never built. What
> follows matches the real Node/TypeScript backend in
> `avalanche-deploy-assurance-website/backend/`.

Thanks for considering a contribution. This project is early-stage and
solo-maintained through its initial grant period (see
[`docs/14-business-case.md`](./docs/14-business-case.md)) — response times
may be slower than a larger project, stated here honestly rather than
implied otherwise.

## The Easiest Way to Contribute: A New Check

The `Check` interface (`backend/src/types/check.ts`) is designed so a new
check is a self-contained addition:

```ts
export type Check = {
  id: string
  name: string
  run(target: CheckTarget): Promise<CheckResult>
}
```

1. Implement the interface in a new file under `backend/src/checks/`.
2. Register it in `ALL_CHECKS` in `backend/src/checks/index.ts`.
3. Add a weight for it in `DEFAULT_WEIGHTS` in
   `backend/src/score/computeHealthScore.ts` — a check that's registered
   but has no weight still runs, but never affects the health score (see
   `docs/03-engineering-design.md` §8).
4. Add a unit test in `backend/test/checks/` (mocked, no real network —
   see existing checks' tests for the pattern) and, if the check can
   reasonably be exercised against real Fuji testnet infrastructure, a
   live integration test in `backend/test/integration/`.
5. Open a PR. Include the evidence for why the check matters — this
   project's entire premise is evidence-first, and PRs are held to the
   same standard (see [`docs/20-critical-review.md`](./docs/20-critical-review.md)
   for what that standard looks like in practice).

## Coding Standards

- Standard TypeScript/Prettier-style formatting (no enforced linter/CI
  currently runs on this repo — see `docs/06-repository-structure.md`'s CI
  section for that honest gap).
- No check may sign a transaction, submit one, or write to any local or
  chain state. This is a hard boundary, not a style preference — see
  [`docs/12-security.md`](./docs/12-security.md).
- Every check must isolate its own failures: wrap RPC calls in try/catch
  and return an `unavailable` `CheckResult` on error, never let an
  exception propagate out of `run()` and abort the other checks (see
  `docs/03-engineering-design.md` §5). Never return a fabricated `pass` —
  if the data a check needs isn't reachable, that's `unavailable`, not a
  guess.

## Branch Strategy

- `main` — always releasable.
- Feature branches merged via PR (this repo's actual history uses
  `feat/<name>`, `fix/<name>`, `copy/<name>` branch names, merged via
  GitHub PR — not strictly squash-merged; check `git log --oneline` for
  the real pattern before assuming one).

## Reporting False Positives / Negatives

These are first-class bug reports, not general issues — use the
`false-positive` / `false-negative` labels and include `--json` output.
See [`docs/12-security.md`](./docs/12-security.md) for why this category
gets priority triage.

## Frontend Contributions

The Next.js site (`avalanche-deploy-assurance-website/src/`) is a separate
concern from the backend checks above. See
[`avalanche-deploy-assurance-website/README.md`](./avalanche-deploy-assurance-website/README.md#the-frontend)
for its structure and design-token conventions. Wiring the site's
simulated demo up to the real backend, and reconciling
`src/lib/checks.ts`'s check descriptions with the backend's actual six
check IDs, are open, well-scoped contributions — see that README's Known
Gaps section.

## Code of Conduct

Standard respectful open-source collaboration norms apply. Be direct about
disagreements on technical approach; keep it about the evidence and the
code, not the person.
