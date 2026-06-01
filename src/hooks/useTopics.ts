import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Topic, TopicWithStats } from '../types'

export function useTopics(userId: string | undefined) {
  const [topics, setTopics] = useState<TopicWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTopics = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const { data: topicsData, error: topicsErr } = await supabase
        .from('topics')
        .select('*')
        .eq('user_id', userId)
        .order('order_index', { ascending: true })

      if (topicsErr) throw topicsErr

      const topicsWithStats: TopicWithStats[] = await Promise.all(
        (topicsData || []).map(async (topic: Topic) => {
          const { data: questions } = await supabase
            .from('questions')
            .select('id')
            .eq('topic_id', topic.id)

          const questionIds = (questions || []).map((q: { id: string }) => q.id)
          let memorized = 0, learning = 0

          if (questionIds.length > 0) {
            const { data: progress } = await supabase
              .from('study_progress')
              .select('status')
              .eq('user_id', userId)
              .in('question_id', questionIds)

            memorized = (progress || []).filter((p: { status: string }) => p.status === 'memorized').length
            learning = (progress || []).filter((p: { status: string }) => p.status === 'learning').length
          }

          const total = questionIds.length
          return {
            ...topic,
            question_count: total,
            memorized_count: memorized,
            learning_count: learning,
            new_count: total - memorized - learning,
            progress_percentage: total > 0 ? Math.round((memorized / total) * 100) : 0,
          }
        })
      )

      setTopics(topicsWithStats)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Konular yüklenemedi')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchTopics()
  }, [fetchTopics])

  const createTopic = async (data: Partial<Topic>) => {
    if (!userId) return { error: 'Oturum açık değil' }
    const maxIndex = topics.length > 0 ? Math.max(...topics.map(t => t.order_index)) + 1 : 0
    const { error } = await supabase
      .from('topics')
      .insert({ ...data, user_id: userId, order_index: maxIndex })
    if (!error) await fetchTopics()
    return { error }
  }

  const updateTopic = async (id: string, data: Partial<Topic>) => {
    const { error } = await supabase.from('topics').update(data).eq('id', id)
    if (!error) await fetchTopics()
    return { error }
  }

  const deleteTopic = async (id: string) => {
    const { error } = await supabase.from('topics').delete().eq('id', id)
    if (!error) await fetchTopics()
    return { error }
  }

  return { topics, loading, error, createTopic, updateTopic, deleteTopic, refetch: fetchTopics }
}
