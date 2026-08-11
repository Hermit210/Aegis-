import { describe, expect, it } from 'vitest'
import { genesisConsistencyCheck } from '../../src/checks/genesisConsistency.js'

const FUJI_C_CHAIN_ID = 'yH8D7ThNJkxmtkuv2jgBa4P1Rn3Qpr4pPr7QYNfcdoS6k6HWp'
const FUJI_C_CHAIN_RPC = 'https://api.avax-test.network/ext/bc/C/rpc'
const FUJI_C_CHAIN_CHAINID = 43113

/**
 * Hits real Fuji testnet P-Chain + C-Chain RPC. Not part of the default
 * `npm test` run (see vitest.integration.config.ts) — run explicitly with
 * `npm run test:integration`.
 *
 * C-Chain's own creation is retrievable via platform.getTx just like a
 * user-created subnet-evm chain's CreateChainTx (verified manually before
 * writing this: platform.getTx({txID: C-Chain's blockchainID}) returns a
 * genesisData field decoding to the real Fuji C-Chain genesis, chainId
 * 43113) — and unlike most subnet L1s, C-Chain's RPC is reliably public,
 * which is what makes it usable as a full round-trip integration target.
 */
describe('genesisConsistencyCheck (live Fuji P-Chain + C-Chain)', () => {
  it('passes: on-chain genesis-creation chainId matches the live C-Chain', async () => {
    const result = await genesisConsistencyCheck.run({
      blockchainId: FUJI_C_CHAIN_ID,
      network: 'fuji',
      chainRpcUrl: FUJI_C_CHAIN_RPC,
    })

    expect(result.status).toBe('pass')
    expect(result.details?.creationChainId).toBe(FUJI_C_CHAIN_CHAINID)
    expect(result.details?.liveChainId).toBe(FUJI_C_CHAIN_CHAINID)
    expect(typeof result.details?.genesisBlockHash).toBe('string')
  })

  it('returns unavailable for a syntactically valid but non-existent blockchain ID', async () => {
    const result = await genesisConsistencyCheck.run({
      blockchainId: '11111111111111111111111111111111LpoYY',
      network: 'fuji',
      chainRpcUrl: FUJI_C_CHAIN_RPC,
    })

    expect(result.status).toBe('unavailable')
  })
})
