import type { Metadata } from 'next'
import OpenSource from '@/components/sections/OpenSource'

export const metadata: Metadata = {
  title: 'Docs & Open Source | Avalanche Deploy Assurance',
  description: 'Public from day one. MIT licensed. Evidence-based decision making. No monetization.',
}

export default function DocsPage() {
  return <OpenSource />
}
