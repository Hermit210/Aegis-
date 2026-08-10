'use client'

import { useSyncExternalStore } from 'react'
import CountUp from 'react-countup'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeToReducedMotion(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function getReducedMotionServerSnapshot() {
  return false
}

type AnimatedStatProps = {
  end: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  /** Seconds to wait before counting starts (e.g. to match a parent's entrance delay). */
  delay?: number
  /** Trigger the count when scrolled into view instead of on mount. */
  scrollSpy?: boolean
  className?: string
}

export default function AnimatedStat({
  end,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.4,
  delay = 0,
  scrollSpy = false,
  className,
}: AnimatedStatProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  )

  if (reducedMotion) {
    return (
      <span className={className}>
        {prefix}
        {end.toFixed(decimals)}
        {suffix}
      </span>
    )
  }

  return (
    <CountUp
      end={end}
      prefix={prefix}
      suffix={suffix}
      decimals={decimals}
      duration={duration}
      delay={delay}
      enableScrollSpy={scrollSpy}
      scrollSpyOnce
      className={className}
    />
  )
}
