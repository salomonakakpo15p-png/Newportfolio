import { useCountUp } from '../hooks/useCountUp'
import { GlassCard } from './GlassCard'

interface StatCardProps {
  value: number
  suffix: string
  label: string
}

export function StatCard({ value, suffix, label }: StatCardProps) {
  const { ref, value: count } = useCountUp(value)

  return (
    <GlassCard interactive className="p-6 text-center md:p-8">
      <p translate="no" className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
        <span ref={ref} className="tabular-nums">
          {count}
        </span>
        <span className="text-cyan">{suffix}</span>
      </p>
      <p className="mt-2 text-sm text-slate-400">{label}</p>
    </GlassCard>
  )
}