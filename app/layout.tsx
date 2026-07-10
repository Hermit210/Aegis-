import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aegis',
  description: 'Know your deployment actually worked. Verify validator registration, configuration, and chain health with one command.',
  openGraph: {
    title: 'Aegis',
    description: 'One command. One report. One confidence score.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
