import type { CheckResult, CheckTarget } from './types/check.js'
import { runAllChecks } from './checks/index.js'
import { computeHealthScore } from './score/computeHealthScore.js'

export type VerifyReport = {
  target: CheckTarget
  results: CheckResult[]
  score: number | null
  skipped: { id: string; reason: string }[]
  timestamp: string
}

/** Single source of truth for a verification run — reused by both the CLI and the JSON API so their output never drifts apart. */
export async function verify(target: CheckTarget): Promise<VerifyReport> {
  const results = await runAllChecks(target)
  const { score, skipped } = computeHealthScore(results)
  return { target, results, score, skipped, timestamp: new Date().toISOString() }
}
