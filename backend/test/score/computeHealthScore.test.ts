import { describe, expect, it } from 'vitest'
import { computeHealthScore, DEFAULT_WEIGHTS } from '../../src/score/computeHealthScore.js'
import type { CheckResult } from '../../src/types/check.js'

function result(id: string, status: CheckResult['status'], message = ''): CheckResult {
  return { id, name: id, status, message, durationMs: 0 }
}

describe('computeHealthScore', () => {
  it('weights sum to 1.0', () => {
    const total = DEFAULT_WEIGHTS.reduce((sum, w) => sum + w.weight, 0)
    expect(total).toBeCloseTo(1, 5)
  })

  it('scores 1.0 when every check passes', () => {
    const { score } = computeHealthScore(DEFAULT_WEIGHTS.map((w) => result(w.id, 'pass')))
    expect(score).toBe(1)
  })

  it('scores 0.0 when every check fails', () => {
    const { score } = computeHealthScore(DEFAULT_WEIGHTS.map((w) => result(w.id, 'fail')))
    expect(score).toBe(0)
  })

  it('gives half credit for warn', () => {
    const { score } = computeHealthScore([result('port-availability', 'warn')], [{ id: 'port-availability', weight: 1 }])
    expect(score).toBe(0.5)
  })

  it('weights genesis-consistency failure more heavily than port-availability failure', () => {
    const allPassExceptGenesis = computeHealthScore(
      DEFAULT_WEIGHTS.map((w) => result(w.id, w.id === 'genesis-consistency' ? 'fail' : 'pass'))
    ).score!
    const allPassExceptPort = computeHealthScore(
      DEFAULT_WEIGHTS.map((w) => result(w.id, w.id === 'port-availability' ? 'fail' : 'pass'))
    ).score!

    expect(allPassExceptGenesis).toBeLessThan(allPassExceptPort)
  })

  it('excludes unavailable checks from the weighted denominator (renormalizes)', () => {
    // only port-availability (0.05) ran and passed; everything else unavailable
    const results = DEFAULT_WEIGHTS.map((w) =>
      w.id === 'port-availability' ? result(w.id, 'pass') : result(w.id, 'unavailable', 'no node given')
    )
    const { score, skipped } = computeHealthScore(results)

    expect(score).toBe(1) // renormalized: the one check that ran, passed
    expect(skipped).toHaveLength(5)
  })

  it('returns a null score (not 0, not 1) when every check is unavailable', () => {
    const results = DEFAULT_WEIGHTS.map((w) => result(w.id, 'unavailable', 'no target given'))
    const { score, skipped } = computeHealthScore(results)

    expect(score).toBeNull()
    expect(skipped).toHaveLength(6)
  })

  it('always lists skipped checks with their reason, even when the score is otherwise fine', () => {
    const results = [result('genesis-consistency', 'pass'), result('port-availability', 'unavailable', 'no ports specified')]
    const { skipped } = computeHealthScore(results)

    expect(skipped).toEqual([{ id: 'port-availability', reason: 'no ports specified' }])
  })
})
