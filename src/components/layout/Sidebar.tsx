import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  RefreshCw,
  BarChart3,
  LogOut,
  Brain,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  onSignOut: () => void
  userEmail?: string
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/topics', icon: BookOpen, label: 'Konular' },
  { to: '/review', icon: RefreshCw, label: 'Tekrar Modu' },
  { to: '/statistics', icon: BarChart3, label: 'İstatistikler' },
]

export function Sidebar({ onSignOut, userEmail }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navContent = (
    <>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
          <Brain size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-100">InterviewPrep</p>
          <p className="text-xs text-slate-500">Çalışma Asistanı</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-200
              ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }
            `}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-slate-500 truncate">{userEmail}</p>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} />
          Çıkış Yap
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`
        lg:hidden fixed top-0 left-0 z-40 h-full w-64 bg-slate-900 border-r border-slate-800
        flex flex-col transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {navContent}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-60 bg-slate-900 border-r border-slate-800 fixed top-0 left-0 h-full z-30">
        {navContent}
      </div>
    </>
  )
}
