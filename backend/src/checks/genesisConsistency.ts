import { readFile } from 'node:fs/promises'
import type { Check, CheckTarget } from '../types/check.js'
import { resultOf } from '../types/check.js'
import { AvalancheRpcError, callJsonRpc } from '../lib/avalancheRpc.js'

const ID = 'genesis-consistency'
const NAME = 'Genesis consistency'

type SubnetEvmGenesis = {
  config?: { chainId?: number }
}

function resolveChainRpcUrl(target: CheckTarget): string | undefined {
  if (target.chainRpcUrl) return target.chainRpcUrl
  if (target.nodeUrl && target.blockchainId) {
    return `${target.nodeUrl.replace(/\/+$/, '')}/ext/bc/${target.blockchainId}/rpc`
  }
  return undefined
}

/**
 * Scoped deliberately: fully re-deriving a subnet-evm genesis block hash means
 * reimplementing block-header RLP encoding + Keccak hashing, which is real EVM
 * client internals — attempting that without near-certainty of correctness
 * would risk a check that *looks* rigorous but silently gives wrong answers,
 * which is worse than the honest partial version below. Compares the one
 * piece that's simple, well-defined, and catches a real misconfiguration
 * class (local genesis chainId vs. what the live chain actually reports),
 * and surfaces the live genesis block hash as informational context rather
 * than claiming to have verified it.
 */
export const genesisConsistencyCheck: Check = {
  id: ID,
  name: NAME,
  async run(target: CheckTarget) {
    const startedAt = Date.now()

    if (!target.genesisPath) {
      return resultOf(ID, NAME, 'unavailable', 'No local genesis file specified.', startedAt)
    }

    let genesis: SubnetEvmGenesis
    try {
      const raw = await readFile(target.genesisPath, 'utf-8')
      genesis = JSON.parse(raw)
    } catch (err) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        `Could not read/parse local genesis file at ${target.genesisPath}: ${(err as Error).message}`,
        startedAt
      )
    }

    const localChainId = genesis.config?.chainId
    if (localChainId === undefined) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        'Local genesis file has no config.chainId — is this a subnet-evm genesis?',
        startedAt
      )
    }

    const chainRpcUrl = resolveChainRpcUrl(target)
    if (!chainRpcUrl) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        'No chain RPC endpoint to query on-chain genesis state (need chainRpcUrl, or nodeUrl + blockchainId).',
        startedAt,
        { localChainId }
      )
    }

    try {
      const [onChainChainIdHex, genesisBlock] = await Promise.all([
        callJsonRpc<string>(chainRpcUrl, 'eth_chainId'),
        callJsonRpc<{ hash: string; stateRoot: string }>(chainRpcUrl, 'eth_getBlockByNumber', ['0x0', false]),
      ])

      const onChainChainId = parseInt(onChainChainIdHex, 16)
      const details = {
        localChainId,
        onChainChainId,
        genesisBlockHash: genesisBlock.hash,
        chainRpcUrl,
      }

      if (onChainChainId !== localChainId) {
        return resultOf(
          ID,
          NAME,
          'fail',
          `Local genesis declares chainId ${localChainId}, but the live chain reports ${onChainChainId}.`,
          startedAt,
          details
        )
      }

      return resultOf(
        ID,
        NAME,
        'pass',
        `Local genesis chainId (${localChainId}) matches the live chain. Genesis block hash reported on-chain is ${genesisBlock.hash} (informational — not independently re-derived from the local genesis file).`,
        startedAt,
        details
      )
    } catch (err) {
      const message =
        err instanceof AvalancheRpcError
          ? err.message
          : `Unexpected error querying ${chainRpcUrl}: ${(err as Error).message}`
      return resultOf(ID, NAME, 'unavailable', message, startedAt, { localChainId })
    }
  },
}
