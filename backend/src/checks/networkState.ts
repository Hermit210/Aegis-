import type { Check, CheckTarget } from '../types/check.js'
import { resultOf } from '../types/check.js'
import { AvalancheRpcError, fetchJson } from '../lib/avalancheRpc.js'

const ID = 'network-state'
const NAME = 'Network state'

type HealthCheckDetail = {
  message?: string
  error?: string
  healthy?: boolean
}

type HealthResponse = {
  checks?: Record<string, HealthCheckDetail>
  healthy?: boolean
}

/**
 * Health API is node-specific and NOT exposed on Avalanche's public API
 * server (confirmed against docs before building this) — requires a
 * caller-supplied nodeUrl, unlike validator-registration or the chainId
 * half of genesis-consistency.
 */
export const networkStateCheck: Check = {
  id: ID,
  name: NAME,
  async run(target: CheckTarget) {
    const startedAt = Date.now()

    if (!target.nodeUrl) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        'No nodeUrl specified. The Health API is node-specific and not reachable via the public API server.',
        startedAt
      )
    }

    const url = `${target.nodeUrl.replace(/\/+$/, '')}/ext/health${target.subnetId ? `?tag=${encodeURIComponent(target.subnetId)}` : ''}`

    try {
      const { body } = await fetchJson<HealthResponse>(url)

      const failing = Object.entries(body.checks ?? {}).filter(([, c]) => c.healthy === false)
      const details = { checks: body.checks, failingChecks: failing.map(([name]) => name), queried: url }

      if (body.healthy) {
        return resultOf(ID, NAME, 'pass', 'Node reports healthy.', startedAt, details)
      }

      return resultOf(
        ID,
        NAME,
        'fail',
        failing.length
          ? `Node reports unhealthy: ${failing.map(([name]) => name).join(', ')}.`
          : 'Node reports unhealthy.',
        startedAt,
        details
      )
    } catch (err) {
      const message =
        err instanceof AvalancheRpcError ? err.message : `Unexpected error querying ${url}: ${(err as Error).message}`
      return resultOf(ID, NAME, 'unavailable', message, startedAt)
    }
  },
}
