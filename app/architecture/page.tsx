'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function ArchitecturePage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-5xl bg-background border-b border-border">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-text mb-lg">Architecture & Contributing</h1>
              <p className="text-xl text-accent">
                Understand the design, extend with new checks, and contribute to the project.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Design Philosophy */}
        <section className="py-5xl bg-surface border-b border-border">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <h2 className="text-text mb-3xl">Design Philosophy</h2>

            <div className="grid md:grid-cols-3 gap-lg">
              {[
                {
                  title: 'Read-Only by Design',
                  desc: 'Every component reads from live network and local state. Zero write capability. Security by construction.'
                },
                {
                  title: 'Modular Checks',
                  desc: 'Each check is independent, testable, and contributable. One interface, unlimited extensibility.'
                },
                {
                  title: 'Failure Isolation',
                  desc: 'Tool errors are kept distinct from chain errors. A bug in one check never corrupts results from another.'
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-background border border-border rounded-lg p-xl shadow-level-2"
                >
                  <h3 className="text-highlight font-semibold mb-md">{item.title}</h3>
                  <p className="text-accent text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* The Check Interface */}
        <section className="py-5xl bg-background border-b border-border">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <h2 className="text-text mb-3xl">The Check Interface</h2>
            <p className="text-accent mb-2xl">
              This single abstraction is the heart of the project. Every check, past and future, implements it.
            </p>

            <div className="bg-card border border-border rounded-lg p-lg overflow-x-auto font-mono text-xs leading-relaxed group relative">
              <code className="text-highlight">
{`type Check interface {
    ID() string
    Stage() Stage // PreFlight | PostDeploy
    Run(ctx context.Context, s *state.Snapshot) Result
}

type Result struct {
    CheckID  string
    Severity Severity // Pass | Warning | Error
    Message  string
    Fix      string
}`}
              </code>
              <button
                onClick={() => copyToClipboard(`type Check interface {
    ID() string
    Stage() Stage
    Run(ctx context.Context, s *state.Snapshot) Result
}`, 'interface')}
                className="absolute top-lg right-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copiedId === 'interface' ? (
                  <Check size={16} className="text-success" />
                ) : (
                  <Copy size={16} className="text-accent hover:text-highlight" />
                )}
              </button>
            </div>

            <div className="bg-surface border border-border rounded-lg p-2xl mt-2xl">
              <p className="text-accent text-sm mb-md">
                <span className="text-highlight font-semibold">Why one interface?</span> Because closing a newly identified problem category doesn't require redesigning the system. It requires writing one new file and one registry entry.
              </p>
            </div>
          </div>
        </section>

        {/* Project Structure */}
        <section className="py-5xl bg-surface border-b border-border">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <h2 className="text-text mb-3xl">Project Structure</h2>

            <div className="bg-background border border-border rounded-lg p-lg overflow-x-auto font-mono text-xs leading-relaxed">
              <code className="text-highlight">
{`avalanche-deploy-assurance/
├── cmd/                    # CLI entrypoints
│   ├── root.go
│   ├── preflight.go
│   ├── verify.go
│   └── doctor.go
├── internal/
│   ├── checks/             # Check implementations
│   │   ├── registry.go
│   │   ├── preflight/
│   │   └── postdeploy/
│   ├── state/              # Read-only state layer
│   │   ├── cliconfig/
│   │   ├── rpcclient/
│   │   └── pchainclient/
│   └── report/             # Output formatting
│       ├── scoring.go
│       ├── render_text.go
│       └── render_json.go
├── pkg/
│   └── compat/             # Public: version compat data
└── testdata/
    └── fixtures/           # Test scenarios`}
              </code>
            </div>

            <div className="grid md:grid-cols-2 gap-lg mt-2xl">
              <div className="bg-card border border-border rounded-lg p-lg">
                <h3 className="text-highlight font-semibold mb-md">Each Layer Is Independent</h3>
                <p className="text-accent text-sm">CLI never queries network. Checks never format output. Report layer never reads from disk. Clean separation means each part can evolve without touching others.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-lg">
                <h3 className="text-highlight font-semibold mb-md">Adding a Check</h3>
                <p className="text-accent text-sm">Create new file in internal/checks/, implement Check interface, add one line to registry.go. No other code changes needed. This is by design.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Adding Your First Check */}
        <section className="py-5xl bg-background border-b border-border">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <h2 className="text-text mb-3xl">Adding Your First Check</h2>

            <div className="space-y-2xl">
              <div>
                <h3 className="text-text font-semibold mb-lg">Step 1: Identify a Problem</h3>
                <p className="text-accent mb-lg">
                  Look at the six problem categories in the documentation. Pick one not yet covered, or identify a new category from real usage.
                </p>
              </div>

              <div>
                <h3 className="text-text font-semibold mb-lg">Step 2: Implement Check</h3>
                <p className="text-accent mb-lg">
                  Create file in internal/checks/preflight/ or internal/checks/postdeploy/:
                </p>
                <div className="bg-card border border-border rounded-lg p-lg overflow-x-auto font-mono text-xs leading-relaxed group relative">
                  <code className="text-highlight">
{`package preflight

type MyNewCheck struct {}

func (c MyNewCheck) ID() string {
    return "my-new-check"
}

func (c MyNewCheck) Stage() Stage {
    return PreFlight
}

func (c MyNewCheck) Run(ctx context.Context, s *state.Snapshot) Result {
    // Your logic here
    return Result{
        CheckID:  c.ID(),
        Severity: Pass,
        Message:  "All good!",
    }
}`}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`package preflight

type MyNewCheck struct {}

func (c MyNewCheck) ID() string { return "my-new-check" }
func (c MyNewCheck) Stage() Stage { return PreFlight }
func (c MyNewCheck) Run(ctx context.Context, s *state.Snapshot) Result { /* logic */ }`, 'check-impl')}
                    className="absolute top-lg right-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === 'check-impl' ? (
                      <Check size={16} className="text-success" />
                    ) : (
                      <Copy size={16} className="text-accent hover:text-highlight" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-text font-semibold mb-lg">Step 3: Write a Fixture Test</h3>
                <p className="text-accent mb-lg">
                  Create test scenario files in testdata/fixtures/ that represent the problem you're checking for.
                </p>
              </div>

              <div>
                <h3 className="text-text font-semibold mb-lg">Step 4: Register in registry.go</h3>
                <div className="bg-card border border-border rounded-lg p-lg overflow-x-auto font-mono text-xs leading-relaxed group relative">
                  <code className="text-highlight">
{`func AllChecks() []Check {
    return []Check{
        // ... existing checks ...
        preflight.MyNewCheck{},  // Add this line
    }
}`}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`preflight.MyNewCheck{},`, 'registry')}
                    className="absolute top-lg right-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === 'registry' ? (
                      <Check size={16} className="text-success" />
                    ) : (
                      <Copy size={16} className="text-accent hover:text-highlight" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-text font-semibold mb-lg">Step 5: Open a PR</h3>
                <p className="text-accent">
                  CI runs lint, tests, and vulnerability scanning. No other part of the codebase needs to change. Your check is live in the next release.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Review Checklist */}
        <section className="py-5xl bg-surface border-b border-border">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <h2 className="text-text mb-3xl">Review Checklist (for PRs)</h2>

            <div className="space-y-lg">
              {[
                'Check is read-only (hard requirement)',
                'Fixture test represents a real, plausible scenario',
                'Fix text is concrete and actionable, not generic',
                'No other code changes needed',
                'Tests pass, linter passes, no vulnerabilities',
              ].map((item, idx) => (
                <div key={idx} className="flex gap-lg items-start bg-card border border-border rounded-lg p-lg">
                  <div className="text-success font-bold mt-0.5">✓</div>
                  <p className="text-accent text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
