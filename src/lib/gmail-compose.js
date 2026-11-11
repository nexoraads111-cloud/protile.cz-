/**
 * Open Gmail web compose (not mailto / Outlook / OS mail picker).
 * Prefills To / subject / body for a handoff to gmail.com.
 */
export function buildGmailComposeUrl({ to, subject = '', body = '' }) {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: String(to || '').trim(),
    su: String(subject || ''),
    body: String(body || ''),
  })
  return `https://mail.google.com/mail/?${params.toString()}`
}

export function openGmailCompose(options) {
  const url = buildGmailComposeUrl(options)
  const win = window.open(url, '_blank', 'noopener,noreferrer')
  if (!win) window.location.assign(url)
  return url
}
