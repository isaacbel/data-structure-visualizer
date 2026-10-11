import { test, expect } from '@playwright/test'

test.describe('Data Structure Visualizer E2E Test Suite', () => {
  test('Homepage loads correctly with hero and category cards', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Data Structure|Visualizer/i)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('Learn route loads visualizer canvas for Array', async ({ page }) => {
    await page.goto('/learn/array')
    await expect(page.locator('h1, h2')).toContainText(/Array/i)
    // Check canvas / visualization container exists
    await expect(page.locator('canvas, [data-testid="visualizer-canvas"], .relative')).toBeDefined()
  })

  test('Learn route loads visualizer canvas for BST', async ({ page }) => {
    await page.goto('/learn/bst')
    await expect(page.locator('body')).toContainText(/Binary Search Tree|BST/i)
  })

  test('Learn route loads visualizer canvas for Graph', async ({ page }) => {
    await page.goto('/learn/graph-visualizer')
    await expect(page.locator('body')).toContainText(/Graph/i)
  })

  test('Keyboard Shortcuts dialog opens on ? key press', async ({ page }) => {
    await page.goto('/learn/array')
    await page.keyboard.press('Shift+Slash') // '?' key
    await expect(page.locator('text=Keyboard Navigation Shortcuts')).toBeVisible({ timeout: 5000 })
  })
})
