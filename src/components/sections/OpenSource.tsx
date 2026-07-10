'use client'

import { motion } from 'framer-motion'
import { FileText, Users, GitBranch, Zap } from 'lucide-react'

export default function OpenSource() {
  return (
    <section id="opensource" className="py-24 bg-surface border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">Open Source, Open Design</h2>
          <p className="text-xl text-text-secondary max-w-2xl">
            Public from day one. MIT licensed. Evidence-based decision making. No monetization.
          </p>
        </motion.div>

        {/* Four Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: FileText,
              title: 'MIT Licensed',
              description: 'Permissive. Embed anywhere.',
            },
            {
              icon: Users,
              title: 'Community Checks',
              description: 'Low-friction contributions.',
            },
            {
              icon: GitBranch,
              title: 'Public Repo',
              description: 'Transparent from day one.',
            },
            {
              icon: Zap,
              title: 'Honest Maintenance',
              description: 'Clear issue triage process.',
            },
          ].map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary transition group"
              >
                <div className="mb-4 inline-block p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{pillar.title}</h3>
                <p className="text-sm text-text-secondary">{pillar.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Contributing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-primary/10 border border-primary/30 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold mb-4">How to Contribute</h3>
          <p className="text-text-secondary mb-6">
            The easiest way: implement a new check. It's a self-contained PR with no impact on the
            rest of the codebase.
          </p>
          <ol className="space-y-3 text-sm text-text-secondary">
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">1.</span>
              <span>Implement the Check interface in internal/checks/</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">2.</span>
              <span>Register in internal/checks/registry.go</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">3.</span>
              <span>Add fixture-based tests reproducing a real issue</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">4.</span>
              <span>Open a PR with evidence for why the check matters</span>
            </li>
          </ol>
        </motion.div>
      </div>
    </section>
  )
}
