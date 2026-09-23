import { ContactForm } from '../components/ContactForm'
import { ContactInfo } from '../components/ContactInfo'
import { GlassCard } from '../components/GlassCard'
import { Reveal } from '../components/Reveal'
import SplitText from '../components/SplitText'

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <Reveal className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan">Contact</span>
            <SplitText
              tag="h2"
              id="contact-title"
              text="Let's Build Something Great"
              className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
              textAlign="left"
              splitType="chars"
              threshold={0.3}
              duration={0.6}
              delay={20}
              from={{ opacity: 0, y: 36 }}
              to={{ opacity: 1, y: 0 }}
            />
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-400">
              Have a project in mind or want to collaborate? I'd love to hear from you.
            </p>
            <ContactInfo />
          </Reveal>

          <Reveal delay={0.1}>
            <GlassCard className="p-7 md:p-9">
              <ContactForm />
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}