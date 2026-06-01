import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' }

export function Card({ children, className = '', onClick, hover = false, padding = 'md' }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white border border-[#e8e8e8] rounded-xl
        ${paddingMap[padding]}
        ${hover ? 'hover:border-[#d0d0d0] hover:bg-[#fafafa] cursor-pointer transition-colors duration-150' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
