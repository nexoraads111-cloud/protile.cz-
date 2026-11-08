import { company } from '../company'

export default function Logo({ className = '' }) {
  return (
    <a
      href="#domu"
      className={`logo ${className}`}
      aria-label={`${company.name} — Domů`}
    >
      <span className="logo__mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="logo__text">
        <span className="logo__name">{company.shortName}</span>
        <span className="logo__tag">{company.tagline}</span>
      </span>
    </a>
  )
}
