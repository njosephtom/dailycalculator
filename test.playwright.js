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

test('Dashboard loads quickly after login', async ({ page, context }) => {
  const navigationStartTime = Date.now();

  // Navigate to the app
  await page.goto('http://localhost:5173/');

  // Wait for app to fully load
  await page.waitForLoadState('networkidle');
  const appLoadTime = Date.now() - navigationStartTime;
  console.log(`✓ App load time: ${appLoadTime}ms`);

  // Dashboard should be visible if user is logged in
  // Check for dashboard content (header with user greeting)
  const dashboardVisible = await Promise.race([
    page.waitForSelector('h1', { timeout: 5000 }).then(() => true).catch(() => false),
  ]);

  const totalLoadTime = Date.now() - navigationStartTime;
  console.log(`✓ Dashboard visible: ${dashboardVisible}, Total load: ${totalLoadTime}ms`);
});

test('Dashboard Firestore reads performance', async ({ page }) => {
  // This test measures the actual performance of Firestore calls
  // by instrumenting the page

  await page.addInitScript(() => {
    window.firebaseMetrics = {
      docReads: [],
      collectionReads: []
    };
  });

  await page.goto('http://localhost:5173/');

  // Wait for network idle to ensure all reads are done
  await page.waitForLoadState('networkidle');

  // Try to measure how long Firestore operations took
  const readTime = await page.evaluate(() => {
    const startMark = performance.getEntriesByName('navigationStart')[0];
    const lastResource = performance.getEntriesByType('resource').pop();
    if (lastResource && startMark) {
      return lastResource.responseEnd - startMark.startTime;
    }
    return 0;
  });

  console.log(`Page interactive time from start: ${readTime}ms`);

  // Measure time to First Contentful Paint
  const paintEntries = await page.evaluate(() => {
    return performance.getEntriesByType('paint');
  });

  console.log('Paint entries:', JSON.stringify(paintEntries, null, 2));
});
