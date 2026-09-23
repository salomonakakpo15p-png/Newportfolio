import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
          onClick={() => {
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' })
          }}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 inline-flex size-11 items-center justify-center rounded-full border border-edge bg-card/80 text-cyan shadow-card backdrop-blur transition-all duration-300 hover:border-cyan/40 hover:shadow-glow-sm"
        >
          <ArrowUp className="size-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}