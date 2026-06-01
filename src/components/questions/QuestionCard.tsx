import { useState } from 'react'
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '../ui/Badge'
import type { QuestionWithProgress } from '../../types'
import { getDifficultyColor, getDifficultyLabel, getStatusColor, getStatusLabel, getQuestionTypeLabel } from '../../utils/helpers'

interface QuestionCardProps {
  question: QuestionWithProgress
  onEdit: (q: QuestionWithProgress) => void
  onDelete: (id: string) => void
}

export function QuestionCard({ question, onEdit, onDelete }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const status = question.progress?.status || 'new'

  return (
    <div className="group bg-white border border-[#e8e8e8] rounded-xl overflow-hidden hover:border-[#d0d0d0] transition-colors">
      <div className="p-4 cursor-pointer flex items-start gap-3" onClick={() => setExpanded(e => !e)}>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <Badge className={getStatusColor(status)} dot>{getStatusLabel(status)}</Badge>
            <Badge className={getDifficultyColor(question.difficulty)}>{getDifficultyLabel(question.difficulty)}</Badge>
            <Badge className="bg-[#f0f0f0] text-[#888] border-[#e8e8e8]">{getQuestionTypeLabel(question.question_type)}</Badge>
          </div>
          <p className="text-sm text-[#222] leading-relaxed">{question.question_text}</p>
          {question.progress && (
            <p className="text-[11px] text-[#bbb] mt-1">{question.progress.review_count}x tekrar edildi</p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={e => { e.stopPropagation(); onEdit(question) }}
            className="p-1.5 rounded-md text-[#ccc] hover:text-emerald-600 hover:bg-emerald-50
              transition-all opacity-0 group-hover:opacity-100">
            <Pencil size={12} />
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(question.id) }}
            className="p-1.5 rounded-md text-[#ccc] hover:text-red-600 hover:bg-red-50
              transition-all opacity-0 group-hover:opacity-100">
            <Trash2 size={12} />
          </button>
          {expanded ? <ChevronUp size={14} className="text-[#ccc]" /> : <ChevronDown size={14} className="text-[#ccc]" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#f0f0f0] p-4 space-y-4 bg-[#fafafa]">
          <div>
            <p className="text-[10px] font-medium text-[#aaa] mb-2 uppercase tracking-wider">Cevap</p>
            <p className="text-sm text-[#333] whitespace-pre-wrap leading-relaxed">{question.answer_text}</p>
          </div>

          {question.question_type === 'multiple_choice' && question.options && (
            <div>
              <p className="text-[10px] font-medium text-[#aaa] mb-2 uppercase tracking-wider">Seçenekler</p>
              <div className="space-y-1">
                {question.options.map((opt, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    i === question.correct_option
                      ? 'bg-emerald-600/10 border border-emerald-600/25 text-emerald-700'
                      : 'bg-[#f0f0f0] text-[#666]'
                  }`}>
                    <span className="font-mono text-xs w-4">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                    {i === question.correct_option && <span className="ml-auto text-xs text-emerald-600">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {question.interview_answer && (
            <div className="bg-white border border-[#e8e8e8] rounded-lg p-4">
              <p className="text-[10px] font-medium text-[#aaa] mb-2 uppercase tracking-wider">Mülakatta Nasıl Söylenir?</p>
              <p className="text-sm text-[#444] whitespace-pre-wrap leading-relaxed">{question.interview_answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
