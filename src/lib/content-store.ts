import { useSyncExternalStore } from 'react'
import { defaultSiteData, mergeContent } from './site-data'
import type { SiteData } from './site-data'

let data: SiteData = defaultSiteData
let started = false
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

async function load() {
  try {
    const response = await fetch('/api/content', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
    if (response.ok) {
      const json = (await response.json()) as Partial<SiteData>
      data = mergeContent(data, json)
      emit()
    }
  } catch {
    // No server or network error: the site keeps its bundled defaults,
    // so a static deployment still works without the content API.
  }
}

/** Re-fetch the live content so admin edits show up on the site. */
export function reloadContent() {
  void load()
}

let reloadTimer: ReturnType<typeof setTimeout> | undefined
function scheduleReload() {
  if (reloadTimer) clearTimeout(reloadTimer)
  reloadTimer = setTimeout(() => {
    reloadTimer = undefined
    void load()
  }, 250)
}

function ensureStarted() {
  if (started) return
  started = true
  void load()
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) scheduleReload()
    })
    window.addEventListener('focus', scheduleReload)
    window.addEventListener('pageshow', scheduleReload)
  }
}

function subscribe(listener: () => void) {
  ensureStarted()
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): SiteData {
  return data
}

export function useSiteData(): SiteData {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export type { SiteData as StoreSiteData }