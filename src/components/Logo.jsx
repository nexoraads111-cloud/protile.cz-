import { company } from '../company'

export default function Logo({ className = '', compact = false }) {
  return (
    <a
      href="#domu"
      className={`logo ${compact ? 'logo--compact' : ''} ${className}`}
      aria-label={`${company.name} — Domů`}
    >
      <svg
        className="logo__mark"
        viewBox="0 0 48 48"
        width="42"
        height="42"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="18" height="18" rx="2" fill="currentColor" />
        <rect x="26" y="4" width="18" height="18" rx="2" fill="currentColor" opacity="0.55" />
        <rect x="4" y="26" width="18" height="18" rx="2" fill="currentColor" opacity="0.55" />
        <rect x="26" y="26" width="18" height="18" rx="2" fill="currentColor" />
      </svg>
      <span className="logo__text">
        <span className="logo__name">{company.shortName}</span>
        <span className="logo__tag">{company.tagline}</span>
      </span>
    </a>
  )
}
