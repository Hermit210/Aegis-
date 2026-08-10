import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { genesisConsistencyCheck } from '../../src/checks/genesisConsistency.js'

const FUJI_C_CHAIN_RPC = 'https://api.avax-test.network/ext/bc/C/rpc'
const FUJI_C_CHAIN_ID = 43113

/**
 * Hits real Fuji testnet C-Chain RPC. Not part of the default `npm test` run.
 */
describe('genesisConsistencyCheck (live Fuji C-Chain)', () => {
  let dir: string

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'aegis-genesis-it-'))
  })
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  it('passes when the local genesis chainId matches Fuji C-Chain', async () => {
    const genesisPath = path.join(dir, 'genesis.json')
    await writeFile(genesisPath, JSON.stringify({ config: { chainId: FUJI_C_CHAIN_ID } }))

    const result = await genesisConsistencyCheck.run({ genesisPath, chainRpcUrl: FUJI_C_CHAIN_RPC })

    expect(result.status).toBe('pass')
    expect(result.details?.onChainChainId).toBe(FUJI_C_CHAIN_ID)
    expect(typeof result.details?.genesisBlockHash).toBe('string')
  })

  it('fails when the local genesis chainId does not match', async () => {
    const genesisPath = path.join(dir, 'genesis.json')
    await writeFile(genesisPath, JSON.stringify({ config: { chainId: 1 } }))

    const result = await genesisConsistencyCheck.run({ genesisPath, chainRpcUrl: FUJI_C_CHAIN_RPC })

    expect(result.status).toBe('fail')
  })
})
