import type { Metadata } from 'next'
import Features from '@/components/sections/Features'

export const metadata: Metadata = {
  title: 'Features | Avalanche Deploy Assurance',
  description: 'Six independent capabilities that verify your L1: pre-flight, verification, read-only, and more.',
}

export default function FeaturesPage() {
  return <Features />
}
