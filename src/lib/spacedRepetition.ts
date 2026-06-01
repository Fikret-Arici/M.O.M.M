import type { ConfidenceLevel } from '../types'
import { addDays } from 'date-fns'

export function getNextReviewDate(confidence: ConfidenceLevel): Date {
  const daysMap: Record<ConfidenceLevel, number> = {
    0: 1,  // Bilmiyorum → yarın
    1: 2,  // Kısmen biliyorum → 2 gün
    2: 5,  // İyi biliyorum → 5 gün
    3: 10, // Ezberledim → 10 gün
  }
  return addDays(new Date(), daysMap[confidence])
}

export function getStatusFromConfidence(confidence: ConfidenceLevel) {
  if (confidence === 3) return 'memorized'
  if (confidence === 0) return 'new'
  return 'learning'
}

export function getConfidenceLabel(confidence: ConfidenceLevel): string {
  const labels: Record<ConfidenceLevel, string> = {
    0: 'Bilmiyorum',
    1: 'Kısmen Biliyorum',
    2: 'İyi Biliyorum',
    3: 'Ezberledim',
  }
  return labels[confidence]
}

export function getConfidenceColor(confidence: ConfidenceLevel): string {
  const colors: Record<ConfidenceLevel, string> = {
    0: 'bg-red-500/20 text-red-400 border-red-500/30',
    1: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    2: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    3: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  }
  return colors[confidence]
}
