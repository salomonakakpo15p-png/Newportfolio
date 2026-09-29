import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

const appEl = document.getElementById('root')!

if (window.location.pathname.startsWith('/admin')) {
  const [{ BrowserRouter }, { default: AdminApp }] = await Promise.all([
    import('react-router'),
    import('./AdminApp'),
  ])
  createRoot(appEl).render(
    <StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <AdminApp />
        </BrowserRouter>
      </ErrorBoundary>
    </StrictMode>,
  )
} else {
  const { default: PortfolioStandalone } = await import('./PortfolioStandalone')
  createRoot(appEl).render(
    <StrictMode>
      <ErrorBoundary>
        <PortfolioStandalone />
      </ErrorBoundary>
    </StrictMode>,
  )
}