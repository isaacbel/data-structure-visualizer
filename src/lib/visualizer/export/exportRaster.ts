import { findPrimarySvg, serializeSvgElement } from './serializeSvg'
import { buildExportFilename } from './filename'

export interface ExportRasterOptions {
  container: HTMLElement
  dsId: string
  operation?: string
  /** Background color. PNG supports transparency ('transparent'), JPEG needs a solid color */
  background?: string
  /** Output scale multiplier (2 = 2× resolution) */
  scale?: number
}

/**
 * Render the current SVG into a high-resolution offscreen canvas,
 * then trigger a PNG download.
 */
export async function exportPng(opts: ExportRasterOptions): Promise<string | null> {
  return exportRaster({ ...opts, format: 'png' })
}

/**
 * Render the current SVG into a high-resolution offscreen canvas,
 * then trigger a JPEG download (with solid background).
 */
export async function exportJpeg(opts: ExportRasterOptions): Promise<string | null> {
  return exportRaster({
    background: '#020617', // dark background matches app theme
    ...opts,
    format: 'jpeg',
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal
// ─────────────────────────────────────────────────────────────────────────────

async function exportRaster(
  opts: ExportRasterOptions & { format: 'png' | 'jpeg' },
): Promise<string | null> {
  const { container, dsId, operation, format } = opts
  const background = opts.background ?? (format === 'jpeg' ? '#020617' : 'transparent')
  const scale = opts.scale ?? 2

  try {
    const svg = findPrimarySvg(container)
    if (!svg) return 'No SVG visualization found to export.'

    const svgStr = serializeSvgElement(svg)
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr)

    const rect = svg.getBoundingClientRect()
    const w = Math.max(Math.round(rect.width), 800)
    const h = Math.max(Math.round(rect.height), 400)

    const canvas = document.createElement('canvas')
    canvas.width = w * scale
    canvas.height = h * scale
    const ctx = canvas.getContext('2d')
    if (!ctx) return 'Canvas context unavailable.'

    ctx.scale(scale, scale)

    if (background !== 'transparent') {
      ctx.fillStyle = background
      ctx.fillRect(0, 0, w, h)
    }

    const img = await loadImage(dataUrl)
    ctx.drawImage(img, 0, 0, w, h)

    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png'
    const quality = format === 'jpeg' ? 0.92 : undefined

    const exportUrl = canvas.toDataURL(mimeType, quality)
    const ext = format === 'jpeg' ? 'jpeg' : 'png'
    triggerDownload(exportUrl, buildExportFilename(dsId, ext, operation))
    return null
  } catch (err) {
    console.error(`[export${format.toUpperCase()}]`, err)
    return `Unable to export ${format.toUpperCase()}. Please try again.`
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e || new Error('Image load failed'))
    img.src = src
  })
}

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
