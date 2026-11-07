import { useInView } from '../hooks/useInView'

const FEATURES = [
  {
    title: 'Kvalita spár a detailů',
    body: 'Přesné řezy, rovné spáry a čisté napojení — výsledek, který unese i velké formáty.',
    metric: '10+',
    metricLabel: 'let zkušeností',
    icon: 'quality',
  },
  {
    title: 'Kompletní realizace',
    body: 'Od přípravy podkladu přes hydroizolaci až po finální spárování. Jedna firma, jeden výsledek.',
    metric: '100+',
    metricLabel: 'dokončených zakázek',
    icon: 'projects',
  },
  {
    title: 'Transparentní nabídka',
    body: 'Jasný rozpočet předem, bez skrytých příplatků. Domluvíme termín a držíme se dohody.',
    metric: '0',
    metricLabel: 'skrytých poplatků',
    icon: 'price',
  },
  {
    title: 'Praha i celá ČR',
    body: 'Sídlíme v Praze–Nuslích a jezdíme za zakázkami po celé České republice.',
    metric: '100%',
    metricLabel: 'zaměření na obklady',
    icon: 'area',
  },
]

function FeatureIcon({ name }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  if (name === 'quality') {
    return (
      <svg {...common}>
        <path d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5L12 14.8 7.5 16.7l.9-5L4.8 8.2l5-.7L12 3z" />
      </svg>
    )
  }
  if (name === 'projects') {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18M9 4v16" />
      </svg>
    )
  }
  if (name === 'price') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v8M9.5 10.5c.5-1 1.5-1.5 2.5-1.5s2 .6 2 1.7c0 2.3-4.5 1.3-4.5 3.6 0 1 .9 1.7 2.5 1.7s2-.4 2.5-1.2" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M12 21s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.6-7 10-7 10z" />
    </svg>
  )
}

export default function WhyUs() {
  const [ref, inView] = useInView()

  return (
    <section id="proc-my" className="why section" ref={ref}>
      <div className="container">
        <header className={`section-head ${inView ? 'is-visible' : ''}`}>
          <p className="section-eyebrow">Proč my</p>
          <h2 className="section-title">Obklady, na které se můžete spolehnout</h2>
        </header>

        <div className={`why__grid ${inView ? 'is-visible' : ''}`}>
          {FEATURES.map((item, i) => (
            <article key={item.title} className="why-card" style={{ '--i': i }}>
              <div className="why-card__icon">
                <FeatureIcon name={item.icon} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <div className="why-card__metric">
                <strong>{item.metric}</strong>
                <span>{item.metricLabel}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
