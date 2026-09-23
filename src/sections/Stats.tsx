import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { StatCard } from '../components/StatCard'
import { useSiteData } from '../lib/content-store'

export function Stats() {
  const stats = useSiteData().stats

  return (
    <section id="stats" aria-labelledby="stats-title" className="scroll-mt-24 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Results" title="En chiffres" animated />
        <ul className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <li key={stat.label}>
              <Reveal delay={index * 0.08} className="h-full">
                <StatCard value={stat.value} suffix={stat.suffix} label={stat.label} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}