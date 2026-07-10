'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { Button } from '@/components/Button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function DocsPage() {
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
              <h1 className="text-text mb-lg">Documentation</h1>
              <p className="text-xl text-accent">
                Everything you need to install, run, and integrate Aegis into your workflow.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="py-3xl bg-surface border-b border-border sticky top-20 z-40">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <div className="flex flex-wrap gap-lg text-sm">
              <a href="#install" className="text-highlight hover:text-warning transition">
                Install
              </a>
              <a href="#first-run" className="text-accent hover:text-highlight transition">
                First Run
              </a>
              <a href="#understanding" className="text-accent hover:text-highlight transition">
                Understanding Reports
              </a>
              <a href="#checks" className="text-accent hover:text-highlight transition">
                The Six Checks
              </a>
              <a href="#config" className="text-accent hover:text-highlight transition">
                Configuration
              </a>
              <a href="#ci" className="text-accent hover:text-highlight transition">
                CI/CD
              </a>
            </div>
          </div>
        </section>

        {/* Install Section */}
        <section id="install" className="py-5xl bg-background border-b border-border">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <h2 className="text-text mb-3xl">Quick Install</h2>

            <div className="space-y-3xl">
              <div>
                <h3 className="text-text font-semibold mb-lg">macOS</h3>
                <div className="bg-card border border-border rounded-lg p-lg group relative">
                  <code className="text-highlight text-sm font-mono">
                    $ brew install aegis
                  </code>
                  <button
                    onClick={() => copyToClipboard('brew install aegis', 'macos')}
                    className="absolute top-lg right-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === 'macos' ? (
                      <Check size={16} className="text-success" />
                    ) : (
                      <Copy size={16} className="text-accent hover:text-highlight" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-text font-semibold mb-lg">Linux</h3>
                <div className="bg-card border border-border rounded-lg p-lg group relative">
                  <code className="text-highlight text-sm font-mono">
                    $ curl -sSfL https://get.avalanche.sh/aegis | sh
                  </code>
                  <button
                    onClick={() => copyToClipboard('curl -sSfL https://get.avalanche.sh/aegis | sh', 'linux')}
                    className="absolute top-lg right-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === 'linux' ? (
                      <Check size={16} className="text-success" />
                    ) : (
                      <Copy size={16} className="text-accent hover:text-highlight" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-text font-semibold mb-lg">From Source</h3>
                <div className="bg-card border border-border rounded-lg p-lg group relative">
                  <code className="text-highlight text-sm font-mono">
                    $ go install github.com/avalanche-labs/aegis/cmd@latest
                  </code>
                  <button
                    onClick={() => copyToClipboard('go install github.com/avalanche-labs/aegis/cmd@latest', 'source')}
                    className="absolute top-lg right-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === 'source' ? (
                      <Check size={16} className="text-success" />
                    ) : (
                      <Copy size={16} className="text-accent hover:text-highlight" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-text font-semibold mb-lg">Verify Installation</h3>
                <div className="bg-card border border-border rounded-lg p-lg group relative">
                  <code className="text-highlight text-sm font-mono">
                    $ aegis --version
                  </code>
                  <button
                    onClick={() => copyToClipboard('aegis --version', 'verify')}
                    className="absolute top-lg right-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === 'verify' ? (
                      <Check size={16} className="text-success" />
                    ) : (
                      <Copy size={16} className="text-accent hover:text-highlight" />
                    )}
                  </button>
                </div>
                <p className="text-accent text-sm mt-md">
                  Expected output: <span className="text-highlight">avalanche-deploy-assurance version 0.1.0</span>
                </p>
              </div>

              <div className="bg-surface border border-border rounded-lg p-lg">
                <p className="text-accent text-sm">
                  <span className="text-highlight font-semibold">Requirements:</span> Go 1.22+ (if building from source), or use prebuilt binaries for your OS.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* First Run */}
        <section id="first-run" className="py-5xl bg-surface border-b border-border">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <h2 className="text-text mb-3xl">Your First Check</h2>

            <div className="space-y-2xl">
              <div>
                <h3 className="text-text font-semibold mb-lg">Step 1: List Your Chains</h3>
                <div className="bg-background border border-border rounded-lg p-lg group relative">
                  <code className="text-highlight text-sm font-mono">
                    $ avalanche blockchain list
                  </code>
                  <button
                    onClick={() => copyToClipboard('avalanche blockchain list', 'step1')}
                    className="absolute top-lg right-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === 'step1' ? (
                      <Check size={16} className="text-success" />
                    ) : (
                      <Copy size={16} className="text-accent hover:text-highlight" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-text font-semibold mb-lg">Step 2: Run Doctor</h3>
                <div className="bg-background border border-border rounded-lg p-lg group relative">
                  <code className="text-highlight text-sm font-mono">
                    $ aegis doctor --chain mychain
                  </code>
                  <button
                    onClick={() => copyToClipboard('aegis doctor --chain mychain', 'step2')}
                    className="absolute top-lg right-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === 'step2' ? (
                      <Check size={16} className="text-success" />
                    ) : (
                      <Copy size={16} className="text-accent hover:text-highlight" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-text font-semibold mb-lg">Step 3: Read Your Report</h3>
                <div className="bg-background border border-border rounded-lg p-lg font-mono text-xs leading-relaxed overflow-x-auto">
                  <div className="text-accent mb-lg">Pre-Flight Checks — mychain</div>
                  <div className="space-y-sm text-text">
                    <div><span className="text-success">✓</span> [PASS]    version-compatibility</div>
                    <div><span className="text-warning">⚠</span> [WARNING] config-validation</div>
                    <div><span className="text-success">✓</span> [PASS]    port-availability</div>
                  </div>

                  <div className="text-accent mt-lg">Post-Deploy Verification — mychain</div>
                  <div className="space-y-sm text-text">
                    <div><span className="text-success">✓</span> [PASS]    validator-verification</div>
                    <div><span className="text-success">✓</span> [PASS]    network-state-verification</div>
                    <div><span className="text-success">✓</span> [PASS]    genesis-consistency</div>
                  </div>

                  <div className="border-t border-border mt-lg pt-lg">
                    <div className="text-highlight">Health Score: 0.95 / 1.0</div>
                    <div className="text-accent">Result: 5 passed, 1 warning, 0 errors</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Understanding Reports */}
        <section id="understanding" className="py-5xl bg-background border-b border-border">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <h2 className="text-text mb-3xl">Understanding Your Report</h2>

            <div className="space-y-2xl">
              <div className="bg-card border border-border rounded-lg p-2xl">
                <h3 className="text-success font-semibold mb-md flex items-center gap-md">
                  <span className="text-lg">✓</span> PASS: All Good
                </h3>
                <p className="text-accent">This check passed. No action needed.</p>
                <p className="text-sm text-border mt-md">Example: [PASS] version-compatibility</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-2xl">
                <h3 className="text-warning font-semibold mb-md flex items-center gap-md">
                  <span className="text-lg">⚠</span> WARNING: Attention Recommended
                </h3>
                <p className="text-accent">This check detected a condition that should be reviewed, but doesn't prevent deployment.</p>
                <p className="text-sm text-border mt-md">Example: [WARNING] config-validation — Multiple config sources detected</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-2xl">
                <h3 className="text-error font-semibold mb-md flex items-center gap-md">
                  <span className="text-lg">✗</span> ERROR: Must Be Fixed
                </h3>
                <p className="text-accent">This check detected a critical issue that could compromise your deployment.</p>
                <p className="text-sm text-border mt-md">Example: [ERROR] validator-verification — Validators don't match live set</p>
              </div>

              <div className="bg-surface border border-border rounded-lg p-2xl">
                <h3 className="text-highlight font-semibold mb-md">Exit Codes</h3>
                <ul className="space-y-md text-accent text-sm">
                  <li><span className="text-highlight">Exit 0:</span> All checks passed</li>
                  <li><span className="text-highlight">Exit 1:</span> One or more warnings, no errors</li>
                  <li><span className="text-highlight">Exit 2:</span> One or more errors detected</li>
                </ul>
                <p className="text-accent text-xs mt-lg">
                  Exit codes allow CI pipelines to gate on errors while allowing warnings to pass through.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Six Checks */}
        <section id="checks" className="py-5xl bg-surface border-b border-border">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <h2 className="text-text mb-3xl">The Six MVP Checks</h2>

            <h3 className="text-text font-semibold mb-2xl mt-3xl">Pre-Flight Checks</h3>
            <div className="space-y-lg">
              {[
                {
                  name: 'version-compatibility',
                  desc: 'Ensures AvalancheGo and VM plugin versions are compatible',
                  fixes: 'Update AvalancheGo or VM plugin to compatible versions'
                },
                {
                  name: 'config-validation',
                  desc: 'Validates local configuration resolution and consistency',
                  fixes: 'Resolve config file conflicts or ambiguities'
                },
                {
                  name: 'port-availability',
                  desc: 'Checks that target ports are available for binding',
                  fixes: 'Free up port or use different port configuration'
                },
              ].map((check) => (
                <div key={check.name} className="bg-background border border-border rounded-lg p-lg">
                  <h4 className="text-highlight font-mono text-sm font-semibold mb-md">{check.name}</h4>
                  <p className="text-accent text-sm mb-md">{check.desc}</p>
                  <p className="text-border text-xs"><span className="text-warning">Fix:</span> {check.fixes}</p>
                </div>
              ))}
            </div>

            <h3 className="text-text font-semibold mb-2xl mt-3xl">Post-Deploy Checks</h3>
            <div className="space-y-lg">
              {[
                {
                  name: 'validator-verification',
                  desc: 'Compares configured validators against live P-Chain validator set',
                  fixes: 'Confirm validator registration transactions have finalized'
                },
                {
                  name: 'network-state-verification',
                  desc: 'Verifies RPC is responding and chain is reachable',
                  fixes: 'Check network connectivity and RPC endpoint availability'
                },
                {
                  name: 'genesis-consistency',
                  desc: 'Verifies on-chain genesis matches local genesis.json',
                  fixes: 'Recheck genesis configuration or redeploy with correct genesis'
                },
              ].map((check) => (
                <div key={check.name} className="bg-background border border-border rounded-lg p-lg">
                  <h4 className="text-highlight font-mono text-sm font-semibold mb-md">{check.name}</h4>
                  <p className="text-accent text-sm mb-md">{check.desc}</p>
                  <p className="text-border text-xs"><span className="text-warning">Fix:</span> {check.fixes}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CI/CD Integration */}
        <section id="ci" className="py-5xl bg-background border-b border-border">
          <div className="max-w-container mx-auto px-lg md:px-2xl">
            <h2 className="text-text mb-3xl">CI/CD Integration</h2>

            <h3 className="text-text font-semibold mb-2xl">GitHub Actions</h3>
            <p className="text-accent mb-2xl">Add this workflow to your repository to run checks on deployment:</p>

            <div className="bg-card border border-border rounded-lg p-lg overflow-x-auto font-mono text-xs leading-relaxed group relative">
              <code className="text-highlight">
{`name: Deploy Assurance Check
on: [push, pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install deploy-assurance
        run: go install github.com/avalanche-labs/avalanche-deploy-assurance/cmd@latest
      - name: Run checks
        run: avalanche-deploy-assurance doctor --json`}
              </code>
              <button
                onClick={() => copyToClipboard(`name: Deploy Assurance Check
on: [push, pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install deploy-assurance
        run: go install github.com/avalanche-labs/avalanche-deploy-assurance/cmd@latest
      - name: Run checks
        run: avalanche-deploy-assurance doctor --json`, 'github-action')}
                className="absolute top-lg right-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copiedId === 'github-action' ? (
                  <Check size={16} className="text-success" />
                ) : (
                  <Copy size={16} className="text-accent hover:text-highlight" />
                )}
              </button>
            </div>

            <div className="bg-surface border border-border rounded-lg p-lg mt-2xl">
              <p className="text-accent text-sm">
                <span className="text-highlight font-semibold">Exit Codes:</span> Use exit codes to gate CI pipeline stages. Exit 0 for pass, 1 for warnings, 2 for errors.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
