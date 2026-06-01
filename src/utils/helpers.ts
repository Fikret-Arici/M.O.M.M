import type { Difficulty, ProgressStatus, QuestionType } from '../types'

export function getDifficultyLabel(d: Difficulty): string {
  return { easy: 'Kolay', medium: 'Orta', hard: 'Zor' }[d]
}

export function getDifficultyColor(d: Difficulty): string {
  return {
    easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    hard: 'bg-red-500/20 text-red-400 border-red-500/30',
  }[d]
}

export function getStatusLabel(s: ProgressStatus): string {
  return { new: 'Yeni', learning: 'Çalışılıyor', memorized: 'Ezberlendi' }[s]
}

export function getStatusColor(s: ProgressStatus): string {
  return {
    new: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    learning: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    memorized: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  }[s]
}

export function getQuestionTypeLabel(t: QuestionType): string {
  return {
    long_text: 'Uzun Cevap',
    short_answer: 'Kısa Cevap',
    multiple_choice: 'Çoktan Seçmeli',
    example_based: 'Örnekli',
    interview_question: 'Mülakat Sorusu',
  }[t]
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n) + '...' : str
}
