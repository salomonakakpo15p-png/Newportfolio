import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'

export function useCountUp(target: number, duration = 1800): { ref: React.RefObject<HTMLSpanElement | null>; value: number } {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      if (prefersReduced) {
        setValue(target)
        return
      }
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, target, duration])

  return { ref, value }
}