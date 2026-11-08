/**
 * Shared Supabase browser client (CDN UMD global: supabase).
 * Requires js/supabase-config.js to set window.PROTILE_SUPABASE first.
 */
(function (global) {
  const cfg = global.PROTILE_SUPABASE || global.DOSPRETON_SUPABASE || {}
  const url = (cfg.url || '').trim()
  const anonKey = (cfg.anonKey || '').trim()

  const configured = Boolean(url && anonKey && global.supabase?.createClient)

  /** @type {import('@supabase/supabase-js').SupabaseClient | null} */
  const db = configured ? global.supabase.createClient(url, anonKey) : null

  const GALLERY_BUCKET = 'gallery'

  const ALLOWED_TYPES = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/pjpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }

  const MAX_BYTES = 5 * 1024 * 1024

  /** UUID v4 — works on HTTP (no secure-context randomUUID required). */
  function uuidv4() {
    const c = global.crypto
    if (c && typeof c.randomUUID === 'function') {
      try {
        return c.randomUUID()
      } catch (_) {
        /* insecure context can throw — fall through */
      }
    }
    if (c && typeof c.getRandomValues === 'function') {
      const bytes = new Uint8Array(16)
      c.getRandomValues(bytes)
      bytes[6] = (bytes[6] & 0x0f) | 0x40
      bytes[8] = (bytes[8] & 0x3f) | 0x80
      const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
      const r = (Math.random() * 16) | 0
      const v = ch === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  function formatError(err) {
    if (!err) return 'Neznámá chyba'
    if (typeof err === 'string') return err
    const parts = [
      err.message,
      err.error,
      err.statusCode || err.status,
      err.code,
      err.details,
      err.hint,
    ].filter(Boolean)
    // unique-ish join
    return [...new Set(parts.map(String))].join(' · ')
  }

  function publicUrl(storagePath) {
    if (!storagePath) return ''
    // External image URL saved from admin «Přidat z URL»
    if (/^https?:\/\//i.test(storagePath)) return storagePath
    // Seeded static site assets (e.g. /photos123/p01.jpg)
    if (String(storagePath).startsWith('/')) return storagePath
    if (!db) return ''
    const { data } = db.storage.from(GALLERY_BUCKET).getPublicUrl(storagePath)
    return data?.publicUrl || ''
  }

  function isExternalUrl(path) {
    return /^https?:\/\//i.test(String(path || ''))
  }

  /** True only for objects in the gallery Storage bucket (not site paths / URLs). */
  function isStorageObjectPath(path) {
    const p = String(path || '')
    if (!p || isExternalUrl(p) || p.startsWith('/')) return false
    return true
  }

  const CATEGORY_IDS = ['koupelny', 'obklady', 'dlazby']
  const LEGACY_CATEGORY = { kamen: 'koupelny', schody: 'dlazby', kuchyn: 'obklady', kuchyne: 'obklady' }

  function resolveCategory(row) {
    const raw = String(row?.category || '').trim().toLowerCase()
    if (CATEGORY_IDS.includes(raw)) return raw
    if (LEGACY_CATEGORY[raw]) return LEGACY_CATEGORY[raw]
    const text = `${row?.alt_text || row?.alt || ''} ${row?.storage_path || ''}`.toLowerCase()
    if (/koupel|vana|sprch|bath|wc|toalet/.test(text)) return 'koupelny'
    if (/dla[zž]|podlah|terasa|balkon|chodba|nivel|floor|schod|stairs|podest/.test(text)) return 'dlazby'
    if (/obklad|tile|roh|sp[aá]r|detail/.test(text)) return 'obklady'
    if (/kamen|mramor|fas[aá]d|stone/.test(text)) return 'koupelny'
    return 'obklady'
  }

  async function fetchGalleryImages() {
    if (!db) throw new Error('Supabase není nakonfigurován (chybí URL/klíč nebo CDN).')
    let query = db.from('gallery_images').select('*')
    // Prefer sort_order when column exists; fall back if schema is older
    let { data, error } = await query.order('sort_order', { ascending: true }).order('created_at', {
      ascending: false,
    })
    if (error && /sort_order/i.test(error.message || '')) {
      ;({ data, error } = await db
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false }))
    }
    if (error) throw error
    return (data || []).map((row) => ({
      id: row.id,
      storagePath: row.storage_path,
      alt: row.alt_text || 'Fotografie realizace',
      category: resolveCategory(row),
      sortOrder: row.sort_order ?? 0,
      createdAt: row.created_at,
      url: publicUrl(row.storage_path),
      isStaticSeed: String(row.storage_path || '').startsWith('/photos123/'),
    }))
  }

  function normalizeFile(file) {
    let type = (file.type || '').toLowerCase()
    if (!type || type === 'application/octet-stream') {
      const name = (file.name || '').toLowerCase()
      if (name.endsWith('.jpg') || name.endsWith('.jpeg')) type = 'image/jpeg'
      else if (name.endsWith('.png')) type = 'image/png'
      else if (name.endsWith('.webp')) type = 'image/webp'
    }
    if (type === 'image/jpg' || type === 'image/pjpeg') type = 'image/jpeg'
    if (type === file.type) return file
    return new File([file], file.name, { type, lastModified: file.lastModified })
  }

  function validateFiles(fileList) {
    const files = Array.from(fileList || []).map(normalizeFile)
    if (!files.length) return { ok: false, error: 'Vyberte alespoň jednu fotografii.' }
    for (const file of files) {
      if (!ALLOWED_TYPES[file.type]) {
        return {
          ok: false,
          error: `Nepodporovaný formát: ${file.name} (${file.type || 'neznámý typ'}). Povolené: JPEG, PNG, WebP.`,
        }
      }
      if (file.size > MAX_BYTES) {
        return { ok: false, error: `${file.name} je větší než 5 MB.` }
      }
    }
    return { ok: true, files }
  }

  /**
   * Upload one file + insert DB row. Rolls back storage object if insert fails.
   */
  async function uploadOne(file, userId, altText, category) {
    const normalized = normalizeFile(file)
    const ext = ALLOWED_TYPES[normalized.type]
    if (!ext) {
      const err = new Error(`Nepodporovaný typ: ${normalized.type || 'neznámý'}`)
      throw err
    }
    if (!userId) throw new Error('Chybí user id — nejste přihlášeni.')

    const path = `${userId}/${uuidv4()}.${ext}`
    const { error: uploadError } = await db.storage.from(GALLERY_BUCKET).upload(path, normalized, {
      contentType: normalized.type,
      upsert: false,
    })
    if (uploadError) {
      uploadError.message = `Storage: ${formatError(uploadError)}`
      throw uploadError
    }

    const cat = resolveCategory({ category, alt_text: altText })
    const row = {
      storage_path: path,
      alt_text: (altText || '').trim() || normalized.name,
      category: cat,
      sort_order: 0,
    }
    let { error: rowError } = await db.from('gallery_images').insert(row)
    if (rowError && /sort_order/i.test(rowError.message || '')) {
      delete row.sort_order
      ;({ error: rowError } = await db.from('gallery_images').insert(row))
    }
    if (rowError && /category/i.test(rowError.message || '')) {
      delete row.category
      ;({ error: rowError } = await db.from('gallery_images').insert(row))
    }
    if (rowError) {
      await db.storage.from(GALLERY_BUCKET).remove([path])
      rowError.message = `DB gallery_images: ${formatError(rowError)}`
      throw rowError
    }
    return path
  }

  async function deleteImage(row) {
    if (!db) throw new Error('Supabase není nakonfigurován.')
    const path = row.storagePath || row.storage_path
    const id = row.id
    if (id) {
      const { error: delRow } = await db.from('gallery_images').delete().eq('id', id)
      if (delRow) {
        delRow.message = `DB delete: ${formatError(delRow)}`
        throw delRow
      }
    }
    // Only remove Storage objects (not site-relative / external URLs)
    if (path && isStorageObjectPath(path)) {
      const { error: delFile } = await db.storage.from(GALLERY_BUCKET).remove([path])
      if (delFile) {
        delFile.message = `Storage delete: ${formatError(delFile)}`
        throw delFile
      }
    }
  }

  /**
   * Replace image file for an existing row (keeps id / sort_order; optional new caption/category).
   */
  async function replaceImage(row, file, userId, altText, category) {
    if (!db) throw new Error('Supabase není nakonfigurován.')
    if (!row?.id) throw new Error('Chybí id fotografie.')
    if (!userId) throw new Error('Chybí user id — nejste přihlášeni.')

    const normalized = normalizeFile(file)
    const ext = ALLOWED_TYPES[normalized.type]
    if (!ext) throw new Error(`Nepodporovaný typ: ${normalized.type || 'neznámý'}`)

    const newPath = `${userId}/${uuidv4()}.${ext}`
    const { error: uploadError } = await db.storage.from(GALLERY_BUCKET).upload(newPath, normalized, {
      contentType: normalized.type,
      upsert: false,
    })
    if (uploadError) {
      uploadError.message = `Storage: ${formatError(uploadError)}`
      throw uploadError
    }

    const patch = {
      storage_path: newPath,
    }
    if (altText != null && String(altText).trim()) patch.alt_text = String(altText).trim()
    if (category) patch.category = resolveCategory({ category, alt_text: altText })

    const { error: updError } = await db.from('gallery_images').update(patch).eq('id', row.id)
    if (updError) {
      await db.storage.from(GALLERY_BUCKET).remove([newPath])
      updError.message = `DB update: ${formatError(updError)}`
      throw updError
    }

    const oldPath = row.storagePath || row.storage_path
    if (oldPath && isStorageObjectPath(oldPath) && oldPath !== newPath) {
      await db.storage.from(GALLERY_BUCKET).remove([oldPath])
    }
    return newPath
  }

  async function updateImageMeta(row, { altText, category } = {}) {
    if (!db) throw new Error('Supabase není nakonfigurován.')
    if (!row?.id) throw new Error('Chybí id fotografie.')
    const patch = {}
    if (altText != null) patch.alt_text = String(altText).trim()
    if (category) patch.category = resolveCategory({ category, alt_text: altText })
    if (!Object.keys(patch).length) return
    const { error } = await db.from('gallery_images').update(patch).eq('id', row.id)
    if (error) {
      error.message = `DB update: ${formatError(error)}`
      throw error
    }
  }

  /**
   * Add photo from a public https URL.
   * Tries to download → Storage upload; on CORS/network failure stores the URL in DB.
   */
  async function addFromUrl(imageUrl, userId, altText, category) {
    const url = String(imageUrl || '').trim()
    if (!/^https?:\/\//i.test(url)) {
      throw new Error('Zadejte platnou URL začínající na http:// nebo https://.')
    }
    if (!userId) throw new Error('Chybí user id — nejste přihlášeni.')

    const cat = resolveCategory({ category, alt_text: altText })
    const caption = (altText || '').trim() || 'Fotografie realizace'

    // Prefer copying into our bucket so the portfolio stays durable
    try {
      const res = await fetch(url, { mode: 'cors' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      let type = (blob.type || '').toLowerCase()
      if (!ALLOWED_TYPES[type]) {
        const lower = url.toLowerCase()
        if (lower.includes('.png')) type = 'image/png'
        else if (lower.includes('.webp')) type = 'image/webp'
        else type = 'image/jpeg'
      }
      if (!ALLOWED_TYPES[type]) {
        throw new Error('URL neukazuje na JPEG / PNG / WebP.')
      }
      if (blob.size > MAX_BYTES) {
        throw new Error('Soubor z URL je větší než 5 MB.')
      }
      const ext = ALLOWED_TYPES[type]
      const file = new File([blob], `url-${Date.now()}.${ext}`, { type })
      return await uploadOne(file, userId, caption, cat)
    } catch (err) {
      // Fallback: store external URL (display via <img>, no Storage object)
      const row = {
        storage_path: url,
        alt_text: caption,
        category: cat,
      }
      let { error: rowError } = await db.from('gallery_images').insert(row)
      if (rowError && /category/i.test(rowError.message || '')) {
        delete row.category
        ;({ error: rowError } = await db.from('gallery_images').insert(row))
      }
      if (rowError) {
        rowError.message = `DB gallery_images: ${formatError(rowError)} · (stáhnout z URL se nepodařilo: ${formatError(err)})`
        throw rowError
      }
      return url
    }
  }

  global.DospretonGallery = {
    db,
    configured,
    GALLERY_BUCKET,
    ALLOWED_TYPES,
    MAX_BYTES,
    CATEGORY_IDS,
    formatError,
    publicUrl,
    isExternalUrl,
    isStorageObjectPath,
    resolveCategory,
    fetchGalleryImages,
    validateFiles,
    uploadOne,
    addFromUrl,
    deleteImage,
    replaceImage,
    updateImageMeta,
  }
})(window)
