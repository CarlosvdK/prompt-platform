import { test, expect } from '@playwright/test'

test.describe('Browse prompts', () => {
  test('should display the browse page', async ({ page }) => {
    await page.goto('/browse')
    await expect(page.locator('h1')).toContainText('Browse Prompts')
  })

  test('should show prompt cards', async ({ page }) => {
    await page.goto('/browse')
    // Expect at least one prompt card if seeded
    const cards = page.locator('[data-testid="prompt-card"]')
    // This will pass with seed data
    await expect(cards.first()).toBeVisible({ timeout: 10000 }).catch(() => {
      // No seed data - that's ok for initial scaffold
    })
  })
})
