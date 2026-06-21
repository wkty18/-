// ── 梯队行 ──
export interface Tier {
  id: string
  label: string
  color: string
  textColor: string
  borderStyle: 'none' | 'solid' | 'dashed'
  borderColor: string
  minCardHeight: number
  maxCards: number | null
  locked: boolean
  sortOrder: number
  items: TierItem[]
}

// ── 卡片 (图片/文字) ──
export interface TierItem {
  id: string
  type: 'image' | 'text'
  sortOrder: number
  assetId?: string
  text?: string
  textStyle?: TextCardStyle
}

export interface TextCardStyle {
  fontSize: number
  fontWeight: 300 | 400 | 600 | 800
  fontColor: string
  bgColor: string
  shape: 'rounded' | 'pill' | 'sharp' | 'tag'
  borderStyle: 'none' | 'solid' | 'dashed'
  borderColor: string
}

// ── 图片素材 ──
export interface Asset {
  id: string
  fileName: string
  data: string   // base64
  mimeType: string
  width: number
  height: number
  dominantColor?: string
}

// ── 项目全局设置 ──
export interface ProjectSettings {
  aspectRatio: '3:4' | '4:3' | '9:16' | '16:9' | '1:1' | 'custom'
  customRatio?: { w: number; h: number }
  backgroundColor: string
  backgroundType: 'solid' | 'gradient-linear' | 'gradient-radial' | 'image' | 'transparent'
  backgroundImageAssetId?: string
  cardCornerRadius: number
  gapSize: number
  rowGapSize: number
  fontFamily: string
  titleText: string
  titleFontSize: number
  titleColor: string
  titleVisible: boolean
  watermark: string
  watermarkPosition: 'tl' | 'tr' | 'bl' | 'br'
  themeName?: string
}

// ── 项目 ──
export interface Project {
  version: string
  metadata: {
    title: string
    createdAt: string
    updatedAt: string
  }
  tiers: Tier[]
  assets: Asset[]
  settings: ProjectSettings
}

// ── 模板 ──
export interface TierTemplate {
  version: string
  name: string
  description: string
  icon: string
  tiers: {
    label: string
    color: string
    textColor: string
    borderStyle: string
    borderColor: string
  }[]
  settings: Partial<ProjectSettings>
}

// ── UI 模式 ──
export type ViewMode = 'image' | 'text' | 'mixed'
export type ThemeMode = 'light' | 'dark' | 'system'
