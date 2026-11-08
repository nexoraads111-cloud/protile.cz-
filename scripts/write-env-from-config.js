/**
 * Write .env.production from js/supabase-config.js when Vite env is missing.
 * GitHub Actions prefers secrets; this covers local/Pages builds when secrets are empty.
 * Never prints key values.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = resolve(root, '.env.production')

function fromConfigFile() {
  const path = resolve(root, 'js/supabase-config.js')
  if (!existsSync(path)) return null
  const text = readFileSync(path, 'utf8')
  const url = text.match(/url:\s*'([^']*)'/)?.[1]?.trim() || ''
  const anon = text.match(/anonKey:\s*'([^']*)'/)?.[1]?.trim() || ''
  if (!url || !anon) return null
  return { url, anon }
}

const fromEnv = {
  url: (process.env.VITE_SUPABASE_URL || '').trim(),
  anon: (process.env.VITE_SUPABASE_ANON_KEY || '').trim(),
}

const cfg =
  fromEnv.url && fromEnv.anon
    ? fromEnv
    : fromConfigFile()

if (!cfg) {
  console.log('write-env-from-config: no URL/anon — skipping .env.production')
  process.exit(0)
}

writeFileSync(
  out,
  `VITE_SUPABASE_URL=${cfg.url}\nVITE_SUPABASE_ANON_KEY=${cfg.anon}\n`,
)
console.log('write-env-from-config: wrote .env.production (url host only:', new URL(cfg.url).host, ')')
