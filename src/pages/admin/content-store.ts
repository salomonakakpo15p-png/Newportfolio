import { useSyncExternalStore } from 'react'
import { getAdminContent } from '../../lib/api'
import { defaultSiteData, mergeContent } from '../../lib/site-data'
import type { SiteData } from '../../lib/site-data'

let tick = 0
let content: SiteData = defaultSiteData
let loading = true
let started = false
const listeners = new Set<() => void>()

export interface AdminSnapshot {
  tick: number
  content: SiteData
  loading: boolean
}

let snapshot: AdminSnapshot = { tick: 0, content: defaultSiteData, loading: true }

function emit() {
  for (const listener of listeners) listener()
}

function bump(nextLoading?: boolean) {
  if (typeof nextLoading === 'boolean') loading = nextLoading
  snapshot = { tick, content, loading }
  emit()
}

export async function loadAdminContent(): Promise<SiteData> {
  bump(true)
  try {
    const server = await getAdminContent()
    content = mergeContent(defaultSiteData, server as Partial<SiteData>)
    return content
  } finally {
    tick += 1
    bump(false)
  }
}

function ensureStarted() {
  if (started) return
  started = true
  void loadAdminContent().catch(() => undefined)
}

function subscribe(listener: () => void) {
  ensureStarted()
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): AdminSnapshot {
  return snapshot
}

export function useAdminStore(): AdminSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}