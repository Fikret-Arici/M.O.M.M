import { useNavigate } from 'react-router-dom'
import { BookOpen, Play, ChevronRight, Trash2 } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { Button } from '../ui/Button'
import type { TopicWithStats } from '../../types'

interface TopicCardProps {
  topic: TopicWithStats
  onDelete: (id: string) => void
}

const categoryColors: Record<string, string> = {
  'SQL': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Machine Learning': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Python': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Statistics': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Data Engineering': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
}

function getCategoryColor(category: string | null): string {
  if (!category) return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  return categoryColors[category] || 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
}

export function TopicCard({ topic, onDelete }: TopicCardProps) {
  const navigate = useNavigate()

  return (
    <Card hover className="group relative flex flex-col gap-4" onClick={() => navigate(`/topics/${topic.id}`)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/30 to-violet-600/30 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <BookOpen size={18} className="text-indigo-400" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-100 truncate">{topic.title}</h3>
            {topic.description && (
              <p className="text-xs text-slate-500 mt-0.5 truncate">{topic.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(topic.id) }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {topic.category && (
        <Badge className={getCategoryColor(topic.category)}>{topic.category}</Badge>
      )}

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>{topic.question_count} soru</span>
        <span className="text-emerald-400">{topic.memorized_count} ezberlendi</span>
        <span className="text-blue-400">{topic.learning_count} öğreniliyor</span>
      </div>

      <ProgressBar
        value={topic.memorized_count}
        max={topic.question_count || 1}
        color={topic.progress_percentage === 100 ? 'emerald' : 'indigo'}
        showLabel
      />

      <div className="flex items-center gap-2 pt-1">
        <Button
          size="sm"
          variant="primary"
          icon={<Play size={12} />}
          onClick={(e) => { e.stopPropagation(); navigate(`/topics/${topic.id}/study`) }}
          className="flex-1"
        >
          Çalış
        </Button>
        <Button
          size="sm"
          variant="ghost"
          icon={<ChevronRight size={12} />}
          onClick={(e) => { e.stopPropagation(); navigate(`/topics/${topic.id}`) }}
          className="flex-1"
        >
          Detay
        </Button>
      </div>
    </Card>
  )
}
