'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

export default function SecurityPage() {
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
              <h1 className="text-text mb-lg">Security & Trust</h1>
              <p className="text-xl text-accent">
                Is this safe to run? What can it do? What can't it do?
              </p>
            </motion.div>
          </div>
        </section>

        {/* Trust Model */}
        <section className="py-5xl bg-surface border-b border-border">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <h2 className="text-text mb-3xl">Trust Model</h2>
            <p className="text-accent mb-3xl">
              Zero write capability. Read-only by design. Every claim is verified by the type system, not by convention.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-lg">
              {[
                { icon: '🔑', label: 'No private keys' },
                { icon: '✍️', label: 'No signing' },
                { icon: '⛓️', label: 'No chain writes' },
                { icon: '⚙️', label: 'No config writes' },
                { icon: '🔐', label: 'Read-only always' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-background border border-border rounded-lg p-2xl text-center shadow-level-2"
                >
                  <div className="text-3xl mb-md">{item.icon}</div>
                  <p className="text-text font-semibold text-sm">{item.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-background border border-border rounded-lg p-2xl mt-3xl">
              <p className="text-accent">
                <span className="text-highlight font-semibold">Zero write capability:</span> The state layer package has no write methods at all. There is no code path by which a check could mutate anything. This is enforced by Go's type system, not by code review convention alone.
              </p>
            </div>
          </div>
        </section>

        {/* Threat Model */}
        <section className="py-5xl bg-background border-b border-border">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <h2 className="text-text mb-3xl">Threat Model</h2>
            <p className="text-accent mb-3xl">
              What's the worst that could happen if this tool is compromised?
            </p>

            <div className="bg-surface border border-border rounded-lg p-2xl mb-2xl">
              <h3 className="text-error font-semibold mb-md">Worst-Case Outcome</h3>
              <p className="text-accent">
                An incorrect report. That's it. Not fund loss, not unauthorized on-chain action, not credential exposure.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-lg">
              <div className="bg-card border border-border rounded-lg p-lg">
                <h3 className="text-error font-semibold mb-md flex items-center gap-md">
                  <X size={20} /> What It CANNOT Do
                </h3>
                <ul className="space-y-md text-accent text-sm">
                  <li>Sign transactions</li>
                  <li>Submit transactions</li>
                  <li>Modify chain state</li>
                  <li>Access private keys</li>
                  <li>Write to local config</li>
                  <li>Open network listeners</li>
                  <li>Execute arbitrary commands</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-lg p-lg">
                <h3 className="text-success font-semibold mb-md flex items-center gap-md">
                  <Check size={20} /> What It CAN Do
                </h3>
                <ul className="space-y-md text-accent text-sm">
                  <li>Read local config files</li>
                  <li>Query public RPC endpoints</li>
                  <li>Query P-Chain API</li>
                  <li>Generate reports</li>
                  <li>Output to stdout/JSON</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Failure Modes */}
        <section className="py-5xl bg-surface border-b border-border">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <h2 className="text-text mb-3xl">Failure Modes & Mitigations</h2>

            <div className="space-y-lg">
              <div className="bg-background border border-border rounded-lg p-lg">
                <h3 className="text-warning font-semibold mb-md">False Positives</h3>
                <p className="text-accent text-sm mb-md">
                  Reporting an error that isn't real. Most likely from RPC/P-Chain query timing racing ahead of transaction finalization.
                </p>
                <p className="text-highlight text-sm font-semibold">Mitigation:</p>
                <p className="text-accent text-sm">
                  Bounded retry-with-backoff before escalating to Error severity. Distinction between "not yet finalized" and "genuinely inconsistent" is surfaced explicitly in output.
                </p>
              </div>

              <div className="bg-background border border-border rounded-lg p-lg">
                <h3 className="text-warning font-semibold mb-md">False Negatives</h3>
                <p className="text-accent text-sm mb-md">
                  Reporting pass when something is wrong. Most likely from a problem category not yet covered by an implemented check.
                </p>
                <p className="text-highlight text-sm font-semibold">Mitigation:</p>
                <p className="text-accent text-sm">
                  Report always lists exactly which checks ran. A clean result reads as "no issues found among these checks," not an implied guarantee of total correctness.
                </p>
              </div>

              <div className="bg-background border border-border rounded-lg p-lg">
                <h3 className="text-warning font-semibold mb-md">Tool Errors vs. Chain Errors</h3>
                <p className="text-accent text-sm mb-md">
                  A network timeout or bug in the tool itself could be rendered identically to an actual deployment problem.
                </p>
                <p className="text-highlight text-sm font-semibold">Mitigation:</p>
                <p className="text-accent text-sm">
                  Structurally kept distinct in the report layer. Tool internal errors never get rendered as deployment failures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Safe Defaults */}
        <section className="py-5xl bg-background border-b border-border">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <h2 className="text-text mb-3xl">Safe Defaults</h2>
            <p className="text-accent mb-3xl">
              Conservative, local-first principles throughout:
            </p>

            <div className="grid md:grid-cols-2 gap-lg">
              {[
                {
                  title: 'Local RPC Preferred',
                  desc: 'Defaults to local 127.0.0.1:9650 over remote endpoints when both are plausible candidates.'
                },
                {
                  title: 'No Write Retries',
                  desc: 'Ever. A state mutation either succeeds or fails. No automatic retry of writes.'
                },
                {
                  title: 'Conservative Errors',
                  desc: 'When in doubt, report it. Better a false positive than a false negative.'
                },
                {
                  title: 'JSON Safety',
                  desc: 'Output scoped to avoid leaking unnecessary local file paths or hostnames beyond what check messages require.'
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-surface border border-border rounded-lg p-lg"
                >
                  <h3 className="text-highlight font-semibold mb-md">{item.title}</h3>
                  <p className="text-accent text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Source & Auditable */}
        <section className="py-5xl bg-surface border-b border-border">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <h2 className="text-text mb-3xl">Open Source & Auditable</h2>

            <div className="bg-background border border-border rounded-lg p-2xl">
              <div className="space-y-lg">
                <div>
                  <h3 className="text-highlight font-semibold mb-md">📜 MIT License</h3>
                  <p className="text-accent text-sm">
                    Fully open source. Anyone can review, audit, and modify.
                  </p>
                </div>

                <div className="border-t border-border pt-lg">
                  <h3 className="text-highlight font-semibold mb-md">🔍 Code is the Spec</h3>
                  <p className="text-accent text-sm">
                    No hidden behavior. What you see in the repo is what runs.
                  </p>
                </div>

                <div className="border-t border-border pt-lg">
                  <h3 className="text-highlight font-semibold mb-md">✓ Reproducible Builds</h3>
                  <p className="text-accent text-sm">
                    Binaries can be independently verified to match source code.
                  </p>
                </div>

                <div className="border-t border-border pt-lg">
                  <h3 className="text-highlight font-semibold mb-md">🛡️ Governed by Community</h3>
                  <p className="text-accent text-sm">
                    Security decisions made transparently via PRs and discussions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Questions */}
        <section className="py-5xl bg-background">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <h2 className="text-text mb-3xl">Questions?</h2>
            <p className="text-accent mb-3xl">
              For security concerns or vulnerability reports, please email security@example.com or open a private vulnerability report on GitHub.
            </p>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-highlight hover:text-warning">
              View source code on GitHub →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
