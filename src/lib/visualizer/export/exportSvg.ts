import { findPrimarySvg, serializeSvgElement } from './serializeSvg'
import { buildExportFilename } from './filename'

export interface ExportSvgOptions {
  container: HTMLElement
  dsId: string
  operation?: string
}

/**
 * Export the SVG visualization as a downloadable .svg file.
 * Returns an error message if export fails, or null on success.
 */
export async function exportSvg({
  container,
  dsId,
  operation,
}: ExportSvgOptions): Promise<string | null> {
  try {
    const svg = findPrimarySvg(container)
    if (!svg) return 'No SVG visualization found to export.'

    const source = serializeSvgElement(svg)
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = buildExportFilename(dsId, 'svg', operation)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // Revoke after a small delay to ensure download starts
    setTimeout(() => URL.revokeObjectURL(url), 5000)
    return null
  } catch (err) {
    console.error('[exportSvg]', err)
    return 'Unable to export SVG. Please try again.'
  }
}
