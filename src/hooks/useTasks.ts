import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Task, TaskStatus } from '../types'

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setTasks(data || [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  const create = async (data: Partial<Task>) => {
    if (!userId) return
    await supabase.from('tasks').insert({ ...data, user_id: userId })
    await fetch()
  }

  const update = async (id: string, data: Partial<Task>) => {
    await supabase.from('tasks').update(data).eq('id', id)
    await fetch()
  }

  const remove = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id)
    await fetch()
  }

  const setStatus = async (id: string, status: TaskStatus) => {
    await supabase.from('tasks').update({ status }).eq('id', id)
    setTasks(ts => ts.map(t => t.id === id ? { ...t, status } : t))
  }

  return { tasks, loading, create, update, remove, setStatus, refetch: fetch }
}
