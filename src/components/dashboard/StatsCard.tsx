import React from 'react'

interface StatsCardProps {
  icon: React.ReactNode
  label: string
  value: number | string
  sub?: string
  accent?: 'emerald' | 'sky' | 'amber' | 'red' | 'zinc'
}

const accents = {
  emerald: { bg: 'bg-emerald-600/10', icon: 'text-emerald-600', num: 'text-[#111]' },
  sky:     { bg: 'bg-sky-500/10',     icon: 'text-sky-600',     num: 'text-[#111]' },
  amber:   { bg: 'bg-amber-500/10',   icon: 'text-amber-600',   num: 'text-[#111]' },
  red:     { bg: 'bg-red-500/10',     icon: 'text-red-600',     num: 'text-[#111]' },
  zinc:    { bg: 'bg-[#eeeeee]',      icon: 'text-[#888]',      num: 'text-[#111]' },
}

export function StatsCard({ icon, label, value, sub, accent = 'zinc' }: StatsCardProps) {
  const a = accents[accent]
  return (
    <div className="bg-white border border-[#e8e8e8] rounded-xl p-5 flex flex-col gap-4">
      <div className={`w-8 h-8 rounded-lg ${a.bg} ${a.icon} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className={`text-2xl font-bold tracking-tight ${a.num}`}>{value}</p>
        <p className="text-xs text-[#888] mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-[#bbb] mt-1">{sub}</p>}
      </div>
    </div>
  )
}
