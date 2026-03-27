import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './qa',
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    command: 'npx astro dev --port 4321',
    port: 4321,
    reuseExistingServer: true,
  },
});
