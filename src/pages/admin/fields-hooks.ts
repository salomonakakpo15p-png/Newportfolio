import { useState } from 'react'
import { ApiError, saveCollection } from '../../lib/api'
import type { SiteData } from '../../lib/site-data'
import { loadAdminContent, useAdminStore } from './content-store'

export interface AdminEditor<T> {
  content: SiteData
  loading: boolean
  value: T
  setValue: (next: T | ((current: T) => T)) => void
  save: (next?: T) => Promise<void>
  saving: boolean
  saved: boolean
  error: string
}

export function useAdminEditor<T>(
  collection: keyof SiteData,
  initial: (values: SiteData) => T,
): AdminEditor<T> {
  const { tick, content, loading } = useAdminStore()
  const [appliedTick, setAppliedTick] = useState(() => 0)
  const [value, setValue] = useState<T>(() => initial(content))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  if (appliedTick !== tick) {
    setAppliedTick(tick)
    setValue(initial(content))
  }

  const save = async (next?: T) => {
    const payload = next ?? value
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      await saveCollection(collection, payload)
      setValue(payload)
      setSaved(true)
      await loadAdminContent()
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        window.location.assign('/admin/login')
        return
      }
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return { content, loading, value, setValue, save, saving, saved, error }
}