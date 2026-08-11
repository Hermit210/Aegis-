/**
 * Maps AvalancheGo's rpcProtocolVersion (from info.getNodeVersion) to
 * subnet-evm versions confirmed compatible with it.
 *
 * Sourced directly from subnet-evm's own published compatibility.json — a
 * real canonical, machine-readable feed. (An earlier version of this file
 * assumed no such feed existed and shipped a single unverified placeholder
 * entry instead; that assumption was wrong for subnet-evm specifically,
 * which is the VM this project's genesis-consistency check targets. Other
 * VMs would need their own published compatibility.json to add here.)
 *
 * Source: https://raw.githubusercontent.com/ava-labs/subnet-evm/master/compatibility.json
 * Fetched: 2026-08-11. Re-fetch and update this table when adding support
 * for newer AvalancheGo/subnet-evm releases — don't hand-edit version
 * numbers from memory.
 */
export const RPC_CHAIN_VM_COMPATIBILITY: Record<number, { subnetEvmVersions: string[] }> = {
  44: { subnetEvmVersions: ['v0.8.0'] },
  43: { subnetEvmVersions: ['v0.7.9', 'v0.7.8'] },
  42: { subnetEvmVersions: ['v0.7.7', 'v0.7.6'] },
  41: { subnetEvmVersions: ['v0.7.5'] },
  40: { subnetEvmVersions: ['v0.7.4'] },
  39: { subnetEvmVersions: ['v0.7.3', 'v0.7.2', 'v0.7.1'] },
  38: { subnetEvmVersions: ['v0.7.0'] },
}
