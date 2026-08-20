import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4323';
const environment = (
  globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }
).process?.env;
const executablePath = environment?.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const isCI = Boolean(environment?.CI);

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 3 : undefined,
  reporter: isCI ? 'line' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: executablePath ? { executablePath } : undefined,
      },
    },
    {
      name: 'firefox',
      use: devices['Desktop Firefox'],
    },
    {
      name: 'webkit',
      use: devices['Desktop Safari'],
    },
  ],
  webServer: {
    command: 'pnpm preview --host 127.0.0.1 --port 4323',
    env: {
      ASTRO_PREVIEW_BACKGROUND: '0',
    },
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
});
