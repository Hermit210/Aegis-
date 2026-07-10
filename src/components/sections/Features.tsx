'use client'

import { motion } from 'framer-motion'
import { Shield, Eye, Zap, Code2, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function Features() {
  const features = [
    { icon: Zap, title: 'Pre-Flight', desc: 'Before deploy', items: ['RPCChainVM', 'Config', 'Ports'], size: 'lg' },
    { icon: Eye, title: 'Verification', desc: 'After deploy', items: ['RPC', 'Validators', 'Genesis'], size: 'lg' },
    { icon: Shield, title: 'Read-Only', desc: 'No changes', items: ['Safe', 'Secure', 'Trust'], size: 'md' },
    { icon: Code2, title: 'CI-Ready', desc: 'JSON output', items: ['Exit codes', 'Structured', 'Automated'], size: 'md' },
    { icon: AlertCircle, title: 'Actionable', desc: 'Smart fixes', items: ['Suggestions', 'Links', 'Score'], size: 'md' },
    { icon: CheckCircle2, title: 'Easy', desc: 'Single binary', items: ['Auto-detect', 'Zero config', 'Remote'], size: 'md' },
  ]

  return (
    <section id="features" className="py-24 bg-surface border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="mb-16">
          <h2 className="text-5xl font-bold mb-4">Built for Trust</h2>
          <p className="text-xl text-text-secondary">Six independent capabilities that verify your L1.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon
            return (
              <motion.div key={f.title} initial={{opacity: 0}} animate={{opacity: 1}} className={`bg-card border border-border rounded-xl p-6 hover:border-primary transition group ${f.size === 'lg' ? 'lg:row-span-2' : ''}`}>
                <div className="mb-4 inline-block p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-text-secondary mb-4">{f.desc}</p>
                <ul className="space-y-2">
                  {f.items.map(i => (
                    <li key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {i}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
