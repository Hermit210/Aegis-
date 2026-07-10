'use client'

import { motion } from 'framer-motion'
import { AlertCircle, Check, CheckCircle2 } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

export function TheGap() {
  return (
    <section className="py-5xl bg-background border-t border-border">
      <div className="max-w-container mx-auto px-lg md:px-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-center text-text mb-3xl">
            The Deployment Moment Nobody Owns
          </h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-lg"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Column 1 */}
          <motion.div
            variants={itemVariants}
            className="bg-card border border-border rounded-lg p-xl shadow-level-2"
          >
            <div className="flex items-center gap-md mb-lg">
              <Check size={32} className="text-success" />
              <h3 className="text-text">Deployment Executes</h3>
            </div>
            <p className="text-accent text-sm">
              <span className="text-highlight font-semibold">Status quo:</span> Your CLI commands complete without error.
            </p>
          </motion.div>

          {/* Column 2 */}
          <motion.div
            variants={itemVariants}
            className="bg-card border border-border rounded-lg p-xl shadow-level-2"
          >
            <div className="flex items-center gap-md mb-lg">
              <AlertCircle size={32} className="text-warning" />
              <h3 className="text-text">But You Don't Know If It Worked</h3>
            </div>
            <p className="text-accent text-sm">
              <span className="text-highlight font-semibold">The gap:</span> Success reported ≠ deployment correct. Manual cross-checking required.
            </p>
          </motion.div>

          {/* Column 3 */}
          <motion.div
            variants={itemVariants}
            className="bg-card border border-border rounded-lg p-xl shadow-level-2"
          >
            <div className="flex items-center gap-md mb-lg">
              <CheckCircle2 size={32} className="text-success" />
              <h3 className="text-text">Get Confident</h3>
            </div>
            <p className="text-accent text-sm">
              <span className="text-highlight font-semibold">The solution:</span> One command. One report. Unified confidence signal.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
