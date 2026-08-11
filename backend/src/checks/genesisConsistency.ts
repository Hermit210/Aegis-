import { pvm } from '@avalabs/avalanchejs'
import type { Check, CheckTarget } from '../types/check.js'
import { resultOf } from '../types/check.js'
import { AvalancheRpcError, callJsonRpc, resolveChainRpcUrl, resolveNodeBaseUrl } from '../lib/avalancheRpc.js'

const ID = 'genesis-consistency'
const NAME = 'Genesis consistency'

type SubnetEvmGenesis = {
  config?: { chainId?: number }
}

/**
 * A blockchain's ID *is* the ID of the P-Chain CreateChainTx that created
 * it (verified live: platform.getTx({txID: blockchainID, encoding:'json'})
 * returns the transaction with a base64 `genesisData` field containing the
 * exact genesis JSON submitted at creation — confirmed against both a
 * user-created Fuji subnet-evm chain and Fuji's own C-Chain). That means
 * genesis can be sourced entirely on-chain, with no local genesis file
 * needed — the check no other tool can do, because it doesn't depend on
 * having filesystem access to whatever machine ran the deploy.
 */
function decodeGenesisData(base64: string): SubnetEvmGenesis {
  return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'))
}

/**
 * Scoped deliberately: fully re-deriving a subnet-evm genesis block hash
 * would mean reimplementing block-header RLP encoding + Keccak hashing —
 * real EVM client internals. Attempting that without near-certainty of
 * correctness would risk a check that *looks* rigorous but silently gives
 * wrong answers, which is worse than the honest partial version below.
 * Compares the one piece that's simple, well-defined, and catches a real
 * misconfiguration class: the chainId declared in the immutable
 * genesis-creation transaction vs. what the live chain currently reports.
 */
export const genesisConsistencyCheck: Check = {
  id: ID,
  name: NAME,
  async run(target: CheckTarget) {
    const startedAt = Date.now()

    if (!target.blockchainId) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        'No blockchainId specified. Genesis consistency looks up the on-chain genesis-creation transaction by blockchain ID.',
        startedAt
      )
    }

    const nodeBaseUrl = resolveNodeBaseUrl(target)
    if (!nodeBaseUrl) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        'No nodeUrl or network (mainnet/fuji) specified — cannot reach a P-Chain endpoint to look up the genesis-creation transaction.',
        startedAt
      )
    }

    let genesisDataB64: string | undefined
    try {
      const api = new pvm.PVMApi(nodeBaseUrl)
      const tx = await api.getTxJson({ txID: target.blockchainId })
      genesisDataB64 = tx.tx.unsignedTx.genesisData
    } catch (err) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        `Could not look up the genesis-creation transaction for blockchain ${target.blockchainId} at ${nodeBaseUrl}: ${(err as Error).message}`,
        startedAt
      )
    }

    if (!genesisDataB64) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        `platform.getTx for ${target.blockchainId} did not return genesisData — is this a valid blockchain ID?`,
        startedAt
      )
    }

    let onChainGenesis: SubnetEvmGenesis
    try {
      onChainGenesis = decodeGenesisData(genesisDataB64)
    } catch (err) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        `Could not parse genesisData for blockchain ${target.blockchainId}: ${(err as Error).message}`,
        startedAt
      )
    }

    const creationChainId = onChainGenesis.config?.chainId
    if (creationChainId === undefined) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        'The on-chain genesis-creation transaction has no config.chainId — is this a subnet-evm chain?',
        startedAt
      )
    }

    const chainRpcUrl = resolveChainRpcUrl(target)
    if (!chainRpcUrl) {
      return resultOf(
        ID,
        NAME,
        'unavailable',
        'No chain RPC endpoint to query current live chain state (need chainRpcUrl, or nodeUrl + blockchainId).',
        startedAt,
        { creationChainId }
      )
    }

    try {
      const [liveChainIdHex, genesisBlock] = await Promise.all([
        callJsonRpc<string>(chainRpcUrl, 'eth_chainId'),
        callJsonRpc<{ hash: string }>(chainRpcUrl, 'eth_getBlockByNumber', ['0x0', false]),
      ])

      const liveChainId = parseInt(liveChainIdHex, 16)
      const details = {
        blockchainId: target.blockchainId,
        creationChainId,
        liveChainId,
        genesisBlockHash: genesisBlock.hash,
        pChainQueried: nodeBaseUrl,
        chainRpcQueried: chainRpcUrl,
      }

      if (liveChainId !== creationChainId) {
        return resultOf(
          ID,
          NAME,
          'fail',
          `The on-chain genesis-creation transaction declared chainId ${creationChainId}, but the live chain currently reports ${liveChainId}.`,
          startedAt,
          details
        )
      }

      return resultOf(
        ID,
        NAME,
        'pass',
        `Live chain's chainId (${liveChainId}) matches the chainId declared in its on-chain genesis-creation transaction. Genesis block hash currently reported is ${genesisBlock.hash} (informational — not independently re-derived from genesisData).`,
        startedAt,
        details
      )
    } catch (err) {
      const message =
        err instanceof AvalancheRpcError
          ? err.message
          : `Unexpected error querying ${chainRpcUrl}: ${(err as Error).message}`
      return resultOf(ID, NAME, 'unavailable', message, startedAt, { creationChainId })
    }
  },
}
