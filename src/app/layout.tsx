import type { Metadata } from "next"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import SmoothScroll from "@/components/SmoothScroll"
import "./globals.css"

export const metadata: Metadata = {
  title: "Avalanche Deploy Assurance | Independent L1 Deployment Verification",
  description: "Independent, read-only verification for avalanche-cli deployments. Catch deploy failures before they matter.",
  keywords: ["Avalanche", "L1", "deployment", "verification", "blockchain"],
  authors: [{ name: "Avalanche Deploy Assurance Contributors" }],
  openGraph: {
    title: "Avalanche Deploy Assurance",
    description: "Independent verification for Avalanche L1 deployments",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-text-primary antialiased min-h-screen flex flex-col">
        <SmoothScroll />
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
