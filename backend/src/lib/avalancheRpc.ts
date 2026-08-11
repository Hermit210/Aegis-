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

/** P-Chain is public on Avalanche's API servers, unlike Info/Health/Admin. */
export const PUBLIC_P_CHAIN_URL: Record<'mainnet' | 'fuji', string> = {
  mainnet: 'https://api.avax.network/ext/bc/P',
  fuji: 'https://api.avax-test.network/ext/bc/P',
}

/**
 * Resolves a P-Chain endpoint for the target: a specific node's own P-Chain
 * (available on any AvalancheGo node, not just the public gateway) if
 * nodeUrl is given, otherwise the public mainnet/fuji endpoint.
 */
export function resolvePChainUrl(target: CheckTarget): string | undefined {
  if (target.nodeUrl) return `${target.nodeUrl.replace(/\/+$/, '')}/ext/bc/P`
  if (target.network === 'mainnet' || target.network === 'fuji') return PUBLIC_P_CHAIN_URL[target.network]
  return undefined
}
