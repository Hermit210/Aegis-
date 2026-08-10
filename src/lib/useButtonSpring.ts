'use client'

import { useSpring, useReducedMotion, to } from '@react-spring/web'

/** Physics-based hover-lift / press-compress feedback, shared by any clickable surface (button, link, card). */
export function useButtonSpring(hoverOnly = false) {
  const prefersReducedMotion = useReducedMotion()
  const [{ scale, y }, api] = useSpring(() => ({ scale: 1, y: 0 }))

  const bind = {
    onMouseEnter: () => {
      if (!prefersReducedMotion) api.start({ scale: 1.03, y: -2 })
    },
    onMouseLeave: () => {
      if (!prefersReducedMotion) api.start({ scale: 1, y: 0 })
    },
    ...(hoverOnly
      ? {}
      : {
          onMouseDown: () => {
            if (!prefersReducedMotion) api.start({ scale: 0.96, y: 0 })
          },
          onMouseUp: () => {
            if (!prefersReducedMotion) api.start({ scale: 1.03, y: -2 })
          },
        }),
  }

  const style = {
    transform: to([scale, y], (s, ty) => `translateY(${ty}px) scale(${s})`),
  }

  return { style, bind }
}
