import net from 'node:net'
import { describe, expect, it, afterEach } from 'vitest'
import { portAvailabilityCheck } from '../../src/checks/portAvailability.js'

describe('portAvailabilityCheck', () => {
  let blocker: net.Server | undefined

  afterEach(async () => {
    if (blocker) {
      await new Promise<void>((resolve) => blocker!.close(() => resolve()))
      blocker = undefined
    }
  })

  it('passes when the checked ports are free', async () => {
    const result = await portAvailabilityCheck.run({ ports: [0] })
    // port 0 asks the OS for an ephemeral free port, so this should always be free
    expect(result.status).toBe('pass')
    expect(result.id).toBe('port-availability')
  })

  it('fails when a checked port is already bound', async () => {
    blocker = net.createServer()
    const port = await new Promise<number>((resolve) => {
      blocker!.listen(0, '0.0.0.0', () => {
        resolve((blocker!.address() as net.AddressInfo).port)
      })
    })

    const result = await portAvailabilityCheck.run({ ports: [port] })

    expect(result.status).toBe('fail')
    expect(result.details?.taken).toEqual([port])
  })

  it('defaults to Avalanche staking/API ports when none are specified', async () => {
    const result = await portAvailabilityCheck.run({})
    expect(result.details?.ports).toEqual([9651, 9650])
  })
})
