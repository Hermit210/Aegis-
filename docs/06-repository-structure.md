# Repository Structure

> **Rewritten to match the actual implementation.** The original version of
> this document described a standalone Go repository (`go.mod`, `cmd/`,
> `internal/`, `pkg/`, `goreleaser`). What was actually built is a
> TypeScript backend living *inside* the Next.js marketing site's repo, as
> a monorepo, documented below.

```
avalanche-deploy-assurance-website/        # the actual git repository root
├── src/                                   # Next.js frontend (marketing/docs site)
│   ├── app/                               # routes: /, /problem, /solution, /features,
│   │                                       #   /architecture, /docs, /roadmap
│   ├── components/
│   │   └── sections/                      # Hero, Problem, Solution, Features, Demo,
│   │                                       #   Architecture, Roadmap, OpenSource, CTA
│   └── lib/
│       └── checks.ts                      # static check-description copy — NOT wired to
│                                           #   backend/, and its check IDs/grouping don't
│                                           #   match backend/'s real six checks (see root
│                                           #   README's Known Gaps)
├── backend/                                # the real verification engine
│   ├── src/
│   │   ├── checks/
│   │   │   ├── portAvailability.ts
│   │   │   ├── validatorRegistration.ts
│   │   │   ├── genesisConsistency.ts
│   │   │   ├── networkState.ts
│   │   │   ├── versionCompatibility.ts
│   │   │   ├── configValidation.ts
│   │   │   ├── rpcChainVmCompatibility.ts # subnet-evm compatibility table (data, not a check)
│   │   │   └── index.ts                   # ALL_CHECKS registry + runAllChecks
│   │   ├── score/
│   │   │   └── computeHealthScore.ts
│   │   ├── api/
│   │   │   └── server.ts                  # Fastify: GET /health, POST /verify
│   │   ├── cli/
│   │   │   └── index.ts                   # commander: `aegis verify`
│   │   ├── lib/
│   │   │   └── avalancheRpc.ts            # shared RPC helpers, node/chain URL resolution
│   │   ├── types/
│   │   │   ├── check.ts                   # CheckTarget, CheckResult, Check, resultOf()
│   │   │   └── avalanchejs.d.ts           # ambient types working around an upstream
│   │   │                                  #   @avalabs/avalanchejs .d.ts resolution bug
│   │   └── verify.ts                      # orchestrator shared by CLI + API
│   ├── test/
│   │   ├── checks/                        # unit tests, mocked, no network
│   │   ├── score/
│   │   ├── api/
│   │   └── integration/                   # hits real Fuji testnet infrastructure
│   ├── package.json                       # @aegis/backend, bin: aegis
│   ├── tsconfig.json / tsconfig.typecheck.json
│   ├── vitest.config.ts / vitest.integration.config.ts
│   └── README.md
├── .github/
│   └── workflows/
│       └── aegis-verify.yml.example       # CI gate template — copy into your own repo
├── LICENSE
└── README.md                              # covers both the frontend and backend/
```

There is no `cmd/`, `internal/`, `pkg/`, `go.mod`, `go.sum`, `Makefile`,
`testdata/fixtures/`, `testdata/golden/`, or `examples/` — those were part
of the unbuilt Go design. There is also no `CONTRIBUTING.md` or `CHANGELOG.md`
in the actual repository (a `CONTRIBUTING.md` and a broader `docs/` folder
exist locally one directory above this repo, on the machine this was
developed on, but were never committed here — see the root README's Known
Gaps section).

## Naming Conventions

- Check IDs are kebab-case (`port-availability`, `validator-registration`,
  `genesis-consistency`, `network-state`, `version-compatibility`,
  `config-validation`), matching their `id` field in `Check` — traceable
  directly from a report's `results[].id` back to `src/checks/<name>.ts`
  (filenames are camelCase, not a 1:1 slug of the ID — e.g.
  `versionCompatibility.ts` implements `version-compatibility`).
- No Go-style package naming applies (no packages, just ES modules).

## Tests

- `backend/test/checks/*.test.ts` — unit tests per check, fetch mocked via
  `vitest`'s `vi.stubGlobal`, no real network calls. Run by default
  (`npm test`).
- `backend/test/score/computeHealthScore.test.ts`,
  `backend/test/api/server.test.ts` — unit tests for scoring and the
  Fastify routes.
- `backend/test/integration/*.integration.test.ts` — hit real Fuji testnet
  P-Chain and C-Chain infrastructure. Not part of the default `npm test`
  run; run explicitly with `npm run test:integration`
  (`vitest.integration.config.ts`). Currently covers validator
  registration and genesis consistency, both verified against live data as
  of this writing.
- No `testdata/fixtures/` or `testdata/golden/` directories — fixtures are
  inlined in each test file rather than kept as separate JSON files, and
  there's no golden-file output diffing.

## CI (GitHub Actions)

There is **no CI workflow that runs on push/PR in this repository** — no
`test.yml`, `lint.yml`, or `release.yml` exist, unlike the original
design's plan. The only workflow file present is
`.github/workflows/aegis-verify.yml.example`, a `workflow_dispatch`
template meant to be copied into *other* repositories to gate their deploy
pipeline on this tool's health score — not a CI check for this repository's
own code. Setting up real `test`/`typecheck`/`lint` CI for this repo is an
open gap, not something already in place.
