import { useUIStore } from '@/stores/uiStore'
import { useProjectStore } from '@/stores/projectStore'

export function Toolbar() {
  const viewMode = useUIStore((s) => s.viewMode)
  const setViewMode = useUIStore((s) => s.setViewMode)
  const toggleAssetPanel = useUIStore((s) => s.toggleAssetPanel)
  const toggleSettingsPanel = useUIStore((s) => s.toggleSettingsPanel)
  const tierCount = useProjectStore((s) => s.project.tiers.length)
  const addTier = useProjectStore((s) => s.addTier)
  const removeTier = useProjectStore((s) => s.removeTier)
  const tiers = useProjectStore((s) => s.project.tiers)

  const btn = 'px-3 py-1.5 text-xs rounded-lg transition-all duration-150 font-medium'
  const active = 'bg-white dark:bg-white/15 shadow-sm text-[var(--text)]'
  const inactive = 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-black/5 dark:hover:bg-white/5'

  return (
    <div className="glass-strong flex items-center gap-2 h-10 px-3 shrink-0">
      {/* 模式切换 */}
      <div className="flex rounded-lg bg-black/[0.04] dark:bg-white/[0.06] p-0.5 gap-0.5">
        <button type="button" onClick={() => setViewMode('image')} className={`${btn} ${viewMode === 'image' ? active : inactive}`}>📷 图片</button>
        <button type="button" onClick={() => setViewMode('mixed')} className={`${btn} ${viewMode === 'mixed' ? active : inactive}`}>📷📝 混合</button>
        <button type="button" onClick={() => setViewMode('text')} className={`${btn} ${viewMode === 'text' ? active : inactive}`}>📝 文字</button>
      </div>

      <div className="w-px h-5 bg-[var(--border)]" />

      {/* 行数控制 */}
      <span className="text-[11px] text-[var(--text-secondary)] font-medium">行数</span>
      <div className="flex items-center bg-black/[0.04] dark:bg-white/[0.06] rounded-lg">
        <button type="button" onClick={() => { const t = tiers[tiers.length-1]; if(t) removeTier(t.id) }} disabled={tierCount <= 3} className="w-7 h-7 flex items-center justify-center text-xs text-[var(--text-secondary)] hover:text-[var(--text)] disabled:opacity-25 transition-colors">−</button>
        <span className="text-xs font-semibold tabular-nums min-w-[2ch] text-center">{tierCount}</span>
        <button type="button" onClick={addTier} disabled={tierCount >= 15} className="w-7 h-7 flex items-center justify-center text-xs text-[var(--text-secondary)] hover:text-[var(--text)] disabled:opacity-25 transition-colors">+</button>
      </div>

      <div className="w-px h-5 bg-[var(--border)]" />

      {/* 面板 */}
      <button type="button" onClick={toggleAssetPanel} className={`${btn} ${inactive}`}>📁 素材</button>
      <button type="button" onClick={toggleSettingsPanel} className={`${btn} ${inactive}`}>⚙️ 设置</button>

      <div className="flex-1" />

      {/* 导出 */}
      <button type="button" className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95" style={{ background: 'var(--accent)' }}>
        💾 导出
      </button>
    </div>
  )
}
