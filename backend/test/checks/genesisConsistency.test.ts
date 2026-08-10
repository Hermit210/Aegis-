import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { genesisConsistencyCheck } from '../../src/checks/genesisConsistency.js'

let dir: string
let genesisPath: string

async function writeGenesis(chainId: number) {
  genesisPath = path.join(dir, 'genesis.json')
  await writeFile(genesisPath, JSON.stringify({ config: { chainId } }))
}

function mockChainRpc(onChainChainId: number, blockHash = '0xabc123') {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation(async (_url: string, init: { body: string }) => {
      const body = JSON.parse(init.body)
      if (body.method === 'eth_chainId') {
        return { ok: true, status: 200, json: async () => ({ jsonrpc: '2.0', id: 1, result: `0x${onChainChainId.toString(16)}` }) }
      }
      if (body.method === 'eth_getBlockByNumber') {
        return { ok: true, status: 200, json: async () => ({ jsonrpc: '2.0', id: 1, result: { hash: blockHash, stateRoot: '0xdef' } }) }
      }
      throw new Error(`unexpected method ${body.method}`)
    })
  )
}

describe('genesisConsistencyCheck', () => {
  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'aegis-genesis-'))
  })
  afterEach(async () => {
    vi.unstubAllGlobals()
    await rm(dir, { recursive: true, force: true })
  })

  it('returns unavailable when no genesis file is specified', async () => {
    const result = await genesisConsistencyCheck.run({})
    expect(result.status).toBe('unavailable')
  })

  it('returns unavailable when the genesis file is not valid JSON', async () => {
    genesisPath = path.join(dir, 'bad.json')
    await writeFile(genesisPath, 'not json')
    const result = await genesisConsistencyCheck.run({ genesisPath })
    expect(result.status).toBe('unavailable')
  })

  it('returns unavailable when genesis has no config.chainId', async () => {
    genesisPath = path.join(dir, 'no-chainid.json')
    await writeFile(genesisPath, JSON.stringify({ config: {} }))
    const result = await genesisConsistencyCheck.run({ genesisPath })
    expect(result.status).toBe('unavailable')
  })

  it('returns unavailable when there is no chain RPC endpoint to query', async () => {
    await writeGenesis(43112)
    const result = await genesisConsistencyCheck.run({ genesisPath })
    expect(result.status).toBe('unavailable')
  })

  it('passes when local and on-chain chainId match', async () => {
    await writeGenesis(43112)
    mockChainRpc(43112)

    const result = await genesisConsistencyCheck.run({ genesisPath, chainRpcUrl: 'http://localhost:9650/ext/bc/X/rpc' })

    expect(result.status).toBe('pass')
    expect(result.details?.genesisBlockHash).toBe('0xabc123')
  })

  it('fails when local and on-chain chainId differ', async () => {
    await writeGenesis(43112)
    mockChainRpc(99999)

    const result = await genesisConsistencyCheck.run({ genesisPath, chainRpcUrl: 'http://localhost:9650/ext/bc/X/rpc' })

    expect(result.status).toBe('fail')
    expect(result.details).toMatchObject({ localChainId: 43112, onChainChainId: 99999 })
  })

  it('resolves chain RPC from nodeUrl + blockchainId when chainRpcUrl is not given', async () => {
    await writeGenesis(43112)
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ jsonrpc: '2.0', id: 1, result: '0xa870' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await genesisConsistencyCheck.run({ genesisPath, nodeUrl: 'http://localhost:9650', blockchainId: 'abc123' })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:9650/ext/bc/abc123/rpc', expect.anything())
  })

  it('sends eth_getBlockByNumber params as a positional array, not an object', async () => {
    await writeGenesis(43112)
    const fetchMock = vi.fn().mockImplementation(async (_url: string, init: { body: string }) => {
      const body = JSON.parse(init.body)
      if (body.method === 'eth_getBlockByNumber') {
        expect(Array.isArray(body.params)).toBe(true)
        expect(body.params).toEqual(['0x0', false])
      }
      return { ok: true, status: 200, json: async () => ({ jsonrpc: '2.0', id: 1, result: body.method === 'eth_chainId' ? '0xa870' : { hash: '0xabc', stateRoot: '0xdef' } }) }
    })
    vi.stubGlobal('fetch', fetchMock)

    await genesisConsistencyCheck.run({ genesisPath, chainRpcUrl: 'http://localhost:9650/ext/bc/X/rpc' })
  })
})
