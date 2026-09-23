declare module 'vanta/dist/vanta.waves.min' {
  export interface VantaEffect {
    destroy: () => void
  }
  interface VantaConfig {
    el: HTMLElement | null
    THREE: unknown
    [key: string]: unknown
  }
  const WAVES: (config: VantaConfig) => VantaEffect
  export default WAVES
}