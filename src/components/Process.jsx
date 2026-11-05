import { useInView } from '../hooks/useInView'

const STEPS = [
  {
    n: '01',
    title: 'Konzultace',
    text: 'Probereme prostor, materiály a vaše představy. Připravíme nezávaznou nabídku.',
  },
  {
    n: '02',
    title: 'Příprava',
    text: 'Demontáž, vyrovnání podkladu a hydroizolace — pevný základ pro přesnou pokládku.',
  },
  {
    n: '03',
    title: 'Realizace',
    text: 'Pokládka obkladů a dlažeb včetně detailů, spádů, řezů a úprav rohů.',
  },
  {
    n: '04',
    title: 'Předání',
    text: 'Spárování, silikonování a finální kontrola. Čistý výsledek připravený k užívání.',
  },
]

export default function Process() {
  const [ref, inView] = useInView({ threshold: 0.15 })

  return (
    <section id="postup" className="process section" ref={ref}>
      <div className="container">
        <header className={`section-head section-head--center ${inView ? 'is-visible' : ''}`}>
          <p className="section-eyebrow section-eyebrow--gold">Náš postup</p>
          <h2 className="section-title section-title--light">Jak spolupracujeme</h2>
        </header>

        <ol className={`process__track ${inView ? 'is-visible' : ''}`}>
          {STEPS.map((step, i) => (
            <li key={step.n} className="process__step" style={{ '--i': i }}>
              <span className="process__num" aria-hidden="true">
                {step.n}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
