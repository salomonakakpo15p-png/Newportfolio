import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary'
import { installTranslateGuard } from './lib/translate-guard'
import './index.css'

installTranslateGuard()

const appEl = document.getElementById('root')!

if (window.location.pathname.startsWith('/admin')) {
  // Keep browser translators out of the admin DOM entirely (they re-parent
  // text nodes and crash React on the next re-render).
  document.documentElement.classList.add('notranslate')
  document.documentElement.setAttribute('translate', 'no')

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