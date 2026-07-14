import { Navigate, Route, Routes } from 'react-router-dom'
import { InsightsPage } from '../pages/InsightsPage'
import { PlansPage } from '../pages/PlansPage'
import { TodayPage } from '../pages/TodayPage'
import { useWorkday } from './App'
import { AppShell } from './AppShell'

export function AppRouter() {
  const app = useWorkday()
  return <Routes><Route element={<AppShell />}><Route index element={<TodayPage {...app.today} />} /><Route path="plans" element={<PlansPage {...app.plans} />} /><Route path="insights" element={<InsightsPage insights={app.insights} />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes>
}
