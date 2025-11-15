'use client'

import { ReactNode } from 'react'

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function AnimatedButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
}: AnimatedButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 hover-glow border'
  
  const variants = {
    primary: 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 glow-blue',
    secondary: 'bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/90 glow-purple',
    outline: 'border-border bg-transparent text-foreground hover:bg-card hover:border-primary',
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}
