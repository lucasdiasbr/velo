import { defineConfig, devices } from '@playwright/test';

const isCI =
  !!(globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.CI;

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({

  timeout: 60_000,

  expect: {
    timeout: 5_000
  },

  testDir: './playwright/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    actionTimeout: 5_000,
    navigationTimeout: 10_000,
    screenshot: 'on'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Só sobe o servidor local quando BASE_URL não estiver definida (ambiente local)
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'yarn dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !isCI,
      },
});