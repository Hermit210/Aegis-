'use client'
import { motion } from 'framer-motion'
import { Play, CheckCircle2, XCircle, AlertTriangle, MinusCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import Button from '@/components/ui/Button'

type CheckStatus = 'pass' | 'fail' | 'warn' | 'unavailable'
type CheckResult = { id: string; name: string; status: CheckStatus; message: string }
type VerifyReport = { results: CheckResult[]; score: number | null; skipped: { id: string; reason: string }[] }

const STATUS_ICON: Record<CheckStatus, React.ReactNode> = {
  pass: <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />,
  fail: <XCircle className="w-5 h-5 text-error flex-shrink-0" />,
  warn: <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />,
  unavailable: <MinusCircle className="w-5 h-5 text-text-tertiary flex-shrink-0" />,
}

export default function Demo() {
  const [state, setState] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [report, setReport] = useState<VerifyReport | null>(null)

  async function run() {
    setState('running')
    setReport(null)
    try {
      const res = await fetch('/api/verify/demo')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: VerifyReport = await res.json()
      setReport(data)
      setState('done')
    } catch {
      setState('error')
    }
  }

  return (
    <section id="demo" className="py-24 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-5xl font-bold mb-4">See It Live</h2>
        <p className="text-xl text-text-secondary mb-12">
          Real, live verification against Fuji testnet — not a simulation. Picks a currently-connected
          validator and checks it, plus Fuji&apos;s C-Chain genesis and RPC reachability, right now.
        </p>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Fuji testnet</h3>
              <p className="text-xs text-text-secondary">Live deployment verification</p>
            </div>
            <Button
              onClick={run}
              disabled={state === 'running'}
              className={`px-4 py-2 font-medium ${
                state === 'running' ? 'bg-primary/40 text-background' : 'bg-primary text-background'
              }`}
            >
              {state === 'running' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {state === 'running' ? 'Running' : 'Run'}
            </Button>
          </div>
          <div className="p-6">
            {state === 'idle' && <p className="text-center py-12 text-text-secondary">Click Run to start</p>}
            {state === 'error' && (
              <p className="text-center py-12 text-error">
                Live check failed to run — the API route may be unreachable right now.
              </p>
            )}
            {(state === 'running' || state === 'done') && (
              <div className="space-y-2">
                {state === 'running' && !report && (
                  <div className="flex items-center gap-3 p-3 text-text-secondary">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    Querying live Fuji P-Chain and RPC data…
                  </div>
                )}
                {report?.results.map((result, idx) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.08 }}
                    className="p-3 rounded-lg border border-border bg-surface"
                  >
                    <div className="flex items-start gap-3">
                      {STATUS_ICON[result.status]}
                      <div className="min-w-0">
                        <span className="text-sm font-medium">{result.name}</span>
                        <p className="text-xs text-text-secondary mt-0.5">{result.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {report && (
                  <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      Health score{report.skipped.length > 0 ? ` (${report.skipped.length} unavailable, excluded)` : ''}
                    </span>
                    <span className="font-mono font-semibold">
                      {report.score === null ? 'n/a' : report.score.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
