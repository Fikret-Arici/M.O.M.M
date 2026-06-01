import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, Trophy, CheckCircle } from 'lucide-react'
import { StudyCard } from '../components/questions/StudyCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageSpinner } from '../components/ui/Spinner'
import { useStudyProgress } from '../hooks/useStudyProgress'
import type { ConfidenceLevel, Question, QuestionWithProgress, StudyProgress } from '../types'
import { supabase } from '../lib/supabase'
import { getConfidenceLabel } from '../lib/spacedRepetition'

interface ReviewModeProps {
  userId: string
}

export default function ReviewMode({ userId }: ReviewModeProps) {
  const navigate = useNavigate()
  const { getDueQuestions, upsertProgress } = useStudyProgress(userId)
  const [queue, setQueue] = useState<QuestionWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [ratings, setRatings] = useState<Record<string, ConfidenceLevel>>({})

  useEffect(() => {
    async function loadQueue() {
      setLoading(true)
      try {
        const dueProgress = await getDueQuestions()
        if (dueProgress.length === 0) { setQueue([]); setLoading(false); return }

        const questionIds = dueProgress.map((p: StudyProgress) => p.question_id)
        const { data: questionsData } = await supabase
          .from('questions')
          .select('*')
          .in('id', questionIds)

        const progressMap = Object.fromEntries(dueProgress.map((p: StudyProgress) => [p.question_id, p]))
        const enriched: QuestionWithProgress[] = (questionsData || []).map((q: Question) => ({
          ...q,
          progress: progressMap[q.id] || null,
        }))

        setQueue(enriched)
      } finally {
        setLoading(false)
      }
    }
    loadQueue()
  }, [getDueQuestions])

  const handleRate = async (confidence: ConfidenceLevel) => {
    const current = queue[currentIndex]
    if (!current) return
    await upsertProgress(current.id, confidence)
    setRatings(r => ({ ...r, [current.id]: confidence }))
    if (currentIndex + 1 >= queue.length) {
      setDone(true)
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  if (loading) return <PageSpinner />

  if (queue.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-100">Tekrar Modu</h1>
        <Card className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle size={28} className="text-emerald-400" />
          </div>
          <p className="text-slate-300 font-medium mb-2">Tebrikler! Tekrar edilecek soru yok</p>
          <p className="text-sm text-slate-500 mb-6">
            Spaced repetition sistemine göre bugün tekrar gereken soru bulunmuyor.
          </p>
          <Button onClick={() => navigate('/topics')}>Konulara Git</Button>
        </Card>
      </div>
    )
  }

  if (done) {
    const ratingCounts = { 0: 0, 1: 0, 2: 0, 3: 0 } as Record<ConfidenceLevel, number>
    Object.values(ratings).forEach(r => ratingCounts[r]++)

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-100">Tekrar Modu</h1>
        <Card className="text-center py-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <Trophy size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Tekrar Tamamlandı!</h2>
          <p className="text-slate-400 mb-8">{queue.length} soru tekrar edildi</p>
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-8">
            {([0, 1, 2, 3] as ConfidenceLevel[]).map(level => (
              <div key={level} className="bg-slate-800/50 rounded-xl p-3">
                <p className="text-2xl font-bold text-slate-100">{ratingCounts[level]}</p>
                <p className="text-xs text-slate-500 mt-0.5">{getConfidenceLabel(level)}</p>
              </div>
            ))}
          </div>
          <Button onClick={() => navigate('/dashboard')}>Dashboard'a Dön</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Tekrar Modu</h1>
        <div className="flex items-center gap-2 text-sm text-amber-400">
          <RefreshCw size={16} />
          <span>{queue.length} soru bekliyor</span>
        </div>
      </div>

      <StudyCard
        question={queue[currentIndex]}
        currentIndex={currentIndex}
        total={queue.length}
        onRate={handleRate}
        key={queue[currentIndex]?.id}
      />
    </div>
  )
}
