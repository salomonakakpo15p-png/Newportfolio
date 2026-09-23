import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Testimonial } from '../data/testimonials'
import { cn } from '../lib/utils'
import { GlassCard } from './GlassCard'

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  autoplay?: boolean
  autoplayInterval?: number
}

export function TestimonialCarousel({
  testimonials,
  autoplay = true,
  autoplayInterval = 6000,
}: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dragX, setDragX] = useState(0)
  const pointerStart = useRef<number | null>(null)
  const reduce = useReducedMotion()
  const count = testimonials.length
  const safeIndex = index % count

  const goTo = (next: number) => setIndex(((next % count) + count) % count)
  const next = () => goTo(safeIndex + 1)
  const prev = () => goTo(safeIndex - 1)

  useEffect(() => {
    if (!autoplay || paused || reduce || count <= 1) return
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, autoplayInterval)
    return () => clearInterval(timer)
  }, [autoplay, paused, reduce, autoplayInterval, count])

  const active = testimonials[safeIndex]

  return (
    <div
      className="relative mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
        className="relative overflow-hidden rounded-2xl"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') prev()
          if (event.key === 'ArrowRight') next()
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={safeIndex}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: dragX || 60 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dragX || -60 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            // Drag is only an input hint; navigation happens on release.
            style={{ cursor: 'grab', touchAction: 'pan-y' }}
            onPointerDown={(event) => {
              pointerStart.current = event.clientX
              setDragX(0)
            }}
            onPointerMove={(event) => {
              if (pointerStart.current === null) return
              setDragX(event.clientX - pointerStart.current)
            }}
            onPointerUp={(event) => {
              if (pointerStart.current === null) return
              const delta = event.clientX - pointerStart.current
              if (Math.abs(delta) > 48) {
                if (delta < 0) next()
                else prev()
              }
              pointerStart.current = null
              setDragX(0)
            }}
            onPointerCancel={() => {
              pointerStart.current = null
              setDragX(0)
            }}
          >
            <GlassCard className="p-8 py-10 md:p-12">
              <Quote className="size-8 text-cyan/70" aria-hidden="true" />
              <blockquote className="mt-5 text-lg leading-relaxed text-ink/90 md:text-xl">
                “{active.quote}”
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                {active.avatar ? (
                  <img
                    src={active.avatar}
                    alt=""
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    className="size-12 rounded-full border border-edge object-cover"
                  />
                ) : (
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-edge bg-cyan/10 text-sm font-semibold text-cyan">
                    {active.name.slice(0, 1)}
                  </span>
                )}
                <div>
                  <p className="font-semibold text-ink">{active.name}</p>
                  <p className="text-sm text-slate-400">
                    {active.role} · {active.company}
                  </p>
                </div>
              </div>
              <p role="img" className="mt-4 flex items-center gap-1" aria-label={`Rated ${active.rating} out of 5`}>
                {Array.from({ length: active.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-cyan text-cyan" aria-hidden="true" />
                ))}
              </p>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous testimonial"
          className="inline-flex size-10 items-center justify-center rounded-full border border-edge bg-card/60 text-slate-300 transition-all duration-300 hover:border-cyan/40 hover:text-cyan"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose testimonial">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={i === safeIndex}
              aria-label={`Testimonial ${i + 1} from ${t.name}`}
              onClick={() => goTo(i)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === safeIndex ? 'w-7 bg-cyan' : 'w-2 bg-slate-600 hover:bg-slate-400',
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next testimonial"
          className="inline-flex size-10 items-center justify-center rounded-full border border-edge bg-card/60 text-slate-300 transition-all duration-300 hover:border-cyan/40 hover:text-cyan"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}