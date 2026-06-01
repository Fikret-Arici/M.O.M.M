import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, CheckCircle, RefreshCw, Target, Plus, Play, Zap } from 'lucide-react'
import { StatsCard } from '../components/dashboard/StatsCard'
import { WeakTopicsWidget } from '../components/dashboard/WeakTopicsWidget'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useTopics } from '../hooks/useTopics'
import { useStudyProgress } from '../hooks/useStudyProgress'
import { PageSpinner } from '../components/ui/Spinner'
import { supabase } from '../lib/supabase'

interface DashboardProps {
  userId: string
}

export default function Dashboard({ userId }: DashboardProps) {
  const navigate = useNavigate()
  const { topics, loading } = useTopics(userId)
  const { getDueQuestions } = useStudyProgress(userId)
  const [dueCount, setDueCount] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [memorizedCount, setMemorizedCount] = useState(0)

  useEffect(() => {
    getDueQuestions().then(q => setDueCount(q.length))
  }, [getDueQuestions])

  useEffect(() => {
    if (!userId) return
    supabase
      .from('questions')
      .select('id', { count: 'exact' })
      .then(({ count }) => setTotalQuestions(count || 0))

    supabase
      .from('study_progress')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('status', 'memorized')
      .then(({ count }) => setMemorizedCount(count || 0))
  }, [userId, topics])

  const learningTopics = topics.filter(t => t.learning_count > 0 || t.memorized_count > 0)

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Mülakat hazırlığına devam et</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => navigate('/topics')}>
          Konu Ekle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<BookOpen size={20} className="text-indigo-400" />}
          iconBg="bg-indigo-500/20"
          label="Toplam Konu"
          value={topics.length}
          sub="Aktif konu sayısı"
        />
        <StatsCard
          icon={<Target size={20} className="text-violet-400" />}
          iconBg="bg-violet-500/20"
          label="Toplam Soru"
          value={totalQuestions}
          sub="Tüm konulardaki sorular"
        />
        <StatsCard
          icon={<CheckCircle size={20} className="text-emerald-400" />}
          iconBg="bg-emerald-500/20"
          label="Ezberlendi"
          value={memorizedCount}
          sub="Tam öğrenilen sorular"
        />
        <StatsCard
          icon={<RefreshCw size={20} className="text-amber-400" />}
          iconBg="bg-amber-500/20"
          label="Tekrar Bekliyor"
          value={dueCount}
          sub="Bugün tekrar edilmesi gerekenler"
        />
      </div>

      {/* Quick actions */}
      {dueCount > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Zap size={18} className="text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  {dueCount} soru tekrar bekliyor
                </p>
                <p className="text-xs text-slate-400">Spaced repetition sistemine göre</p>
              </div>
            </div>
            <Button
              variant="secondary"
              icon={<Play size={14} />}
              onClick={() => navigate('/review')}
            >
              Tekrar Et
            </Button>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent topics */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-200">Çalışılan Konular</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/topics')}>
              Tümünü Gör
            </Button>
          </div>

          {learningTopics.length === 0 ? (
            <Card className="text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 mx-auto mb-4 flex items-center justify-center">
                <BookOpen size={24} className="text-indigo-400" />
              </div>
              <p className="text-slate-300 font-medium mb-1">Henüz çalışma başlamadı</p>
              <p className="text-sm text-slate-500 mb-4">
                İlk konunu ekle ve öğrenmeye başla!
              </p>
              <Button icon={<Plus size={16} />} onClick={() => navigate('/topics')}>
                Konu Ekle
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {learningTopics.slice(0, 4).map(topic => (
                <Card
                  key={topic.id}
                  hover
                  className="flex items-center gap-4"
                  onClick={() => navigate(`/topics/${topic.id}`)}
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={16} className="text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-medium text-slate-100 truncate">{topic.title}</p>
                      <span className="text-xs text-slate-500 flex-shrink-0">
                        {topic.progress_percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${topic.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    icon={<Play size={12} />}
                    onClick={e => { e.stopPropagation(); navigate(`/topics/${topic.id}/study`) }}
                  >
                    Çalış
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Weak topics */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-200">Zayıf Konular</h2>
          </div>
          <WeakTopicsWidget topics={topics} />
        </div>
      </div>
    </div>
  )
}
