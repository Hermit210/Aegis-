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
})
