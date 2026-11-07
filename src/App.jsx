import Header from './components/Header'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import About from './components/About'
import Services from './components/Services'
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
          <TrustBar />
          <About />
          <Services />
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
