import { useState, useMemo } from 'react'
import { Plus, Calendar, CheckCircle2, Circle, Trash2, Pencil, AlarmClock, Link2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input, Textarea } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Modal } from '../components/ui/Modal'
import { PageSpinner } from '../components/ui/Spinner'
import { useTasks } from '../hooks/useTasks'
import { useTopics } from '../hooks/useTopics'
import type { Task, TaskPriority, TaskStatus } from '../types'
import { formatDate } from '../utils/formatters'
import { isAfter, parseISO, isToday } from 'date-fns'

interface TasksProps { userId: string }

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low',    label: 'Düşük' },
  { value: 'medium', label: 'Orta' },
  { value: 'high',   label: 'Yüksek' },
  { value: 'urgent', label: 'Acil' },
]

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'todo',        label: 'Yapılacak' },
  { value: 'in_progress', label: 'Devam Ediyor' },
  { value: 'done',        label: 'Tamamlandı' },
]

const priorityStyle: Record<TaskPriority, { border: string; badge: string }> = {
  low:    { border: 'border-l-[#ddd]',       badge: 'bg-[#f0f0f0] text-[#888] border-[#e8e8e8]' },
  medium: { border: 'border-l-sky-400',      badge: 'bg-sky-500/10 text-sky-700 border-sky-500/25' },
  high:   { border: 'border-l-amber-400',    badge: 'bg-amber-500/10 text-amber-700 border-amber-500/25' },
  urgent: { border: 'border-l-red-500',      badge: 'bg-red-500/10 text-red-700 border-red-500/25' },
}

const statusTabs: { value: TaskStatus | 'all' | 'overdue'; label: string }[] = [
  { value: 'all',         label: 'Tümü' },
  { value: 'todo',        label: 'Yapılacak' },
  { value: 'in_progress', label: 'Devam Ediyor' },
  { value: 'done',        label: 'Tamamlandı' },
  { value: 'overdue',     label: 'Gecikmiş' },
]

function isOverdue(task: Task) {
  return task.due_date && task.status !== 'done' && !isAfter(parseISO(task.due_date), new Date())
}

function isDueToday(task: Task) {
  return task.due_date && isToday(parseISO(task.due_date))
}

interface TaskFormState {
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  due_date: string
  topic_id: string
}

const EMPTY_FORM: TaskFormState = {
  title: '', description: '', priority: 'medium',
  status: 'todo', due_date: '', topic_id: '',
}

export default function Tasks({ userId }: TasksProps) {
  const { tasks, loading, create, update, remove, setStatus } = useTasks(userId)
  const { topics } = useTopics(userId)
  const [tab, setTab] = useState<TaskStatus | 'all' | 'overdue'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [form, setForm] = useState<TaskFormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    if (tab === 'all')     return tasks
    if (tab === 'overdue') return tasks.filter(isOverdue)
    return tasks.filter(t => t.status === tab)
  }, [tasks, tab])

  const stats = useMemo(() => ({
    total:   tasks.length,
    today:   tasks.filter(t => isDueToday(t) && t.status !== 'done').length,
    overdue: tasks.filter(isOverdue).length,
    done:    tasks.filter(t => t.status === 'done').length,
  }), [tasks])

  const openCreate = () => { setForm(EMPTY_FORM); setEditTask(null); setModalOpen(true) }
  const openEdit   = (t: Task) => {
    setForm({ title: t.title, description: t.description || '', priority: t.priority,
      status: t.status, due_date: t.due_date || '', topic_id: t.topic_id || '' })
    setEditTask(t); setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    const payload: Partial<Task> = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      priority: form.priority,
      status: form.status,
      due_date: form.due_date || null,
      topic_id: form.topic_id || null,
    }
    if (editTask) await update(editTask.id, payload)
    else await create(payload)
    setSaving(false)
    setModalOpen(false)
  }

  const toggleDone = async (task: Task) => {
    await setStatus(task.id, task.status === 'done' ? 'todo' : 'done')
  }

  const topicOptions = [
    { value: '', label: 'Konuya bağlama (opsiyonel)' },
    ...topics.map(t => ({ value: t.id, label: t.title })),
  ]

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111]">Görevler</h1>
          <p className="text-xs text-[#888] mt-0.5">Mülakat hazırlık ajandan</p>
        </div>
        <Button icon={<Plus size={14} />} onClick={openCreate}>Görev Ekle</Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Toplam',      value: stats.total,   color: 'text-[#111]' },
          { label: 'Bugün',       value: stats.today,   color: 'text-sky-600' },
          { label: 'Gecikmiş',    value: stats.overdue, color: stats.overdue > 0 ? 'text-red-600' : 'text-[#888]' },
          { label: 'Tamamlandı',  value: stats.done,    color: 'text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e8e8e8] rounded-xl px-4 py-3">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-[#aaa] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white border border-[#e8e8e8] rounded-xl p-1 overflow-x-auto">
        {statusTabs.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              tab === t.value
                ? 'bg-emerald-600 text-white'
                : 'text-[#888] hover:text-[#333] hover:bg-[#f5f5f5]'
            }`}
          >
            {t.label}
            {t.value === 'overdue' && stats.overdue > 0 && (
              <span className="ml-1.5 bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full">
                {stats.overdue}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-[#f0f0f0] mx-auto mb-3 flex items-center justify-center">
            <CheckCircle2 size={22} className="text-[#bbb]" />
          </div>
          <p className="text-sm text-[#888] font-medium">
            {tab === 'all' ? 'Henüz görev yok' : 'Bu kategoride görev yok'}
          </p>
          {tab === 'all' && (
            <Button variant="outline" size="sm" icon={<Plus size={13} />} onClick={openCreate} className="mt-4">
              İlk görevi ekle
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(task => {
            const ps = priorityStyle[task.priority]
            const overdue = isOverdue(task)
            const dueToday = isDueToday(task)
            const topic = topics.find(t => t.id === task.topic_id)

            return (
              <div
                key={task.id}
                className={`group bg-white border border-[#e8e8e8] rounded-xl
                  border-l-2 ${ps.border}
                  hover:border-[#d0d0d0] transition-all duration-150
                  ${task.status === 'done' ? 'opacity-50' : ''}
                `}
              >
                <div className="flex items-start gap-3 p-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleDone(task)}
                    className="mt-0.5 flex-shrink-0 text-[#ccc] hover:text-emerald-600 transition-colors"
                  >
                    {task.status === 'done'
                      ? <CheckCircle2 size={18} className="text-emerald-600" />
                      : <Circle size={18} />
                    }
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-[#bbb]' : 'text-[#111]'}`}>
                      {task.title}
                    </span>

                    {task.description && (
                      <p className="text-xs text-[#aaa] mt-0.5 line-clamp-2">{task.description}</p>
                    )}

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge className={ps.badge}>{PRIORITIES.find(p => p.value === task.priority)?.label}</Badge>

                      {task.status === 'in_progress' && (
                        <Badge className="bg-sky-500/10 text-sky-700 border-sky-500/25">Devam Ediyor</Badge>
                      )}

                      {task.due_date && (
                        <span className={`flex items-center gap-1 text-[11px] ${
                          overdue ? 'text-red-500' : dueToday ? 'text-amber-600' : 'text-[#aaa]'
                        }`}>
                          {overdue ? <AlarmClock size={11} /> : <Calendar size={11} />}
                          {overdue ? 'Gecikti · ' : dueToday ? 'Bugün · ' : ''}
                          {formatDate(task.due_date)}
                        </span>
                      )}

                      {topic && (
                        <span className="flex items-center gap-1 text-[11px] text-[#bbb]">
                          <Link2 size={10} />
                          {topic.title}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(task)}
                      className="p-1.5 rounded-md text-[#ccc] hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => remove(task.id)}
                      className="p-1.5 rounded-md text-[#ccc] hover:text-red-600 hover:bg-red-50 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTask ? 'Görevi Düzenle' : 'Yeni Görev'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Görev *" placeholder="Örn: SQL JOIN konusunu bitir"
            value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            required
          />
          <Textarea
            label="Açıklama" placeholder="Detaylar (opsiyonel)..."
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={2}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Öncelik" options={PRIORITIES}
              value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))} />
            <Select label="Durum" options={STATUSES}
              value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))} />
          </div>
          <Input
            label="Bitiş Tarihi" type="date"
            value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
          />
          <Select label="Konu" options={topicOptions}
            value={form.topic_id} onChange={e => setForm(f => ({ ...f, topic_id: e.target.value }))} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="flex-1">İptal</Button>
            <Button type="submit" loading={saving} className="flex-1">{editTask ? 'Güncelle' : 'Ekle'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
