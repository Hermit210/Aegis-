'use client'

import { animated } from '@react-spring/web'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { useButtonSpring } from '@/lib/useButtonSpring'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, children, ...props },
  ref
) {
  const { style, bind } = useButtonSpring()

  return (
    <animated.button
      ref={ref}
      style={style}
      {...bind}
      className={cn(
        'px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </animated.button>
  )
})

export default Button
