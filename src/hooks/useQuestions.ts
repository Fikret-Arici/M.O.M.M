import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Question, QuestionWithProgress } from '../types'

export function useQuestions(topicId: string | undefined, userId: string | undefined) {
  const [questions, setQuestions] = useState<QuestionWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuestions = useCallback(async () => {
    if (!topicId || !userId) return
    setLoading(true)
    try {
      const { data: questionsData, error: qErr } = await supabase
        .from('questions')
        .select('*')
        .eq('topic_id', topicId)
        .order('order_index', { ascending: true })

      if (qErr) throw qErr

      const ids = (questionsData || []).map((q: Question) => q.id)
      let progressMap: Record<string, import('../types').StudyProgress> = {}

      if (ids.length > 0) {
        const { data: progressData } = await supabase
          .from('study_progress')
          .select('*')
          .eq('user_id', userId)
          .in('question_id', ids)

        progressMap = Object.fromEntries(
          (progressData || []).map((p: import('../types').StudyProgress) => [p.question_id, p])
        )
      }

      setQuestions(
        (questionsData || []).map((q: Question) => ({
          ...q,
          progress: progressMap[q.id] || null,
        }))
      )
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sorular yüklenemedi')
    } finally {
      setLoading(false)
    }
  }, [topicId, userId])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const createQuestion = async (data: Partial<Question>) => {
    if (!topicId) return { error: 'Konu bulunamadı' }
    const maxIndex = questions.length > 0 ? Math.max(...questions.map(q => q.order_index)) + 1 : 0
    const { error } = await supabase
      .from('questions')
      .insert({ ...data, topic_id: topicId, order_index: maxIndex })
    if (!error) await fetchQuestions()
    return { error }
  }

  const updateQuestion = async (id: string, data: Partial<Question>) => {
    const { error } = await supabase.from('questions').update(data).eq('id', id)
    if (!error) await fetchQuestions()
    return { error }
  }

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase.from('questions').delete().eq('id', id)
    if (!error) await fetchQuestions()
    return { error }
  }

  return { questions, loading, error, createQuestion, updateQuestion, deleteQuestion, refetch: fetchQuestions }
}
