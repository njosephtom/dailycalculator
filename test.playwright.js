import { test, expect } from '@playwright/test';

test('shows setup screen when Firebase config missing', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Wait for the setup screen to appear
  await expect(page.locator('h2:has-text("Setup Required")')).toBeVisible({ timeout: 5000 });

  // Verify setup instructions are visible
  await expect(page.locator('text=Firebase configuration is missing')).toBeVisible();
  await expect(page.locator('text=Firebase Console')).toBeVisible();

  console.log('✓ Setup screen displayed correctly');
});
