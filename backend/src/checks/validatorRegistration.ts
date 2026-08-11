import { pvm } from '@avalabs/avalanchejs'
import type { Check, CheckTarget } from '../types/check.js'
import { resultOf } from '../types/check.js'
import { resolveNodeBaseUrl } from '../lib/avalancheRpc.js'

const ID = 'validator-registration'
const NAME = 'Validator registration'

/** Calls platform.getCurrentValidators via AvalancheJS's PVMApi against a resolved node base URL. Exported for reuse. */
export async function getCurrentValidators(
  nodeBaseUrl: string,
  params: pvm.GetCurrentValidatorsParams = {}
): Promise<pvm.ValidatorInfo[]> {
  const api = new pvm.PVMApi(nodeBaseUrl)
  const { validators } = await api.getCurrentValidators(params)
  return validators
}

export const validatorRegistrationCheck: Check = {
  id: ID,
  name: NAME,
  async run(target: CheckTarget) {
    const startedAt = Date.now()

    const nodeBaseUrl = resolveNodeBaseUrl(target)
    if (!nodeBaseUrl) {
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
      const validators = await getCurrentValidators(nodeBaseUrl, {
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
          { queried: nodeBaseUrl }
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
          queried: nodeBaseUrl,
        }
      )
    } catch (err) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        `Could not query the validator set at ${nodeBaseUrl}: ${(err as Error).message}`,
        startedAt
      )
    }
  },
}
