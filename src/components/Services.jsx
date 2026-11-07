import { useInView } from '../hooks/useInView'
import { photos } from '../photos'
import { useLightbox } from '../lightbox-context'

const SERVICES = [
  { title: 'Obklady a dlažby', image: photos.services.tiles },
  { title: 'Koupelny', image: photos.services.bathroom },
  { title: 'Terasy a schody', image: photos.services.stairs },
]

export default function Services() {
  const [ref, inView] = useInView()
  const { openImage } = useLightbox()

  return (
    <section id="sluzby" className="services section section--cream" ref={ref}>
      <div className="container">
        <header className={`services__intro ${inView ? 'is-visible' : ''}`}>
          <span className="services__rule" aria-hidden="true" />
          <h2 className="services__heading">Řemeslo, které je vidět.</h2>
        </header>

        <div className={`services__cards ${inView ? 'is-visible' : ''}`}>
          {SERVICES.map((service, i) => (
            <button
              key={service.title}
              type="button"
              className="service-tile"
              style={{ '--i': i }}
              onClick={() => openImage(service.image)}
              aria-label={`${service.title} — otevřít fotografii`}
            >
              <img
                src={service.image}
                alt={service.title}
                loading="lazy"
                decoding="async"
                width={870}
                height={382}
                sizes="(max-width: 860px) 100vw, 33vw"
              />
              <span className="service-tile__shade" aria-hidden="true" />
              <span className="service-tile__label">
                <span>{service.title}</span>
                <span className="service-tile__arrow" aria-hidden="true">
                  →
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
