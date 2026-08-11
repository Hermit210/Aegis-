/**
 * 'unavailable' exists so a check can fail honestly when the API it needs isn't
 * reachable (e.g. Info/Admin/Health APIs are node-specific and not exposed on
 * Avalanche's public API servers) instead of silently skipping or faking a pass.
 */
export type CheckStatus = 'pass' | 'fail' | 'warn' | 'unavailable'

export type CheckResult = {
  id: string
  name: string
  status: CheckStatus
  message: string
  details?: Record<string, unknown>
  durationMs: number
}

export type CheckTarget = {
  /** AvalancheGo node base URL, for Info/Health/Admin APIs (e.g. http://localhost:9650). Not the public API server — those APIs aren't exposed there. */
  nodeUrl?: string
  /** Which public P-Chain/chain-RPC infrastructure to use for checks that don't need a specific node. */
  network?: 'mainnet' | 'fuji' | 'local'
  /** Base URL for a specific chain's RPC (e.g. a subnet's public endpoint), for genesis consistency. */
  chainRpcUrl?: string
  subnetId?: string
  blockchainId?: string
  nodeId?: string
  /** Ports to check for availability (defaults to Avalanche's standard staking/API ports). */
  ports?: number[]
}

export type Check = {
  id: string
  name: string
  run(target: CheckTarget): Promise<CheckResult>
}

export function resultOf(
  id: string,
  name: string,
  status: CheckStatus,
  message: string,
  startedAt: number,
  details?: Record<string, unknown>
): CheckResult {
  return { id, name, status, message, details, durationMs: Date.now() - startedAt }
}
