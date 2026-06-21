import { useEffect } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { TitleBar } from '@/components/layout/TitleBar'
import { Toolbar } from '@/components/layout/Toolbar'
import { StatusBar } from '@/components/layout/StatusBar'
import { AssetPanel } from '@/components/asset/AssetPanel'
import { TierPanel } from '@/components/tier/TierPanel'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { useUIStore } from '@/stores/uiStore'

export default function App() {
  const assetPanelOpen = useUIStore((s) => s.assetPanelOpen)
  const settingsPanelOpen = useUIStore((s) => s.settingsPanelOpen)
  const themeMode = useUIStore((s) => s.themeMode)

  // 黑夜/白天模式切换
  useEffect(() => {
    const root = document.documentElement
    if (themeMode === 'dark') {
      root.classList.add('dark')
    } else if (themeMode === 'light') {
      root.classList.remove('dark')
    } else {
      // system: follow OS preference
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const apply = () => {
        if (mq.matches) root.classList.add('dark')
        else root.classList.remove('dark')
      }
      apply()
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [themeMode])

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
        <TitleBar />
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          {assetPanelOpen && <AssetPanel />}
          <TierPanel />
          {settingsPanelOpen && <SettingsPanel />}
        </div>
        <StatusBar />
      </div>
      <Toaster position="bottom-right" />
    </TooltipProvider>
  )
}
