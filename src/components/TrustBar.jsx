import { useInView } from '../hooks/useInView'

const ITEMS = [
  {
    title: '+150',
    text: 'Spokojených zákazníků',
    icon: 'home',
  },
  {
    title: 'Praha + ČR',
    text: 'Zakázky po celé republice',
    icon: 'helmet',
  },
  {
    title: '100%',
    text: 'Důraz na kvalitu detailu',
    icon: 'trophy',
  },
  {
    title: 'Termíny',
    text: 'Spolehlivá komunikace',
    icon: 'handshake',
  },
]

export default function TrustBar() {
  const [ref, inView] = useInView({ threshold: 0.2 })

  return (
    <section className={`trust-bar ${inView ? 'is-visible' : ''}`} aria-label="Proč ProTile CZ" ref={ref}>
      <div className="container trust-bar__grid">
        {ITEMS.map((item, i) => (
          <article key={item.title} className="trust-bar__item" style={{ '--i': i }}>
            <span className="trust-bar__icon" aria-hidden="true">
              <TrustIcon type={item.icon} />
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function TrustIcon({ type }) {
  const props = { width: 28, height: 28, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true }
  if (type === 'home') {
    return (
      <svg {...props}>
        <path
          d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (type === 'helmet') {
    return (
      <svg {...props}>
        <path
          d="M4 14c0-4.4 3.6-8 8-8s8 3.6 8 8H4zm0 0h16v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V14zm8-8V4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (type === 'trophy') {
    return (
      <svg {...props}>
        <path
          d="M8 4h8v5a4 4 0 0 1-8 0V4zm0 1H5a2 2 0 0 0 2 3.5M16 5h3a2 2 0 0 1-2 3.5M12 13v3m-3 4h6m-3-4a3 3 0 0 0-3 3h6a3 3 0 0 0-3-3z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg {...props}>
      <path
        d="M8 12.5 5.5 10l1.5-1.5L9.5 11l5-5L16 7.5l-7 7zm7.5-1.5 2.5-2.5L16.5 7l-2 2 1 2zM7 16l-1.5 1.5L9 21l1.5-1.5L7 16zm7 0-3.5 3.5L12 21l3.5-3.5L14 16z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}
