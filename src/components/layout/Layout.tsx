import React from 'react'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
  onSignOut: () => void
  userEmail?: string
}

export function Layout({ children, onSignOut, userEmail }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar onSignOut={onSignOut} userEmail={userEmail} />
      <main className="flex-1 lg:ml-60 min-h-screen">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
