'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, X } from 'lucide-react'

export default function Problem() {
  const issues = [
    {
      id: '#2594',
      title: 'Deploy Success Lie',
      severity: 'critical',
      description: 'CLI reports deployment successful but LOCAL NETWORK status shows No',
      impact: 'Chain appears broken when it isn\'t, or vice versa',
      visual: (
        <div className="space-y-2 text-xs font-mono">
          <div className="text-success">✓ CLI: deployment successful</div>
          <div className="text-error">✗ Network: LOCAL NETWORK No</div>
        </div>
      ),
    },
    {
      id: '#2526',
      title: 'Validator Ghost Validators',
      severity: 'critical',
      description: 'Validator-add transaction succeeds but validator set query returns empty',
      impact: 'Fees charged, validator never actually added',
      visual: (
        <div className="space-y-2 text-xs font-mono">
          <div className="text-success">✓ Transaction: addValidator succeeded</div>
          <div className="text-error">✗ P-Chain: validator set empty</div>
        </div>
      ),
    },
    {
      id: '#2535',
      title: 'Config Silently Ignored',
      severity: 'high',
      description: 'config.json ignored, ports randomize after Etna upgrade',
      impact: 'Ports mismatch, clients can\'t reconnect',
      visual: (
        <div className="space-y-2 text-xs font-mono">
          <div className="text-text-secondary">Expected: 9650, 9651, 9652</div>
          <div className="text-error">Actual: 51821, 51822, 51823</div>
        </div>
      ),
    },
    {
      id: '#2458',
      title: 'Ledger Re-Charges Fees',
      severity: 'high',
      description: 'Ledger signature failure forces full re-run, re-charges subnet fees',
      impact: 'Builder loses funds with no recovery path',
      visual: (
        <div className="space-y-2 text-xs font-mono">
          <div>Run 1: CreateSubnetTx — fail</div>
          <div className="text-error">Must retry → charges again</div>
        </div>
      ),
    },
  ]

  const getSeverityColor = (severity: string) => {
    if (severity === 'critical') return 'border-error bg-error/10 text-error'
    return 'border-warning bg-warning/10 text-warning'
  }

  return (
    <section id="problems" className="py-24 bg-surface border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-error/10 border border-error/30 rounded-full px-4 py-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-error" />
            <span className="text-sm font-medium text-error">4 Documented Issues</span>
          </div>

          <h2 className="text-5xl font-bold mb-4">The Verification Gap</h2>
          <p className="text-xl text-text-secondary max-w-2xl">
            avalanche-cli is in maintenance mode. Meanwhile, 4 open GitHub issues show a pattern:
            deploys reporting success while the actual chain state disagrees.
          </p>
        </motion.div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {issues.map((issue, idx) => (
            <motion.a
              key={issue.id}
              href={`https://github.com/ava-labs/avalanche-cli/issues/${issue.id.slice(1)}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group"
            >
              <div
                className={`h-full p-6 rounded-xl border-2 transition hover:shadow-lg cursor-pointer ${getSeverityColor(
                  issue.severity
                )} bg-card hover:bg-card/80`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm font-mono text-text-secondary mb-1">{issue.id}</div>
                    <h3 className="text-lg font-semibold">{issue.title}</h3>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${getSeverityColor(
                      issue.severity
                    )}`}
                  >
                    {issue.severity.toUpperCase()}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-text-secondary mb-4">{issue.description}</p>

                {/* Visual Representation */}
                <div className="bg-background rounded-lg p-3 mb-4 text-text-secondary">
                  {issue.visual}
                </div>

                {/* Impact */}
                <p className="text-xs text-text-secondary italic">
                  <strong>Impact:</strong> {issue.impact}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Context Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-primary/5 border border-primary/30 rounded-xl p-6"
        >
          <div className="flex gap-4">
            <AlertTriangle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Why Deploy Assurance?</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Builders currently have no way to know if their deploy actually worked. The CLI says "success"
                but they must manually cross-check RPC output, validator set state, and config resolution by
                hand — or ship a broken chain and find out during demo day. These aren't consensus bugs;
                they're <strong>deploy-time verification gaps</strong>. Ava Labs won't fix them in maintenance
                mode. So we built the verification layer the CLI lacks.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
