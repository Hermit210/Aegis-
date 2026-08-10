import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { versionCompatibilityCheck } from '../../src/checks/versionCompatibility.js'

function mockInfo(body: unknown) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: true, status: 200, json: async () => body }))
}

describe('versionCompatibilityCheck', () => {
  beforeEach(() => vi.restoreAllMocks())
  afterEach(() => vi.unstubAllGlobals())

  it('returns unavailable without a nodeUrl (Info API is not public)', async () => {
    const result = await versionCompatibilityCheck.run({})
    expect(result.status).toBe('unavailable')
  })

  it('returns unavailable when the reported rpcProtocolVersion has no compatibility data', async () => {
    mockInfo({
      jsonrpc: '2.0',
      id: 1,
      result: { version: 'avalanche/9.9.9', databaseVersion: '1.0.0', rpcProtocolVersion: '999999' },
    })

    const result = await versionCompatibilityCheck.run({ nodeUrl: 'http://localhost:9650' })

    expect(result.status).toBe('unavailable')
    expect(result.message).toContain('999999')
  })

  it('passes when the reported rpcProtocolVersion is in the compatibility table', async () => {
    mockInfo({
      jsonrpc: '2.0',
      id: 1,
      result: { version: 'avalanche/1.13.0', databaseVersion: '1.0.0', rpcProtocolVersion: '39' },
    })

    const result = await versionCompatibilityCheck.run({ nodeUrl: 'http://localhost:9650' })

    expect(result.status).toBe('pass')
  })

  it('returns unavailable (not a crash) when the node is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('ECONNREFUSED')))
    const result = await versionCompatibilityCheck.run({ nodeUrl: 'http://localhost:9650' })
    expect(result.status).toBe('unavailable')
  })
})
