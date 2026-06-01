import type { Difficulty, ProgressStatus, QuestionType } from '../types'

export function getDifficultyLabel(d: Difficulty): string {
  return { easy: 'Kolay', medium: 'Orta', hard: 'Zor' }[d]
}

export function getDifficultyColor(d: Difficulty): string {
  return {
    easy:   'bg-emerald-600/10 text-emerald-700 border-emerald-600/25',
    medium: 'bg-amber-500/10 text-amber-700 border-amber-500/25',
    hard:   'bg-red-500/10 text-red-700 border-red-500/25',
  }[d]
}

export function getStatusLabel(s: ProgressStatus): string {
  return { new: 'Yeni', learning: 'Çalışılıyor', memorized: 'Ezberlendi' }[s]
}

export function getStatusColor(s: ProgressStatus): string {
  return {
    new:       'bg-[#f0f0f0] text-[#888] border-[#e0e0e0]',
    learning:  'bg-sky-500/10 text-sky-700 border-sky-500/25',
    memorized: 'bg-emerald-600/10 text-emerald-700 border-emerald-600/25',
  }[s]
}

export function getQuestionTypeLabel(t: QuestionType): string {
  return {
    long_text:          'Uzun Cevap',
    short_answer:       'Kısa Cevap',
    multiple_choice:    'Çoktan Seçmeli',
    example_based:      'Örnekli',
    interview_question: 'Mülakat',
  }[t]
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n) + '…' : str
}
