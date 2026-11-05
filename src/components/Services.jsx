import { useInView } from '../hooks/useInView'
import { photos } from '../photos'
import { useLightbox } from '../lightbox-context'

const SERVICES = [
  {
    title: 'Pokládka obkladů a dlažeb',
    text: 'Všechny druhy keramiky a keramogranitu — od mozaiky po velkoformátové desky, na podlahy i stěny.',
    image: photos.services.tiles,
    icon: 'tile',
  },
  {
    title: 'Koupelny, sprchy a kuchyně',
    text: 'Obklady koupelen, sprchových koutů, kuchyní a sanitárních prostor včetně spádů a detailů.',
    image: photos.services.bathroom,
    icon: 'bath',
  },
  {
    title: 'Terasy, balkony a schody',
    text: 'Exteriérové dlažby a schodiště — trvanlivé řešení odolné vůči povětrnostním vlivům.',
    image: photos.services.stairs,
    icon: 'stairs',
  },
]

export default function Services() {
  const [ref, inView] = useInView()
  const { openImage } = useLightbox()

  return (
    <section id="sluzby" className="services section section--dark" ref={ref}>
      <div className="container">
        <header className={`section-head section-head--split ${inView ? 'is-visible' : ''}`}>
          <div>
            <p className="section-eyebrow section-eyebrow--gold">Naše služby</p>
            <h2 className="section-title section-title--light">Co vám nabízíme?</h2>
          </div>
          <p className="section-lead">
            Specializujeme se na profesionální pokládku dlaždic a komplexní dokončovací práce.
            Používáme moderní materiály a ověřené technologie.
          </p>
        </header>

        <div className={`services__grid services__grid--three ${inView ? 'is-visible' : ''}`}>
          {SERVICES.map((service, i) => (
            <article key={service.title} className="service-card" style={{ '--i': i }}>
              <button
                type="button"
                className="service-card__media"
                onClick={() => openImage(service.image)}
                aria-label={`${service.title} — otevřít fotografii`}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  decoding="async"
                  width={480}
                  height={600}
                  sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
              </button>
              <div className="service-card__body">
                <span className="service-card__icon" aria-hidden="true">
                  <ServiceIcon type={service.icon} />
                </span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <a href="#kontakt" className="service-card__arrow" aria-label="Kontaktovat">
                  →
                </a>
              </div>
            </article>
          ))}
        </div>

        <ul className={`services__list ${inView ? 'is-visible' : ''}`}>
          {[
            'Hydroizolace podlah a stěn',
            'Příprava a vyrovnání povrchů',
            'Sprchové zóny s odtoky a spády',
            'Spárování, silikonování a finální úpravy',
            'Řezání, přizpůsobení a úprava rohů pod 45°',
            'Demontáž staré dlažby a příprava podkladu',
            'Pokládka mozaiky a dekorativní dlažby',
            'Montáž velkoformátových desek',
          ].map((item) => (
            <li key={item}>
              <span aria-hidden="true">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ServiceIcon({ type }) {
  const props = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true }
  if (type === 'bath') {
    return (
      <svg {...props}>
        <path
          d="M5 12h14v3a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-3zm2-2V7a3 3 0 0 1 3-3h0"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  if (type === 'stairs') {
    return (
      <svg {...props}>
        <path
          d="M4 19h4v-4h4v-4h4V7h4"
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
      <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
