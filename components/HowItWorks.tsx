'use client'

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

const stageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15 },
  }),
}

export function HowItWorks() {
  return (
    <section className="py-5xl bg-surface border-t border-border">
      <div className="max-w-container mx-auto px-lg md:px-2xl">
        <motion.h2
          className="text-center text-text mb-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Three Stages. One Command.
        </motion.h2>

        <div className="flex flex-col items-center max-w-2xl mx-auto">
          {/* Pre-Flight */}
          <motion.div
            custom={0}
            variants={stageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full md:w-96 bg-card border border-border rounded-lg p-2xl text-center shadow-level-2 mb-3xl"
          >
            <div className="text-2xl font-bold text-highlight mb-md">PRE-FLIGHT</div>
            <p className="text-accent text-sm">
              Validates configuration, versions, ports before deployment
            </p>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-3xl"
          >
            <ArrowDown size={32} className="text-highlight" />
          </motion.div>

          {/* Deploy */}
          <motion.div
            custom={1}
            variants={stageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full md:w-96 bg-card border border-border rounded-lg p-2xl text-center shadow-level-2 mb-3xl"
          >
            <div className="text-2xl font-bold text-highlight mb-md">DEPLOY</div>
            <p className="text-accent text-sm">
              Your avalanche-cli deployment commands run here
            </p>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-3xl"
          >
            <ArrowDown size={32} className="text-highlight" />
          </motion.div>

          {/* Post-Deploy */}
          <motion.div
            custom={2}
            variants={stageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full md:w-96 bg-card border border-border rounded-lg p-2xl text-center shadow-level-2 mb-3xl"
          >
            <div className="text-2xl font-bold text-highlight mb-md">VERIFY</div>
            <p className="text-accent text-sm">
              Independently verifies validators, chain state, genesis against live network
            </p>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mb-3xl"
          >
            <ArrowDown size={32} className="text-highlight" />
          </motion.div>

          {/* Report */}
          <motion.div
            custom={3}
            variants={stageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full md:w-96 bg-highlight text-background border border-highlight rounded-lg p-2xl text-center shadow-level-3"
          >
            <div className="text-2xl font-bold mb-md">REPORT</div>
            <div className="text-sm font-semibold">Health Score + Fixes</div>
            <div className="mt-md font-mono text-xs">0.95 / 1.0</div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
