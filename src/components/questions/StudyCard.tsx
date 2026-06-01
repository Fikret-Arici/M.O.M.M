import { useState } from 'react'
import { Eye, CheckCircle } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import type { QuestionWithProgress, ConfidenceLevel } from '../../types'
import { getDifficultyColor, getDifficultyLabel } from '../../utils/helpers'
import { getConfidenceColor, getConfidenceLabel } from '../../lib/spacedRepetition'

const CONFIDENCE_LEVELS: ConfidenceLevel[] = [0, 1, 2, 3]

interface StudyCardProps {
  question: QuestionWithProgress
  currentIndex: number
  total: number
  onRate: (confidence: ConfidenceLevel) => void
}

export function StudyCard({ question, currentIndex, total, onRate }: StudyCardProps) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs text-[#888] flex-shrink-0">{currentIndex + 1} / {total}</span>
        <div className="flex-1 flex gap-1">
          {Array.from({ length: Math.min(total, 20) }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                i < currentIndex ? 'bg-emerald-500' :
                i === currentIndex ? 'bg-emerald-400' :
                'bg-[#e8e8e8]'
              }`}
            />
          ))}
        </div>
        <Badge className={getDifficultyColor(question.difficulty)}>
          {getDifficultyLabel(question.difficulty)}
        </Badge>
      </div>

      {/* Question */}
      <div className="bg-white border border-[#e8e8e8] rounded-xl p-6 mb-4">
        <p className="text-[11px] text-[#bbb] uppercase tracking-wider mb-4">Soru {currentIndex + 1}</p>
        <p className="text-base text-[#111] leading-relaxed font-medium">{question.question_text}</p>
        {question.question_type === 'multiple_choice' && question.options && !revealed && (
          <div className="mt-5 space-y-2">
            {question.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f5f5f5] border border-[#e8e8e8] text-sm text-[#888]">
                <span className="font-mono text-xs w-4 text-[#bbb]">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>

      {!revealed ? (
        <Button variant="primary" size="lg" icon={<Eye size={16} />} onClick={() => setRevealed(true)} className="w-full">
          Cevabı Gör
        </Button>
      ) : (
        <div className="space-y-3">
          {/* Answer */}
          <div className="bg-white border border-[#e8e8e8] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={14} className="text-emerald-600" />
              <span className="text-[11px] text-emerald-700 uppercase tracking-wider font-medium">Cevap</span>
            </div>
            <p className="text-sm text-[#333] leading-relaxed whitespace-pre-wrap">{question.answer_text}</p>
            {question.question_type === 'multiple_choice' && question.correct_option !== null && question.options && (
              <div className="mt-4 pt-4 border-t border-[#f0f0f0]">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600/10 border border-emerald-600/20 text-sm text-emerald-700">
                  <span className="font-mono text-xs">{String.fromCharCode(65 + question.correct_option)}.</span>
                  {question.options[question.correct_option]}
                </div>
              </div>
            )}
          </div>

          {question.interview_answer && (
            <div className="bg-[#fafafa] border border-[#e8e8e8] rounded-xl p-5">
              <p className="text-[11px] text-[#bbb] uppercase tracking-wider mb-2">Mülakatta Nasıl Söylenir?</p>
              <p className="text-sm text-[#444] leading-relaxed whitespace-pre-wrap">{question.interview_answer}</p>
            </div>
          )}

          {/* Rating */}
          <div className="pt-2">
            <p className="text-xs text-[#888] text-center mb-3">Kendini değerlendir</p>
            <div className="grid grid-cols-2 gap-2">
              {CONFIDENCE_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => onRate(level)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium cursor-pointer
                    transition-colors duration-150 hover:opacity-80 active:scale-[0.98]
                    ${getConfidenceColor(level)}`}
                >
                  {getConfidenceLabel(level)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
