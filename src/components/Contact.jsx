import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { company } from '../company'
import { photos } from '../photos'
import Logo from './Logo'

export default function Contact() {
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
    <footer id="kontakt" className="contact" ref={ref}>
      <div className="contact__bg" aria-hidden="true">
        <img
          src={photos.contactBg}
          alt=""
          loading="lazy"
          decoding="async"
          width={900}
          height={700}
        />
      </div>
      <div className="contact__shade" aria-hidden="true" />

      <div className={`container contact__inner ${inView ? 'is-visible' : ''}`}>
        <div className="contact__grid contact__grid--form">
          <div className="contact__intro">
            <p className="section-eyebrow section-eyebrow--gold">Kontakt</p>
            <h2 className="section-title">
              Máte projekt? <em>Napište nám</em>
            </h2>
            <p className="contact__lead">
              Domluvíme nezávaznou konzultaci, prohlédneme si prostor a připravíme férovou nabídku
              na míru vaší zakázce.
            </p>

            <div className="contact__details contact__details--compact">
              <a className="contact__row" href={`tel:${company.phoneLinks[0]}`}>
                <span className="contact__label">Telefon</span>
                <strong>{company.phoneDisplay}</strong>
              </a>
              <a className="contact__row" href={`mailto:${company.email}`}>
                <span className="contact__label">E-mail</span>
                <strong>{company.email}</strong>
              </a>
              <div className="contact__row">
                <span className="contact__label">Adresa</span>
                <strong>{company.address.full}</strong>
              </div>
              <div className="contact__row">
                <span className="contact__label">IČO</span>
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
            <button type="submit" className="btn btn--gold btn--lg contact-form__submit">
              Odeslat zprávu
              <span aria-hidden="true">→</span>
            </button>
            {status === 'ok' && (
              <p className="contact-form__msg" role="status">
                Otevírá se e-mailový klient — zprávu stačí odeslat.
              </p>
            )}
          </form>
        </div>

        <div className="contact__legal">
          <Logo className="logo--footer" />
          <div className="contact__legal-text">
            <p>
              <strong>{company.name}</strong>
            </p>
            <p>IČO: {company.ico}</p>
            <p>{company.address.full}</p>
            <p className="contact__muted">
              {company.activities.slice(0, 2).join(' · ')}
            </p>
          </div>
          <nav className="contact__footer-nav" aria-label="Patička">
            {['Domov', 'O nás', 'Služby', 'Realizace', 'Kontakt'].map((label, i) => {
              const ids = ['domu', 'o-nas', 'sluzby', 'realizace', 'kontakt']
              return (
                <a key={label} href={`#${ids[i]}`}>
                  {label}
                </a>
              )
            })}
          </nav>
        </div>

        <p className="contact__copy">
          © {new Date().getFullYear()} {company.name}. Všechna práva vyhrazena.
          <a className="contact__admin-link" href="./admin.html">
            Admin galerie
          </a>
        </p>
      </div>
    </footer>
  )
}
