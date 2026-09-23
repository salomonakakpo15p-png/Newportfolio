import { motion, useReducedMotion } from 'motion/react'

interface SkillBarProps {
  name: string
  level: number
}

export function SkillBar({ name, level }: SkillBarProps) {
  const reduce = useReducedMotion()

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-ink">{name}</span>
        <span className="tabular-nums text-slate-400">{level}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name} proficiency`}
        className="h-2 w-full overflow-hidden rounded-full bg-white/5"
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan to-cyan-bright"
          initial={{ width: reduce ? `${level}%` : '0%' }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}