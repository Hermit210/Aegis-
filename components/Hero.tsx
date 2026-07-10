'use client'

import { motion } from 'framer-motion'
import { Button } from './Button'
import { Terminal } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
}

export function Hero() {
  return (
    <section className="pt-24 md:pt-32 pb-5xl bg-background">
      <div className="max-w-container mx-auto px-lg md:px-2xl">
        <motion.div
          className="grid md:grid-cols-2 gap-3xl items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <h1 className="text-text mb-lg leading-tight">
              Know Your Deployment Actually Worked
            </h1>

            <p className="text-lg text-text mb-2xl">
              Verify validator registration, configuration, and chain health with one command.
            </p>

            <div className="flex flex-col sm:flex-row gap-lg">
              <Button
                variant="primary"
                size="lg"
                onClick={() => document.getElementById('getting-started')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Install Now
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => window.location.href = '/docs'}
              >
                View Docs →
              </Button>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            variants={itemVariants}
            className="hidden md:flex items-center justify-center"
          >
            <div className="w-full aspect-video bg-card border border-border rounded-lg shadow-level-2 flex items-center justify-center">
              <div className="p-2xl w-full">
                <div className="bg-background rounded-md p-lg font-mono text-sm">
                  <div className="text-accent mb-md">$ aegis doctor</div>
                  <div className="space-y-sm">
                    <div className="flex items-center gap-md">
                      <span className="text-success">✓</span>
                      <span className="text-text">Pre-Flight Checks</span>
                    </div>
                    <div className="flex items-center gap-md">
                      <span className="text-success">✓</span>
                      <span className="text-text">Post-Deploy Verification</span>
                    </div>
                    <div className="flex items-center gap-md">
                      <span className="text-highlight">→</span>
                      <span className="text-text">Health Score: 0.95 / 1.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
