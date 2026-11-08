/** Filter ids shared by Realizace UI + admin upload. */
export const GALLERY_CATEGORY_IDS = ['koupelny', 'obklady', 'dlazby']

export const GALLERY_CATEGORY_OPTIONS = [
  { id: 'koupelny', label: 'Koupelny' },
  { id: 'obklady', label: 'Obklady' },
  { id: 'dlazby', label: 'Dlažby' },
]

/** Public filter chips including «Vše». */
export const GALLERY_FILTERS = [{ id: 'all', label: 'Vše' }, ...GALLERY_CATEGORY_OPTIONS]

const ALLOWED = new Set(GALLERY_CATEGORY_IDS)

/** Older admin / DB ids → current filter ids. */
const LEGACY = {
  kamen: 'koupelny',
  schody: 'dlazby',
  kuchyn: 'obklady',
  kuchyne: 'obklady',
}

/**
 * Resolve Realizace filter category for a Supabase row.
 * Prefer DB `category`; else infer from alt_text / path; else default «obklady».
 */
export function resolveGalleryCategory(row = {}) {
  const raw = String(row.category || '').trim().toLowerCase()
  if (ALLOWED.has(raw)) return raw
  if (LEGACY[raw]) return LEGACY[raw]

  const text = `${row.alt_text || row.alt || ''} ${row.storage_path || row.storagePath || ''}`.toLowerCase()
  if (/koupel|vana|sprch|bath|wc|toalet/.test(text)) return 'koupelny'
  if (/dla[zž]|podlah|terasa|balkon|chodba|nivel|k[rř][ií][zž]k|floor/.test(text)) return 'dlazby'
  if (/schod|stairs|podest/.test(text)) return 'dlazby'
  if (/obklad|tile|roh|sp[aá]r|detail/.test(text)) return 'obklady'
  if (/kamen|mramor|fas[aá]d|stone/.test(text)) return 'koupelny'
  return 'obklady'
}
