import type { ReactNode } from 'react'
import { BackToTop } from '../components/BackToTop'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Seo } from '../components/Seo'

export function PortfolioShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Seo />
      <Background />
      <Header />
      {children}
      <BackToTop />
    </>
  )
}