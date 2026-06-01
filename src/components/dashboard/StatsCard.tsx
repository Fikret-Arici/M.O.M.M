import React from 'react'
import { Card } from '../ui/Card'

interface StatsCardProps {
  icon: React.ReactNode
  label: string
  value: number | string
  sub?: string
  iconBg?: string
  trend?: number
}

export function StatsCard({ icon, label, value, sub, iconBg = 'bg-indigo-500/20', trend }: StatsCardProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
        <p className="text-sm text-slate-400 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
      </div>
    </Card>
  )
}
