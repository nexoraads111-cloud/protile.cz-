/**
 * GET /functions/v1/review-action?id=&action=approve|reject&exp=&sig=
 * Verifies HMAC, updates review status, then 302-redirects to a static Czech
 * result page on the marketing site (Supabase gateway forces text/plain on
 * function bodies, so we cannot rely on inline HTML rendering in the browser).
 *
 * Self-contained for Supabase Dashboard Editor deploy (no ../_shared imports).
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const enc = new TextEncoder()

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

async function signAction(
  secret: string,
  id: string,
  action: 'approve' | 'reject',
  expUnix: number,
): Promise<string> {
  const key = await importKey(secret)
  const data = enc.encode(`${id}:${action}:${expUnix}`)
  const sig = await crypto.subtle.sign('HMAC', key, data)
  return toHex(sig)
}

async function verifyAction(
  secret: string,
  id: string,
  action: string,
  expUnix: number,
  sigHex: string,
): Promise<boolean> {
  if (action !== 'approve' && action !== 'reject') return false
  if (!id || !sigHex || !Number.isFinite(expUnix)) return false
  if (Math.floor(Date.now() / 1000) > expUnix) return false
  const expected = await signAction(secret, id, action as 'approve' | 'reject', expUnix)
  if (expected.length !== sigHex.length) return false
  let ok = 0
  for (let i = 0; i < expected.length; i++) {
    ok |= expected.charCodeAt(i) ^ sigHex.charCodeAt(i)
  }
  return ok === 0
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return redirectResult('chyba', 303)
  }

  try {
    const url = new URL(req.url)
    const id = (url.searchParams.get('id') || '').trim()
    const action = (url.searchParams.get('action') || '').trim()
    const exp = Number(url.searchParams.get('exp') || 0)
    const sig = (url.searchParams.get('sig') || '').trim().toLowerCase()

    const reviewSecret = Deno.env.get('REVIEW_ACTION_SECRET') || ''
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const siteUrl = (Deno.env.get('SITE_URL') || 'https://protile.cz').replace(/\/$/, '')

    if (!reviewSecret || !supabaseUrl || !serviceKey) {
      return redirectResult('chyba', 303, siteUrl)
    }

    const ok = await verifyAction(reviewSecret, id, action, exp, sig)
    if (!ok) {
      return redirectResult('neplatny', 303, siteUrl)
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { data: existing, error: fetchError } = await admin
      .from('reviews')
      .select('id, status, author_name')
      .eq('id', id)
      .maybeSingle()

    if (fetchError || !existing) {
      return redirectResult('nenalezena', 303, siteUrl)
    }

    // Reject always hides (even if previously approved). Approve only from pending/rejected.
    if (action === 'reject') {
      if (existing.status === 'rejected') {
        return redirectResult('odmitnuta', 303, siteUrl)
      }
      const { error: updateError } = await admin
        .from('reviews')
        .update({
          status: 'rejected',
          decided_at: new Date().toISOString(),
          decided_action: 'reject',
        })
        .eq('id', id)

      if (updateError) {
        console.error(updateError)
        return redirectResult('chyba', 303, siteUrl)
      }
      return redirectResult('odmitnuta', 303, siteUrl)
    }

    // approve
    if (existing.status === 'approved') {
      return redirectResult('schvalena', 303, siteUrl)
    }

    const { error: updateError } = await admin
      .from('reviews')
      .update({
        status: 'approved',
        decided_at: new Date().toISOString(),
        decided_action: 'approve',
      })
      .eq('id', id)

    if (updateError) {
      console.error(updateError)
      return redirectResult('chyba', 303, siteUrl)
    }
    return redirectResult('schvalena', 303, siteUrl)
  } catch (err) {
    console.error(err)
    return redirectResult('chyba', 303)
  }
})

function redirectResult(
  stav: 'schvalena' | 'odmitnuta' | 'neplatny' | 'nenalezena' | 'chyba',
  status = 303,
  siteUrl = (Deno.env.get('SITE_URL') || 'https://protile.cz').replace(/\/$/, ''),
) {
  const location = `${siteUrl}/recenze-stav.html?stav=${encodeURIComponent(stav)}`
  return new Response(null, {
    status,
    headers: {
      ...corsHeaders,
      Location: location,
      'Cache-Control': 'no-store',
    },
  })
}
