import { test, expect } from '@playwright/test';

// needs a real account: TEST_USER_EMAIL / TEST_USER_PASSWORD. Without them these tests skip.
const EMAIL = process.env.TEST_USER_EMAIL;
const PASSWORD = process.env.TEST_USER_PASSWORD;
const hasCreds = Boolean(EMAIL && PASSWORD);

// ponytail: budgets are a first guess; tune after the first real run
const DASHBOARD_MAX_MS = 3000;
const DASHBOARD_MAX_FIRESTORE_REQUESTS = 4;

async function signIn(page) {
  await page.goto('/');
  await page.locator('button:visible', { hasText: 'Sign In' }).first().click();
  await page.locator('input[type="email"]').fill(EMAIL);
  await page.locator('input[type="password"]').fill(PASSWORD);
  await page.locator('button[type="submit"]', { hasText: 'Sign In' }).click();
  // header of the sign-in modal goes away once signed in
  await expect(page.locator('input[type="password"]')).toBeHidden({ timeout: 15000 });
}

test.skip('shows setup screen when Firebase config missing', async ({ page }) => {
  // skipped: only shows when VITE_FIREBASE_* env vars are unset, and this checkout has them
  await page.goto('http://localhost:5173/');
  await expect(page.locator('h2:has-text("Setup Required")')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('text=Firebase configuration is missing')).toBeVisible();
});

test.describe('Dashboard after login', () => {
  test.skip(!hasCreds, 'set TEST_USER_EMAIL and TEST_USER_PASSWORD to run');

  test('dashboard renders within budget', async ({ page }) => {
    await signIn(page);

    const start = Date.now();
    await page.goto('/dashboard');
    await expect(page.locator('h1', { hasText: 'Welcome' })).toBeVisible({ timeout: DASHBOARD_MAX_MS * 3 });
    const elapsed = Date.now() - start;

    console.log(`dashboard render: ${elapsed}ms`);
    expect(elapsed).toBeLessThan(DASHBOARD_MAX_MS);
  });

  test('dashboard makes few Firestore requests', async ({ page }) => {
    await signIn(page);

    let firestoreRequests = 0;
    page.on('request', (req) => {
      if (req.url().includes('firestore.googleapis.com')) firestoreRequests++;
    });

    await page.goto('/dashboard');
    await expect(page.locator('h1', { hasText: 'Welcome' })).toBeVisible({ timeout: 15000 });
    await page.waitForLoadState('networkidle');

    console.log(`firestore requests on dashboard: ${firestoreRequests}`);
    expect(firestoreRequests).toBeLessThanOrEqual(DASHBOARD_MAX_FIRESTORE_REQUESTS);
  });
});
