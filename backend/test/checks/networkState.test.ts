import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { networkStateCheck } from '../../src/checks/networkState.js'

function mockHealth(body: unknown, status = 200) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ status, json: async () => body }))
}

describe('networkStateCheck', () => {
  beforeEach(() => vi.restoreAllMocks())
  afterEach(() => vi.unstubAllGlobals())

  it('returns unavailable without a nodeUrl (Health API is not public)', async () => {
    const result = await networkStateCheck.run({})
    expect(result.status).toBe('unavailable')
  })

  it('passes when the node reports healthy', async () => {
    mockHealth({ healthy: true, checks: {} })
    const result = await networkStateCheck.run({ nodeUrl: 'http://localhost:9650' })
    expect(result.status).toBe('pass')
  })

  it('fails and lists the failing sub-checks when unhealthy', async () => {
    mockHealth(
      { healthy: false, checks: { network: { healthy: false }, database: { healthy: true } } },
      503
    )
    const result = await networkStateCheck.run({ nodeUrl: 'http://localhost:9650' })
    expect(result.status).toBe('fail')
    expect(result.details?.failingChecks).toEqual(['network'])
  })

  it('returns unavailable (not a crash) when the node is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('ECONNREFUSED')))
    const result = await networkStateCheck.run({ nodeUrl: 'http://localhost:9650' })
    expect(result.status).toBe('unavailable')
  })

  it('appends a subnetID tag filter to the query when provided', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({ status: 200, json: async () => ({ healthy: true, checks: {} }) })
    vi.stubGlobal('fetch', fetchMock)

    await networkStateCheck.run({ nodeUrl: 'http://localhost:9650', subnetId: 'abc' })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:9650/ext/health?tag=abc')
  })

  function mockRpc(result: unknown) {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ jsonrpc: '2.0', id: 1, result }) })
    )
  }

  it('passes on chain RPC reachability alone when no nodeUrl is given', async () => {
    mockRpc('0x10')
    const result = await networkStateCheck.run({ chainRpcUrl: 'https://example.com/rpc' })
    expect(result.status).toBe('pass')
    expect(result.details?.blockNumber).toBe(16)
  })

  it('returns unavailable when the only attempted target (chain RPC) is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('ECONNREFUSED')))
    const result = await networkStateCheck.run({ chainRpcUrl: 'https://example.com/rpc' })
    expect(result.status).toBe('unavailable')
  })

  it('passes when both Health API and chain RPC are attempted and both succeed', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ status: 200, json: async () => ({ healthy: true, checks: {} }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ jsonrpc: '2.0', id: 1, result: '0x1' }) })
    vi.stubGlobal('fetch', fetchMock)

    const result = await networkStateCheck.run({
      nodeUrl: 'http://localhost:9650',
      chainRpcUrl: 'https://example.com/rpc',
    })
    expect(result.status).toBe('pass')
  })

  it('warns when one attempted target succeeds and the other is unreachable', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ status: 200, json: async () => ({ healthy: true, checks: {} }) })
      .mockRejectedValueOnce(new Error('ECONNREFUSED'))
    vi.stubGlobal('fetch', fetchMock)

    const result = await networkStateCheck.run({
      nodeUrl: 'http://localhost:9650',
      chainRpcUrl: 'https://example.com/rpc',
    })
    expect(result.status).toBe('warn')
  })

  it('fails when the node reports unhealthy even if chain RPC is reachable', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ status: 503, json: async () => ({ healthy: false, checks: {} }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ jsonrpc: '2.0', id: 1, result: '0x1' }) })
    vi.stubGlobal('fetch', fetchMock)

    const result = await networkStateCheck.run({
      nodeUrl: 'http://localhost:9650',
      chainRpcUrl: 'https://example.com/rpc',
    })
    expect(result.status).toBe('fail')
  })

  it('derives the chain RPC URL from nodeUrl + blockchainId when chainRpcUrl is not given', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ status: 200, json: async () => ({ healthy: true, checks: {} }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ jsonrpc: '2.0', id: 1, result: '0x5' }) })
    vi.stubGlobal('fetch', fetchMock)

    const result = await networkStateCheck.run({
      nodeUrl: 'http://localhost:9650',
      blockchainId: 'abc123',
    })
    expect(result.details?.chainRpcQueried).toBe('http://localhost:9650/ext/bc/abc123/rpc')
  })
})
