import type { Metadata } from 'next'
import Architecture from '@/components/sections/Architecture'

export const metadata: Metadata = {
  title: 'Architecture | Avalanche Deploy Assurance',
  description: 'Four clean layers. Read-only. No CLI modification. Easy to add new checks.',
}

export default function ArchitecturePage() {
  return <Architecture />
}
