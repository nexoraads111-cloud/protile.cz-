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
            width={1280}
            height={720}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="hero__overlay" />
        <div className="hero__grain" />
      </div>

      <div className="hero__content container">
        <p className="hero__brand reveal reveal--1">{company.shortName}</p>
        <h1 className="hero__title reveal reveal--2">
          Pokládáme precizně.
          <br />
          Dokončujeme na míru.
        </h1>
        <p className="hero__lead reveal reveal--3">
          Profesionální pokládka obkladů a dlažeb a komplexní dokončovací práce v Česku —
          moderní materiály, přesná práce a spolehlivý výsledek.
        </p>

        <div className="hero__actions reveal reveal--4">
          <a href="#sluzby" className="btn btn--primary btn--lg">
            Naše služby
            <span aria-hidden="true">→</span>
          </a>
          <a href="#kontakt" className="btn btn--ghost btn--lg">
            Kontaktujte nás
          </a>
        </div>
      </div>
    </section>
  )
}
