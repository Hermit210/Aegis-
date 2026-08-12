'use client'

import { motion } from 'framer-motion'
import { Check, Clock } from 'lucide-react'

export default function Roadmap() {
  const milestones = [
    {
      version: 'Shipped',
      title: 'The six checks',
      week: 'Node/TypeScript',
      status: 'released',
      items: [
        'port-availability',
        'validator-registration',
        'genesis-consistency',
        'network-state',
        'version-compatibility',
        'config-validation',
      ],
    },
    {
      version: 'Shipped',
      title: 'Health score, CLI, API',
      week: 'Live-tested',
      status: 'released',
      items: ['aegis verify CLI', 'Fastify JSON API', 'Weighted health score', '51 unit + 4 live-Fuji tests'],
    },
    {
      version: 'Shipped',
      title: 'Deployed',
      week: 'This site',
      status: 'released',
      items: [
        'Live on Vercel',
        'Homepage demo calls the real backend',
        'Real Fuji data, not a simulation',
      ],
    },
    {
      version: 'In progress',
      title: 'Reconciling the marketing copy',
      week: 'Ongoing',
      status: 'beta',
      items: ['Fixed: /docs, /architecture', 'Fixed: /solution', 'Open: project naming (Aegis vs. this name)'],
    },
  ]

  return (
    <section id="roadmap" className="py-24 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">Project Status</h2>
          <p className="text-xl text-text-secondary max-w-2xl">
            What&apos;s actually built and live today, not a projected timeline. V2 below is still
            evidence-gated — scoped to real demand, not built yet.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mb-16">
          {/* Visual Timeline Line */}
          <div className="absolute top-0 left-6 w-0.5 h-full bg-gradient-to-b from-primary via-secondary to-highlight opacity-30" />

          <div className="space-y-8 pl-20">
            {milestones.map((milestone, idx) => (
              <motion.div
                key={milestone.title}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-16 top-2">
                  <div
                    className={`
                      w-12 h-12 rounded-full border-2 flex items-center justify-center bg-background
                      ${milestone.status === 'released' ? 'border-success bg-success/10' : ''}
                      ${milestone.status === 'beta' ? 'border-warning bg-warning/10' : ''}
                      ${milestone.status === 'internal' ? 'border-text-tertiary bg-text-tertiary/10' : ''}
                    `}
                  >
                    {milestone.status === 'released' ? (
                      <Check className="w-6 h-6 text-success" />
                    ) : (
                      <Clock className="w-6 h-6 text-text-tertiary" />
                    )}
                  </div>
                </div>

                {/* Milestone Card */}
                <div className="bg-card border border-border rounded-xl p-6 hover:border-primary transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-sm font-mono text-primary">{milestone.version}</span>
                      <h3 className="text-xl font-semibold">{milestone.title}</h3>
                    </div>
                    <span className="text-xs font-medium text-text-secondary bg-surface px-3 py-1 rounded-full">
                      {milestone.week}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {milestone.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* V2 Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-surface border border-border rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold mb-6">V2 — Contingent on Adoption</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Deploy Wrapper',
                threshold: 'If 3+ builders request it',
              },
              {
                title: 'Network-Runner Support',
                threshold: 'If production teams hit same bugs',
              },
              {
                title: 'Watch Mode',
                threshold: 'If not redundant with avalanche-monitoring',
              },
              {
                title: 'Smarter Repair Suggestions',
                threshold: 'Natural incremental improvement',
              },
            ].map((feature) => (
              <div key={feature.title} className="border border-border rounded-lg p-4">
                <p className="font-semibold mb-1">{feature.title}</p>
                <p className="text-sm text-text-secondary">{feature.threshold}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
