import { useInView } from '../hooks/useInView'
import { company } from '../company'
import { photos } from '../photos'
import { useLightbox } from '../lightbox-context'

const POINTS = [
  'Profesionální pokládka všech formátů dlaždic',
  'Komplexní dokončovací a přípravné práce',
  'Moderní materiály a ověřené technologie',
  'Práce v Praze i po celé České republice',
]

export default function About() {
  const [ref, inView] = useInView()
  const { openImage } = useLightbox()

  return (
    <section id="o-nas" className="about section" ref={ref}>
      <div className={`container about__inner about__inner--media-first ${inView ? 'is-visible' : ''}`}>
        <button
          type="button"
          className="about__photo"
          onClick={() => openImage(photos.about)}
          aria-label="Otevřít fotografii realizace"
        >
          <img
            src={photos.about}
            alt={`${company.shortName} — realizace obkladů a dokončovacích prací`}
            loading="lazy"
            decoding="async"
            width={1280}
            height={720}
          />
        </button>

        <div className="about__copy">
          <p className="section-eyebrow">O nás</p>
          <h2 className="section-title">
            Partner pro <em>obklady a dokončení</em>
          </h2>
          <p className="about__text">
            {company.shortName} se specializuje na profesionální pokládku dlaždic a komplexní
            dokončovací práce. Od přípravy podkladu přes hydroizolaci až po finální spárování —
            precizní detaily a spolehlivý výsledek.
          </p>
          <ul className="about__points">
            {POINTS.map((p) => (
              <li key={p}>
                <span aria-hidden="true">✓</span>
                {p}
              </li>
            ))}
          </ul>
          <a href="#realizace" className="btn btn--ghost">
            Prohlédnout realizace
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
