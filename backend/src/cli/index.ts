#!/usr/bin/env node
import { Command } from 'commander'
import type { CheckResult, CheckTarget } from '../types/check.js'
import { verify } from '../verify.js'

const STATUS_COLOR: Record<CheckResult['status'], string> = {
  pass: '\x1b[32m', // green
  warn: '\x1b[33m', // yellow
  fail: '\x1b[31m', // red
  unavailable: '\x1b[90m', // gray
}
const RESET = '\x1b[0m'
const STATUS_ICON: Record<CheckResult['status'], string> = {
  pass: '✓',
  warn: '!',
  fail: '✗',
  unavailable: '-',
}

function printReport(target: CheckTarget, results: CheckResult[], score: number | null): void {
  console.log(`\nAegis verification report`)
  console.log(`Target: ${JSON.stringify(target)}\n`)

  for (const result of results) {
    const color = STATUS_COLOR[result.status]
    const icon = STATUS_ICON[result.status]
    console.log(`${color}${icon} ${result.name}${RESET} — ${result.message}`)
  }

  console.log('')
  if (score === null) {
    console.log('Health score: n/a (no check could produce a usable result — see statuses above)')
  } else {
    console.log(`Health score: ${score.toFixed(2)}`)
  }
}

function buildTarget(nodeUrl: string | undefined, options: Record<string, string | undefined>): CheckTarget {
  const target: CheckTarget = {}
  if (nodeUrl ?? options.nodeUrl) target.nodeUrl = nodeUrl ?? options.nodeUrl
  if (options.network) target.network = options.network as CheckTarget['network']
  if (options.nodeId) target.nodeId = options.nodeId
  if (options.subnetId) target.subnetId = options.subnetId
  if (options.blockchainId) target.blockchainId = options.blockchainId
  if (options.chainRpcUrl) target.chainRpcUrl = options.chainRpcUrl
  if (options.ports) target.ports = options.ports.split(',').map((p) => parseInt(p.trim(), 10))
  return target
}

const program = new Command()

program
  .name('aegis')
  .description('Independent, read-only verification for Avalanche L1 deployments.')
  .version('0.1.0')

program
  .command('verify')
  .description('Run all six checks against a target and report a health score.')
  .argument('[nodeUrl]', 'AvalancheGo node base URL (shorthand for --node-url)')
  .option('--node-url <url>', 'AvalancheGo node base URL, for Info/Health/Admin API checks')
  .option('--network <network>', 'mainnet | fuji | local — used for P-Chain checks when no nodeUrl is given')
  .option('--node-id <nodeId>', 'NodeID to look up in the validator set')
  .option('--subnet-id <subnetId>', 'Subnet ID to scope validator/health checks to')
  .option('--blockchain-id <blockchainId>', 'Blockchain ID, for genesis consistency / network state via nodeUrl')
  .option('--chain-rpc-url <url>', "The chain's own RPC URL, for genesis consistency / network state")
  .option('--ports <ports>', 'Comma-separated ports to check for availability')
  .option('--json', 'Output the full report as JSON instead of a human-readable summary')
  .action(async (nodeUrl: string | undefined, options) => {
    const target = buildTarget(nodeUrl, options)
    const report = await verify(target)

    if (options.json) {
      console.log(JSON.stringify(report, null, 2))
    } else {
      printReport(report.target, report.results, report.score)
    }

    const hasFailure = report.results.some((r) => r.status === 'fail')
    process.exitCode = hasFailure ? 1 : 0
  })

program.parseAsync(process.argv)
