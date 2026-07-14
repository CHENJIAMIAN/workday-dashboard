import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { CountdownView, InsightView, TimeZoneView } from '../components/types'
import { SettingsDrawer } from '../components/SettingsDrawer'
import { CountdownEditor } from '../modals/CountdownEditor'
import { GoogleDriveDialog } from '../modals/GoogleDriveDialog'
import { ImportDialog } from '../modals/ImportDialog'
import { ZoneEditor } from '../modals/ZoneEditor'
import type { PlansPageProps } from '../pages/PlansPage'
import type { TodayPageProps } from '../pages/TodayPage'
import { decodeBackup, encodeBackup } from '../services/backup-codec'
import { downloadLatestDriveBackup, requestDriveToken, uploadDriveBackup } from '../services/google-drive'
import { loadState, saveState } from '../services/storage'
import { calculateWorkdayClock, formatRemainingTime } from '../services/workday-clock'
import type { WorkdayState } from '../types/workday'
import { AppRouter } from './router'

const COLORS = ['#0071e3', '#34c759', '#ff9f0a', '#af52de']
const THEME_STORAGE_KEY = 'workday-dashboard-theme'
const DRIVE_CLIENT_ID_KEY = 'gdrive-client-id'

function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function daysLeft(date: string) {
  return Math.ceil((new Date(`${date}T00:00:00`).getTime() - Date.now()) / 86_400_000)
}

function zoneViews(state: WorkdayState): TimeZoneView[] {
  return state.zones.map((zone, index) => ({
    id: zone.id,
    name: zone.name,
    color: zone.color ?? COLORS[index % COLORS.length],
    blocks: zone.dots.length,
  }))
}

interface AppContextValue {
  openSettings: () => void
  darkMode: boolean
  toggleTheme: () => void
  today: TodayPageProps
  plans: PlansPageProps
  insights: InsightView[]
}

const AppContext = createContext<AppContextValue | null>(null)

export function useWorkday() {
  const value = useContext(AppContext)
  if (!value) throw new Error('useWorkday 必须在 WorkdayProvider 中使用')
  return value
}

export function App() {
  const [state, setState] = useState<WorkdayState>(() => loadState())
  const [now, setNow] = useState(() => new Date())
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [driveOpen, setDriveOpen] = useState(false)
  const [importError, setImportError] = useState<string>()
  const [driveError, setDriveError] = useState<string>()
  const [driveMessage, setDriveMessage] = useState<string>()
  const [driveBusy, setDriveBusy] = useState(false)
  const [driveToken, setDriveToken] = useState<string>()
  const [driveClientId, setDriveClientId] = useState(() => localStorage.getItem(DRIVE_CLIENT_ID_KEY) ?? '')
  const [editingCountdown, setEditingCountdown] = useState<CountdownView>()
  const [countdownEditorOpen, setCountdownEditorOpen] = useState(false)
  const [editingZone, setEditingZone] = useState<TimeZoneView>()
  const [zoneEditorOpen, setZoneEditorOpen] = useState(false)
  const [selectedZoneId, setSelectedZoneId] = useState<string>()
  const [planMessage, setPlanMessage] = useState<string>()

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const zones = useMemo(() => zoneViews(state), [state])
  const countdowns = useMemo<CountdownView[]>(() => state.countdowns.map((item) => ({
    id: item.id,
    title: item.name,
    targetDate: item.date.slice(0, 10),
    daysLeft: daysLeft(item.date.slice(0, 10)),
    note: item.note,
  })), [state.countdowns])
  const clock = calculateWorkdayClock(now, { unitMinutes: state.unitMinutes })
  const assignedBlocks = zones.reduce((sum, zone) => sum + zone.blocks, 0)

  function openZoneEditor(zone?: TimeZoneView) {
    setEditingZone(zone)
    setZoneEditorOpen(true)
  }

  function saveZone(value: { id?: string; name: string }) {
    if (!value.name) return
    setState((current) => ({
      ...current,
      zones: value.id
        ? current.zones.map((zone) => zone.id === value.id ? { ...zone, name: value.name } : zone)
        : [...current.zones, {
            id: crypto.randomUUID(),
            name: value.name,
            dots: [],
            color: COLORS[current.zones.length % COLORS.length],
          }],
    }))
    setZoneEditorOpen(false)
  }

  function changeZoneBlocks(zoneId: string, delta: number) {
    setState((current) => {
      const totalAssigned = current.zones.reduce((sum, zone) => sum + zone.dots.length, 0)
      if (delta > 0 && totalAssigned >= clock.totalBlocks) return current
      return {
        ...current,
        zones: current.zones.map((zone) => {
          if (zone.id !== zoneId) return zone
          if (delta < 0) return { ...zone, dots: zone.dots.slice(0, -1) }
          return { ...zone, dots: [...zone.dots, crypto.randomUUID()] }
        }),
      }
    })
    setPlanMessage(undefined)
  }

  function saveCountdown(item: { id?: string; title: string; targetDate: string; note: string }) {
    setState((current) => ({
      ...current,
      countdowns: item.id
        ? current.countdowns.map((countdown) => countdown.id === item.id
            ? { ...countdown, name: item.title.trim(), date: item.targetDate, note: item.note.trim() || undefined }
            : countdown)
        : [...current.countdowns, {
            id: crypto.randomUUID(),
            name: item.title.trim(),
            date: item.targetDate,
            note: item.note.trim() || undefined,
          }],
    }))
    setCountdownEditorOpen(false)
  }

  function exportJson() {
    const blob = new Blob([encodeBackup(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `workday-dashboard-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  async function importFile(file: File) {
    try {
      const result = decodeBackup(await file.text())
      setState(result.state)
      setImportOpen(false)
      setImportError(undefined)
    } catch (error) {
      setImportError(error instanceof Error ? error.message : '无法导入备份')
    }
  }

  async function connectDrive() {
    setDriveBusy(true)
    setDriveError(undefined)
    setDriveMessage(undefined)
    try {
      const token = await requestDriveToken(driveClientId)
      localStorage.setItem(DRIVE_CLIENT_ID_KEY, driveClientId.trim())
      setDriveToken(token)
      setDriveMessage('Google Drive 已连接')
    } catch (error) {
      setDriveError(error instanceof Error ? error.message : 'Google Drive 连接失败')
    } finally {
      setDriveBusy(false)
    }
  }

  async function uploadToDrive() {
    if (!driveToken) return
    setDriveBusy(true)
    setDriveError(undefined)
    try {
      await uploadDriveBackup(driveToken, encodeBackup(state))
      setDriveMessage('备份已上传到 Google Drive')
    } catch (error) {
      setDriveError(error instanceof Error ? error.message : 'Google Drive 上传失败')
    } finally {
      setDriveBusy(false)
    }
  }

  async function restoreFromDrive() {
    if (!driveToken) return
    setDriveBusy(true)
    setDriveError(undefined)
    try {
      const result = decodeBackup(await downloadLatestDriveBackup(driveToken))
      setState(result.state)
      setDriveMessage('已恢复 Google Drive 中的最新备份')
    } catch (error) {
      setDriveError(error instanceof Error ? error.message : 'Google Drive 恢复失败')
    } finally {
      setDriveBusy(false)
    }
  }

  const yearStart = new Date(now.getFullYear(), 0, 1).getTime()
  const nextYear = new Date(now.getFullYear() + 1, 0, 1).getTime()
  const yearProgress = ((now.getTime() - yearStart) / (nextYear - yearStart)) * 100
  const insights: InsightView[] = [
    { label: '今年进度', value: `${Math.round(yearProgress)}%`, detail: `${now.getFullYear()} 年`, progress: yearProgress },
    { label: '长期计划', value: String(countdowns.length), detail: '个关注日期' },
    { label: '时间分区', value: String(zones.length), detail: '个执行分区' },
  ]

  const context: AppContextValue = {
    openSettings: () => setSettingsOpen(true),
    darkMode: theme === 'dark',
    toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : 'dark'),
    today: {
      clock: {
        label: '离下班还有',
        value: clock.isComplete ? '今日已完成' : formatRemainingTime(clock.remainingMilliseconds),
        targetLabel: '目标 18:00',
        progress: clock.progress,
        remainingMinutes: clock.remainingMinutes,
        isComplete: clock.isComplete,
      },
      totalBlocks: clock.totalBlocks,
      unitMinutes: state.unitMinutes,
      zones,
      selectedZoneId,
      onSelectZone: setSelectedZoneId,
      onIncrementZone: (id) => changeZoneBlocks(id, 1),
      onDecrementZone: (id) => changeZoneBlocks(id, -1),
      onAddZone: () => openZoneEditor(),
      onCompletePlan: () => {
        setPlanMessage('今天的时间安排已完成')
        window.setTimeout(() => setPlanMessage(undefined), 2400)
      },
      canCompletePlan: clock.totalBlocks > 0 && assignedBlocks >= clock.totalBlocks,
    },
    plans: {
      countdowns,
      zones,
      onAddCountdown: () => { setEditingCountdown(undefined); setCountdownEditorOpen(true) },
      onEditCountdown: (item) => { setEditingCountdown(item); setCountdownEditorOpen(true) },
      onDeleteCountdown: (id) => setState((current) => ({ ...current, countdowns: current.countdowns.filter((item) => item.id !== id) })),
      onAddZone: () => openZoneEditor(),
      onEditZone: (zone) => openZoneEditor(zone),
      onDeleteZone: (id) => setState((current) => ({ ...current, zones: current.zones.filter((zone) => zone.id !== id) })),
    },
    insights,
  }

  return (
    <AppContext.Provider value={context}>
      <AppRouter />
      {planMessage && <div className="status-toast" role="status">{planMessage}</div>}
      <SettingsDrawer
        open={settingsOpen}
        value={{ unitMinutes: state.unitMinutes, birthDate: state.birthDate ?? '' }}
        onChange={(value) => setState((current) => ({ ...current, unitMinutes: value.unitMinutes, birthDate: value.birthDate || null }))}
        onClose={() => setSettingsOpen(false)}
        onExport={exportJson}
        onOpenImport={() => { setSettingsOpen(false); setImportOpen(true) }}
        onOpenDrive={() => { setSettingsOpen(false); setDriveOpen(true) }}
      />
      <CountdownEditor open={countdownEditorOpen} value={editingCountdown} onClose={() => setCountdownEditorOpen(false)} onSave={saveCountdown} />
      <ZoneEditor open={zoneEditorOpen} value={editingZone} onClose={() => setZoneEditorOpen(false)} onSave={saveZone} />
      <ImportDialog open={importOpen} error={importError} onClose={() => setImportOpen(false)} onImport={importFile} />
      <GoogleDriveDialog
        open={driveOpen}
        connected={Boolean(driveToken)}
        busy={driveBusy}
        clientId={driveClientId}
        message={driveMessage}
        error={driveError}
        onClientIdChange={setDriveClientId}
        onClose={() => setDriveOpen(false)}
        onConnect={connectDrive}
        onUpload={uploadToDrive}
        onDownload={restoreFromDrive}
      />
    </AppContext.Provider>
  )
}
