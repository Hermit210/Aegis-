'use client'

import { motion } from 'framer-motion'
import { BarChart3, Wrench, GitBranch, Lock } from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Health Score',
    description: '0.95/1.0 confidence signal in one metric. Unified deployment health at a glance.',
  },
  {
    icon: Wrench,
    title: 'Guided Fixes',
    description: 'Every failing check includes "Fix:" guidance. Know exactly what to do when something\'s wrong.',
  },
  {
    icon: GitBranch,
    title: 'CI/CD Ready',
    description: 'JSON output, exit codes, GitHub Actions template. Integrate into any CI pipeline.',
  },
  {
    icon: Lock,
    title: 'Read-Only Trust',
    description: 'No private keys. No signing. No writes. Pure verification, by design.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export function Features() {
  return (
    <section className="py-5xl bg-background border-t border-border">
      <div className="max-w-container mx-auto px-lg md:px-2xl">
        <motion.h2
          className="text-center text-text mb-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          What You Get
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-lg"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-card border border-border rounded-lg p-xl shadow-level-2 hover:shadow-level-3 hover:-translate-y-sm transition-all group"
              >
                <div className="w-12 h-12 bg-surface rounded-md flex items-center justify-center mb-lg group-hover:bg-accent transition-colors">
                  <Icon size={24} className="text-highlight" />
                </div>
                <h3 className="text-text font-semibold mb-md">{feature.title}</h3>
                <p className="text-accent text-sm">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
