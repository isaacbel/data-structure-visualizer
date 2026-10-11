/**
 * Generate a sanitized, descriptive download filename.
 *
 * Format: dsv-{structure}-{date}.{ext}
 * Example: dsv-avl-tree-2026-08-08.png
 */
export function buildExportFilename(
  dsId: string,
  ext: 'png' | 'jpeg' | 'jpg' | 'svg' | 'webm',
  operation?: string,
): string {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const sanitize = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const parts = ['dsv', sanitize(dsId)]
  if (operation) parts.push(sanitize(operation))
  parts.push(today)

  return `${parts.join('-')}.${ext}`
}
