'use client'

import { motion } from 'framer-motion'
import { ArrowDown, CheckCircle2, AlertCircle, Zap } from 'lucide-react'

export default function Solution() {
  const DeploymentFlow = ({ title, steps }: { title: string; steps: any[] }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex gap-3 items-start"
          >
            {/* Status Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {step.status === 'auto' && (
                <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary flex items-center justify-center">
                  <Zap className="w-3 h-3 text-primary" />
                </div>
              )}
              {step.status === 'manual' && (
                <div className="w-6 h-6 rounded-full bg-warning/10 border border-warning flex items-center justify-center">
                  <AlertCircle className="w-3 h-3 text-warning" />
                </div>
              )}
              {step.status === 'verify' && (
                <div className="w-6 h-6 rounded-full bg-success/10 border border-success flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-success" />
                </div>
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <p className="text-sm font-medium">{step.label}</p>
              {step.description && (
                <p className="text-xs text-text-secondary mt-1">{step.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const beforeSteps = [
    { label: 'avalanche blockchain create', status: 'manual' },
    { label: 'avalanche blockchain deploy', status: 'manual' },
    { label: 'Manual RPC checks', status: 'manual', description: 'Query endpoints by hand' },
    { label: 'Manual validator checks', status: 'manual', description: 'Verify validator set' },
    { label: 'Manual config checks', status: 'manual', description: 'Check port bindings' },
    { label: 'Hope it worked?', status: 'manual', description: 'No guarantee' },
  ]

  const afterSteps = [
    { label: 'avalanche blockchain create', status: 'verify' },
    {
      label: 'avalanche-deploy-assurance preflight',
      status: 'auto',
      description: 'Catch issues before deploy',
    },
    { label: 'avalanche blockchain deploy', status: 'verify' },
    {
      label: 'avalanche-deploy-assurance verify',
      status: 'auto',
      description: 'Independently verify on-chain state',
    },
    {
      label: 'Deployment verified ✓',
      status: 'verify',
      description: 'With health score and actionable fixes',
    },
  ]

  return (
    <section id="solution" className="py-24 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">Three Stages of Assurance</h2>
          <p className="text-xl text-text-secondary max-w-2xl">
            Pre-flight checks before you deploy, independent verification after. No manual
            cross-checking. No hidden failures.
          </p>
        </motion.div>

        {/* Three Stages Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              title: 'Pre-Flight',
              description: 'Before deploy is attempted',
              checks: ['AvalancheGo ↔ VM compatibility', 'Config resolution', 'Port availability'],
              icon: 'preflight',
            },
            {
              title: 'Deploy',
              description: 'Run your standard CLI commands',
              checks: ['avalanche blockchain deploy', 'All existing flows work', 'Zero modification'],
              icon: 'deploy',
            },
            {
              title: 'Post-Deploy',
              description: 'After chain is live',
              checks: ['Network status diff', 'Validator set verification', 'Genesis consistency'],
              icon: 'verify',
            },
          ].map((stage, idx) => (
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative"
            >
              {/* Connector Arrow */}
              {idx < 2 && (
                <div className="hidden md:block absolute -right-3 top-1/3">
                  <ArrowDown className="w-6 h-6 text-primary -rotate-90" />
                </div>
              )}

              <div className="bg-card border border-border rounded-xl p-6 h-full">
                <h3 className="text-lg font-semibold mb-1">{stage.title}</h3>
                <p className="text-sm text-text-secondary mb-6">{stage.description}</p>
                <ul className="space-y-2">
                  {stage.checks.map((check) => (
                    <li key={check} className="flex items-center gap-2 text-sm text-text-secondary">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      {check}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Before/After Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-error/5 border border-error/20 rounded-xl p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5 text-error" />
              <h3 className="text-lg font-semibold">Without Deploy Assurance</h3>
            </div>
            <DeploymentFlow title="Manual Verification" steps={beforeSteps} />
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-success/5 border border-success/20 rounded-xl p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <h3 className="text-lg font-semibold">With Deploy Assurance</h3>
            </div>
            <DeploymentFlow title="Automated Verification" steps={afterSteps} />
          </motion.div>
        </div>

        {/* Key Difference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-primary/10 border border-primary/30 rounded-xl p-8 text-center"
        >
          <p className="text-xl font-semibold mb-2">The Key Difference</p>
          <p className="text-text-secondary leading-relaxed">
            Deploy Assurance doesn't trust the CLI's own status report. It independently queries RPC
            and P-Chain state, then diffs it against what the CLI claimed. If they disagree, you
            know immediately — with actionable fixes, not just a red X.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
