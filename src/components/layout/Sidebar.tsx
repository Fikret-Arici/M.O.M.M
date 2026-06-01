import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, RefreshCw,
  BarChart3, LogOut, Brain, Menu, X, ClipboardList,
} from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  onSignOut: () => void
  userEmail?: string
}

const navItems = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/topics',     icon: BookOpen,         label: 'Konular' },
  { to: '/tasks',      icon: ClipboardList,    label: 'Görevler' },
  { to: '/review',     icon: RefreshCw,        label: 'Tekrar' },
  { to: '/statistics', icon: BarChart3,        label: 'İstatistikler' },
]

function NavContent({ onSignOut, userEmail, onClose }: SidebarProps & { onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-[#e8e8e8]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <Brain size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111] leading-none">InterviewPrep</p>
            <p className="text-[10px] text-[#aaa] mt-0.5 leading-none">Çalışma Asistanı</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium
              transition-colors duration-150
              ${isActive
                ? 'bg-emerald-600/10 text-emerald-700'
                : 'text-[#888] hover:text-[#333] hover:bg-[#f0f0f0]'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={15} className={isActive ? 'text-emerald-600' : 'text-[#aaa]'} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#e8e8e8] px-2 py-3 space-y-0.5">
        <div className="px-3 py-1">
          <p className="text-[11px] text-[#bbb] truncate">{userEmail}</p>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium
            text-[#888] hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
        >
          <LogOut size={15} />
          Çıkış Yap
        </button>
      </div>
    </div>
  )
}

export function Sidebar({ onSignOut, userEmail }: SidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-[#e8e8e8] text-[#555]"
        onClick={() => setOpen(o => !o)}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)} />
      )}

      <div className={`lg:hidden fixed top-0 left-0 z-40 h-full w-52 bg-white border-r border-[#e8e8e8]
        transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <NavContent onSignOut={onSignOut} userEmail={userEmail} onClose={() => setOpen(false)} />
      </div>

      <div className="hidden lg:block fixed top-0 left-0 h-full w-52 bg-white border-r border-[#e8e8e8] z-30">
        <NavContent onSignOut={onSignOut} userEmail={userEmail} />
      </div>
    </>
  )
}
