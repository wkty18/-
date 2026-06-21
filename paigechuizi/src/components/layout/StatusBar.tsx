import { useProjectStore } from '@/stores/projectStore'

export function StatusBar() {
  const project = useProjectStore((s) => s.project)
  const isDirty = useProjectStore((s) => s.isDirty)
  const assetCount = project.assets.length
  const itemCount = project.tiers.reduce((sum, t) => sum + t.items.length, 0)

  return (
    <div className="glass-strong flex items-center gap-5 h-7 px-3 shrink-0 text-[11px] font-medium text-[var(--text-secondary)]">
      <span>🖼️ {assetCount}</span>
      <span>📝 {itemCount}</span>
      <span>📏 {project.tiers.length}</span>
      <span>📐 {project.settings.aspectRatio}</span>
      <div className="flex-1" />
      <span style={{ color: isDirty ? 'var(--accent)' : undefined }}>{isDirty ? '● 未保存' : '● 已保存'}</span>
    </div>
  )
}
