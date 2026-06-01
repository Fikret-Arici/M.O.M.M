import React, { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-[#555]">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full bg-[#fafafa] border rounded-lg px-3.5 py-2.5 text-sm text-[#111]
            outline-none transition-colors duration-150 appearance-none cursor-pointer pr-9
            focus:border-emerald-500
            disabled:opacity-40
            ${error ? 'border-red-400' : 'border-[#e0e0e0]'}
            ${className}
          `}
          {...props}
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
)
Select.displayName = 'Select'
