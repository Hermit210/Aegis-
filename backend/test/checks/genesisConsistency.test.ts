import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { genesisConsistencyCheck } from '../../src/checks/genesisConsistency.js'

function toBase64(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj), 'utf-8').toString('base64')
}

/** Mocks platform.getTx to return a CreateChainTx-shaped response with the given genesis. */
function mockGetTx(genesis: unknown | undefined) {
  return vi.fn().mockImplementationOnce(async (_url: string, init: { body: string }) => {
    const body = JSON.parse(init.body)
    expect(body.method).toBe('platform.getTx')
    return {
      ok: true,
      status: 200,
      json: async () => ({
        jsonrpc: '2.0',
        id: 1,
        result: genesis === undefined ? { tx: { unsignedTx: {} } } : { tx: { unsignedTx: { genesisData: toBase64(genesis) } } },
      }),
    }
  })
}

function mockChainRpc(getTxMock: ReturnType<typeof vi.fn>, liveChainId: number, blockHash = '0xabc123') {
  const fetchMock = vi.fn().mockImplementation(async (url: string, init: { body: string }) => {
    if (url.includes('/ext/bc/P') || url.endsWith('/P')) return getTxMock(url, init)
    const body = JSON.parse(init.body)
    if (body.method === 'eth_chainId') {
      return { ok: true, status: 200, json: async () => ({ jsonrpc: '2.0', id: 1, result: `0x${liveChainId.toString(16)}` }) }
    }
    if (body.method === 'eth_getBlockByNumber') {
      return { ok: true, status: 200, json: async () => ({ jsonrpc: '2.0', id: 1, result: { hash: blockHash } }) }
    }
    throw new Error(`unexpected method ${body.method}`)
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('genesisConsistencyCheck', () => {
  beforeEach(() => vi.restoreAllMocks())
  afterEach(() => vi.unstubAllGlobals())

  it('returns unavailable without a blockchainId', async () => {
    const result = await genesisConsistencyCheck.run({ network: 'fuji' })
    expect(result.status).toBe('unavailable')
  })

  it('returns unavailable without a nodeUrl or network to reach the P-Chain', async () => {
    const result = await genesisConsistencyCheck.run({ blockchainId: 'abc' })
    expect(result.status).toBe('unavailable')
  })

  it('returns unavailable when platform.getTx fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('ECONNREFUSED')))
    const result = await genesisConsistencyCheck.run({ blockchainId: 'abc', network: 'fuji' })
    expect(result.status).toBe('unavailable')
  })

  it('returns unavailable when the transaction has no genesisData (not a CreateChainTx)', async () => {
    const getTx = mockGetTx(undefined)
    mockChainRpc(getTx, 1)
    const result = await genesisConsistencyCheck.run({ blockchainId: 'abc', network: 'fuji' })
    expect(result.status).toBe('unavailable')
  })

  it('returns unavailable when genesisData has no config.chainId', async () => {
    const getTx = mockGetTx({ config: {} })
    mockChainRpc(getTx, 1)
    const result = await genesisConsistencyCheck.run({ blockchainId: 'abc', network: 'fuji' })
    expect(result.status).toBe('unavailable')
  })

  it('returns unavailable when there is no chain RPC endpoint to query live state', async () => {
    const getTx = mockGetTx({ config: { chainId: 43112 } })
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementationOnce(async (url: string, init: { body: string }) => getTx(url, init))
    )
    const result = await genesisConsistencyCheck.run({ blockchainId: 'abc', network: 'fuji' })
    expect(result.status).toBe('unavailable')
    expect(result.details?.creationChainId).toBe(43112)
  })

  it('passes when the on-chain creation chainId matches the live chain', async () => {
    const getTx = mockGetTx({ config: { chainId: 43112 } })
    mockChainRpc(getTx, 43112)

    const result = await genesisConsistencyCheck.run({
      blockchainId: 'abc',
      network: 'fuji',
      chainRpcUrl: 'http://localhost:9650/ext/bc/X/rpc',
    })

    expect(result.status).toBe('pass')
    expect(result.details?.genesisBlockHash).toBe('0xabc123')
  })

  it('fails when the on-chain creation chainId differs from the live chain', async () => {
    const getTx = mockGetTx({ config: { chainId: 43112 } })
    mockChainRpc(getTx, 99999)

    const result = await genesisConsistencyCheck.run({
      blockchainId: 'abc',
      network: 'fuji',
      chainRpcUrl: 'http://localhost:9650/ext/bc/X/rpc',
    })

    expect(result.status).toBe('fail')
    expect(result.details).toMatchObject({ creationChainId: 43112, liveChainId: 99999 })
  })

  it('resolves chain RPC from nodeUrl + blockchainId when chainRpcUrl is not given', async () => {
    const getTx = mockGetTx({ config: { chainId: 43112 } })
    const fetchMock = vi.fn().mockImplementation(async (url: string, init: { body: string }) => {
      if (url === 'http://localhost:9650/ext/bc/P') return getTx(url, init)
      return { ok: true, status: 200, json: async () => ({ jsonrpc: '2.0', id: 1, result: '0xa870' }) }
    })
    vi.stubGlobal('fetch', fetchMock)

    await genesisConsistencyCheck.run({ blockchainId: 'abc123', nodeUrl: 'http://localhost:9650' })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:9650/ext/bc/abc123/rpc', expect.anything())
  })
})
