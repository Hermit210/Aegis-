import type { CheckResult } from '../types/check.js'

export type CheckWeight = { id: string; weight: number }

/**
 * Weights reflect how bad each failure mode is, not how hard the check was to
 * build. Genesis mismatch is weighted heaviest: it's the hardest failure to
 * recover from and the project's real differentiator (no other tool catches
 * it). Port conflicts are weighted lightest: almost always transient and
 * trivially fixable, not evidence the deployment itself is broken. Sums to
 * 1.0 across all six so a fully-run verification maps cleanly to 0.0–1.0.
 */
export const DEFAULT_WEIGHTS: CheckWeight[] = [
  // 0.30 — hardest failure to recover from; the check no other tool covers.
  { id: 'genesis-consistency', weight: 0.3 },
  // 0.20 — a validator silently missing/disconnected from the set it should
  // be in is a deploy that looks done but isn't actually securing anything.
  { id: 'validator-registration', weight: 0.2 },
  // 0.20 — tied with validator registration: an unhealthy node or an
  // unreachable chain RPC means nothing else in the report can be trusted
  // as current, even if it individually passed.
  { id: 'network-state', weight: 0.2 },
  // 0.15 — a real risk (mismatched RPCChainVM protocol can break block
  // production), but it's a known, well-documented failure mode with a
  // clear fix (upgrade one side), unlike genesis or validator issues.
  { id: 'version-compatibility', weight: 0.15 },
  // 0.10 — config drift is usually a misconfiguration to fix, not evidence
  // the chain itself is broken; also the check with the narrowest scope
  // (only a handful of well-known flags, no published canonical schema).
  { id: 'config-validation', weight: 0.1 },
  // 0.05 — almost always transient/trivially fixable, not evidence the
  // deployment itself is broken.
  { id: 'port-availability', weight: 0.05 },
]

export type HealthScoreResult = {
  /** null when no check produced a usable (non-unavailable) result — a score would be meaningless. */
  score: number | null
  breakdown: { id: string; status: CheckResult['status']; weight: number; credit: number }[]
  skipped: { id: string; reason: string }[]
}

/**
 * pass = full credit, warn = half credit, fail = none. 'unavailable' checks
 * are excluded from both the numerator and the weight total (renormalized
 * across whatever actually ran) rather than counted as failures — but always
 * listed in `skipped`, so a score can never be inflated by silently dropping
 * checks the caller doesn't notice are missing.
 */
export function computeHealthScore(
  results: CheckResult[],
  weights: CheckWeight[] = DEFAULT_WEIGHTS
): HealthScoreResult {
  const weightById = new Map(weights.map((w) => [w.id, w.weight]))

  const breakdown: HealthScoreResult['breakdown'] = []
  const skipped: HealthScoreResult['skipped'] = []
  let totalWeight = 0
  let earnedWeight = 0

  for (const result of results) {
    const weight = weightById.get(result.id) ?? 0

    if (result.status === 'unavailable') {
      skipped.push({ id: result.id, reason: result.message })
      continue
    }

    const credit = result.status === 'pass' ? 1 : result.status === 'warn' ? 0.5 : 0
    totalWeight += weight
    earnedWeight += weight * credit
    breakdown.push({ id: result.id, status: result.status, weight, credit: weight * credit })
  }

  if (totalWeight === 0) {
    return { score: null, breakdown, skipped }
  }

  return { score: Math.round((earnedWeight / totalWeight) * 100) / 100, breakdown, skipped }
}
