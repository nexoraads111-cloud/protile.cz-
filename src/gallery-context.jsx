import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CATEGORIES, gallery as staticGallery } from './photos'
import { fetchRemoteGallery } from './lib/gallery-api'
import { getIsSupabaseConfigured } from './lib/supabase'

const GalleryContext = createContext(null)

const staticItems = staticGallery.map((g) => ({ ...g, source: 'static' }))

/**
 * Unified Realizace gallery.
 * When Supabase returns rows, DB is the source of truth (admin delete/replace updates the site).
 * Falls back to static photos123 META only when remote is empty or unavailable.
 */
export function GalleryProvider({ children }) {
  const configured = getIsSupabaseConfigured()
  const [remote, setRemote] = useState([])
  const [status, setStatus] = useState(configured ? 'loading' : 'static')
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!getIsSupabaseConfigured()) {
      setRemote([])
      setStatus('static')
      setError(null)
      return
    }
    setStatus((s) => (s === 'ready' ? 'ready' : 'loading'))
    try {
      const rows = await fetchRemoteGallery()
      setRemote(rows)
      setStatus('ready')
      setError(null)
    } catch (err) {
      console.error(err)
      setRemote([])
      setStatus('error')
      setError(err)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const items = useMemo(() => {
    if (remote.length > 0) return remote
    return staticItems
  }, [remote])

  const value = useMemo(
    () => ({
      items,
      remote,
      staticCount: staticItems.length,
      filters: CATEGORIES,
      status,
      error,
      refresh,
      configured: getIsSupabaseConfigured(),
    }),
    [items, remote, status, error, refresh],
  )

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}

export function useGallery() {
  const ctx = useContext(GalleryContext)
  if (!ctx) throw new Error('useGallery must be used within GalleryProvider')
  return ctx
}
