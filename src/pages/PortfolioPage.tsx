import { useEffect } from 'react'
import { About } from '../sections/About'
import { Contact } from '../sections/Contact'
import { Footer } from '../sections/Footer'
import { Hero } from '../sections/Hero'
import { Process } from '../sections/Process'
import { Projects } from '../sections/Projects'
import { Skills } from '../sections/Skills'
import { Stats } from '../sections/Stats'
import { Testimonials } from '../sections/Testimonials'
import { reloadContent } from '../lib/content-store'

export function PortfolioPage() {
  useEffect(() => {
    reloadContent()
  }, [])
  return (
    <>
      <main>
        <Hero />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 pb-24 md:pb-28 lg:grid-cols-2 lg:gap-6">
            <About />
            <Skills />
          </div>
        </div>
        <Projects />
        <Process />
        <Testimonials />
        <Stats />
        <Contact />
      </main>
      <Footer />
    </>
  )
}