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
          className="menu-toggle"
          aria-expanded={open}
          aria-controls={navId}
          aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <>
            <button
              type="button"
              className={`mobile-nav-backdrop ${open ? 'is-open' : ''}`}
              aria-label="Zavřít menu"
              tabIndex={open ? 0 : -1}
              onClick={close}
            />

            <nav
              id={navId}
              className={`mobile-nav ${open ? 'is-open' : ''}`}
              aria-label="Mobilní navigace"
              aria-hidden={!open}
              inert={!open ? true : undefined}
            >
              <ul>
                {NAV.map((item, i) => (
                  <li key={item.id}>
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={`#${item.id}`}
                      onClick={close}
                      tabIndex={open ? 0 : -1}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mobile-nav__contact">
                <a href={`tel:${company.phoneLinks[0]}`} tabIndex={open ? 0 : -1}>
                  {company.phoneDisplay}
                </a>
                <a href={`mailto:${company.email}`} tabIndex={open ? 0 : -1}>
                  {company.email}
                </a>
                <a
                  href="#kontakt"
                  className="btn btn--dark btn--pill"
                  onClick={close}
                  tabIndex={open ? 0 : -1}
                >
                  Nezávazná konzultace
                </a>
              </div>
            </nav>
          </>,
          document.body,
        )}
    </header>
  )
}
