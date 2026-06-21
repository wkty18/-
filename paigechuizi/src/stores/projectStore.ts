import { create } from 'zustand'
import type { Project, Tier, Asset } from '@/types'

const DEFAULT_TIERS: Tier[] = [
  { id: 't1', label: '夯', color: '#EF4444', textColor: '#FFFFFF', borderStyle: 'none', borderColor: '#EF4444', minCardHeight: 64, maxCards: null, locked: false, sortOrder: 0, items: [] },
  { id: 't2', label: '顶级', color: '#F59E0B', textColor: '#FFFFFF', borderStyle: 'none', borderColor: '#F59E0B', minCardHeight: 64, maxCards: null, locked: false, sortOrder: 1, items: [] },
  { id: 't3', label: '人上人', color: '#EAB308', textColor: '#1A1A2E', borderStyle: 'none', borderColor: '#EAB308', minCardHeight: 64, maxCards: null, locked: false, sortOrder: 2, items: [] },
  { id: 't4', label: 'NPC', color: '#6B7280', textColor: '#FFFFFF', borderStyle: 'none', borderColor: '#6B7280', minCardHeight: 64, maxCards: null, locked: false, sortOrder: 3, items: [] },
  { id: 't5', label: '拉完了', color: '#9CA3AF', textColor: '#1A1A2E', borderStyle: 'none', borderColor: '#9CA3AF', minCardHeight: 64, maxCards: null, locked: false, sortOrder: 4, items: [] },
]

function createDefaultProject(): Project {
  return {
    version: '1.0',
    metadata: {
      title: '未命名项目',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    tiers: DEFAULT_TIERS.map(t => ({ ...t, items: [] })),
    assets: [],
    settings: {
      aspectRatio: '3:4',
      backgroundColor: '#FFFFFF',
      backgroundType: 'solid',
      cardCornerRadius: 12,
      gapSize: 8,
      rowGapSize: 4,
      fontFamily: 'Microsoft YaHei',
      titleText: '',
      titleFontSize: 28,
      titleColor: '#1A1A2E',
      titleVisible: false,
      watermark: '',
      watermarkPosition: 'br',
    },
  }
}

interface ProjectStore {
  project: Project
  history: Project[]
  historyIndex: number
  isDirty: boolean
  selectedTierId: string | null
  selectedItemIds: Set<string>

  selectTier: (id: string | null) => void
  addAsset: (asset: Asset) => void
  removeAsset: (id: string) => void
  moveItem: (itemId: string, fromTierId: string, toTierId: string) => void
  reorderItems: (tierId: string, itemIds: string[]) => void
  addTextItem: (tierId: string, text: string) => void
  removeItem: (tierId: string, itemId: string) => void
  updateTierLabel: (tierId: string, label: string) => void
  updateTierColor: (tierId: string, color: string) => void
  addTier: () => void
  removeTier: (tierId: string) => void
  reorderTiers: (tierIds: string[]) => void
  updateSettings: (settings: Partial<Project['settings']>) => void
  undo: () => void
  redo: () => void
  newProject: () => void
}

let idCounter = 0
function uid(): string {
  return `${Date.now()}-${++idCounter}`
}

export const useProjectStore = create<ProjectStore>((set) => ({
  project: createDefaultProject(),
  history: [],
  historyIndex: -1,
  isDirty: false,
  selectedTierId: null,
  selectedItemIds: new Set(),

  selectTier: (id) => set({ selectedTierId: id }),

  addAsset: (asset) => {
    set((s) => ({ project: { ...s.project, assets: [...s.project.assets, asset], metadata: { ...s.project.metadata, updatedAt: new Date().toISOString() } }, isDirty: true }))
  },

  removeAsset: (id) => {
    set((s) => ({ project: { ...s.project, assets: s.project.assets.filter(a => a.id !== id) }, isDirty: true }))
  },

  moveItem: (itemId, fromTierId, toTierId) => {
    set((s) => {
      const tiers = s.project.tiers.map(t => ({ ...t, items: [...t.items] }))
      const fromTier = tiers.find(t => t.id === fromTierId)
      const toTier = tiers.find(t => t.id === toTierId)
      if (!fromTier || !toTier) return s
      const itemIdx = fromTier.items.findIndex(i => i.id === itemId)
      if (itemIdx === -1) return s
      const [item] = fromTier.items.splice(itemIdx, 1)
      toTier.items.push({ ...item, sortOrder: toTier.items.length })
      return { project: { ...s.project, tiers, metadata: { ...s.project.metadata, updatedAt: new Date().toISOString() } }, isDirty: true }
    })
  },

  reorderItems: (tierId, itemIds) => {
    set((s) => {
      const tiers = s.project.tiers.map(t => {
        if (t.id !== tierId) return t
        const items = itemIds.map((id, idx) => {
          const item = t.items.find(i => i.id === id)!
          return { ...item, sortOrder: idx }
        })
        return { ...t, items }
      })
      return { project: { ...s.project, tiers }, isDirty: true }
    })
  },

  addTextItem: (tierId, text) => {
    set((s) => {
      const tiers = s.project.tiers.map(t => {
        if (t.id !== tierId) return t
        return { ...t, items: [...t.items, { id: uid(), type: 'text' as const, sortOrder: t.items.length, text }] }
      })
      return { project: { ...s.project, tiers }, isDirty: true }
    })
  },

  removeItem: (tierId, itemId) => {
    set((s) => {
      const tiers = s.project.tiers.map(t => {
        if (t.id !== tierId) return t
        return { ...t, items: t.items.filter(i => i.id !== itemId) }
      })
      return { project: { ...s.project, tiers }, isDirty: true }
    })
  },

  updateTierLabel: (tierId, label) => {
    set((s) => ({
      project: { ...s.project, tiers: s.project.tiers.map(t => t.id === tierId ? { ...t, label } : t) },
      isDirty: true,
    }))
  },

  updateTierColor: (tierId, color) => {
    set((s) => ({
      project: { ...s.project, tiers: s.project.tiers.map(t => t.id === tierId ? { ...t, color } : t) },
      isDirty: true,
    }))
  },

  addTier: () => {
    set((s) => {
      if (s.project.tiers.length >= 15) return s
      const tiers = [...s.project.tiers, {
        id: uid(), label: `等级 ${s.project.tiers.length + 1}`, color: '#95A5A6', textColor: '#FFFFFF', borderStyle: 'none' as const, borderColor: '#95A5A6', minCardHeight: 64, maxCards: null, locked: false, sortOrder: s.project.tiers.length, items: [],
      }]
      return { project: { ...s.project, tiers }, isDirty: true }
    })
  },

  removeTier: (tierId) => {
    set((s) => {
      if (s.project.tiers.length <= 3) return s
      return { project: { ...s.project, tiers: s.project.tiers.filter(t => t.id !== tierId) }, isDirty: true }
    })
  },

  reorderTiers: (tierIds) => {
    set((s) => {
      const tiers = tierIds.map((id, idx) => {
        const tier = s.project.tiers.find(t => t.id === id)!
        return { ...tier, sortOrder: idx }
      })
      return { project: { ...s.project, tiers }, isDirty: true }
    })
  },

  updateSettings: (partial) => {
    set((s) => ({ project: { ...s.project, settings: { ...s.project.settings, ...partial } }, isDirty: true }))
  },

  undo: () => { /* TODO */ },
  redo: () => { /* TODO */ },
  newProject: () => set({ project: createDefaultProject(), isDirty: false, selectedTierId: null, selectedItemIds: new Set() }),
}))
