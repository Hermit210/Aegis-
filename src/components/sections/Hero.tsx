'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Terminal, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import AnimatedStat from '@/components/AnimatedStat'
import Button from '@/components/ui/Button'

export default function Hero() {
  const terminalLines: { text: string; delay: number; healthScore?: number }[] = [
    { text: '$ avalanche-deploy verify', delay: 0.1 },
    { text: 'Scanning deployment...', delay: 0.6 },
    { text: '  RPC connection verified', delay: 1.2 },
    { text: '  Validator set synchronized', delay: 1.6 },
    { text: '  Config applied correctly', delay: 2.0 },
    { text: '  Health score: ', delay: 2.4, healthScore: 98 },
  ]

  const healthMetrics: {
    label: string
    value?: string
    count?: number
    suffix?: string
  }[] = [
    { label: 'Deployment Status', value: 'Verified' },
    { label: 'RPC Nodes', count: 3, suffix: '/3 Healthy' },
    { label: 'Validators', count: 5, suffix: '/5 Active' },
    { label: 'Config State', value: 'Synced' },
  ]

  return (
    <section className="min-h-screen bg-background flex flex-col justify-center items-center px-6 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Know Your Deploy
            <span className="block text-primary">Actually Worked</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
            Avalanche CLI says success but how do you know? Deploy Assurance gives builders certainty
            that their chain actually deployed, validators are live, and everything is configured correctly.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="#demo">
              <Button className="bg-primary hover:bg-primary/90 text-background">
                Try Demo <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/problem">
              <Button className="border border-primary text-primary hover:bg-primary/10 bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="bg-background/50 border-b border-border px-4 py-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-xs text-text-secondary font-mono">terminal</span>
            </div>
            <div className="p-6 font-mono text-sm space-y-2">
              {terminalLines.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: line.delay }}
                  className="text-text-secondary"
                >
                  {line.text}
                  {line.healthScore !== undefined && (
                    <AnimatedStat end={line.healthScore} suffix="%" delay={line.delay + 0.2} duration={1.2} />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {healthMetrics.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0 + idx * 0.15 }}
                className="bg-card border border-border rounded-lg p-4 text-center"
              >
                <div className="text-2xl font-bold mb-2 text-success">
                  {metric.count !== undefined ? (
                    <AnimatedStat end={metric.count} suffix={metric.suffix} delay={2.0 + idx * 0.15 + 0.2} duration={1} />
                  ) : (
                    metric.value
                  )}
                </div>
                <div className="text-xs text-text-secondary font-medium">{metric.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex flex-wrap justify-center gap-4 mt-16 text-sm text-text-secondary"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            Open Source
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            Avalanche Mainnet
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            CLI Compatible
          </div>
        </motion.div>
      </div>
    </section>
  )
}
