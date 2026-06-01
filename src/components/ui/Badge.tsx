import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  dot?: boolean
}

export function Badge({ children, className = '', dot = false }: BadgeProps) {
  return (
    <span className={`
      inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border tracking-wide
      ${className}
    `}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 flex-shrink-0" />}
      {children}
    </span>
  )
}
