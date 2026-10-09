import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
// CI (and PLAYWRIGHT_SERVER=start locally, after `npm run build`) tests the
// production build: the dev server's on-demand compiles stall the main thread
// for seconds and make timing-sensitive specs flaky.
const PRODUCTION_SERVER = Boolean(process.env.CI) || process.env.PLAYWRIGHT_SERVER === 'start';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  // GitHub's runners have no GPU and two cores; WebGL-heavy timing specs
  // get one-off stalls there, so CI retries before failing.
  retries: process.env.CI ? 2 : 0,
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
    // PLAYWRIGHT_CHANNEL=chrome uses installed Chrome locally; CI defaults to bundled Chromium.
    channel: process.env.PLAYWRIGHT_CHANNEL,
    // Software WebGL everywhere: without these flags the runners' WebGL
    // contexts crash the page ("session closed").
    launchOptions: {
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
    },
  },
  webServer: {
    command: `npm run ${PRODUCTION_SERVER ? 'start' : 'dev'} -- --hostname 127.0.0.1 --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
