export type Check = {
  id: string
  name: string
  description: string
  /** Glossary keys (see `glossary`) to render as inline tooltips wherever this check is explained. */
  terms?: string[]
}

export type CheckStage = {
  id: 'node' | 'chain'
  title: string
  description: string
  checks: Check[]
}

export const glossary: Record<string, string> = {
  AvalancheGo: 'The reference node client for Avalanche primary network validators.',
  RPCChainVM: "The gRPC interface AvalancheGo uses to run a blockchain's VM as a subprocess.",
  VM: "Virtual Machine — the pluggable execution environment defining a chain's rules.",
  'P-Chain': 'The Platform Chain — coordinates validators, subnets, and blockchain metadata across Avalanche.',
  'Validator set': 'The nodes currently staked and registered to produce blocks for a given chain.',
  Genesis: 'The state a blockchain is created with — its first block and starting parameters.',
  Subnet: 'A dynamic set of validators securing one or more custom blockchains on Avalanche.',
}

/**
 * All six checks run together in a single pass (`aegis verify`) — there's
 * no separate "preflight" or "postdeploy" command. Grouped here by what
 * each check actually looks at: your AvalancheGo node's own setup, or a
 * specific deployed chain's on-chain/live state — not by when they run.
 */
export const checkStages: CheckStage[] = [
  {
    id: 'node',
    title: 'Your node',
    description:
      "Checks your AvalancheGo node's own setup — version compatibility, resolved config, and port availability. Needs your own node (--node-url); not reachable via Avalanche's public API server.",
    checks: [
      {
        id: 'version-compatibility',
        name: 'AvalancheGo ↔ VM compatibility',
        description:
          "Compares the node's reported RPCChainVM protocol version against subnet-evm's own published compatibility data, so a version mismatch is caught early.",
        terms: ['AvalancheGo', 'RPCChainVM', 'VM'],
      },
      {
        id: 'config-validation',
        name: 'Config resolution',
        description:
          "Checks the Admin API's actually-resolved config for a handful of well-known flags — a project-owned schema, since no canonical one is published by Ava Labs.",
      },
      {
        id: 'port-availability',
        name: 'Port availability',
        description:
          'Checks that the staking and API ports the node needs are free — the only check that needs nothing at all, not even a node.',
      },
    ],
  },
  {
    id: 'chain',
    title: 'Your chain',
    description:
      "Checks a specific deployed chain's actual on-chain and live state, independent of what any deploy tool reports. Validator registration and genesis consistency work against Avalanche's public P-Chain; network state's chain-RPC half needs a reachable RPC endpoint.",
    checks: [
      {
        id: 'validator-registration',
        name: 'Validator registration',
        description:
          "Queries the P-Chain's validator set directly to confirm a NodeID is registered, connected, staked, and its uptime — not just that a transaction was submitted.",
        terms: ['P-Chain', 'Validator set'],
      },
      {
        id: 'genesis-consistency',
        name: 'Genesis consistency',
        description:
          "Looks up the on-chain genesis-creation transaction — a blockchain's ID is the ID of the P-Chain transaction that created it — and compares its declared chain ID against what the live chain currently reports. No local genesis file needed.",
        terms: ['Genesis', 'P-Chain'],
      },
      {
        id: 'network-state',
        name: 'Network state',
        description:
          "Two independent checks: the node's own Health API, and direct RPC reachability on the target chain — so a health-report glitch and an actually-unreachable chain read as different problems.",
      },
    ],
  },
]
