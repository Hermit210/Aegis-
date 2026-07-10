import Hero from '@/components/sections/Hero'
import Problem from '@/components/sections/Problem'
import Solution from '@/components/sections/Solution'
import Features from '@/components/sections/Features'
import Demo from '@/components/sections/Demo'
import Architecture from '@/components/sections/Architecture'
import Roadmap from '@/components/sections/Roadmap'
import OpenSource from '@/components/sections/OpenSource'
import CTA from '@/components/sections/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <Demo />
      <Architecture />
      <Roadmap />
      <OpenSource />
      <CTA />
    </>
  )
}
