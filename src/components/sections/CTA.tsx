'use client'

import { motion } from 'framer-motion'
import { ArrowRight, GitBranch } from 'lucide-react'

export default function CTA() {
  return (
    <section id="cta" className="py-24 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          {/* Main CTA */}
          <div className="space-y-4">
            <h2 className="text-5xl lg:text-6xl font-bold">Get Started in Seconds</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              No configuration required for the common case. Read-only. MIT-licensed. No strings
              attached.
            </p>
          </div>

          {/* Commands */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-6 text-left">
              <p className="text-xs text-text-secondary font-mono mb-3">via go install</p>
              <code className="text-sm text-highlight font-mono break-all">
                go install github.com/your-org/...@latest
              </code>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-left">
              <p className="text-xs text-text-secondary font-mono mb-3">or binary</p>
              <code className="text-sm text-highlight font-mono break-all">
                curl -sSfL https://... | sh
              </code>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="https://github.com/your-org/avalanche-deploy-assurance"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-bronze text-background font-semibold rounded-lg hover:shadow-bronze-glow-lg transition group"
            >
              <GitBranch size={20} />
              Get Started on GitHub
              <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
            </a>
            <a
              href="#demo"
              className="px-8 py-4 bg-card border border-border text-text-primary font-semibold rounded-lg hover:bg-surface transition"
            >
              See Live Demo
            </a>
          </div>

          {/* Quick Example */}
          <div className="bg-surface border border-border rounded-xl p-8 max-w-2xl mx-auto text-left mt-8">
            <p className="text-sm text-text-secondary mb-3 font-mono">$ example run</p>
            <code className="text-xs text-text-secondary font-mono leading-relaxed block whitespace-pre-wrap">
{`avalanche-deploy-assurance doctor --chain mychain --json

┌─────────────────────────────────────┐
│ Deployment: mychain                 │
│ Health: 100% • All checks passed    │
│ RPC: responding • Validators: 5 ✓   │
└─────────────────────────────────────┘`}
            </code>
          </div>

          {/* Trust Statement */}
          <div className="text-center pt-8">
            <p className="text-text-secondary mb-2">
              Built for the Avalanche L1 builder community
            </p>
            <p className="text-xs text-text-tertiary">
              MIT Licensed • Open Source • Built in Public • Zero Monetization
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
