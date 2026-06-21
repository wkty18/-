import { useProjectStore } from '@/stores/projectStore'
import { useUIStore } from '@/stores/uiStore'
import type { Asset } from '@/types'

export function AssetPanel() {
  const assets = useProjectStore((s) => s.project.assets)
  const addAsset = useProjectStore((s) => s.addAsset)
  const toggleAssetPanel = useUIStore((s) => s.toggleAssetPanel)

  const handleImport = async () => {
    // Use native file dialog via Tauri
    try {
      const { open } = await import('@tauri-apps/plugin-dialog')
      const selected = await open({
        multiple: true,
        filters: [{ name: '图片', extensions: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif', 'svg', 'avif'] }],
      })
      if (!selected) return

      const paths = Array.isArray(selected) ? selected : [selected]
      const { readFile } = await import('@tauri-apps/plugin-fs')

      for (const filePath of paths) {
        const fileName = filePath.split(/[/\\]/).pop() || 'image'
        const ext = fileName.split('.').pop()?.toLowerCase() || 'png'
        const mimeMap: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', bmp: 'image/bmp', gif: 'image/gif', svg: 'image/svg+xml', avif: 'image/avif' }
        const contents = await readFile(filePath)
        const binary = new Uint8Array(contents)
        const base64 = btoa(String.fromCharCode(...binary))

        const img = new Image()
        img.src = `data:${mimeMap[ext]};base64,${base64}`
        await new Promise<void>((resolve) => { img.onload = () => resolve() })

        const asset: Asset = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          fileName,
          data: base64,
          mimeType: mimeMap[ext],
          width: img.naturalWidth,
          height: img.naturalHeight,
        }
        addAsset(asset)
      }
    } catch (e) {
      console.error('Import failed:', e)
    }
  }

  return (
    <div className="glass w-56 shrink-0 flex flex-col border-r border-[var(--color-border-default)]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border-default)]">
        <span className="text-xs font-medium">📁 素材</span>
        <button type="button" onClick={toggleAssetPanel} className="text-xs w-5 h-5 rounded hover:bg-black/5">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-xs text-[var(--color-text-secondary)]">
            <span className="text-3xl">📷</span>
            <p>暂无素材</p>
            <p className="text-center">点击下方按钮导入</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {assets.map((a) => (
              <div key={a.id} className="aspect-square rounded-lg bg-white dark:bg-[#2E2E2E] shadow-sm flex items-center justify-center cursor-grab overflow-hidden text-[10px] text-center p-1" title={a.fileName}>
                <img src={`data:${a.mimeType};base64,${a.data}`} alt={a.fileName} className="w-full h-full object-cover rounded-md" />
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleImport}
        className="m-2 py-2 rounded-lg bg-[var(--color-accent)] text-white text-xs font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
      >
        📷 导入图片
      </button>
    </div>
  )
}
