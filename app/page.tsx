import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { TheGap } from '@/components/TheGap'
import { HowItWorks } from '@/components/HowItWorks'
import { Features } from '@/components/Features'
import { GettingStarted } from '@/components/GettingStarted'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TheGap />
        <HowItWorks />
        <Features />
        <GettingStarted />
      </main>
      <Footer />
    </>
  )
}
