import type { Metadata } from 'next'
import Roadmap from '@/components/sections/Roadmap'

export const metadata: Metadata = {
  title: 'Roadmap | Avalanche Deploy Assurance',
  description: 'Evidence-driven roadmap. Each milestone scoped to real demand, from v0.1 pre-flight to v1.0.',
}

export default function RoadmapPage() {
  return <Roadmap />
}
