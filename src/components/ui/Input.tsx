import React, { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, hint, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-[#555]">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-[#fafafa] border rounded-lg px-3.5 py-2.5 text-sm text-[#111]
            placeholder-[#bbb] outline-none transition-colors duration-150
            focus:border-emerald-500 focus:bg-white
            disabled:opacity-40 disabled:cursor-not-allowed
            ${error ? 'border-red-400' : 'border-[#e0e0e0]'}
            ${icon ? 'pl-9' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#888]">{hint}</p>}
    </div>
  )
)
Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-[#555]">{label}</label>}
      <textarea
        ref={ref}
        className={`
          w-full bg-[#fafafa] border rounded-lg px-3.5 py-2.5 text-sm text-[#111]
          placeholder-[#bbb] outline-none transition-colors duration-150 resize-none
          focus:border-emerald-500 focus:bg-white
          disabled:opacity-40 disabled:cursor-not-allowed
          ${error ? 'border-red-400' : 'border-[#e0e0e0]'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#888]">{hint}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'
