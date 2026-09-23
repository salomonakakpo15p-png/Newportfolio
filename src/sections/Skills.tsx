import { GlassCard } from '../components/GlassCard'
import { Reveal } from '../components/Reveal'
import { SkillBar } from '../components/SkillBar'
import { useSiteData } from '../lib/content-store'

export function Skills() {
  const skills = useSiteData().skills

  return (
    <section id="skills" aria-labelledby="skills-title" className="flex h-full scroll-mt-24 flex-col">
      <Reveal>
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan">Expertise</span>
        <h2 id="skills-title" className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
          My Expertise
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-8 h-full">
        <GlassCard className="flex h-full flex-col p-7 md:p-9">
          <p className="text-sm leading-relaxed text-slate-400">
            The technologies I use daily to build fast, reliable and beautiful products. Percentages are a
            visual indicator of confidence, not a scientific measure.
          </p>
          <div className="mt-8 flex flex-col gap-6">
            {skills.map((skill) => (
              <SkillBar key={skill.name} name={skill.name} level={skill.level} />
            ))}
          </div>
        </GlassCard>
      </Reveal>
    </section>
  )
}