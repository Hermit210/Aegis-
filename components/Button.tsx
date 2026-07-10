import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-highlight text-background hover:bg-warning active:bg-accent shadow-level-1',
  secondary: 'border border-highlight text-highlight hover:bg-surface active:bg-accent',
  ghost: 'text-highlight hover:text-warning',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-md py-sm text-sm',
  md: 'px-lg py-md text-base',
  lg: 'px-xl py-lg text-lg',
}

export function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-md transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight disabled:opacity-50 disabled:cursor-not-allowed'
  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`
  
  return <button className={styles} {...props} />
}
