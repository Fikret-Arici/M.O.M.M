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
    0: 'bg-red-500/10 text-red-700 border-red-500/25',
    1: 'bg-amber-500/10 text-amber-700 border-amber-500/25',
    2: 'bg-sky-500/10 text-sky-700 border-sky-500/25',
    3: 'bg-emerald-600/10 text-emerald-700 border-emerald-600/25',
  }
  return colors[confidence]
}
