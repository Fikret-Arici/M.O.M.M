import { useState } from 'react'
import { Textarea } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import type { Question, QuestionType, Difficulty } from '../../types'

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'long_text', label: 'Uzun Cevap' },
  { value: 'short_answer', label: 'Kısa Cevap' },
  { value: 'multiple_choice', label: 'Çoktan Seçmeli' },
  { value: 'example_based', label: 'Örnekli Cevap' },
  { value: 'interview_question', label: 'Mülakat Sorusu' },
]

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Kolay' },
  { value: 'medium', label: 'Orta' },
  { value: 'hard', label: 'Zor' },
]

interface QuestionFormProps {
  initial?: Partial<Question>
  onSubmit: (data: Partial<Question>) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function QuestionForm({ initial, onSubmit, onCancel, loading }: QuestionFormProps) {
  const [form, setForm] = useState({
    question_text: initial?.question_text || '',
    answer_text: initial?.answer_text || '',
    interview_answer: initial?.interview_answer || '',
    question_type: (initial?.question_type || 'long_text') as QuestionType,
    difficulty: (initial?.difficulty || 'medium') as Difficulty,
    options: initial?.options || ['', '', '', ''],
    correct_option: initial?.correct_option ?? 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isMultipleChoice = form.question_type === 'multiple_choice'

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.question_text.trim()) e.question_text = 'Soru metni zorunludur'
    if (!form.answer_text.trim()) e.answer_text = 'Cevap metni zorunludur'
    if (isMultipleChoice) {
      const filledOptions = form.options.filter(o => o.trim())
      if (filledOptions.length < 2) e.options = 'En az 2 seçenek giriniz'
    }
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    await onSubmit({
      question_text: form.question_text.trim(),
      answer_text: form.answer_text.trim(),
      interview_answer: form.interview_answer.trim() || null,
      question_type: form.question_type,
      difficulty: form.difficulty,
      options: isMultipleChoice ? form.options.filter(o => o.trim()) : null,
      correct_option: isMultipleChoice ? form.correct_option : null,
    })
  }

  const updateOption = (i: number, value: string) => {
    const newOptions = [...form.options]
    newOptions[i] = value
    setForm(f => ({ ...f, options: newOptions }))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Soru Tipi"
          options={QUESTION_TYPES}
          value={form.question_type}
          onChange={e => setForm(f => ({ ...f, question_type: e.target.value as QuestionType }))}
        />
        <Select
          label="Zorluk"
          options={DIFFICULTIES}
          value={form.difficulty}
          onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as Difficulty }))}
        />
      </div>

      <Textarea
        label="Soru *"
        placeholder="Soru metnini girin..."
        value={form.question_text}
        onChange={e => setForm(f => ({ ...f, question_text: e.target.value }))}
        rows={3}
        error={errors.question_text}
      />

      <Textarea
        label="Cevap *"
        placeholder="Detaylı cevabı girin..."
        value={form.answer_text}
        onChange={e => setForm(f => ({ ...f, answer_text: e.target.value }))}
        rows={5}
        error={errors.answer_text}
      />

      {isMultipleChoice && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">Seçenekler</label>
          {errors.options && <p className="text-xs text-red-400">{errors.options}</p>}
          {form.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct_option"
                checked={form.correct_option === i}
                onChange={() => setForm(f => ({ ...f, correct_option: i }))}
                className="w-4 h-4 accent-indigo-500"
              />
              <input
                type="text"
                placeholder={`Seçenek ${String.fromCharCode(65 + i)}`}
                value={opt}
                onChange={e => updateOption(i, e.target.value)}
                className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500"
              />
            </div>
          ))}
          <p className="text-xs text-slate-500">Doğru cevabın solundaki radyo butonunu seçin</p>
        </div>
      )}

      <div className="border-t border-slate-800 pt-4">
        <Textarea
          label="Mülakatta Nasıl Cevaplanmalı? (opsiyonel)"
          placeholder="Profesyonel mülakat cevabını buraya yazın. Bu alan ezber için kullanılır..."
          value={form.interview_answer}
          onChange={e => setForm(f => ({ ...f, interview_answer: e.target.value }))}
          rows={4}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          İptal
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          {initial ? 'Güncelle' : 'Soru Ekle'}
        </Button>
      </div>
    </form>
  )
}
