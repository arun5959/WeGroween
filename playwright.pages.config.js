import { defineConfig } from '@playwright/test';
import { basePath } from './src/app/hosting.js';

export default defineConfig({
  testDir: './tests/pages',
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4183', browserName: 'chromium', headless: true },
  webServer: { command: 'node scripts/serve-pages-preview.js', url: `http://127.0.0.1:4183${basePath}`, reuseExistingServer: false, timeout: 30000 },
});
