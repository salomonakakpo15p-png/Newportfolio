import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { TestimonialCarousel } from '../components/TestimonialCarousel'
import { useSiteData } from '../lib/content-store'

export function Testimonials() {
  const testimonials = useSiteData().testimonials

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="scroll-mt-24 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Feedback"
          title="Ce que disent les clients"
          description="Real words from the people I've had the pleasure of building with."
          animated
        />
        <Reveal>
          <TestimonialCarousel testimonials={testimonials} autoplay autoplayInterval={6500} />
        </Reveal>
      </div>
    </section>
  )
}