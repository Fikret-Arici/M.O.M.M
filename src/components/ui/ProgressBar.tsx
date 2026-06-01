interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  color?: 'indigo' | 'violet' | 'emerald' | 'amber' | 'red'
  size?: 'sm' | 'md'
  showLabel?: boolean
}

const colorClasses = {
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
}

export function ProgressBar({
  value,
  max = 100,
  className = '',
  color = 'indigo',
  size = 'md',
  showLabel = false,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100)

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>İlerleme</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2'}`}>
        <div
          className={`${colorClasses[color]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
