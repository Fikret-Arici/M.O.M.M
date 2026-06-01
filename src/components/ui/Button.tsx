import React from 'react'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline'
type Size = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
}

const variants: Record<Variant, string> = {
  primary:   'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600',
  secondary: 'bg-[#eeeeee] hover:bg-[#e5e5e5] text-[#333] border border-[#e0e0e0]',
  ghost:     'bg-transparent hover:bg-[#eeeeee] text-[#888] hover:text-[#333] border border-transparent',
  outline:   'bg-transparent hover:bg-emerald-600/10 text-emerald-600 border border-emerald-600/40 hover:border-emerald-600',
  danger:    'bg-transparent hover:bg-red-500/10 text-red-600 border border-red-500/30 hover:border-red-500',
  success:   'bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 border border-emerald-600/25',
}

const sizes: Record<Size, string> = {
  xs: 'px-2.5 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
}

export function Button({
  variant = 'primary', size = 'md', loading = false,
  icon, children, className = '', disabled, ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-colors duration-150 cursor-pointer select-none
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        active:scale-[0.98]
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={13} className="animate-spin flex-shrink-0" /> : icon}
      {children}
    </button>
  )
}
