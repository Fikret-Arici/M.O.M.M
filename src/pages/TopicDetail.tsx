import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Search, Play, ArrowLeft, BookOpen } from 'lucide-react'
import { QuestionCard } from '../components/questions/QuestionCard'
import { QuestionForm } from '../components/questions/QuestionForm'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { useQuestions } from '../hooks/useQuestions'
import { useTopics } from '../hooks/useTopics'
import { PageSpinner } from '../components/ui/Spinner'
import type { Question, QuestionWithProgress, Difficulty } from '../types'
import { getDifficultyLabel } from '../utils/helpers'

interface TopicDetailProps {
  userId: string
}

const DIFFICULTIES: (Difficulty | '')[] = ['', 'easy', 'medium', 'hard']

export default function TopicDetail({ userId }: TopicDetailProps) {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const { topics } = useTopics(userId)
  const { questions, loading, createQuestion, updateQuestion, deleteQuestion } = useQuestions(topicId, userId)
  const [modalOpen, setModalOpen] = useState(false)
  const [editQuestion, setEditQuestion] = useState<QuestionWithProgress | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | ''>('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'learning' | 'memorized'>('all')

  const topic = topics.find(t => t.id === topicId)

  const filtered = useMemo(() => {
    return questions.filter(q => {
      const matchSearch = q.question_text.toLowerCase().includes(search.toLowerCase()) ||
        q.answer_text.toLowerCase().includes(search.toLowerCase())
      const matchDiff = !difficultyFilter || q.difficulty === difficultyFilter
      const questionStatus = q.progress?.status || 'new'
      const matchStatus = statusFilter === 'all' || questionStatus === statusFilter
      return matchSearch && matchDiff && matchStatus
    })
  }, [questions, search, difficultyFilter, statusFilter])

  const memorized = questions.filter(q => q.progress?.status === 'memorized').length
  const learning = questions.filter(q => q.progress?.status === 'learning').length

  const handleCreate = async (data: Partial<Question>) => {
    setFormLoading(true)
    await createQuestion(data)
    setFormLoading(false)
    setModalOpen(false)
  }

  const handleUpdate = async (data: Partial<Question>) => {
    if (!editQuestion) return
    setFormLoading(true)
    await updateQuestion(editQuestion.id, data)
    setFormLoading(false)
    setEditQuestion(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu soruyu silmek istediğinizden emin misiniz?')) return
    await deleteQuestion(id)
  }

  if (loading || !topic) return <PageSpinner />

  const progressPercent = questions.length > 0 ? Math.round((memorized / questions.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/topics')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Konulara Dön
        </button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-violet-600/30 border border-indigo-500/30 flex items-center justify-center">
              <BookOpen size={22} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">{topic.title}</h1>
              {topic.description && (
                <p className="text-sm text-slate-400 mt-0.5">{topic.description}</p>
              )}
              {topic.category && (
                <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 mt-1">
                  {topic.category}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              icon={<Play size={16} />}
              onClick={() => navigate(`/topics/${topicId}/study`)}
              disabled={questions.length === 0}
            >
              Çalışmaya Başla
            </Button>
            <Button
              variant="ghost"
              icon={<Plus size={16} />}
              onClick={() => setModalOpen(true)}
            >
              Soru Ekle
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Toplam', value: questions.length, color: 'text-slate-300' },
          { label: 'Yeni', value: questions.length - memorized - learning, color: 'text-slate-400' },
          { label: 'Öğreniliyor', value: learning, color: 'text-blue-400' },
          { label: 'Ezberlendi', value: memorized, color: 'text-emerald-400' },
        ].map(stat => (
          <Card key={stat.label} padding="sm" className="text-center">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </div>

      <ProgressBar value={memorized} max={questions.length || 1} showLabel color={progressPercent === 100 ? 'emerald' : 'indigo'} />

      {/* AI button placeholder */}
      <Card className="border-violet-500/20 bg-violet-500/5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-violet-300">AI ile Soru Üret</p>
            <p className="text-xs text-slate-500 mt-0.5">Konu hakkında otomatik soru-cevap oluştur</p>
          </div>
          <Button variant="secondary" size="sm" disabled>
            Yakında
          </Button>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48">
          <Input
            placeholder="Soru ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'new', 'learning', 'memorized'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as typeof statusFilter)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500'
              }`}
            >
              {{ all: 'Tümü', new: 'Yeni', learning: 'Öğreniliyor', memorized: 'Ezberlendi' }[s]}
            </button>
          ))}
          {DIFFICULTIES.filter(Boolean).map(d => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d === difficultyFilter ? '' : d)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all hidden sm:block ${
                difficultyFilter === d
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500'
              }`}
            >
              {getDifficultyLabel(d as Difficulty)}
            </button>
          ))}
        </div>
      </div>

      {/* Questions list */}
      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-slate-300 font-medium mb-2">
            {questions.length === 0 ? 'Henüz soru eklenmemiş' : 'Sonuç bulunamadı'}
          </p>
          {questions.length === 0 && (
            <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)} className="mt-4">
              İlk Soruyu Ekle
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              onEdit={setEditQuestion}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Yeni Soru Ekle" size="lg">
        <QuestionForm
          onSubmit={handleCreate}
          onCancel={() => setModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editQuestion} onClose={() => setEditQuestion(null)} title="Soruyu Düzenle" size="lg">
        {editQuestion && (
          <QuestionForm
            initial={editQuestion}
            onSubmit={handleUpdate}
            onCancel={() => setEditQuestion(null)}
            loading={formLoading}
          />
        )}
      </Modal>
    </div>
  )
}
