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
    primary: 'bg-linear-to-r from-violet-600 to-indigo-600 text-white border-transparent hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/20',
    secondary: 'bg-linear-to-r from-fuchsia-600 to-pink-600 text-white border-transparent hover:from-fuchsia-500 hover:to-pink-500 shadow-lg shadow-pink-500/20',
    outline: 'border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm',
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
