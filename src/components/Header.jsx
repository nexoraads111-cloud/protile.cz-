import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Logo from './Logo'
import { company } from '../company'

const NAV = [
  { id: 'domu', label: 'Domov' },
  { id: 'proc-my', label: 'Proč my' },
  { id: 'realizace', label: 'Realizace' },
  { id: 'recenze', label: 'Recenze' },
  { id: 'kontakt', label: 'Kontakt' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('domu')
  const navId = useId()
  const toggleRef = useRef(null)
  const firstLinkRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
      const sections = NAV.map((item) => document.getElementById(item.id)).filter(Boolean)
      const y = window.scrollY + 100
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop <= y) {
          setActive(sections[i].id)
          break
        }
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Class must live on <body> — CSS uses body.nav-open for scroll lock.
    if (open) {
      document.body.classList.add('nav-open')
      requestAnimationFrame(() => firstLinkRef.current?.focus())
    } else {
      document.body.classList.remove('nav-open')
    }
    return () => document.body.classList.remove('nav-open')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="site-header__inner container">
        <Logo />

        <nav className="site-nav" aria-label="Hlavní navigace">
          <ul className="site-nav__list">
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={active === item.id ? 'is-active' : ''}
                  onClick={close}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#kontakt" className="btn btn--dark btn--pill site-header__cta">
          Nezávazná konzultace
          <span className="btn__arrow" aria-hidden="true">
            →
          </span>
        </a>

        <button
          ref={toggleRef}
          type="button"
          className={`menu-toggle ${open ? 'is-open' : ''}`}
          aria-expanded={open}
          aria-controls={navId}
          aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="menu-toggle__bars" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <div className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
            <button
              type="button"
              className="mobile-menu__backdrop"
              aria-label="Zavřít menu"
              tabIndex={open ? 0 : -1}
              onClick={close}
            />

            <nav
              id={navId}
              className="mobile-menu__panel"
              aria-label="Mobilní navigace"
              inert={!open ? true : undefined}
            >
              <div className="mobile-menu__chrome">
                <button
                  type="button"
                  className="mobile-menu__close"
                  aria-label="Zavřít menu"
                  tabIndex={open ? 0 : -1}
                  onClick={() => {
                    close()
                    toggleRef.current?.focus()
                  }}
                >
                  <span className="mobile-menu__close-x" aria-hidden="true">
                    ×
                  </span>
                  <span className="mobile-menu__close-label">Zavřít</span>
                </button>
              </div>

              <div className="mobile-menu__top">
                <p className="mobile-menu__eyebrow">Navigace</p>
                <span className="mobile-menu__rule" aria-hidden="true" />
              </div>

              <ul className="mobile-menu__list">
                {NAV.map((item, i) => (
                  <li key={item.id} style={{ '--i': i }}>
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={`#${item.id}`}
                      className={active === item.id ? 'is-active' : ''}
                      onClick={close}
                      tabIndex={open ? 0 : -1}
                    >
                      <span className="mobile-menu__index">{String(i + 1).padStart(2, '0')}</span>
                      <span className="mobile-menu__label">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mobile-menu__footer">
                <div className="mobile-menu__meta">
                  <a href={`tel:${company.phoneLinks[0]}`} tabIndex={open ? 0 : -1}>
                    <span>Telefon</span>
                    <strong>{company.phoneDisplay}</strong>
                  </a>
                  <a href={`mailto:${company.email}`} tabIndex={open ? 0 : -1}>
                    <span>E-mail</span>
                    <strong>{company.email}</strong>
                  </a>
                </div>
                <a
                  href="#kontakt"
                  className="btn btn--dark btn--pill btn--lg mobile-menu__cta"
                  onClick={close}
                  tabIndex={open ? 0 : -1}
                >
                  Nezávazná konzultace
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </nav>
          </div>,
          document.body,
        )}
    </header>
  )
}
