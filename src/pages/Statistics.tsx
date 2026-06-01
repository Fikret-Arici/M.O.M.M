import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { BarChart3, TrendingUp, Award, Target } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { StatsCard } from '../components/dashboard/StatsCard'
import { useTopics } from '../hooks/useTopics'
import { PageSpinner } from '../components/ui/Spinner'
import { supabase } from '../lib/supabase'

interface StatisticsProps {
  userId: string
}

const PIE_COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f59e0b']

export default function Statistics({ userId }: StatisticsProps) {
  const { topics, loading } = useTopics(userId)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [memorizedCount, setMemorizedCount] = useState(0)
  const [learningCount, setLearningCount] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)

  useEffect(() => {
    if (!userId) return
    Promise.all([
      supabase.from('questions').select('id', { count: 'exact' }),
      supabase.from('study_progress').select('id, status').eq('user_id', userId),
      supabase.from('study_progress').select('review_count').eq('user_id', userId),
    ]).then(([questionsRes, progressRes, reviewsRes]) => {
      setTotalQuestions(questionsRes.count || 0)
      const progress = progressRes.data || []
      setMemorizedCount(progress.filter((p: { status: string }) => p.status === 'memorized').length)
      setLearningCount(progress.filter((p: { status: string }) => p.status === 'learning').length)
      const totalReviews = (reviewsRes.data || []).reduce(
        (sum: number, r: { review_count: number }) => sum + (r.review_count || 0), 0
      )
      setReviewCount(totalReviews)
    })
  }, [userId, topics])

  const topicChartData = topics
    .filter(t => t.question_count > 0)
    .sort((a, b) => b.memorized_count - a.memorized_count)
    .slice(0, 8)
    .map(t => ({
      name: t.title.length > 12 ? t.title.slice(0, 12) + '…' : t.title,
      ezberlendi: t.memorized_count,
      toplam: t.question_count,
    }))

  const newCount = totalQuestions - memorizedCount - learningCount
  const pieData = [
    { name: 'Ezberlendi', value: memorizedCount },
    { name: 'Öğreniliyor', value: learningCount },
    { name: 'Yeni', value: newCount > 0 ? newCount : 0 },
  ].filter(d => d.value > 0)

  const overallProgress = totalQuestions > 0
    ? Math.round((memorizedCount / totalQuestions) * 100)
    : 0

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">İstatistikler</h1>
        <p className="text-slate-400 text-sm mt-1">Mülakat hazırlık durumun</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<Target size={20} className="text-indigo-400" />}
          iconBg="bg-indigo-500/20"
          label="Toplam Soru"
          value={totalQuestions}
        />
        <StatsCard
          icon={<Award size={20} className="text-emerald-400" />}
          iconBg="bg-emerald-500/20"
          label="Ezberlendi"
          value={memorizedCount}
          sub={`%${overallProgress} tamamlandı`}
        />
        <StatsCard
          icon={<TrendingUp size={20} className="text-blue-400" />}
          iconBg="bg-blue-500/20"
          label="Öğreniliyor"
          value={learningCount}
        />
        <StatsCard
          icon={<BarChart3 size={20} className="text-violet-400" />}
          iconBg="bg-violet-500/20"
          label="Toplam Tekrar"
          value={reviewCount}
        />
      </div>

      {/* Overall progress */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-200">Genel İlerleme</h2>
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-base font-bold px-3 py-1">
            %{overallProgress}
          </Badge>
        </div>
        <ProgressBar
          value={memorizedCount}
          max={totalQuestions || 1}
          color={overallProgress === 100 ? 'emerald' : overallProgress > 60 ? 'indigo' : overallProgress > 30 ? 'amber' : 'red'}
          size="md"
        />
        <div className="flex gap-6 mt-4 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Ezberlendi: {memorizedCount}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            Öğreniliyor: {learningCount}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            Yeni: {Math.max(0, newCount)}
          </span>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <Card className="lg:col-span-2" padding="lg">
          <h2 className="text-base font-semibold text-slate-200 mb-6">Konu Bazında İlerleme</h2>
          {topicChartData.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">Henüz veri yok</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topicChartData} barGap={4}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                  }}
                />
                <Bar dataKey="toplam" fill="#1e293b" radius={[4, 4, 0, 0]} name="Toplam" />
                <Bar dataKey="ezberlendi" fill="#6366f1" radius={[4, 4, 0, 0]} name="Ezberlendi" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Pie chart */}
        <Card padding="lg">
          <h2 className="text-base font-semibold text-slate-200 mb-6">Durum Dağılımı</h2>
          {pieData.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">Henüz veri yok</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#e2e8f0',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                      {d.name}
                    </span>
                    <span className="text-slate-300 font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Per-topic breakdown */}
      <Card>
        <h2 className="text-base font-semibold text-slate-200 mb-4">Konu Detayları</h2>
        {topics.length === 0 ? (
          <p className="text-sm text-slate-500">Henüz konu eklenmemiş.</p>
        ) : (
          <div className="space-y-4">
            {topics
              .filter(t => t.question_count > 0)
              .sort((a, b) => b.progress_percentage - a.progress_percentage)
              .map(topic => (
                <div key={topic.id} className="flex items-center gap-4">
                  <div className="w-32 flex-shrink-0">
                    <p className="text-sm text-slate-300 truncate">{topic.title}</p>
                    <p className="text-xs text-slate-500">{topic.question_count} soru</p>
                  </div>
                  <div className="flex-1">
                    <ProgressBar
                      value={topic.memorized_count}
                      max={topic.question_count}
                      size="sm"
                      color={
                        topic.progress_percentage === 100 ? 'emerald' :
                        topic.progress_percentage > 60 ? 'indigo' :
                        topic.progress_percentage > 30 ? 'amber' : 'red'
                      }
                    />
                  </div>
                  <span className="w-10 text-right text-sm text-slate-400 flex-shrink-0">
                    %{topic.progress_percentage}
                  </span>
                </div>
              ))}
          </div>
        )}
      </Card>
    </div>
  )
}
