import { createClient } from '@supabase/supabase-js'

/**
 * Prefer Vite env (build-time). Fall back to window.PROTILE_SUPABASE
 * (or legacy DOSPRETON_SUPABASE) from js/supabase-config.js.
 * Resolved lazily on first use so the config script can load first.
 */
function readConfig() {
  const fromEnv = {
    url: (import.meta.env.VITE_SUPABASE_URL || '').trim(),
    anonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim(),
  }
  if (fromEnv.url && fromEnv.anonKey) return fromEnv

  if (typeof window !== 'undefined') {
    const cfg = window.PROTILE_SUPABASE || window.DOSPRETON_SUPABASE
    if (cfg) {
      return {
        url: String(cfg.url || '').trim(),
        anonKey: String(cfg.anonKey || '').trim(),
      }
    }
  }
  return fromEnv
}

let cached = null

function resolve() {
  if (cached) return cached
  const { url, anonKey } = readConfig()
  cached = {
    url,
    anonKey,
    configured: Boolean(url && anonKey),
    client: url && anonKey ? createClient(url, anonKey) : null,
  }
  return cached
}

export function getSupabaseConfig() {
  const { url, anonKey } = resolve()
  return { url, anonKey }
}

export function getIsSupabaseConfigured() {
  return resolve().configured
}

/** @deprecated Prefer getIsSupabaseConfigured() — evaluates lazily on first call via wrapper. */
export function isSupabaseConfigured() {
  return resolve().configured
}

/** Lazy client; null when not configured. */
export function getDb() {
  return resolve().client
}

/**
 * Back-compat object used as `db.from(...)`.
 * Throws if called while unconfigured.
 */
export const db = {
  from(...args) {
    const c = resolve().client
    if (!c) throw new Error('Supabase není nakonfigurován.')
    return c.from(...args)
  },
  get storage() {
    return resolve().client?.storage
  },
  get auth() {
    return resolve().client?.auth
  },
}

export const GALLERY_BUCKET = 'gallery'

export function publicGalleryUrl(storagePath) {
  if (!storagePath) return ''
  // External image URL saved from admin «Přidat z URL»
  if (/^https?:\/\//i.test(storagePath)) return storagePath
  // Seeded static site assets (e.g. /photos123/p01.jpg) — served from Pages, not Storage
  if (String(storagePath).startsWith('/')) return storagePath
  const c = resolve().client
  if (!c) return ''
  const { data } = c.storage.from(GALLERY_BUCKET).getPublicUrl(storagePath)
  return data?.publicUrl || ''
}
