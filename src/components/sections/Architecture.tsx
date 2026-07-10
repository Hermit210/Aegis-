'use client'

import { motion } from 'framer-motion'
import { Database, Network, GitBranch, CheckCircle2 } from 'lucide-react'

export default function Architecture() {
  const layers = [
    {
      name: 'CLI Layer',
      icon: GitBranch,
      items: ['cobra commands', 'Flag parsing', 'Error handling'],
      color: 'from-primary to-secondary',
    },
    {
      name: 'Checks Engine',
      icon: CheckCircle2,
      items: ['Pre-flight checks', 'Post-deploy checks', 'Result aggregation'],
      color: 'from-secondary to-highlight',
    },
    {
      name: 'State Readers',
      icon: Database,
      items: ['CLI config parser', 'RPC client', 'P-Chain client'],
      color: 'from-highlight to-primary',
    },
    {
      name: 'Report Generator',
      icon: Network,
      items: ['Health scoring', 'Text output', 'JSON output'],
      color: 'from-primary to-secondary',
    },
  ]

  return (
    <section id="architecture" className="py-24 bg-surface border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">Simple, Extensible Architecture</h2>
          <p className="text-xl text-text-secondary max-w-2xl">
            Four clean layers. Read-only. No CLI modification. Easy to add new checks.
          </p>
        </motion.div>

        {/* Animated Architecture Diagram */}
        <div className="mb-16 space-y-6">
          {layers.map((layer, idx) => {
            const Icon = layer.icon
            return (
              <motion.div
                key={layer.name}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative group"
              >
                {/* Layer Box */}
                <div
                  className={`
                    relative overflow-hidden rounded-xl border border-border p-6 transition
                    hover:border-primary cursor-pointer
                    bg-gradient-to-r ${layer.color} via-background to-background
                  `}
                  style={{
                    backgroundImage: `linear-gradient(90deg, rgba(139, 94, 60, 0.05) 0%, rgba(10, 10, 10, 0.8) 100%)`,
                  }}
                >
                  {/* Glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
                    <div
                      className="absolute inset-0 rounded-xl blur-2xl"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(139, 94, 60, 0.3) 0%, transparent 70%)',
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-6">
                    <div className="p-4 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition">
                      <Icon className="w-8 h-8 text-primary group-hover:text-secondary transition" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition">
                        {layer.name}
                      </h3>
                      <ul className="grid grid-cols-3 gap-3">
                        {layer.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {idx < layers.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.15 + 0.3 }}
                    className="flex justify-center py-2"
                  >
                    <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-transparent" />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Design Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Independent',
              description: 'Never modifies CLI or chain state. Observes and queries only.',
            },
            {
              title: 'Extensible',
              description: 'New checks are self-contained. No other files need to change.',
            },
            {
              title: 'Testable',
              description: 'Every check has fixture tests reproducing real GitHub issues.',
            },
          ].map((principle, idx) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary transition"
            >
              <h4 className="font-semibold mb-2">{principle.title}</h4>
              <p className="text-sm text-text-secondary">{principle.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
