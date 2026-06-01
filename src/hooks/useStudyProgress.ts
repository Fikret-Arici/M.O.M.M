import { useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { ConfidenceLevel, StudyProgress } from '../types'
import { getNextReviewDate, getStatusFromConfidence } from '../lib/spacedRepetition'

export function useStudyProgress(userId: string | undefined) {
  const upsertProgress = useCallback(
    async (questionId: string, confidence: ConfidenceLevel): Promise<{ error: unknown }> => {
      if (!userId) return { error: 'No user' }

      const nextReview = getNextReviewDate(confidence)
      const status = getStatusFromConfidence(confidence)

      const { data: existing } = await supabase
        .from('study_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .single()

      if (existing) {
        const { error } = await supabase
          .from('study_progress')
          .update({
            confidence_level: confidence,
            status,
            last_reviewed_at: new Date().toISOString(),
            next_review_at: nextReview.toISOString(),
            review_count: (existing.review_count || 0) + 1,
          })
          .eq('id', existing.id)
        return { error }
      } else {
        const { error } = await supabase.from('study_progress').insert({
          user_id: userId,
          question_id: questionId,
          confidence_level: confidence,
          status,
          last_reviewed_at: new Date().toISOString(),
          next_review_at: nextReview.toISOString(),
          review_count: 1,
        })
        return { error }
      }
    },
    [userId]
  )

  const getDueQuestions = useCallback(
    async (): Promise<StudyProgress[]> => {
      if (!userId) return []
      const now = new Date().toISOString()
      const { data } = await supabase
        .from('study_progress')
        .select('*')
        .eq('user_id', userId)
        .lte('next_review_at', now)
        .neq('status', 'memorized')
      return data || []
    },
    [userId]
  )

  return { upsertProgress, getDueQuestions }
}
