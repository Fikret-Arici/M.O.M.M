import { useNavigate } from 'react-router-dom'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import type { TopicWithStats } from '../../types'
import { ArrowRight } from 'lucide-react'

interface WeakTopicsWidgetProps {
  topics: TopicWithStats[]
}

export function WeakTopicsWidget({ topics }: WeakTopicsWidgetProps) {
  const navigate = useNavigate()
  const weak = [...topics]
    .filter(t => t.question_count > 0)
    .sort((a, b) => a.progress_percentage - b.progress_percentage)
    .slice(0, 5)

  if (weak.length === 0) {
    return (
      <Card className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-slate-200">En Zayıf Konular</h3>
        <p className="text-sm text-slate-500">Henüz konu eklenmedi.</p>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-slate-200">En Zayıf Konular</h3>
      <div className="space-y-3">
        {weak.map(topic => (
          <div
            key={topic.id}
            className="group flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate(`/topics/${topic.id}/study`)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-slate-300 truncate">{topic.title}</p>
                <span className="text-xs text-slate-500 ml-2 flex-shrink-0">
                  {topic.progress_percentage}%
                </span>
              </div>
              <ProgressBar
                value={topic.memorized_count}
                max={topic.question_count}
                size="sm"
                color={topic.progress_percentage < 30 ? 'red' : topic.progress_percentage < 60 ? 'amber' : 'indigo'}
              />
            </div>
            <ArrowRight size={14} className="text-slate-600 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
          </div>
        ))}
      </div>
    </Card>
  )
}
