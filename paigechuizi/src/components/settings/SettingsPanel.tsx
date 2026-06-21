import { useProjectStore } from '@/stores/projectStore'
import { useUIStore } from '@/stores/uiStore'
import { Switch } from '@/components/ui/switch'

export function SettingsPanel() {
  const project = useProjectStore((s) => s.project)
  const updateSettings = useProjectStore((s) => s.updateSettings)
  const selectedTierId = useProjectStore((s) => s.selectedTierId)
  const selectedTier = project.tiers.find(t => t.id === selectedTierId)
  const updateTierLabel = useProjectStore((s) => s.updateTierLabel)
  const updateTierColor = useProjectStore((s) => s.updateTierColor)
  const toggleSettingsPanel = useUIStore((s) => s.toggleSettingsPanel)

  const RATIOS = ['3:4', '4:3', '9:16', '16:9', '1:1'] as const

  return (
    <div className="glass w-60 shrink-0 flex flex-col border-l border-[var(--color-border-default)] overflow-y-auto">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border-default)]">
        <span className="text-xs font-medium">⚙️ 设置</span>
        <button type="button" onClick={toggleSettingsPanel} className="text-xs w-5 h-5 rounded hover:bg-black/5">✕</button>
      </div>

      <div className="flex-1 p-3 flex flex-col gap-4 text-xs">
        {/* 标题设置 */}
        <section className="space-y-2">
          <h3 className="font-medium text-[var(--color-text-secondary)]">📝 标题</h3>
          <div className="flex items-center justify-between">
            <span>显示标题</span>
            <Switch checked={project.settings.titleVisible} onCheckedChange={(v: boolean) => updateSettings({ titleVisible: v })} />
          </div>
          {project.settings.titleVisible && (
            <input
              className="w-full px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-[var(--color-border-default)] text-xs"
              value={project.settings.titleText}
              onChange={(e) => updateSettings({ titleText: e.target.value })}
              placeholder="输入标题..."
            />
          )}
        </section>

        {/* 导出比例 */}
        <section className="space-y-2">
          <h3 className="font-medium text-[var(--color-text-secondary)]">📐 导出比例</h3>
          <div className="grid grid-cols-3 gap-1">
            {RATIOS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => updateSettings({ aspectRatio: r })}
                className={`py-1.5 rounded-md text-xs transition-all ${
                  project.settings.aspectRatio === r
                    ? 'bg-[var(--color-accent)] text-white font-medium'
                    : 'bg-black/5 dark:bg-white/5 hover:bg-black/10'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </section>

        {/* 背景 */}
        <section className="space-y-2">
          <h3 className="font-medium text-[var(--color-text-secondary)]">🎨 背景</h3>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={project.settings.backgroundColor}
              onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer border-0"
            />
            <span className="text-[10px]">{project.settings.backgroundColor}</span>
          </div>
        </section>

        {/* 选中行设置 */}
        {selectedTier && (
          <section className="space-y-2 border-t border-[var(--color-border-default)] pt-3">
            <h3 className="font-medium text-[var(--color-text-secondary)]">🔧 选中行: {selectedTier.label}</h3>
            <div className="space-y-1.5">
              <label className="block">
                <span className="text-[10px] text-[var(--color-text-secondary)]">标签</span>
                <input
                  className="w-full px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-[var(--color-border-default)] text-xs mt-0.5"
                  value={selectedTier.label}
                  onChange={(e) => updateTierLabel(selectedTier.id, e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-[10px] text-[var(--color-text-secondary)]">颜色</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <input
                    type="color"
                    value={selectedTier.color}
                    onChange={(e) => updateTierColor(selectedTier.id, e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0"
                  />
                  <span className="text-[10px]">{selectedTier.color}</span>
                </div>
              </label>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
