'use client'

import { useEffect, useRef } from 'react'

type RevealOptions = {
  /** CSS selector (scoped to the container) for the elements to stagger in. */
  selector: string
  y?: number
  stagger?: number
  duration?: number
  /** ScrollTrigger `start` value. */
  start?: string
}

export function useGsapReveal<T extends HTMLElement>({
  selector,
  y = 30,
  stagger = 0.12,
  duration = 0.6,
  start = 'top 80%',
}: RevealOptions) {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) return

    let ctx: { revert: () => void } | undefined
    let cancelled = false

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger)

        ctx = gsap.context(() => {
          const targets = Array.from(container.querySelectorAll<HTMLElement>(selector))
          targets.forEach((el, i) => {
            gsap.from(el, {
              opacity: 0,
              y,
              duration,
              delay: i * stagger,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start,
              },
            })
          })
        }, container)
      }
    )

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [selector, y, stagger, duration, start])

  return containerRef
}
