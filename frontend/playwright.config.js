/* eslint-env node */
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e', fullyParallel: true,
  forbidOnly: Boolean(process.env.CI), retries: process.env.CI ? 1 : 0, workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4175', trace: 'retain-on-failure', screenshot: 'only-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {},
  },
  projects: [
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: `${process.env.PLAYWRIGHT_SKIP_BUILD ? '' : 'npm run build && '}npm run preview -- --host 127.0.0.1 --port 4175 --strictPort`,
    url: 'http://127.0.0.1:4175', reuseExistingServer: false, timeout: 120000,
  },
});
