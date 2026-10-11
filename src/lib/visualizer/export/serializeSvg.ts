/**
 * Serialize an SVG element to a string with all necessary attributes.
 * Embeds inline styles and ensures xmlns is correct for standalone use.
 */
export function serializeSvgElement(svgEl: SVGSVGElement): string {
  // Clone so we can mutate without affecting the live DOM
  const clone = svgEl.cloneNode(true) as SVGSVGElement

  // Ensure required SVG attributes
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')

  // Preserve actual pixel dimensions (not just viewBox)
  const rect = svgEl.getBoundingClientRect()
  if (rect.width > 0) {
    clone.setAttribute('width', String(Math.round(rect.width)))
    clone.setAttribute('height', String(Math.round(rect.height)))
  }

  // Inline computed styles for text elements so fonts render correctly
  const textEls = clone.querySelectorAll('text')
  textEls.forEach((el) => {
    const computed = window.getComputedStyle(
      svgEl.querySelector(`text[data-id="${el.getAttribute('data-id')}"]`) ?? el,
    )
    if (computed.fontFamily) {
      el.style.fontFamily = computed.fontFamily
    }
  })

  return new XMLSerializer().serializeToString(clone)
}

/**
 * Find the primary SVG element inside a container.
 * Prefers the largest SVG (by area) to skip minimap/icons.
 */
export function findPrimarySvg(container: HTMLElement): SVGSVGElement | null {
  const svgs = Array.from(container.querySelectorAll('svg')) as SVGSVGElement[]
  if (svgs.length === 0) return null
  if (svgs.length === 1) return svgs[0]

  // Return the SVG with the largest bounding rect
  return svgs.reduce((best, svg) => {
    const b = svg.getBoundingClientRect()
    const best_b = best.getBoundingClientRect()
    return b.width * b.height > best_b.width * best_b.height ? svg : best
  })
}
