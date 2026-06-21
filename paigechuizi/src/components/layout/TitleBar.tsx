import { useUIStore } from '@/stores/uiStore'
import { getCurrentWindow } from '@tauri-apps/api/window'

export function TitleBar() {
  const themeMode = useUIStore((s) => s.themeMode)
  const setThemeMode = useUIStore((s) => s.setThemeMode)

  const cycleTheme = () => {
    const modes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    setThemeMode(modes[(modes.indexOf(themeMode) + 1) % 3])
  }

  const icons: Record<string, string> = { light: '☀️', dark: '🌙', system: '🖥️' }
  const labels: Record<string, string> = { light: '白天模式', dark: '黑夜模式', system: '跟随系统' }
  const win = getCurrentWindow()

  return (
    <div className="glass-strong flex items-center justify-between h-10 px-3 shrink-0 select-none" data-tauri-drag-region>
      <div className="flex items-center gap-2" data-tauri-drag-region>
        <span className="text-lg">🔨</span>
        <span className="text-[13px] font-semibold tracking-wide">排个锤子</span>
      </div>

      <div className="flex items-center gap-0.5" style={{ WebkitAppRegion: 'no-drag', appRegion: 'no-drag' } as React.CSSProperties}>
        <button
          type="button"
          onClick={cycleTheme}
          className="w-8 h-7 flex items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-sm transition-colors"
          title={labels[themeMode]}
        >
          {icons[themeMode]}
        </button>
        <button type="button" onClick={() => win.minimize()} className="w-10 h-7 flex items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-xs text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">─</button>
        <button type="button" onClick={() => win.toggleMaximize()} className="w-10 h-7 flex items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-xs text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">□</button>
        <button type="button" onClick={() => win.close()} className="w-10 h-7 flex items-center justify-center rounded-md hover:bg-red-500 hover:text-white text-xs text-[var(--text-secondary)] transition-colors">✕</button>
      </div>
    </div>
  )
}
