import { Loader2 } from 'lucide-react'

export function Spinner({ size = 20, className = '' }: { size?: number; className?: string }) {
  return <Loader2 size={size} className={`animate-spin text-emerald-600 ${className}`} />
}

export function PageSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <Loader2 size={24} className="animate-spin text-emerald-600" />
      <p className="text-xs text-[#888]">Yükleniyor…</p>
    </div>
  )
}
