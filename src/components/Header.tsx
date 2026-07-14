import { BarChart3, CalendarDays, Moon, Settings, Sun, Timer } from 'lucide-react'
import type { AppPage } from './types'

interface HeaderProps {
  page: AppPage
  onNavigate: (page: AppPage) => void
  onOpenSettings: () => void
  darkMode: boolean
  onToggleTheme: () => void
}

const pages = [
  { id: 'today', label: '今日', icon: Timer },
  { id: 'plans', label: '计划', icon: CalendarDays },
  { id: 'insights', label: '洞察', icon: BarChart3 },
] as const

export function Header({ page, onNavigate, onOpenSettings, darkMode, onToggleTheme }: HeaderProps) {
  return (
    <header className="app-header">
      <button className="brand" type="button" onClick={() => onNavigate('today')} aria-label="返回今日">
        <span className="brand-mark">W</span><span>WorkDay</span>
      </button>
      <nav className="main-tabs" aria-label="主导航">
        {pages.map((item) => (
          <button key={item.id} className={page === item.id ? 'is-active' : ''} type="button" onClick={() => onNavigate(item.id)}>
            <item.icon aria-hidden="true" size={17} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label={darkMode ? '切换浅色模式' : '切换深色模式'} title={darkMode ? '浅色模式' : '深色模式'} onClick={onToggleTheme}>
          {darkMode ? <Sun aria-hidden="true" size={19} /> : <Moon aria-hidden="true" size={19} />}
        </button>
        <button className="icon-button" type="button" aria-label="打开设置" title="设置" onClick={onOpenSettings}>
          <Settings aria-hidden="true" size={19} />
        </button>
      </div>
    </header>
  )
}
