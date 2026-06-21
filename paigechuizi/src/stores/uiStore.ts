import { create } from 'zustand'
import type { ViewMode, ThemeMode } from '@/types'

interface UIStore {
  viewMode: ViewMode
  themeMode: ThemeMode
  assetPanelOpen: boolean
  templatePanelOpen: boolean
  settingsPanelOpen: boolean
  setViewMode: (mode: ViewMode) => void
  setThemeMode: (mode: ThemeMode) => void
  toggleAssetPanel: () => void
  toggleTemplatePanel: () => void
  toggleSettingsPanel: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  viewMode: 'mixed',
  themeMode: 'system',
  assetPanelOpen: true,
  templatePanelOpen: false,
  settingsPanelOpen: false,
  setViewMode: (viewMode) => set({ viewMode }),
  setThemeMode: (themeMode) => set({ themeMode }),
  toggleAssetPanel: () => set((s) => ({ assetPanelOpen: !s.assetPanelOpen })),
  toggleTemplatePanel: () => set((s) => ({ templatePanelOpen: !s.templatePanelOpen })),
  toggleSettingsPanel: () => set((s) => ({ settingsPanelOpen: !s.settingsPanelOpen })),
}))
