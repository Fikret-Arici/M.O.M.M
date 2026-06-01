import { useNavigate } from 'react-router-dom'
import { ProgressBar } from '../ui/ProgressBar'
import type { TopicWithStats } from '../../types'
import { ArrowRight } from 'lucide-react'

interface WeakTopicsWidgetProps { topics: TopicWithStats[] }

export function WeakTopicsWidget({ topics }: WeakTopicsWidgetProps) {
  const navigate = useNavigate()
  const weak = [...topics]
    .filter(t => t.question_count > 0)
    .sort((a, b) => a.progress_percentage - b.progress_percentage)
    .slice(0, 5)

  if (weak.length === 0) {
    return (
      <div className="bg-white border border-[#e8e8e8] rounded-xl p-5">
        <p className="text-sm font-medium text-[#111] mb-2">En Zayıf Konular</p>
        <p className="text-xs text-[#888]">Henüz konu eklenmedi.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#e8e8e8] rounded-xl p-5 space-y-4">
      <p className="text-sm font-medium text-[#111]">En Zayıf Konular</p>
      {weak.map(topic => (
        <div
          key={topic.id}
          className="group flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(`/topics/${topic.id}/study`)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-xs text-[#333] truncate">{topic.title}</p>
              <span className="text-[11px] text-[#888] ml-2 flex-shrink-0">{topic.progress_percentage}%</span>
            </div>
            <ProgressBar
              value={topic.memorized_count}
              max={topic.question_count}
              size="xs"
              color={topic.progress_percentage < 30 ? 'red' : topic.progress_percentage < 60 ? 'amber' : 'emerald'}
            />
          </div>
          <ArrowRight size={12} className="text-[#ccc] group-hover:text-emerald-600 flex-shrink-0 transition-colors" />
        </div>
      ))}
    </div>
  )
}
