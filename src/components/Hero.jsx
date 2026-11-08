import { company } from '../company'
import { photos } from '../photos'

export default function Hero() {
  return (
    <section id="domu" className="hero">
      <div className="hero__media" aria-hidden="true">
        <picture>
          <source srcSet={photos.hero} type="image/webp" />
          <img
            src={photos.heroJpg}
            alt=""
            className="hero__img"
            width={1672}
            height={941}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="hero__scrim" />
      </div>

      <div className="hero__content container">
        <p className="hero__brand reveal reveal--1">
          <span>{company.shortName}</span>
          <span className="hero__brand-line" aria-hidden="true" />
        </p>
        <h1 className="hero__title reveal reveal--2">
          Precizní obklady.
          <br />
          Dokončení na míru.
        </h1>
        <p className="hero__lead reveal reveal--3">
          Obklady, dlažby a dokončovací práce. {company.areaFull}.
        </p>

        <div className="hero__actions reveal reveal--4">
          <a href="#kontakt" className="btn btn--dark btn--pill btn--lg">
            Nezávazná poptávka
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </a>
          <a href="#realizace" className="hero__secondary">
            Naše realizace
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <aside className="hero__chip container">
        <div className="hero__chip-card">
          <img
            src={photos.chip}
            alt=""
            width={72}
            height={56}
            loading="lazy"
            decoding="async"
          />
          <div>
            <p>Reálné zakázky — Praha i celá ČR</p>
            <a href="#realizace">Prohlédnout →</a>
          </div>
        </div>
      </aside>
    </section>
  )
}
