import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { company } from '../company'
import Logo from './Logo'

export default function Footer() {
  const [ref, inView] = useInView()
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)

  function onSubmit(e) {
    e.preventDefault()
    const subject = encodeURIComponent(`Poptávka z webu — ${fields.name.trim()}`)
    const body = encodeURIComponent(
      `Jméno: ${fields.name.trim()}\nE-mail: ${fields.email.trim()}\n\n${fields.message.trim()}`,
    )
    window.location.href = `mailto:${company.email}?subject=${subject}&body=${body}`
    setStatus('ok')
  }

  return (
    <footer id="kontakt" className="site-footer" ref={ref}>
      <div className={`container site-footer__contact ${inView ? 'is-visible' : ''}`}>
        <div className="site-footer__intro">
          <p className="section-eyebrow">Kontakt</p>
          <h2 className="section-title">Máte projekt? Napište nám</h2>
          <p className="site-footer__lead">
            Domluvíme nezávaznou konzultaci, prohlédneme prostor a připravíme férovou nabídku na míru.
          </p>

          <div className="site-footer__details">
            <a href={`tel:${company.phoneLinks[0]}`}>
              <span>Telefon</span>
              <strong>{company.phoneDisplay}</strong>
            </a>
            <a href={`mailto:${company.email}`}>
              <span>E-mail</span>
              <strong>{company.email}</strong>
            </a>
            <div>
              <span>Adresa</span>
              <strong>{company.address.full}</strong>
            </div>
            <div>
              <span>IČO</span>
              <strong>{company.ico}</strong>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={onSubmit}>
          <label>
            Vaše jméno*
            <input
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              value={fields.name}
              onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
              placeholder="Jan Novák"
            />
          </label>
          <label>
            Váš e-mail*
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              value={fields.email}
              onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
              placeholder="jan@email.cz"
            />
          </label>
          <label>
            Zpráva*
            <textarea
              name="message"
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              value={fields.message}
              onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
              placeholder="Popište prostor, typ obkladů nebo termín…"
            />
          </label>
          <button type="submit" className="btn btn--dark btn--pill btn--lg">
            Odeslat zprávu
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </button>
          {status === 'ok' && (
            <p className="contact-form__msg" role="status">
              Otevírá se e-mailový klient — zprávu stačí odeslat.
            </p>
          )}
        </form>
      </div>

      <div className="site-footer__bar container">
        <Logo className="logo--footer" />
        <p className="site-footer__tag">{company.tagline}</p>
        <p className="site-footer__copy">
          © {new Date().getFullYear()} {company.name}
          <a className="site-footer__admin" href="./admin.html">
            Admin
          </a>
        </p>
        <a href="#domu" className="site-footer__top" aria-label="Zpět nahoru">
          ↑
        </a>
      </div>
    </footer>
  )
}
