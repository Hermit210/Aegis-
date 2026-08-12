import { NextResponse } from 'next/server'
import { verify } from '../../../../../backend/dist/verify.js'
import { getCurrentValidators } from '../../../../../backend/dist/checks/validatorRegistration.js'
import { PUBLIC_AVALANCHE_BASE_URL } from '../../../../../backend/dist/lib/avalancheRpc.js'

/** Fuji C-Chain — verified live (see backend/README.md): platform.getTx on this
 * ID returns a real CreateChainTx-shaped response, and its RPC is reliably
 * public, unlike most user-deployed L1s. */
const FUJI_C_CHAIN_ID = 'yH8D7ThNJkxmtkuv2jgBa4P1Rn3Qpr4pPr7QYNfcdoS6k6HWp'
const FUJI_C_CHAIN_RPC = 'https://api.avax-test.network/ext/bc/C/rpc'

/**
 * Demo target for the homepage's "Run Verification" button: real Fuji
 * testnet data, not a mock. No user input required, so it first looks up
 * a currently-connected validator from the live P-Chain validator set
 * rather than hardcoding a NodeID that could fall off the set later —
 * picking *which* real target to check, not faking the result.
 *
 * Three of the six checks (network-state's Health-API half, version
 * compatibility, config resolution) will honestly report `unavailable`
 * here — they need a real AvalancheGo node (--node-url), which this public
 * demo doesn't have. That's the intended, honest behavior, not a bug.
 */
export async function GET() {
  let nodeId: string | undefined
  try {
    const validators = await getCurrentValidators(PUBLIC_AVALANCHE_BASE_URL.fuji)
    nodeId = (validators.find((v) => v.connected) ?? validators[0])?.nodeID
  } catch {
    // Validator lookup failing doesn't block the rest of the demo — verify()
    // will just report validator-registration as unavailable without a nodeId.
  }

  const report = await verify({
    network: 'fuji',
    nodeId,
    blockchainId: FUJI_C_CHAIN_ID,
    chainRpcUrl: FUJI_C_CHAIN_RPC,
  })

  return NextResponse.json(report)
}
