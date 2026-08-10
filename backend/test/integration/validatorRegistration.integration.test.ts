import { describe, expect, it } from 'vitest'
import { validatorRegistrationCheck, getCurrentValidators } from '../../src/checks/validatorRegistration.js'
import { PUBLIC_P_CHAIN_URL } from '../../src/lib/avalancheRpc.js'

/**
 * Hits real Fuji testnet P-Chain infrastructure. Not part of the default
 * `npm test` run (see vitest.integration.config.ts) — run explicitly with
 * `npm run test:integration`. Proves the check works against live data, not
 * just mocks, per the project's "legitimate, demoable" bar.
 */
describe('validatorRegistrationCheck (live Fuji testnet)', () => {
  it('passes for a real, currently-registered Fuji validator', async () => {
    const validators = await getCurrentValidators(PUBLIC_P_CHAIN_URL.fuji)
    expect(validators.length).toBeGreaterThan(0)

    const liveNodeId = validators[0].nodeID

    const result = await validatorRegistrationCheck.run({ network: 'fuji', nodeId: liveNodeId })

    expect(['pass', 'warn']).toContain(result.status)
    expect(result.details?.nodeID).toBe(liveNodeId)
  })

  it('fails for a syntactically valid but non-existent nodeID', async () => {
    const result = await validatorRegistrationCheck.run({
      network: 'fuji',
      nodeId: 'NodeID-111111111111111111116DBWJs',
    })

    expect(result.status).toBe('fail')
  })
})
