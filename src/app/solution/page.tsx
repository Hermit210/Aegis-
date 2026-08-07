import type { Metadata } from 'next'
import Solution from '@/components/sections/Solution'

export const metadata: Metadata = {
  title: 'The Solution | Avalanche Deploy Assurance',
  description:
    'Three stages of assurance: pre-flight checks before you deploy, independent verification after. No manual cross-checking.',
}

export default function SolutionPage() {
  return <Solution />
}
