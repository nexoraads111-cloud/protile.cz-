import { company } from '../company'

export default function Logo({ className = '' }) {
  return (
    <a
      href="#domu"
      className={`logo ${className}`}
      aria-label={`${company.name} — Domů`}
    >
      <span className="logo__name">{company.shortName}</span>
    </a>
  )
}
