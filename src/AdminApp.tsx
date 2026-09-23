import { Route, Routes } from 'react-router'
import { AdminRoutes } from './pages/admin/AdminRoutes'
import PortfolioStandalone from './PortfolioStandalone'

export default function AdminApp() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<PortfolioStandalone />} />
    </Routes>
  )
}