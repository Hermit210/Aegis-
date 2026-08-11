import type { Check, CheckTarget } from '../types/check.js'
import { resultOf } from '../types/check.js'
import { AvalancheRpcError, callJsonRpc, fetchJson, resolveChainRpcUrl } from '../lib/avalancheRpc.js'

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

type SubCheckState = 'ok' | 'fail' | 'unreachable'

/**
 * Health API is node-specific and NOT exposed on Avalanche's public API
 * server (confirmed against docs before building this) — requires a
 * caller-supplied nodeUrl, unlike validator-registration or the chainId
 * half of genesis-consistency. Returns undefined (not attempted) when no
 * nodeUrl is given, distinct from actually querying and failing.
 */
async function checkHealthApi(
  target: CheckTarget
): Promise<{ state: SubCheckState; details: Record<string, unknown> } | undefined> {
  if (!target.nodeUrl) return undefined

  const url = `${target.nodeUrl.replace(/\/+$/, '')}/ext/health${target.subnetId ? `?tag=${encodeURIComponent(target.subnetId)}` : ''}`

  try {
    const { body } = await fetchJson<HealthResponse>(url)
    const failing = Object.entries(body.checks ?? {}).filter(([, c]) => c.healthy === false)
    const details = { checks: body.checks, failingChecks: failing.map(([name]) => name), queried: url }
    return { state: body.healthy ? 'ok' : 'fail', details }
  } catch (err) {
    const message =
      err instanceof AvalancheRpcError ? err.message : `Unexpected error querying ${url}: ${(err as Error).message}`
    return { state: 'unreachable', details: { queried: url, healthError: message } }
  }
}

/**
 * Direct RPC reachability on the target chain itself — separate from the
 * Health API, which reports the *node's* view of itself, not whether the
 * chain's own RPC actually answers requests. Uses eth_blockNumber: cheap,
 * side-effect-free, and valid on any subnet-evm chain.
 */
async function checkRpcReachability(
  target: CheckTarget
): Promise<{ state: SubCheckState; details: Record<string, unknown> } | undefined> {
  const chainRpcUrl = resolveChainRpcUrl(target)
  if (!chainRpcUrl) return undefined

  try {
    const blockNumberHex = await callJsonRpc<string>(chainRpcUrl, 'eth_blockNumber')
    return { state: 'ok', details: { chainRpcQueried: chainRpcUrl, blockNumber: parseInt(blockNumberHex, 16) } }
  } catch (err) {
    const message =
      err instanceof AvalancheRpcError
        ? err.message
        : `Unexpected error querying ${chainRpcUrl}: ${(err as Error).message}`
    return { state: 'unreachable', details: { chainRpcQueried: chainRpcUrl, rpcError: message } }
  }
}

export const networkStateCheck: Check = {
  id: ID,
  name: NAME,
  async run(target: CheckTarget) {
    const startedAt = Date.now()

    const [health, rpc] = await Promise.all([checkHealthApi(target), checkRpcReachability(target)])
    const attempted = [health, rpc].filter((r): r is NonNullable<typeof r> => r !== undefined)

    if (attempted.length === 0) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        'No nodeUrl (for the Health API) and no chain RPC target (chainRpcUrl, or nodeUrl + blockchainId) specified.',
        startedAt
      )
    }

    const details = attempted.reduce((acc, r) => ({ ...acc, ...r.details }), {} as Record<string, unknown>)
    const states = attempted.map((r) => r.state)

    if (states.includes('fail')) {
      const parts = []
      if (health?.state === 'fail') parts.push('node reports unhealthy')
      if (rpc?.state === 'fail') parts.push('chain RPC reports a failure')
      return resultOf(ID, NAME, 'fail', `Network state check failed: ${parts.join('; ')}.`, startedAt, details)
    }

    if (states.every((s) => s === 'unreachable')) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        'Nothing that was attempted could be reached (see details for per-target errors).',
        startedAt,
        details
      )
    }

    if (states.includes('unreachable')) {
      const parts = []
      if (health?.state === 'unreachable') parts.push('Health API unreachable')
      if (rpc?.state === 'unreachable') parts.push('chain RPC unreachable')
      const okParts = []
      if (health?.state === 'ok') okParts.push('node reports healthy')
      if (rpc?.state === 'ok') okParts.push('chain RPC reachable')
      return resultOf(
        ID,
        NAME,
        'warn',
        `Partial result: ${okParts.join('; ')}, but ${parts.join('; ')}.`,
        startedAt,
        details
      )
    }

    const okParts = []
    if (health?.state === 'ok') okParts.push('node reports healthy')
    if (rpc?.state === 'ok') okParts.push('chain RPC reachable')
    return resultOf(ID, NAME, 'pass', `${okParts.join('; ')}.`, startedAt, details)
  },
}
