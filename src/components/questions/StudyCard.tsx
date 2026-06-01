import { useState } from 'react'
import { Eye, CheckCircle } from 'lucide-react'
import { Card } from '../ui/Card'
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

  const handleReveal = () => setRevealed(true)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-slate-400">
          {currentIndex + 1} / {total}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: Math.min(total, 20) }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i < currentIndex
                  ? 'w-4 bg-emerald-500'
                  : i === currentIndex
                  ? 'w-6 bg-indigo-500'
                  : 'w-4 bg-slate-700'
              }`}
            />
          ))}
        </div>
        <Badge className={getDifficultyColor(question.difficulty)}>
          {getDifficultyLabel(question.difficulty)}
        </Badge>
      </div>

      {/* Question card */}
      <Card className="mb-4" padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <span className="text-xs font-bold text-indigo-400">{currentIndex + 1}</span>
          </div>
          <span className="text-xs text-slate-500 uppercase tracking-wide">Soru</span>
        </div>
        <p className="text-lg text-slate-100 leading-relaxed font-medium">
          {question.question_text}
        </p>
        {question.question_type === 'multiple_choice' && question.options && !revealed && (
          <div className="mt-4 space-y-2">
            {question.options.map((opt, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-slate-400"
              >
                <span className="font-mono text-xs w-4">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </div>
            ))}
          </div>
        )}
      </Card>

      {!revealed ? (
        <Button
          variant="primary"
          size="lg"
          icon={<Eye size={18} />}
          onClick={handleReveal}
          className="w-full"
        >
          Cevabı Gör
        </Button>
      ) : (
        <div className="space-y-4">
          {/* Answer card */}
          <Card className="border-indigo-500/30 bg-indigo-950/30" padding="lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={16} className="text-indigo-400" />
              <span className="text-xs text-indigo-400 uppercase tracking-wide font-medium">Cevap</span>
            </div>
            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
              {question.answer_text}
            </p>
            {question.question_type === 'multiple_choice' && question.correct_option !== null && question.options && (
              <div className="mt-3 pt-3 border-t border-indigo-500/20">
                <p className="text-xs text-indigo-400 mb-1">Doğru Cevap:</p>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-sm text-emerald-300">
                  <span className="font-mono text-xs">{String.fromCharCode(65 + question.correct_option)}.</span>
                  {question.options[question.correct_option]}
                </div>
              </div>
            )}
          </Card>

          {/* Interview answer */}
          {question.interview_answer && (
            <Card className="border-violet-500/30 bg-violet-950/20" padding="md">
              <p className="text-xs text-violet-400 uppercase tracking-wide font-medium mb-2">Mülakatta Nasıl Söylenir?</p>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {question.interview_answer}
              </p>
            </Card>
          )}

          {/* Confidence rating */}
          <div>
            <p className="text-sm text-slate-400 text-center mb-3">Kendini nasıl değerlendiriyorsun?</p>
            <div className="grid grid-cols-2 gap-2">
              {CONFIDENCE_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => onRate(level)}
                  className={`
                    px-4 py-3 rounded-xl border text-sm font-medium
                    transition-all duration-200 hover:scale-[1.02] cursor-pointer
                    ${getConfidenceColor(level)}
                  `}
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
