import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy, RotateCcw } from 'lucide-react'
import { StudyCard } from '../components/questions/StudyCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageSpinner } from '../components/ui/Spinner'
import { useQuestions } from '../hooks/useQuestions'
import { useTopics } from '../hooks/useTopics'
import { useStudyProgress } from '../hooks/useStudyProgress'
import type { ConfidenceLevel } from '../types'
import { getConfidenceLabel } from '../lib/spacedRepetition'

interface StudyModeProps {
  userId: string
}

export default function StudyMode({ userId }: StudyModeProps) {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const { topics } = useTopics(userId)
  const { questions, loading, refetch } = useQuestions(topicId, userId)
  const { upsertProgress } = useStudyProgress(userId)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [ratings, setRatings] = useState<Record<string, ConfidenceLevel>>({})

  const topic = topics.find(t => t.id === topicId)
  const studyQueue = questions

  useEffect(() => {
    setCurrentIndex(0)
    setDone(false)
    setRatings({})
  }, [topicId])

  const handleRate = async (confidence: ConfidenceLevel) => {
    const current = studyQueue[currentIndex]
    if (!current) return

    await upsertProgress(current.id, confidence)
    setRatings(r => ({ ...r, [current.id]: confidence }))

    if (currentIndex + 1 >= studyQueue.length) {
      await refetch()
      setDone(true)
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setDone(false)
    setRatings({})
  }

  if (loading) return <PageSpinner />

  if (studyQueue.length === 0) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate(`/topics/${topicId}`)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Geri Dön
        </button>
        <Card className="text-center py-16">
          <p className="text-slate-300 font-medium mb-2">Bu konuda henüz soru yok</p>
          <Button onClick={() => navigate(`/topics/${topicId}`)}>
            Soru Ekle
          </Button>
        </Card>
      </div>
    )
  }

  if (done) {
    const ratingCounts = { 0: 0, 1: 0, 2: 0, 3: 0 } as Record<ConfidenceLevel, number>
    Object.values(ratings).forEach(r => ratingCounts[r]++)

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <button
          onClick={() => navigate(`/topics/${topicId}`)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Konuya Dön
        </button>

        <Card className="text-center py-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
            <Trophy size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Oturum Tamamlandı!</h2>
          <p className="text-slate-400 mb-8">{studyQueue.length} soru çalışıldı</p>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-8">
            {([0, 1, 2, 3] as ConfidenceLevel[]).map(level => (
              <div key={level} className="bg-slate-800/50 rounded-xl p-3">
                <p className="text-2xl font-bold text-slate-100">{ratingCounts[level]}</p>
                <p className="text-xs text-slate-500 mt-0.5">{getConfidenceLabel(level)}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="ghost" icon={<RotateCcw size={16} />} onClick={handleRestart}>
              Tekrar Çalış
            </Button>
            <Button onClick={() => navigate(`/topics/${topicId}`)}>
              Konuya Dön
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/topics/${topicId}`)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={16} />
          {topic?.title || 'Konuya Dön'}
        </button>
        <p className="text-sm text-slate-500">Çalışma Modu</p>
      </div>

      <StudyCard
        question={studyQueue[currentIndex]}
        currentIndex={currentIndex}
        total={studyQueue.length}
        onRate={handleRate}
        key={studyQueue[currentIndex]?.id}
      />
    </div>
  )
}
