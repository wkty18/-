import { useProjectStore } from '@/stores/projectStore'
import { TierRow } from './TierRow'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

export function TierPanel() {
  const project = useProjectStore((s) => s.project)
  const moveItem = useProjectStore((s) => s.moveItem)
  const selectTier = useProjectStore((s) => s.selectTier)
  const selectedTierId = useProjectStore((s) => s.selectedTierId)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find which tier the active item belongs to
    const fromTier = project.tiers.find(t => t.items.some(i => i.id === activeId))
    const toTier = project.tiers.find(t => t.id === overId)

    if (fromTier && toTier) {
      moveItem(activeId, fromTier.id, toTier.id)
    }
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-1"
      style={{ background: project.settings.backgroundColor }}
      onClick={() => selectTier(null)}
    >
      {/* 标题 */}
      {project.settings.titleVisible && (
        <div
          className="text-center py-2 mb-2 font-bold"
          style={{
            fontSize: project.settings.titleFontSize,
            color: project.settings.titleColor,
            fontFamily: project.settings.fontFamily,
          }}
        >
          {project.settings.titleText || '未命名排行'}
        </div>
      )}

      {/* 空状态 */}
      {project.tiers.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[var(--color-text-secondary)]">
          <div className="text-6xl animate-bounce">📋</div>
          <p className="text-lg">还没有任何分级</p>
          <p className="text-sm">点击工具栏的 + 添加行，或从左侧模板库选择</p>
        </div>
      )}

      {/* 梯队行 */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={project.tiers.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {project.tiers.map((tier) => (
            <TierRow
              key={tier.id}
              tier={tier}
              isSelected={selectedTierId === tier.id}
              onSelect={() => selectTier(tier.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* 添加行按钮 */}
      {project.tiers.length < 15 && (
        <button
          type="button"
          onClick={() => useProjectStore.getState().addTier()}
          className="mt-2 py-2 border-2 border-dashed border-[var(--color-border-default)] rounded-xl text-xs text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
        >
          + 添加分级行
        </button>
      )}
    </div>
  )
}
