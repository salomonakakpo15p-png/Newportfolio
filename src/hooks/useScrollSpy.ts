import { useEffect, useState } from 'react'

export function useScrollSpy(ids: string[], offset = 120): string {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? '')
  const key = ids.join(',')

  useEffect(() => {
    if (ids.length === 0) return

    const handleScroll = () => {
      const pos = window.scrollY + offset + 1
      let current = ids[0] ?? ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= pos) current = id
      }
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight
      if (window.scrollY >= scrollMax - 8) {
        current = ids[ids.length - 1] ?? current
      }
      setActiveId(current)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, offset])

  return activeId
}