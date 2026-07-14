import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import type { AppPage } from '../components/types'
import { useWorkday } from './App'

const pagePaths: Record<AppPage, string> = {
  today: '/',
  plans: '/plans',
  insights: '/insights',
}

export function AppShell() {
  const { openSettings, darkMode, toggleTheme } = useWorkday()
  const location = useLocation()
  const navigate = useNavigate()
  const page: AppPage = location.pathname.startsWith('/plans')
    ? 'plans'
    : location.pathname.startsWith('/insights')
      ? 'insights'
      : 'today'

  return (
    <div className="app-shell">
      <Header
        page={page}
        onNavigate={(nextPage) => navigate(pagePaths[nextPage])}
        onOpenSettings={openSettings}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
      />
      <div className="app-main"><Outlet /></div>
    </div>
  )
}
