import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/account',
  testMatch: ['operations-dynamic.spec.js','operations-audit.spec.js'],
  outputDir: './test-results/operations-published',
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4183', browserName: 'chromium', headless: true },
  webServer: { command: 'node scripts/serve-pages-preview.js', url: 'http://127.0.0.1:4183', reuseExistingServer: false, timeout: 30000, env: { WEGROWEEN_BASE_PATH: '/', VITE_OPERATIONS_PREVIEW: 'true' } },
});
