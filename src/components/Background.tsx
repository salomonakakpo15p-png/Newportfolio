import { VantaWaves } from './VantaWaves'

export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <VantaWaves />
      <div className="absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full bg-cyan/10 blur-[160px]" />
      <div className="absolute -right-48 top-1/4 h-[34rem] w-[34rem] rounded-full bg-cyan/[0.07] blur-[180px]" />
      <div className="absolute -bottom-56 left-1/3 h-[30rem] w-[30rem] rounded-full bg-cyan/[0.06] blur-[170px]" />
      <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
    </div>
  )
}