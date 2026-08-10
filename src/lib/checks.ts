export type Check = {
  id: string
  name: string
  description: string
  /** Glossary keys (see `glossary`) to render as inline tooltips wherever this check is explained. */
  terms?: string[]
}

export type CheckStage = {
  id: 'preflight' | 'postdeploy'
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

export const checkStages: CheckStage[] = [
  {
    id: 'preflight',
    title: 'Pre-Flight',
    description: 'Run before deploy is attempted, catching issues before they cost you a broken chain.',
    checks: [
      {
        id: 'vm-compat',
        name: 'AvalancheGo ↔ VM compatibility',
        description:
          "Confirms the node's AvalancheGo version and the VM's RPCChainVM protocol version are compatible before deploy is attempted.",
        terms: ['AvalancheGo', 'RPCChainVM', 'VM'],
      },
      {
        id: 'config-resolution',
        name: 'Config resolution',
        description:
          'Resolves CLI flags, config files, and defaults into the config AvalancheGo will actually run with, and flags conflicts.',
      },
      {
        id: 'port-availability',
        name: 'Port availability',
        description:
          'Checks that the staking and API ports the node needs are free before deploy attempts to bind them.',
      },
    ],
  },
  {
    id: 'postdeploy',
    title: 'Post-Deploy',
    description: 'Run after the chain is live, independently verifying what the CLI reported instead of trusting it.',
    checks: [
      {
        id: 'network-status-diff',
        name: 'Network status diff',
        description:
          'Independently queries RPC and diffs the result against what the CLI claimed, surfacing any disagreement immediately.',
      },
      {
        id: 'validator-set-verification',
        name: 'Validator set verification',
        description:
          "Queries the P-Chain's validator set directly to confirm nodes are registered, connected, and staked as expected.",
        terms: ['P-Chain', 'Validator set'],
      },
      {
        id: 'genesis-consistency',
        name: 'Genesis consistency',
        description: 'Compares the on-chain genesis state against the local genesis file to catch silent misconfiguration.',
        terms: ['Genesis'],
      },
    ],
  },
]
