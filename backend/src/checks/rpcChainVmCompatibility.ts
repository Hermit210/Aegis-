/**
 * Maps AvalancheGo's rpcProtocolVersion (from info.getNodeVersion) to the VM
 * versions known to be compatible with it. No canonical machine-readable feed
 * exists for this (per Avalanche's own docs) — Ava Labs publishes it as prose
 * in each release's notes, so this table has to be maintained by hand.
 *
 * Deliberately seeded with only ONE illustrative, clearly-unverified entry
 * rather than a full table of specific version numbers pulled from memory:
 * fabricating precise compatibility data I'm not confident is currently
 * correct would be worse than admitting the table is empty, since a wrong
 * "pass" here is actively misleading. Populate this from the actual
 * AvalancheGo release notes for the versions you care about — see
 * backend/README.md.
 */
export const RPC_CHAIN_VM_COMPATIBILITY: Record<number, { avalancheGoVersions: string[]; note: string }> = {
  // Illustrative only — verify against https://github.com/ava-labs/avalanchego/releases
  // before relying on this for a real compatibility decision.
  39: {
    avalancheGoVersions: ['v1.13.x (example — verify against release notes)'],
    note: 'UNVERIFIED placeholder entry. Replace with real data from the AvalancheGo release you are targeting.',
  },
}
