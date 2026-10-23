import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testMatch: 'test.playwright.js',
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // starts the Vite dev server for the run; reuses one if already running
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
});
