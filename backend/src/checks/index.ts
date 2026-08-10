import type { Check, CheckResult, CheckTarget } from '../types/check.js'
import { portAvailabilityCheck } from './portAvailability.js'
import { validatorRegistrationCheck } from './validatorRegistration.js'
import { genesisConsistencyCheck } from './genesisConsistency.js'
import { networkStateCheck } from './networkState.js'
import { versionCompatibilityCheck } from './versionCompatibility.js'
import { configValidationCheck } from './configValidation.js'

export const ALL_CHECKS: Check[] = [
  portAvailabilityCheck,
  validatorRegistrationCheck,
  genesisConsistencyCheck,
  networkStateCheck,
  versionCompatibilityCheck,
  configValidationCheck,
]

export async function runAllChecks(target: CheckTarget): Promise<CheckResult[]> {
  return Promise.all(ALL_CHECKS.map((check) => check.run(target)))
}

export {
  portAvailabilityCheck,
  validatorRegistrationCheck,
  genesisConsistencyCheck,
  networkStateCheck,
  versionCompatibilityCheck,
  configValidationCheck,
}
