import { photos } from '../photos'

export default function CtaBand() {
  return (
    <section className="cta-band" aria-labelledby="cta-band-title">
      <div className="container">
        <div className="cta-band__panel">
          <div className="cta-band__copy">
            <h2 id="cta-band-title">
              Domluvme obklady
              <br />
              pro váš prostor
            </h2>
            <a href="#kontakt" className="btn btn--light btn--pill btn--lg">
              Nezávazná konzultace
              <span className="btn__arrow btn__arrow--dark" aria-hidden="true">
                →
              </span>
            </a>
          </div>
          <div className="cta-band__media" aria-hidden="true">
            <img
              src={photos.services.facade || photos.about}
              alt=""
              loading="lazy"
              decoding="async"
              width={900}
              height={600}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
