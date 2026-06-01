import React from 'react'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
  onSignOut: () => void
  userEmail?: string
}

export function Layout({ children, onSignOut, userEmail }: LayoutProps) {
  return (
    <div className="min-h-screen flex bg-[#f5f5f5]">
      <Sidebar onSignOut={onSignOut} userEmail={userEmail} />
      <main className="flex-1 lg:ml-52 min-h-screen">
        <div className="px-4 py-6 lg:px-8 lg:py-8 pt-16 lg:pt-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
