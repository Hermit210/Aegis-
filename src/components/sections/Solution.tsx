'use client'

import { motion } from 'framer-motion'
import { ArrowDown, CheckCircle2, AlertCircle, Zap } from 'lucide-react'
import { useGsapReveal } from '@/lib/useGsapReveal'
import { checkStages } from '@/lib/checks'

export default function Solution() {
  const stagesRef = useGsapReveal<HTMLDivElement>({ selector: '.reveal-stage', y: 30, stagger: 0.12 })

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
    { label: 'avalanche blockchain deploy', status: 'verify' },
    {
      label: 'aegis verify',
      status: 'auto',
      description: 'One command, all six checks — no separate preflight/postdeploy stages',
    },
    {
      label: 'Deployment verified ✓',
      status: 'verify',
      description: 'With a health score, run again any time — read-only, nothing to undo',
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
          <h2 className="text-5xl font-bold mb-4">One Command, Run Anytime</h2>
          <p className="text-xl text-text-secondary max-w-2xl">
            The same <code className="mx-1 px-1.5 py-0.5 rounded bg-surface border border-border text-sm">aegis verify</code> works before or after you deploy — checks that need a chain
            that doesn&apos;t exist yet honestly report unavailable, not a fake pass. No manual
            cross-checking. No hidden failures.
          </p>
        </motion.div>

        {/* Overview: what aegis verify checks, grouped conceptually around the deploy step */}
        <div ref={stagesRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              title: checkStages[0].title,
              description: 'What aegis verify checks about your node',
              checks: checkStages[0].checks.map((c) => c.name),
            },
            {
              title: 'Deploy',
              description: 'Run your standard CLI commands',
              checks: ['avalanche blockchain deploy', 'All existing flows work', 'Zero modification'],
            },
            {
              title: checkStages[1].title,
              description: 'What aegis verify checks once a chain exists',
              checks: checkStages[1].checks.map((c) => c.name),
            },
          ].map((stage, idx) => (
            <div key={stage.title} className="reveal-stage relative">
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
            </div>
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
            Deploy Assurance doesn&apos;t trust the CLI&apos;s own status report — it never reads the
            CLI&apos;s local state at all. It independently queries live RPC and P-Chain data directly. If
            something isn&apos;t reachable, it says so honestly instead of guessing.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
