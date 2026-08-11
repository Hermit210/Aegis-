import type { Check, CheckTarget } from '../types/check.js'
import { resultOf } from '../types/check.js'
import { AvalancheRpcError, callJsonRpc } from '../lib/avalancheRpc.js'

const ID = 'config-validation'
const NAME = 'Config resolution'

/**
 * No canonical JSON schema for AvalancheGo's resolved config is published
 * (per Ava Labs' own docs) — this validates presence of a handful of
 * well-known top-level flags rather than claiming full schema validation,
 * which nothing publicly documents precisely enough to build honestly.
 */
const EXPECTED_KEYS = ['network-id', 'http-port', 'staking-port'] as const

export const configValidationCheck: Check = {
  id: ID,
  name: NAME,
  async run(target: CheckTarget) {
    const startedAt = Date.now()

    if (!target.nodeUrl) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        'No nodeUrl specified. The Admin API is node-specific and not reachable via the public API server.',
        startedAt
      )
    }

    const adminUrl = `${target.nodeUrl.replace(/\/+$/, '')}/ext/admin`

    try {
      const config = await callJsonRpc<Record<string, unknown>>(adminUrl, 'admin.getConfig', {})

      const missing = EXPECTED_KEYS.filter((key) => !(key in config))
      const details = { presentKeys: Object.keys(config), missing, queried: adminUrl }

      if (missing.length > 0) {
        return resultOf(
          ID,
          NAME,
          'warn',
          `Admin API responded, but the resolved config is missing expected key(s): ${missing.join(', ')}. This checks a handful of well-known flags, not a full schema — none is publicly published.`,
          startedAt,
          details
        )
      }

      return resultOf(
        ID,
        NAME,
        'pass',
        `Resolved config includes all checked flags (${EXPECTED_KEYS.join(', ')}).`,
        startedAt,
        details
      )
    } catch (err) {
      const message =
        err instanceof AvalancheRpcError
          ? `${err.message} (the Admin API is disabled by default — enable it with --api-admin-enabled to use this check).`
          : `Unexpected error querying ${adminUrl}: ${(err as Error).message}`
      return resultOf(ID, NAME, 'unavailable', message, startedAt)
    }
  },
}
