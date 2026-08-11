import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildServer } from '../../src/api/server.js'

describe('POST /verify', () => {
  let app: FastifyInstance

  beforeEach(() => {
    app = buildServer()
  })
  afterEach(async () => {
    await app.close()
  })

  it('GET /health responds ok', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' })
    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ ok: true })
  })

  it('runs all six checks and returns a report shaped like verify()', async () => {
    // no nodeUrl/network given, so every check that needs one honestly
    // reports unavailable — this doesn't hit the network, keeping it in the
    // default (non-integration) test suite, while still proving the HTTP
    // plumbing (route, body parsing, JSON response) actually works.
    const response = await app.inject({ method: 'POST', url: '/verify', payload: {} })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.results).toHaveLength(6)
    expect(body).toHaveProperty('score')
    expect(body).toHaveProperty('skipped')
    expect(body).toHaveProperty('timestamp')
  })

  it('passes the request body through as the check target', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/verify',
      payload: { ports: [0] },
    })

    const body = response.json()
    const portCheck = body.results.find((r: { id: string }) => r.id === 'port-availability')
    expect(portCheck.details.ports).toEqual([0])
  })

  it('handles an empty body without crashing', async () => {
    const response = await app.inject({ method: 'POST', url: '/verify' })
    expect(response.statusCode).toBe(200)
  })
})
