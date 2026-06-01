import { useNavigate } from 'react-router-dom'
import { BookOpen, Play, ChevronRight, Trash2 } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { Button } from '../ui/Button'
import type { TopicWithStats } from '../../types'

interface TopicCardProps {
  topic: TopicWithStats
  onDelete: (id: string) => void
}

export function TopicCard({ topic, onDelete }: TopicCardProps) {
  const navigate = useNavigate()

  return (
    <div
      className="group bg-white border border-[#e8e8e8] rounded-xl p-5
        hover:border-[#d0d0d0] transition-colors duration-150 cursor-pointer
        flex flex-col gap-4"
      onClick={() => navigate(`/topics/${topic.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#f0f0f0] border border-[#e8e8e8] flex items-center justify-center flex-shrink-0">
            <BookOpen size={16} className="text-[#888]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#111] truncate">{topic.title}</h3>
            {topic.description && (
              <p className="text-xs text-[#888] mt-0.5 truncate">{topic.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDelete(topic.id) }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-[#ccc]
            hover:text-red-600 hover:bg-red-50 transition-all duration-150 flex-shrink-0"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {topic.category && (
        <Badge className="bg-[#f0f0f0] text-[#888] border-[#e8e8e8] w-fit">{topic.category}</Badge>
      )}

      <div className="flex items-center gap-3 text-[11px] text-[#888]">
        <span>{topic.question_count} soru</span>
        <span className="text-emerald-600">{topic.memorized_count} ezberlendi</span>
        <span className="text-sky-600">{topic.learning_count} öğreniliyor</span>
      </div>

      <ProgressBar
        value={topic.memorized_count}
        max={topic.question_count || 1}
        color="emerald"
        showLabel
      />

      <div className="flex gap-2 pt-1">
        <Button
          size="sm" variant="primary"
          icon={<Play size={11} />}
          onClick={e => { e.stopPropagation(); navigate(`/topics/${topic.id}/study`) }}
          className="flex-1"
        >
          Çalış
        </Button>
        <Button
          size="sm" variant="secondary"
          icon={<ChevronRight size={11} />}
          onClick={e => { e.stopPropagation(); navigate(`/topics/${topic.id}`) }}
          className="flex-1"
        >
          Detay
        </Button>
      </div>
    </div>
  )
}
