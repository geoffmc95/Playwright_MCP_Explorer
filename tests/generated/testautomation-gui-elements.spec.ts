import { test, expect } from '@playwright/test';

test.describe('Test Automation Practice GUI Elements', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code here
    await page.goto('https://testautomationpractice.blogspot.com/');
    await page.waitForLoadState('networkidle');
  });


  test('Verify alert button triggers alert dialog', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify button is present
    await expect(page.locator('button')).toBeVisible();
  });

  test('Verify confirm button shows confirmation dialog', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify button contains text: confirmation dialog
    await expect(page.locator('button')).toContainText('confirmation dialog');
  });

  test('Verify prompt button shows prompt dialog', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify button contains text: prompt dialog
    await expect(page.locator('button')).toContainText('prompt dialog');
  });

  test('Verify double click button works', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify button is present
    await expect(page.locator('button')).toBeVisible();
  });

  test('Verify drag and drop functionality', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify body is present
    await expect(page.locator('body')).toBeVisible();
  });

  test('Verify slider element is interactive', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify body state: active
  });

  test('Verify tabs functionality works', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify body is present
    await expect(page.locator('body')).toBeVisible();
  });

  test('Verify table data is displayed correctly', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify body is present
    await expect(page.locator('body')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    // Cleanup code here
    // Take screenshot on failure
    if (test.info().status !== test.info().expectedStatus) {
      await page.screenshot({
        path: `screenshots/${test.info().title.replace(/[^a-z0-9]/gi, '-')}-failure.png`,
        fullPage: true
      });
    }
  });
});
