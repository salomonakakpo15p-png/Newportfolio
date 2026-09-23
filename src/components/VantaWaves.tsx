import { useEffect, useRef } from 'react'

export function VantaWaves() {
  const vantaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = vantaRef.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let effect: { destroy: () => void } | undefined
    let cancelled = false

    const init = async () => {
      try {
        const [mod, THREE] = await Promise.all([
          import('vanta/dist/vanta.waves.min'),
          import('three'),
        ])
        if (cancelled) return
        const walk = (v: unknown, depth: number): unknown => {
          if (!v || typeof v !== 'object' || depth > 4) return v
          const keys = Object.keys(v as object)
          if (keys.length === 1 && keys[0] === 'default') return walk((v as { default: unknown }).default, depth + 1)
          return v
        }
        const target = walk(mod, 0) as {
          WAVES?: (opts: Record<string, unknown>) => { destroy: () => void }
          [k: string]: unknown
        }
        const ctor =
          typeof target?.WAVES === 'function'
            ? (target.WAVES as (opts: Record<string, unknown>) => { destroy: () => void }).bind(target)
            : typeof target === 'function'
              ? (target as (opts: Record<string, unknown>) => { destroy: () => void })
              : undefined
        if (!ctor) throw new Error('vanta export shape: ' + (target ? String(typeof target) : 'null') + '/' + Object.keys(target ?? {}).join(','))
        effect = ctor({
          el,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          color: 0x1c39,
          shininess: 84,
          waveHeight: 15,
          waveSpeed: 1.15,
          zoom: 1.02,
        })
      } catch (error) {
        console.error('vanta init failed:', error)
        // WebGL unavailable or load failure: the navy background stays as-is
      }
    }

    void init()

    return () => {
      cancelled = true
      effect?.destroy()
    }
  }, [])

  return (
    <>
      <div className="absolute inset-0 bg-void" />
      <div ref={vantaRef} aria-hidden="true" className="absolute inset-0" />
    </>
  )
}