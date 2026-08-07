'use client'

import { motion } from 'framer-motion'
import { ArrowRight, GitBranch } from 'lucide-react'

export default function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 25% 15%, rgba(255,255,255,0.12) 0%, transparent 55%)',
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          {/* Main CTA */}
          <div className="space-y-4">
            <h2 className="text-5xl lg:text-6xl font-bold text-white">Get Started in Seconds</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              No configuration required for the common case. Read-only. MIT-licensed. No strings
              attached.
            </p>
          </div>

          {/* Commands */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 max-w-2xl mx-auto">
            <div className="bg-black/20 border border-white/15 rounded-xl p-6 text-left backdrop-blur-sm">
              <p className="text-xs text-white/60 font-mono mb-3">via go install</p>
              <code className="text-sm text-white font-mono break-all">
                go install github.com/Hermit210/Aegis-/...@latest
              </code>
            </div>
            <div className="bg-black/20 border border-white/15 rounded-xl p-6 text-left backdrop-blur-sm">
              <p className="text-xs text-white/60 font-mono mb-3">or binary</p>
              <code className="text-sm text-white font-mono break-all">
                curl -sSfL https://... | sh
              </code>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="https://github.com/Hermit210/Aegis-"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-white/90 transition group"
            >
              <GitBranch size={20} />
              Get Started on GitHub
              <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
            </a>
            <a
              href="#demo"
              className="px-8 py-4 bg-transparent border border-white/40 text-white font-semibold rounded-lg hover:bg-white/10 transition"
            >
              See Live Demo
            </a>
          </div>

          {/* Quick Example */}
          <div className="bg-black/20 border border-white/15 rounded-xl p-8 max-w-2xl mx-auto text-left mt-8 backdrop-blur-sm">
            <p className="text-sm text-white/60 mb-3 font-mono">$ example run</p>
            <code className="text-xs text-white/80 font-mono leading-relaxed block whitespace-pre-wrap">
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
            <p className="text-white/80 mb-2">
              Built for the Avalanche L1 builder community
            </p>
            <p className="text-xs text-white/50">
              MIT Licensed • Open Source • Built in Public • Zero Monetization
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
