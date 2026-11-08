import { useMemo, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useGallery } from '../gallery-context'
import { useLightbox } from '../lightbox-context'
import { photos } from '../photos'

const FEATURED = [
  {
    id: 'feat-bath',
    title: 'Koupelna — velkoformát',
    meta: 'Obklady · vana · přesné spáry',
    image: photos.services.bathroom,
    match: (g) => g.id === 'p21',
  },
  {
    id: 'feat-stone',
    title: 'Koupelna — sprcha',
    meta: 'Lineární žlab · velkoformát',
    image: photos.services.tiles,
    match: (g) => g.id === 'p12',
  },
  {
    id: 'feat-floor',
    title: 'Dlažba — chodba',
    meta: 'Pokládka · rovný povrch',
    image: photos.services.stairs,
    match: (g) => g.id === 'p15',
  },
]

export default function Projects() {
  const [ref, inView] = useInView()
  const [filter, setFilter] = useState('all')
  const { items, filters, status } = useGallery()
  const { openAt } = useLightbox()

  const filtered = useMemo(() => {
    if (filter === 'all') return items
    return items.filter((g) => g.category === filter)
  }, [filter, items])

  function openFeatured(feat) {
    const idx = items.findIndex(feat.match)
    openAt(idx >= 0 ? idx : 0)
  }

  return (
    <section id="realizace" className="projects section" ref={ref}>
      <div className="container">
        <header className={`section-head section-head--split ${inView ? 'is-visible' : ''}`}>
          <div>
            <p className="section-eyebrow">Vybrané realizace</p>
            <h2 className="section-title">Prostory, kde je práce vidět</h2>
          </div>
          <a href="#galerie" className="text-link">
            Všechny realizace
            <span aria-hidden="true">→</span>
          </a>
        </header>

        <div className={`projects__featured ${inView ? 'is-visible' : ''}`}>
          {FEATURED.map((feat, i) => (
            <button
              key={feat.id}
              type="button"
              className="project-card"
              style={{ '--i': i }}
              onClick={() => openFeatured(feat)}
              aria-label={`Otevřít: ${feat.title}`}
            >
              <div className="project-card__media">
                  <img
                  src={feat.image}
                  alt=""
                  loading="eager"
                  decoding="async"
                  width={480}
                  height={560}
                />
              </div>
              <div className="project-card__body">
                <h3>{feat.title}</h3>
                <p>{feat.meta}</p>
                <span className="text-link">
                  Detail projektu
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </button>
          ))}
        </div>

        <div id="galerie" className="projects__gallery">
          {status === 'loading' && <p className="gallery-status">Načítám galerii…</p>}
          {status === 'error' && (
            <p className="gallery-status gallery-status--warn">
              Online galerii se nepodařilo načíst — zobrazuji lokální fotografie.
            </p>
          )}

          <div className="gallery-filters" role="tablist" aria-label="Filtr kategorií">
            {filters.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={filter === cat.id}
                className={`gallery-filters__btn ${filter === cat.id ? 'is-active' : ''}`}
                onClick={() => setFilter(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="gallery-grid" key={`${filter}-${filtered.length}`}>
            {filtered.length === 0 ? (
              <p className="gallery-empty">V této kategorii zatím nejsou fotografie.</p>
            ) : (
              filtered.map((item, i) => {
                const fullIndex = items.findIndex((g) => g.id === item.id)
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="gallery-card"
                    style={{ '--i': i }}
                    onClick={() => openAt(fullIndex)}
                    aria-label={`Otevřít: ${item.title}`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading={i < 6 ? 'eager' : 'lazy'}
                      decoding="async"
                      width={480}
                      height={360}
                      sizes="(max-width: 860px) 50vw, (max-width: 1100px) 33vw, 25vw"
                    />
                    <span className="gallery-card__caption">
                      <span>{item.title}</span>
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
