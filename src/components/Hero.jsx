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
            width={1844}
            height={1086}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>

      <div className="hero__panel" aria-hidden="true">
        <div className="hero__texture" />
      </div>

      <div className="hero__content container">
        <p className="hero__brand reveal reveal--1">
          <span>{company.shortName.toUpperCase()}</span>
          <span className="hero__brand-line" />
        </p>
        <h1 className="hero__title reveal reveal--2">
          Precizní obklady.
          <br />
          Dokončení na míru.
        </h1>
        <p className="hero__lead reveal reveal--3">
          Obklady, dlažby a dokončovací práce. Praha a celá Česká republika.
        </p>

        <div className="hero__actions reveal reveal--4">
          <a href="#kontakt" className="btn btn--gold btn--lg">
            Nezávazná poptávka
          </a>
          <a href="#realizace" className="btn btn--ghost btn--lg">
            Naše realizace
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
