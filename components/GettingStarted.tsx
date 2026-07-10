'use client'

import { motion } from 'framer-motion'
import { Button } from './Button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export function GettingStarted() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const installCommand = 'go install github.com/avalanche-labs/aegis/cmd@latest'

  return (
    <section id="getting-started" className="py-5xl bg-surface border-t border-border">
      <div className="max-w-container mx-auto px-lg md:px-2xl">
        <motion.h2
          className="text-center text-text mb-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Get Started in 60 Seconds
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-2 gap-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {/* Left Column */}
          <div className="flex flex-col justify-center">
            <h3 className="text-text font-semibold mb-2xl">1. Install</h3>
            <div className="bg-background border border-border rounded-lg p-lg mb-2xl group relative">
              <code className="text-highlight text-sm font-mono break-all">
                {installCommand}
              </code>
              <button
                onClick={() => copyToClipboard(installCommand)}
                className="absolute top-lg right-lg opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Copy to clipboard"
              >
                {copied ? (
                  <Check size={16} className="text-success" />
                ) : (
                  <Copy size={16} className="text-accent hover:text-highlight" />
                )}
              </button>
            </div>

            <h3 className="text-text font-semibold mb-2xl">2. Run Your First Check</h3>
            <div className="bg-background border border-border rounded-lg p-lg mb-2xl group relative">
              <code className="text-highlight text-sm font-mono block">
                $ aegis doctor \<br />
                &nbsp;&nbsp;--chain mychain
              </code>
              <button
                onClick={() => copyToClipboard('avalanche-deploy-assurance doctor --chain mychain')}
                className="absolute top-lg right-lg opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Copy to clipboard"
              >
                {copied ? (
                  <Check size={16} className="text-success" />
                ) : (
                  <Copy size={16} className="text-accent hover:text-highlight" />
                )}
              </button>
            </div>

            <Button
              variant="secondary"
              onClick={() => window.location.href = '/docs'}
              className="w-full"
            >
              Full Documentation →
            </Button>
          </div>

          {/* Right Column */}
          <div className="bg-background border border-border rounded-lg p-2xl shadow-level-2">
            <div className="bg-card rounded-md p-lg font-mono text-xs leading-relaxed">
              <div className="text-accent mb-lg">$ aegis doctor --chain mychain</div>

              <div className="space-y-sm">
                <div className="text-text">
                  <span className="text-success">✓</span> Pre-Flight Checks — mychain
                </div>
                <div className="text-accent ml-md text-xs">
                  [PASS] version-compatibility<br />
                  [WARNING] config-validation<br />
                  [PASS] port-availability
                </div>

                <div className="text-text mt-lg">
                  <span className="text-success">✓</span> Post-Deploy Verification — mychain
                </div>
                <div className="text-accent ml-md text-xs">
                  [PASS] validator-verification<br />
                  [PASS] network-state-verification<br />
                  [PASS] genesis-consistency
                </div>

                <div className="border-t border-border mt-lg pt-lg">
                  <div className="text-highlight font-semibold">Health Score: 0.95 / 1.0</div>
                  <div className="text-accent text-xs mt-md">
                    Result: 5 passed, 1 warning, 0 errors
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
