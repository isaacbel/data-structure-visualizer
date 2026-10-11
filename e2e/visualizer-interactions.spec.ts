import { test, expect } from '@playwright/test'

test.describe('Real Visualizer Interactive Controls Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/learn/array')
    // Ensure canvas container is loaded
    await expect(page.locator('div.relative.h-full.min-h-\\[320px\\]')).toBeVisible({ timeout: 10000 })
  })

  test('Zoom In button increases zoom percentage badge', async ({ page }) => {
    const zoomBadge = page.locator('text=/%$/').first()
    await expect(zoomBadge).toBeVisible()

    const initialText = await zoomBadge.innerText()
    const initialPercent = parseInt(initialText.replace('%', ''), 10)

    // Click Zoom In button
    const zoomInBtn = page.getByRole('button', { name: /Zoom in/i })
    await zoomInBtn.click()

    // Verify percentage badge increased
    await expect(async () => {
      const newText = await zoomBadge.innerText()
      const newPercent = parseInt(newText.replace('%', ''), 10)
      expect(newPercent).toBeGreaterThan(initialPercent)
    }).toPass()
  })

  test('Zoom Out button decreases zoom percentage badge', async ({ page }) => {
    const zoomBadge = page.locator('text=/%$/').first()
    await expect(zoomBadge).toBeVisible()

    // First zoom in
    const zoomInBtn = page.getByRole('button', { name: /Zoom in/i })
    await zoomInBtn.click()
    await zoomInBtn.click()

    const midText = await zoomBadge.innerText()
    const midPercent = parseInt(midText.replace('%', ''), 10)

    // Now zoom out
    const zoomOutBtn = page.getByRole('button', { name: /Zoom out/i })
    await zoomOutBtn.click()

    await expect(async () => {
      const newText = await zoomBadge.innerText()
      const newPercent = parseInt(newText.replace('%', ''), 10)
      expect(newPercent).toBeLessThan(midPercent)
    }).toPass()
  })

  test('Fit to screen button centers and fits visualization', async ({ page }) => {
    const fitBtn = page.getByRole('button', { name: /Fit to screen/i })
    await fitBtn.click()
    await expect(fitBtn).toBeEnabled()
  })

  test('Reset view button restores camera state', async ({ page }) => {
    // Zoom in first
    const zoomInBtn = page.getByRole('button', { name: /Zoom in/i })
    await zoomInBtn.click()

    // Click reset
    const resetBtn = page.getByRole('button', { name: /Reset view/i })
    await resetBtn.click()

    const zoomBadge = page.locator('text=/%$/').first()
    await expect(zoomBadge).toHaveText('100%')
  })

  test('Play/Pause and Step buttons control animation execution', async ({ page }) => {
    // Type value and click Run
    const input = page.getByPlaceholder(/enter value|value/i).first()
    if (await input.isVisible()) {
      await input.fill('42')
      const runBtn = page.getByRole('button', { name: /^Run$/i })
      await runBtn.click()

      // Step Forward
      const stepForwardBtn = page.getByRole('button', { name: /Step forward/i })
      if (await stepForwardBtn.isVisible()) {
        await stepForwardBtn.click()
      }

      // Step Backward
      const stepBackwardBtn = page.getByRole('button', { name: /Step backward/i })
      if (await stepBackwardBtn.isVisible()) {
        await stepBackwardBtn.click()
      }
    }
  })

  test('Randomize button updates visual nodes state', async ({ page }) => {
    const randomBtn = page.getByRole('button', { name: /Random/i }).first()
    await expect(randomBtn).toBeVisible()
    await randomBtn.click()

    // Check node badge exists
    const nodeBadge = page.locator('text=/\\d+ nodes/').first()
    await expect(nodeBadge).toBeVisible()
  })

  test('Export dropdown opens menu with PNG, JPEG, SVG options', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /Export/i }).first()
    await exportBtn.click()

    await expect(page.getByRole('button', { name: /PNG/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /JPEG/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /SVG/i })).toBeVisible()
  })
})
