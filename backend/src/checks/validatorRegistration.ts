import type { Check, CheckTarget } from '../types/check.js'
import { resultOf } from '../types/check.js'
import { AvalancheRpcError, callJsonRpc, resolvePChainUrl } from '../lib/avalancheRpc.js'

const ID = 'validator-registration'
const NAME = 'Validator registration'

type Validator = {
  nodeID: string
  weight?: string
  connected?: boolean
  uptime?: string
  validationID?: string
}

type GetCurrentValidatorsResult = { validators: Validator[] }

/** Calls platform.getCurrentValidators against a resolved P-Chain URL. Exported for reuse (e.g. genesis consistency). */
export async function getCurrentValidators(
  pChainUrl: string,
  params: { subnetID?: string; nodeIDs?: string[] } = {}
): Promise<Validator[]> {
  const { validators } = await callJsonRpc<GetCurrentValidatorsResult>(
    pChainUrl,
    'platform.getCurrentValidators',
    params
  )
  return validators
}

export const validatorRegistrationCheck: Check = {
  id: ID,
  name: NAME,
  async run(target: CheckTarget) {
    const startedAt = Date.now()

    const pChainUrl = resolvePChainUrl(target)
    if (!pChainUrl) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        'No nodeUrl or network (mainnet/fuji) specified — cannot reach a P-Chain endpoint.',
        startedAt
      )
    }
    if (!target.nodeId) {
      return resultOf(ID, NAME, 'unavailable', 'No nodeId specified to look up in the validator set.', startedAt)
    }

    try {
      const validators = await getCurrentValidators(pChainUrl, {
        nodeIDs: [target.nodeId],
        subnetID: target.subnetId,
      })

      const validator = validators.find((v) => v.nodeID === target.nodeId)
      if (!validator) {
        const scope = target.subnetId ? `subnet ${target.subnetId}` : 'the Primary Network'
        return resultOf(
          ID,
          NAME,
          'fail',
          `${target.nodeId} is not in the current validator set for ${scope}.`,
          startedAt,
          { queried: pChainUrl }
        )
      }

      const connected = validator.connected !== false
      const uptimeSuffix = validator.uptime !== undefined ? ` (uptime ${validator.uptime}%)` : ''

      return resultOf(
        ID,
        NAME,
        connected ? 'pass' : 'warn',
        connected
          ? `${target.nodeId} is registered and connected${uptimeSuffix}.`
          : `${target.nodeId} is registered but not currently connected.`,
        startedAt,
        {
          nodeID: validator.nodeID,
          weight: validator.weight,
          uptime: validator.uptime,
          connected: validator.connected,
          queried: pChainUrl,
        }
      )
    } catch (err) {
      const message =
        err instanceof AvalancheRpcError
          ? err.message
          : `Unexpected error querying ${pChainUrl}: ${(err as Error).message}`
      return resultOf(ID, NAME, 'unavailable', message, startedAt)
    }
  },
}
