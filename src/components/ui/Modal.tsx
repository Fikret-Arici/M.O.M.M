import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' }

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className={`
        relative w-full ${sizes[size]}
        bg-white border border-[#e8e8e8]
        rounded-xl shadow-xl shadow-black/10
        max-h-[90vh] flex flex-col
        animate-fade-up
      `}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8e8]">
          <h2 className="text-sm font-semibold text-[#111]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#aaa] hover:text-[#333] hover:bg-[#f0f0f0] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-5">{children}</div>
      </div>
    </div>
  )
}
