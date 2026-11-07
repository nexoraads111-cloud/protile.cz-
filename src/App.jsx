import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import TrustBar from './components/TrustBar'
import About from './components/About'
import Realizations from './components/Realizations'
import Process from './components/Process'
import Reviews from './components/Reviews'
import Contact from './components/Contact'
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
          <Services />
          <TrustBar />
          <About />
          <Realizations />
          <Process />
          <Reviews />
        </main>
        <Contact />
        <Lightbox />
      </LightboxProvider>
    </GalleryProvider>
  )
}
