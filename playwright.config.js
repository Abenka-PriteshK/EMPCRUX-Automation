// @ts-check
const { defineConfig } = require('@playwright/test');
const { getCurrentEnv } = require('./config/env.config');

// Determine if running in CI/CD environment
const isCI = process.env.CI === 'true' || process.env.CI === '1';
// Get centralized environment config
const envConfig = getCurrentEnv();
// Get base URL from environment variable or use centralized config
const baseURL = process.env.BASE_URL || envConfig.baseURL;

module.exports = defineConfig({
  testDir: './tests',

  /* Max time one test can run for. */
  timeout: 90 * 1000,
  expect: {
    timeout: 90000,
  },
  
  /* Run tests in parallel - adjust workers based on environment */
  workers: isCI ? 2 : 4, // Fewer workers in CI to avoid resource issues
  
  /* Retry failed tests - helps with flaky tests */
  retries: isCI ? 2 : 0, // Retry twice in CI, no retries locally for faster feedback
  
  /* Reporter configuration */
  reporter: [
    ['html'],
    ['list'], // Console output
    // Uncomment below for CI/CD reporting services
    // ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // Base URL for all tests - can be overridden per test
    baseURL: baseURL,
    
    browserName: 'chromium',
    
    // Headless mode: true in CI, false locally (can be overridden with --headed flag)
    headless: isCI ? true : process.env.HEADLESS !== 'false',
    
    // Only use slowMo in local development when not in CI
    launchOptions: {
      ...(isCI ? {} : { slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 200 }),
    },
    
    // Screenshot configuration - captures screenshots only when tests fail
    screenshot: 'only-on-failure',
    
    // Video recording on failure - useful for debugging CI failures
    video: 'retain-on-failure',
    
    // Trace on failure - provides detailed execution trace
    trace: 'retain-on-failure',
  },
  
  /* Global setup/teardown hooks (optional) */
  // globalSetup: require.resolve('./global-setup'),
  // globalTeardown: require.resolve('./global-teardown'),
  
  /* Projects for different browsers (optional - uncomment to test multiple browsers) */
  // projects: [
  //   { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  //   { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  //   { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  // ],
});