import Header from './components/Header'
import Hero from './components/Hero'
import WhyUs from './components/WhyUs'
import Projects from './components/Projects'
import CtaBand from './components/CtaBand'
import Reviews from './components/Reviews'
import Footer from './components/Footer'
import Lightbox from './components/Lightbox'
import { GalleryProvider } from './gallery-context'
import { LightboxProvider } from './lightbox-context'

export default function App() {
  return (
    <GalleryProvider>
      <LightboxProvider>
        <Header />
        <main>
          <Hero />
          <WhyUs />
          <Projects />
          <CtaBand />
          <Reviews />
        </main>
        <Footer />
        <Lightbox />
      </LightboxProvider>
    </GalleryProvider>
  )
}
