'use client'
import { motion } from 'framer-motion'
import { Play, CheckCircle2, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'

export default function Demo() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const mockChecks = [
    { id: 'rpcchainvm', name: 'RPCChainVM Compatibility', pass: true, time: 120 },
    { id: 'config', name: 'Config Resolution', pass: true, time: 150 },
    { id: 'ports', name: 'Port Availability', pass: true, time: 100 },
  ]

  useEffect(() => {
    if (!isRunning) return
    setResults([])
    let index = 0
    const timer = setInterval(() => {
      if (index < mockChecks.length) {
        const check = mockChecks[index]
        setResults((prev) => [...prev, { ...check, status: 'running' }])
        setTimeout(() => {
          setResults((prev) =>
            prev.map((r, i) => (i === prev.length - 1 ? { ...r, status: 'complete' } : r))
          )
        }, check.time)
        index++
      } else {
        setIsRunning(false)
        clearInterval(timer)
      }
    }, 300)
    return () => clearInterval(timer)
  }, [isRunning])

  return (
    <section id="demo" className="py-24 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-5xl font-bold mb-4">See It Live</h2>
        <p className="text-xl text-text-secondary mb-12">Click below to run a deployment verification.</p>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">mychain</h3>
              <p className="text-xs text-text-secondary">Deployment Verification</p>
            </div>
            <Button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-2 font-medium ${
                isRunning ? 'bg-error/20 text-error' : 'bg-primary text-background'
              }`}
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Stop' : 'Run'}
            </Button>
          </div>
          <div className="p-6">
            {results.length === 0 ? (
              <p className="text-center py-12 text-text-secondary">Click Run to start</p>
            ) : (
              <div className="space-y-2">
                {results.map((result, idx) => (
                  <motion.div key={result.id} initial={{opacity: 0}} animate={{opacity: 1}} className="p-3 rounded-lg border border-border bg-surface">
                    <div className="flex items-center gap-3">
                      {result.status === 'complete' ? (
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      ) : (
                        <Clock className="w-5 h-5 text-primary animate-spin" />
                      )}
                      <span className="text-sm">{result.name}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
