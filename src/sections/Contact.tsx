import { ContactForm } from '../components/ContactForm'
import { ContactInfo } from '../components/ContactInfo'
import { GlassCard } from '../components/GlassCard'
import { Reveal } from '../components/Reveal'
import SplitText from '../components/SplitText'

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
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
              duration={1.25}
              delay={40}
              from={{ opacity: 0, y: 36 }}
              to={{ opacity: 1, y: 0 }}
            />
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-400">
              Have a project in mind or want to collaborate? I'd love to hear from you.
            </p>
            <ContactInfo />

            <div className="mt-8 rounded-2xl border border-edge bg-card/50 p-5">
              <p className="flex items-center gap-3 text-sm text-slate-300">
                <span className="relative inline-flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-cyan" />
                </span>
                Currently accepting new projects — available to start this month.
              </p>
            </div>
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