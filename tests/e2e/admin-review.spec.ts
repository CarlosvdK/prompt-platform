import { test, expect } from '@playwright/test'

test.describe('Admin review workflow', () => {
  test('should show review queue for admin', async ({ page }) => {
    // TODO: Login as admin, navigate to review queue
    test.skip()
  })

  test('should approve a prompt', async ({ page }) => {
    // TODO: Navigate to review detail, approve, verify status change
    test.skip()
  })
})
