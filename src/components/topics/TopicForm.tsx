import { useState } from 'react'
import { Input, Textarea } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import type { Topic } from '../../types'

const CATEGORIES = [
  { value: '', label: 'Kategori Seçin (opsiyonel)' },
  { value: 'SQL', label: 'SQL' },
  { value: 'Machine Learning', label: 'Machine Learning' },
  { value: 'Python', label: 'Python' },
  { value: 'Statistics', label: 'Statistics' },
  { value: 'Data Engineering', label: 'Data Engineering' },
  { value: 'Churn Analysis', label: 'Churn Analysis' },
  { value: 'ANOVA', label: 'ANOVA' },
  { value: 'Data Management', label: 'Data Management' },
  { value: 'Deep Learning', label: 'Deep Learning' },
  { value: 'NLP', label: 'NLP' },
  { value: 'Behavioral', label: 'Behavioral' },
  { value: 'Diğer', label: 'Diğer' },
]

interface TopicFormProps {
  initial?: Partial<Topic>
  onSubmit: (data: Partial<Topic>) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function TopicForm({ initial, onSubmit, onCancel, loading }: TopicFormProps) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    category: initial?.category || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = 'Konu adı zorunludur'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    await onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || null,
      category: form.category || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Konu Adı *"
        placeholder="Örn: Machine Learning, SQL, Churn..."
        value={form.title}
        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        error={errors.title}
      />
      <Textarea
        label="Açıklama"
        placeholder="Konu hakkında kısa bir açıklama..."
        value={form.description}
        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        rows={3}
      />
      <Select
        label="Kategori"
        options={CATEGORIES}
        value={form.category}
        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
      />
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          İptal
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          {initial ? 'Güncelle' : 'Konu Ekle'}
        </Button>
      </div>
    </form>
  )
}
