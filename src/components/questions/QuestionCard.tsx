import { useState } from 'react'
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
import { Card } from '../ui/Card'
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
    <Card className="group" padding="none">
      <div
        className="p-4 cursor-pointer flex items-start gap-3"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge className={getStatusColor(status)} dot>{getStatusLabel(status)}</Badge>
            <Badge className={getDifficultyColor(question.difficulty)}>{getDifficultyLabel(question.difficulty)}</Badge>
            <Badge className="bg-slate-800 text-slate-400 border-slate-700">{getQuestionTypeLabel(question.question_type)}</Badge>
          </div>
          <p className="text-sm text-slate-200 font-medium leading-relaxed">
            {question.question_text}
          </p>
          {question.progress && (
            <p className="text-xs text-slate-500 mt-1">
              {question.progress.review_count}x tekrar edildi
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={e => { e.stopPropagation(); onEdit(question) }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(question.id) }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={13} />
          </button>
          {expanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-800 p-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Cevap</p>
            <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {question.answer_text}
            </p>
          </div>
          {question.question_type === 'multiple_choice' && question.options && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Seçenekler</p>
              <div className="space-y-1">
                {question.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                      i === question.correct_option
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-800/50 text-slate-400'
                    }`}
                  >
                    <span className="font-mono text-xs">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                    {i === question.correct_option && <span className="ml-auto text-xs text-emerald-400">✓ Doğru</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {question.interview_answer && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
              <p className="text-xs font-medium text-indigo-400 mb-2 uppercase tracking-wide">Mülakatta Nasıl Söylenir?</p>
              <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {question.interview_answer}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
