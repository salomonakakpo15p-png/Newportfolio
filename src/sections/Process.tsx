import { Compass, Code2, Map, PenTool, Rocket, ShieldCheck, type LucideIcon } from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { useSiteData } from '../lib/content-store'

const iconMap: Record<string, LucideIcon> = {
  search: Compass,
  map: Map,
  pen: PenTool,
  code: Code2,
  shield: ShieldCheck,
  rocket: Rocket,
}

export function Process() {
  const processSteps = useSiteData().process

  return (
    <section id="process" aria-labelledby="process-title" className="scroll-mt-24 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How I Work"
          title="Mon processus de travail"
          description="A clear, battle-tested process that keeps every project on time, on budget and on target."
          animated
        />

        <ol className="relative grid gap-6 lg:grid-cols-6 lg:gap-0">
          {/* Progress line (horizontal on desktop, vertical on mobile) */}
          <li
            aria-hidden="true"
            className="absolute left-[1.125rem] top-0 h-full w-px bg-gradient-to-b from-cyan/50 via-edge to-transparent lg:left-0 lg:top-[2.25rem] lg:h-px lg:w-full lg:bg-gradient-to-r"
          />

          {processSteps.map((step, index) => {
            const Icon = iconMap[step.icon] ?? Compass
            const isLast = index === processSteps.length - 1
            return (
              <li key={step.number} className={`relative pl-14 lg:flex-1 lg:pl-0 ${isLast ? '' : ''}`}>
                <Reveal delay={index * 0.07} className="h-full">
                  <GlassCard interactive className="h-full p-6 lg:text-center">
                    <div className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-cyan/40 bg-void text-cyan lg:left-1/2 lg:-top-10 lg:size-11 lg:-translate-x-1/2">
                      <Icon className="size-4 lg:size-5" aria-hidden="true" />
                    </div>
                    <p className="font-display text-sm font-semibold text-cyan/80 lg:mb-1">{step.number}</p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
                  </GlassCard>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}