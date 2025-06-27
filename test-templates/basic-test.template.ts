import { test, expect } from '@playwright/test';

test.describe('{{testSuiteName}}', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code here
    {{beforeEachCode}}
  });

  test('{{testName}}', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('{{baseUrl}}');

    {{testSteps}}

    // Additional assertions
    {{assertions}}
  });

  test.afterEach(async ({ page }) => {
    // Cleanup code here
    {{afterEachCode}}
  });
});
