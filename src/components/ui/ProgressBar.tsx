interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  color?: 'emerald' | 'sky' | 'amber' | 'red' | 'zinc'
  size?: 'xs' | 'sm' | 'md'
  showLabel?: boolean
}

const colors = {
  emerald: 'bg-emerald-500',
  sky:     'bg-sky-500',
  amber:   'bg-amber-500',
  red:     'bg-red-500',
  zinc:    'bg-zinc-400',
}

const heights = { xs: 'h-1', sm: 'h-1.5', md: 'h-2' }

export function ProgressBar({
  value, max = 100, className = '', color = 'emerald', size = 'sm', showLabel = false,
}: ProgressBarProps) {
  const pct = Math.min(Math.round((value / (max || 1)) * 100), 100)
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-[11px] text-[#888] mb-1.5">
          <span>İlerleme</span>
          <span className="text-[#555] font-medium">{pct}%</span>
        </div>
      )}
      <div className={`w-full bg-[#eeeeee] rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${colors[color]} rounded-full transition-all duration-700 ease-out ${heights[size]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
