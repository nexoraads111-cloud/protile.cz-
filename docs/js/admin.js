;(async function () {
  const $ = (sel, root = document) => root.querySelector(sel)
  const msgEl = $('#admin-msg')
  const loginView = $('#login-view')
  const appView = $('#app-view')
  const loginForm = $('#login-form')
  const uploadForm = $('#upload-form')
  const thumbs = $('#thumbs')
  const userLine = $('#user-line')
  const emptyEl = $('#list-empty')
  const cfgMissing = $('#config-missing')

  let activeSource = 'file'

  function message(text, tone = 'info') {
    if (!msgEl) return
    msgEl.textContent = text
    msgEl.className = `msg is-visible is-${tone}`
  }

  function clearMessage() {
    if (!msgEl) return
    msgEl.textContent = ''
    msgEl.className = 'msg'
  }

  const api = window.DospretonGallery
  if (!api?.configured) {
    loginView?.classList.add('hidden')
    appView?.classList.add('hidden')
    cfgMissing?.classList.remove('hidden')
    return
  }

  cfgMissing?.classList.add('hidden')
  const { db } = api

  function setSource(source) {
    activeSource = source === 'url' ? 'url' : 'file'
    document.querySelectorAll('.source-tabs__btn').forEach((btn) => {
      const on = btn.getAttribute('data-source') === activeSource
      btn.classList.toggle('is-active', on)
      btn.setAttribute('aria-selected', on ? 'true' : 'false')
    })
    $('#source-file')?.classList.toggle('hidden', activeSource !== 'file')
    $('#source-url')?.classList.toggle('hidden', activeSource !== 'url')
    const fileInput = $('#photos')
    const urlInput = $('#photo-url')
    if (fileInput) fileInput.required = activeSource === 'file'
    if (urlInput) urlInput.required = activeSource === 'url'
  }

  document.querySelectorAll('.source-tabs__btn').forEach((btn) => {
    btn.addEventListener('click', () => setSource(btn.getAttribute('data-source')))
  })
  setSource('file')

  async function refreshList() {
    try {
      const rows = await api.fetchGalleryImages()
      thumbs.replaceChildren()
      if (!rows.length) {
        emptyEl?.classList.remove('hidden')
        return
      }
      emptyEl?.classList.add('hidden')
      for (const row of rows) {
        const fig = document.createElement('figure')
        fig.className = 'thumb'
        const catLabel =
          {
            koupelny: 'Koupelny',
            obklady: 'Obklady',
            dlazby: 'Dlažby',
            kamen: 'Koupelny',
            schody: 'Dlažby',
          }[row.category] ||
          row.category ||
          'Obklady'
        const external = api.isExternalUrl?.(row.storagePath)
        fig.innerHTML = `
          <img src="${escapeAttr(row.url)}" alt="${escapeAttr(row.alt)}" loading="lazy" />
          <figcaption>
            <span>${escapeHtml(row.alt)}</span>
            <span class="thumb-cat">${escapeHtml(catLabel)}${external ? ' · odkaz' : ''}</span>
            <button type="button" class="btn btn-danger" data-id="${escapeAttr(row.id)}" data-path="${escapeAttr(row.storagePath)}">Smazat</button>
          </figcaption>
        `
        thumbs.appendChild(fig)
      }
    } catch (err) {
      console.error(err)
      const detail = api.formatError ? api.formatError(err) : err?.message || String(err)
      message(`Nepodařilo se načíst seznam: ${detail}`, 'error')
    }
  }

  async function syncSession() {
    const { data } = await db.auth.getSession()
    const session = data.session
    if (session?.user) {
      loginView.classList.add('hidden')
      appView.classList.remove('hidden')
      userLine.innerHTML = `Přihlášen: <strong>${escapeHtml(session.user.email || session.user.id)}</strong>`
      await refreshList()
    } else {
      appView.classList.add('hidden')
      loginView.classList.remove('hidden')
      thumbs.replaceChildren()
    }
  }

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearMessage()
    const email = $('#email').value.trim()
    const password = $('#password').value
    const btn = loginForm.querySelector('button[type="submit"]')
    btn.disabled = true
    try {
      const { error } = await db.auth.signInWithPassword({ email, password })
      if (error) throw error
      message('Přihlášení úspěšné.', 'ok')
      await syncSession()
    } catch (err) {
      console.error(err)
      message(err.message || 'Přihlášení se nezdařilo.', 'error')
    } finally {
      btn.disabled = false
    }
  })

  $('#logout')?.addEventListener('click', async () => {
    await db.auth.signOut()
    message('Byli jste odhlášeni.', 'info')
    await syncSession()
  })

  $('#refresh')?.addEventListener('click', async () => {
    clearMessage()
    await refreshList()
    message('Seznam obnoven.', 'ok')
  })

  uploadForm?.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearMessage()
    const { data } = await db.auth.getSession()
    const user = data.session?.user
    if (!user) {
      message('Nejste přihlášeni.', 'error')
      return
    }

    const alt = ($('#alt-text').value || '').trim()
    const category = $('#category')?.value || 'koupelny'
    if (!alt) {
      message('Vyplňte český popis fotografie.', 'error')
      return
    }

    const btn = uploadForm.querySelector('button[type="submit"]')
    btn.disabled = true

    try {
      if (activeSource === 'url') {
        const url = ($('#photo-url').value || '').trim()
        if (!url) {
          message('Zadejte URL obrázku.', 'error')
          return
        }
        message('Přidávám fotografii z URL…', 'info')
        await api.addFromUrl(url, user.id, alt, category)
        message('Fotografie z URL přidána do galerie.', 'ok')
      } else {
        const input = $('#photos')
        const check = api.validateFiles(input.files)
        if (!check.ok) {
          message(check.error, 'error')
          return
        }
        let done = 0
        for (const file of check.files) {
          message(`Nahrávám ${done + 1}/${check.files.length}: ${file.name}`, 'info')
          await api.uploadOne(file, user.id, alt, category)
          done += 1
        }
        message(`Hotovo — nahráno ${done} fotografií.`, 'ok')
      }

      uploadForm.reset()
      setSource(activeSource)
      await refreshList()
    } catch (err) {
      console.error(err)
      const detail = api.formatError ? api.formatError(err) : err?.message || String(err)
      message(`Chyba při přidávání: ${detail}`, 'error')
    } finally {
      btn.disabled = false
    }
  })

  thumbs?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-id]')
    if (!btn) return
    const id = btn.getAttribute('data-id')
    const storagePath = btn.getAttribute('data-path')
    if (!confirm('Opravdu smazat tuto fotografii z galerie?')) return
    btn.disabled = true
    try {
      await api.deleteImage({ id, storagePath })
      message('Fotografie smazána.', 'ok')
      await refreshList()
    } catch (err) {
      console.error(err)
      const detail = api.formatError ? api.formatError(err) : err?.message || String(err)
      message(`Smazání se nezdařilo: ${detail}`, 'error')
      btn.disabled = false
    }
  })

  db.auth.onAuthStateChange(() => {
    syncSession()
  })

  await syncSession()

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
  }

  function escapeAttr(str) {
    return escapeHtml(str).replaceAll("'", '&#39;')
  }
})()
