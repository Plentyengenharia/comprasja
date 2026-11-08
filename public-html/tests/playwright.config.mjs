import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'entrega-a.spec.mjs',
  use: {
    baseURL: 'http://127.0.0.1:8765',
  },
  webServer: {
    command: 'python3 -m http.server 8765 --directory ..',
    cwd: '.',
    url: 'http://127.0.0.1:8765/',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
