import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import type { Tier } from '@/types'
import { useProjectStore } from '@/stores/projectStore'

interface Props { tier: Tier; isSelected: boolean; onSelect: () => void }

export function TierRow({ tier, isSelected, onSelect }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: tier.id })
  const { attributes, listeners, setNodeRef: setSortRef, transform, transition, isDragging } = useSortable({ id: tier.id })
  const updateTierLabel = useProjectStore((s) => s.updateTierLabel)
  const addTextItem = useProjectStore((s) => s.addTextItem)

  return (
    <div ref={setSortRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...attributes}>
      <motion.div
        ref={setNodeRef}
        onClick={(e) => { e.stopPropagation(); onSelect() }}
        animate={{
          scale: isDragging ? 0.98 : 1,
          opacity: isDragging ? 0.7 : 1,
          boxShadow: isOver ? 'var(--shadow-glow)' : isSelected ? '0 0 0 1px var(--accent), var(--shadow-sm)' : 'var(--shadow-xs)',
        }}
        transition={{ duration: 0.15 }}
        className="flex items-stretch rounded-xl overflow-hidden min-h-[76px] cursor-default"
        style={{ borderLeft: `4px solid ${tier.color}`, background: 'var(--bg-canvas)' }}
      >
        {/* 行标签 — 彩色背景 */}
        <div
          className="flex items-center justify-center w-[72px] shrink-0 cursor-grab active:cursor-grabbing text-sm font-bold select-none tracking-wide"
          style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}dd)`, color: tier.textColor }}
          {...listeners}
          onDoubleClick={(e) => { e.stopPropagation(); const lbl = prompt('等级名称:', tier.label); if (lbl) updateTierLabel(tier.id, lbl) }}
          title="双击编辑名称"
        >
          {tier.label}
        </div>

        {/* 卡片区 */}
        <div className="flex-1 flex items-center gap-2 p-2.5 flex-wrap min-h-[64px]">
          {tier.items.map((item) => (
            <div
              key={item.id}
              className="h-[52px] w-[52px] rounded-lg flex items-center justify-center text-lg cursor-grab active:cursor-grabbing select-none shrink-0 transition-shadow"
              style={{ background: 'var(--bg)', boxShadow: 'var(--shadow-xs)' }}
              title={item.type === 'text' ? item.text : '图片'}
            >
              {item.type === 'text' ? (item.text || '📝').slice(0, 2) : '🖼️'}
            </div>
          ))}
          {tier.items.length === 0 && (
            <span className="text-[11px] text-[var(--text-secondary)] italic px-2">
              拖拽图片或文字到此处
            </span>
          )}
        </div>

        {/* + 按钮 */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); const t = prompt('输入文字:'); if (t) addTextItem(tier.id, t) }}
          className="w-10 shrink-0 flex items-center justify-center text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-colors"
        >
          +
        </button>
      </motion.div>
    </div>
  )
}
