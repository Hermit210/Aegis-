import type { CheckTarget } from '../types/check.js'

export class AvalancheRpcError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'AvalancheRpcError'
  }
}

type JsonRpcResponse<T> = {
  jsonrpc: '2.0'
  id: number
  result?: T
  error?: { code: number; message: string }
}

/**
 * Calls a JSON-RPC endpoint. Used for AvalancheGo's own methods (P-Chain
 * calls take an object of named params, e.g. platform.getCurrentValidators)
 * and for standard Ethereum JSON-RPC methods on chain RPCs (eth_* methods
 * take a positional array, e.g. eth_getBlockByNumber(["0x0", false])) — the
 * spec allows either shape, so callers pass whichever the method expects.
 */
export async function callJsonRpc<T>(
  baseUrl: string,
  method: string,
  params: unknown[] | Record<string, unknown> = []
): Promise<T> {
  let response: Response
  try {
    response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    })
  } catch (err) {
    throw new AvalancheRpcError(`Could not reach ${baseUrl}: ${(err as Error).message}`, { cause: err })
  }

  if (!response.ok) {
    throw new AvalancheRpcError(`${baseUrl} responded with HTTP ${response.status} for ${method}`)
  }

  const body = (await response.json()) as JsonRpcResponse<T>
  if (body.error) {
    throw new AvalancheRpcError(`${method} failed: ${body.error.message}`)
  }
  if (body.result === undefined) {
    throw new AvalancheRpcError(`${method} returned no result`)
  }
  return body.result
}

/** GETs and parses JSON from a REST-style endpoint (e.g. the Health API, which isn't JSON-RPC). */
export async function fetchJson<T>(url: string): Promise<{ status: number; body: T }> {
  let response: Response
  try {
    response = await fetch(url)
  } catch (err) {
    throw new AvalancheRpcError(`Could not reach ${url}: ${(err as Error).message}`, { cause: err })
  }

  let body: T
  try {
    body = (await response.json()) as T
  } catch (err) {
    throw new AvalancheRpcError(`${url} did not return valid JSON: ${(err as Error).message}`, { cause: err })
  }

  return { status: response.status, body }
}

/** Public Avalanche API gateway hosts (P/X/C-Chain are exposed here; Info/Health/Admin are not). */
export const PUBLIC_AVALANCHE_BASE_URL: Record<'mainnet' | 'fuji', string> = {
  mainnet: 'https://api.avax.network',
  fuji: 'https://api.avax-test.network',
}

/**
 * Resolves a node *base* URL (no `/ext/...` suffix) for P-Chain queries made
 * through AvalancheJS's PVMApi, which appends its own path internally: a
 * specific node's own base URL if nodeUrl is given, otherwise the public
 * mainnet/fuji gateway host.
 */
export function resolveNodeBaseUrl(target: CheckTarget): string | undefined {
  if (target.nodeUrl) return target.nodeUrl.replace(/\/+$/, '')
  if (target.network === 'mainnet' || target.network === 'fuji') return PUBLIC_AVALANCHE_BASE_URL[target.network]
  return undefined
}

/**
 * Resolves a chain-specific RPC endpoint: an explicit chainRpcUrl if given,
 * otherwise derived from a node's own base URL + blockchainId. Shared by
 * genesis-consistency (chain-state comparison) and network-state (RPC
 * reachability), since both need "the target chain's own RPC," not the
 * node's Info/Health/Admin APIs.
 */
export function resolveChainRpcUrl(target: CheckTarget): string | undefined {
  if (target.chainRpcUrl) return target.chainRpcUrl
  if (target.nodeUrl && target.blockchainId) {
    return `${target.nodeUrl.replace(/\/+$/, '')}/ext/bc/${target.blockchainId}/rpc`
  }
  return undefined
}
