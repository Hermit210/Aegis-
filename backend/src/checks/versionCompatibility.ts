import type { Check, CheckTarget } from '../types/check.js'
import { resultOf } from '../types/check.js'
import { AvalancheRpcError, callJsonRpc } from '../lib/avalancheRpc.js'
import { RPC_CHAIN_VM_COMPATIBILITY } from './rpcChainVmCompatibility.js'

const ID = 'version-compatibility'
const NAME = 'AvalancheGo ↔ VM compatibility'

type NodeVersionResponse = {
  version: string
  databaseVersion: string
  rpcProtocolVersion: string
  vmVersions?: Record<string, string>
}

/** Info API is node-specific and NOT exposed on Avalanche's public API server. */
export const versionCompatibilityCheck: Check = {
  id: ID,
  name: NAME,
  async run(target: CheckTarget) {
    const startedAt = Date.now()

    if (!target.nodeUrl) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        'No nodeUrl specified. The Info API is node-specific and not reachable via the public API server.',
        startedAt
      )
    }

    const infoUrl = `${target.nodeUrl.replace(/\/+$/, '')}/ext/info`

    try {
      const info = await callJsonRpc<NodeVersionResponse>(infoUrl, 'info.getNodeVersion', {})
      const rpcProtocolVersion = parseInt(info.rpcProtocolVersion, 10)
      const compat = RPC_CHAIN_VM_COMPATIBILITY[rpcProtocolVersion]

      const details = {
        version: info.version,
        rpcProtocolVersion: info.rpcProtocolVersion,
        vmVersions: info.vmVersions,
        queried: infoUrl,
      }

      if (!compat) {
        return resultOf(
          ID,
          NAME,
          'unavailable',
          `No compatibility data for rpcProtocolVersion ${info.rpcProtocolVersion} (node reports AvalancheGo ${info.version}). Not in subnet-evm's published compatibility.json — see src/checks/rpcChainVmCompatibility.ts.`,
          startedAt,
          details
        )
      }

      return resultOf(
        ID,
        NAME,
        'pass',
        `AvalancheGo ${info.version} (rpcProtocolVersion ${info.rpcProtocolVersion}) is compatible with subnet-evm ${compat.subnetEvmVersions.join(', ')}.`,
        startedAt,
        details
      )
    } catch (err) {
      const message =
        err instanceof AvalancheRpcError
          ? err.message
          : `Unexpected error querying ${infoUrl}: ${(err as Error).message}`
      return resultOf(ID, NAME, 'unavailable', message, startedAt)
    }
  },
}
