import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { validatorRegistrationCheck } from '../../src/checks/validatorRegistration.js'

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValueOnce({
      ok,
      status,
      json: async () => body,
    })
  )
}

describe('validatorRegistrationCheck', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns unavailable when no node/network is specified', async () => {
    const result = await validatorRegistrationCheck.run({ nodeId: 'NodeID-abc' })
    expect(result.status).toBe('unavailable')
  })

  it('returns unavailable when no nodeId is specified', async () => {
    const result = await validatorRegistrationCheck.run({ network: 'fuji' })
    expect(result.status).toBe('unavailable')
  })

  it('passes when the node is registered and connected', async () => {
    mockFetchOnce({
      jsonrpc: '2.0',
      id: 1,
      result: {
        validators: [{ nodeID: 'NodeID-abc', weight: '2000000', connected: true, uptime: '99.98' }],
      },
    })

    const result = await validatorRegistrationCheck.run({ network: 'fuji', nodeId: 'NodeID-abc' })

    expect(result.status).toBe('pass')
    expect(result.message).toContain('registered and connected')
  })

  it('warns when the node is registered but disconnected', async () => {
    mockFetchOnce({
      jsonrpc: '2.0',
      id: 1,
      result: { validators: [{ nodeID: 'NodeID-abc', connected: false }] },
    })

    const result = await validatorRegistrationCheck.run({ network: 'fuji', nodeId: 'NodeID-abc' })

    expect(result.status).toBe('warn')
  })

  it('fails when the node is not in the validator set', async () => {
    mockFetchOnce({ jsonrpc: '2.0', id: 1, result: { validators: [] } })

    const result = await validatorRegistrationCheck.run({ network: 'fuji', nodeId: 'NodeID-missing' })

    expect(result.status).toBe('fail')
  })

  it('returns unavailable (not a crash) when the RPC call fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('network down')))

    const result = await validatorRegistrationCheck.run({ network: 'fuji', nodeId: 'NodeID-abc' })

    expect(result.status).toBe('unavailable')
    expect(result.message).toContain('network down')
  })

  it('prefers a nodeUrl target over the public network shortcut', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ jsonrpc: '2.0', id: 1, result: { validators: [] } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await validatorRegistrationCheck.run({ nodeUrl: 'http://localhost:9650', nodeId: 'NodeID-abc' })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:9650/ext/bc/P', expect.anything())
  })
})
