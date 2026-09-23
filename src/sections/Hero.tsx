import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, ImageOff, MessageCircle } from 'lucide-react'
import { Button } from '../components/Button'
import { FloatingStat } from '../components/FloatingStat'
import { SocialLinks } from '../components/SocialLinks'
import SplitText from '../components/SplitText'
import { useSiteData } from '../lib/content-store'

export function Hero() {
  const profile = useSiteData().profile
  const reduce = useReducedMotion()
  const portraitRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: portraitRef, offset: ['start start', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80])
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.21, 0.47, 0.32, 0.98] as const },
  })

  const stats = profile.heroStats

  const headline = (
    split: string,
    cls = '',
    chars: string | undefined = undefined,
  ) => (
    <SplitText
      tag="span"
      text={split}
      className={`inline-block ${cls}`}
      textAlign="inherit"
      splitType="chars"
      threshold={0.1}
      duration={0.5}
      delay={16}
      charsClassName={chars}
      from={{ opacity: 0, y: 40 }}
      to={{ opacity: 1, y: 0 }}
    />
  )

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8">
        <div className="relative z-10 max-w-xl lg:max-w-none">
          <motion.h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
            {headline(profile.headlinePre)}
            {' '}
            {headline(
              profile.headlineHighlight,
              '',
              'split-char bg-gradient-to-r from-cyan to-cyan-bright bg-clip-text text-transparent text-glow',
            )}
            {' '}
            {headline(profile.headlinePost)}
          </motion.h1>

          <motion.p {...enter(0.1)} className="mt-6 max-w-lg text-base leading-relaxed text-slate-400 md:text-lg">
            {profile.bioShort}
          </motion.p>

          <motion.div {...enter(0.2)} className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              href="#projects"
              size="lg"
              icon={<ArrowRight className="size-4" />}
              iconPosition="right"
            >
              View My Work
            </Button>
            <Button href="#contact" size="lg" variant="secondary" icon={<MessageCircle className="size-4" />}>
              Let's Talk
            </Button>
          </motion.div>

          <motion.div {...enter(0.3)} className="mt-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Find me on</p>
            <SocialLinks links={profile.socialLinks} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <motion.div style={{ y: parallaxY }} ref={portraitRef} className="relative mx-auto aspect-[4/4.6] w-full max-w-sm sm:max-w-md lg:max-w-sm xl:max-w-md">
            <div
              aria-hidden="true"
              className="absolute -inset-8 rounded-full bg-cyan/15 blur-[90px]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-4 rounded-full border border-dashed border-cyan/20 animate-spin-slow"
            />
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-edge shadow-card">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={`Portrait of ${profile.name}, ${profile.role}`}
                  width={343}
                  height={361}
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-card/60">
                  <span className="font-display text-7xl font-bold tracking-tight text-cyan/90">
                    {profile.initials || profile.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-slate-500">
                    <ImageOff className="size-3.5" aria-hidden="true" />
                    No photo set
                  </span>
                </div>
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent"
              />
            </div>

            {/* Desktop floating stats */}
            <div className="absolute top-6 -left-6 hidden md:block">
              {stats[0] && <FloatingStat stat={stats[0]} className="animate-float" />}
            </div>
            <div className="absolute -right-4 top-1/2 hidden md:block lg:right-0">
              {stats[1] && <FloatingStat stat={stats[1]} className="animate-float-slow" />}
            </div>
            <div className="absolute -bottom-5 left-6 hidden md:block">
              {stats[2] && <FloatingStat stat={stats[2]} className="animate-float" />}
            </div>
          </motion.div>

          {/* Mobile floating stats in-flow, never overflowing */}
          <ul className="mt-8 grid grid-cols-3 gap-2.5 md:hidden" aria-label="Quick statistics">
            {stats.map((stat) => (
              <li key={stat.label}>
                <FloatingStat stat={stat} compact className="w-full animate-none" />
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}