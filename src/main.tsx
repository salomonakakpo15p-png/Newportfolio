import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const appEl = document.getElementById('root')!

if (window.location.pathname.startsWith('/admin')) {
  const [{ BrowserRouter }, { default: AdminApp }] = await Promise.all([
    import('react-router'),
    import('./AdminApp'),
  ])
  createRoot(appEl).render(
    <StrictMode>
      <BrowserRouter>
        <AdminApp />
      </BrowserRouter>
    </StrictMode>,
  )
} else {
  const { default: PortfolioStandalone } = await import('./PortfolioStandalone')
  createRoot(appEl).render(
    <StrictMode>
      <PortfolioStandalone />
    </StrictMode>,
  )
}