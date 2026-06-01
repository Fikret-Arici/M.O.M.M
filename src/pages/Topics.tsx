import { useState, useMemo } from 'react'
import { Plus, Search } from 'lucide-react'
import { TopicCard } from '../components/topics/TopicCard'
import { TopicForm } from '../components/topics/TopicForm'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useTopics } from '../hooks/useTopics'
import { PageSpinner } from '../components/ui/Spinner'
import type { Topic, TopicWithStats } from '../types'

interface TopicsProps {
  userId: string
}

export default function Topics({ userId }: TopicsProps) {
  const { topics, loading, createTopic, updateTopic, deleteTopic } = useTopics(userId)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTopic, setEditTopic] = useState<TopicWithStats | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const categories = useMemo(() => {
    const cats = [...new Set(topics.map(t => t.category).filter(Boolean))] as string[]
    return cats
  }, [topics])

  const filtered = useMemo(() => {
    return topics.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(search.toLowerCase())
      const matchCat = !categoryFilter || t.category === categoryFilter
      return matchSearch && matchCat
    })
  }, [topics, search, categoryFilter])

  const handleCreate = async (data: Partial<Topic>) => {
    setFormLoading(true)
    await createTopic(data)
    setFormLoading(false)
    setModalOpen(false)
  }

  const handleUpdate = async (data: Partial<Topic>) => {
    if (!editTopic) return
    setFormLoading(true)
    await updateTopic(editTopic.id, data)
    setFormLoading(false)
    setEditTopic(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu konuyu silmek istediğinizden emin misiniz? İçindeki tüm sorular da silinecektir.')) return
    await deleteTopic(id)
  }

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Konular</h1>
          <p className="text-slate-400 text-sm mt-1">{topics.length} konu</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
          Konu Ekle
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-48">
          <Input
            placeholder="Konu ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              !categoryFilter
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500'
            }`}
          >
            Tümü
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat === categoryFilter ? '' : cat)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Topics grid */}
      {filtered.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 mx-auto mb-4 flex items-center justify-center">
            <Plus size={28} className="text-indigo-400" />
          </div>
          <p className="text-slate-300 font-medium mb-2">
            {search || categoryFilter ? 'Sonuç bulunamadı' : 'Henüz konu eklenmemiş'}
          </p>
          <p className="text-sm text-slate-500 mb-6">
            {search || categoryFilter
              ? 'Farklı bir arama deneyin'
              : 'SQL, Machine Learning, Churn gibi konular ekleyerek başlayın'}
          </p>
          {!search && !categoryFilter && (
            <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
              İlk Konunu Ekle
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(topic => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Yeni Konu Ekle">
        <TopicForm
          onSubmit={handleCreate}
          onCancel={() => setModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editTopic} onClose={() => setEditTopic(null)} title="Konuyu Düzenle">
        {editTopic && (
          <TopicForm
            initial={editTopic}
            onSubmit={handleUpdate}
            onCancel={() => setEditTopic(null)}
            loading={formLoading}
          />
        )}
      </Modal>
    </div>
  )
}
