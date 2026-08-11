import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { configValidationCheck } from '../../src/checks/configValidation.js'

function mockAdmin(body: unknown) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: true, status: 200, json: async () => body }))
}

describe('configValidationCheck', () => {
  beforeEach(() => vi.restoreAllMocks())
  afterEach(() => vi.unstubAllGlobals())

  it('returns unavailable without a nodeUrl (Admin API is not public)', async () => {
    const result = await configValidationCheck.run({})
    expect(result.status).toBe('unavailable')
  })

  it('passes when all expected config keys are present', async () => {
    mockAdmin({
      jsonrpc: '2.0',
      id: 1,
      result: { 'network-id': 5, 'http-port': 9650, 'staking-port': 9651 },
    })

    const result = await configValidationCheck.run({ nodeUrl: 'http://localhost:9650' })

    expect(result.status).toBe('pass')
  })

  it('warns (not fails) when expected keys are missing, since no full schema exists', async () => {
    mockAdmin({ jsonrpc: '2.0', id: 1, result: { 'network-id': 5 } })

    const result = await configValidationCheck.run({ nodeUrl: 'http://localhost:9650' })

    expect(result.status).toBe('warn')
    expect(result.details?.missing).toEqual(['http-port', 'staking-port'])
  })

  it('returns unavailable with a hint about --api-admin-enabled when the API is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('ECONNREFUSED')))

    const result = await configValidationCheck.run({ nodeUrl: 'http://localhost:9650' })

    expect(result.status).toBe('unavailable')
    expect(result.message).toContain('--api-admin-enabled')
  })
})
