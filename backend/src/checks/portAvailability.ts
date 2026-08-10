import net from 'node:net'
import type { Check, CheckTarget } from '../types/check.js'
import { resultOf } from '../types/check.js'

/** Avalanche's default staking and HTTP API ports. */
export const DEFAULT_PORTS = [9651, 9650]

function isPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.once('error', () => resolve(false))
    server.once('listening', () => {
      server.close(() => resolve(true))
    })
    server.listen(port, '0.0.0.0')
  })
}

const ID = 'port-availability'
const NAME = 'Port availability'

export const portAvailabilityCheck: Check = {
  id: ID,
  name: NAME,
  async run(target: CheckTarget) {
    const startedAt = Date.now()
    const ports = target.ports?.length ? target.ports : DEFAULT_PORTS

    const results = await Promise.all(
      ports.map(async (port) => ({ port, free: await isPortFree(port) }))
    )
    const taken = results.filter((r) => !r.free).map((r) => r.port)

    if (taken.length === 0) {
      return resultOf(
        ID,
        NAME,
        'pass',
        `All ${ports.length} checked port(s) are free: ${ports.join(', ')}.`,
        startedAt,
        { ports, taken: [] }
      )
    }

    return resultOf(
      ID,
      NAME,
      'fail',
      `Port(s) already in use: ${taken.join(', ')}.`,
      startedAt,
      { ports, taken }
    )
  },
}
