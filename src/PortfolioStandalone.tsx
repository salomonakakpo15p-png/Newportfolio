import { PortfolioShell } from './pages/PortfolioShell'
import { PortfolioPage } from './pages/PortfolioPage'

export default function PortfolioStandalone() {
  return (
    <PortfolioShell>
      <PortfolioPage />
    </PortfolioShell>
  )
}