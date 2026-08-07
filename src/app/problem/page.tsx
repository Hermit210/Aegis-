import type { Metadata } from 'next'
import Problem from '@/components/sections/Problem'

export const metadata: Metadata = {
  title: 'The Problem | Avalanche Deploy Assurance',
  description:
    'Four documented avalanche-cli issues showing a pattern: deploys reporting success while the actual chain state disagrees.',
}

export default function ProblemPage() {
  return <Problem />
}
