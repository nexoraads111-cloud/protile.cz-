import { useEffect, useId, useRef, useState } from 'react'
import Logo from './Logo'
import { company } from '../company'

const NAV = [
  { id: 'domu', label: 'Domov' },
  { id: 'o-nas', label: 'O nás' },
  { id: 'sluzby', label: 'Služby' },
  { id: 'realizace', label: 'Realizace' },
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
      setScrolled(window.scrollY > 20)
      const sections = NAV.map((item) => document.getElementById(item.id)).filter(Boolean)
      const y = window.scrollY + 110
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
    const root = document.documentElement
    if (open) {
      root.classList.add('nav-open')
      requestAnimationFrame(() => firstLinkRef.current?.focus())
    } else {
      root.classList.remove('nav-open')
    }
    return () => root.classList.remove('nav-open')
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
  const toggle = () => setOpen((v) => !v)

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="site-header__bar">
        <div className="site-header__inner">
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

          <a
            href={`tel:${company.phoneLinks[0]}`}
            className="btn btn--phone site-header__cta"
            aria-label={`Zavolat ${company.phoneDisplay}`}
          >
            <PhoneIcon />
            {company.phoneDisplay}
          </a>

          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls={navId}
            aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
            onClick={toggle}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

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
          <a href="#kontakt" className="btn btn--gold" onClick={close} tabIndex={open ? 0 : -1}>
            Nezávazná poptávka
          </a>
        </div>
      </nav>
    </header>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2.2 2.9z"
      />
    </svg>
  )
}
