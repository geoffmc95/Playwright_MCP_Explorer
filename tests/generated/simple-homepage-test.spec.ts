import { test, expect } from '@playwright/test';

test.describe('Simple Homepage Test', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code here
    await page.goto('https://playwright.dev');
    await page.waitForLoadState('networkidle');
  });


  test('Verify header is present', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://playwright.dev');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify header is present
    await expect(page.locator('header')).toBeVisible();
  });

  test('Verify navigation menu exists', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://playwright.dev');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify nav, .nav, .navigation is present
    await expect(page.locator('nav, .nav, .navigation')).toBeVisible();
  });

  test('Verify main heading is visible', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://playwright.dev');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify h1 is present
    await expect(page.locator('h1')).toBeVisible();
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
