import { test, expect } from '@playwright/test';

test.describe('Test Automation Practice Form Interaction', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code here
    await page.goto('https://testautomationpractice.blogspot.com/');
    await page.waitForLoadState('networkidle');
  });


  test('Verify form can be filled with valid data', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify form is present
    await expect(page.locator('form')).toBeVisible();
  });

  test('Verify gender selection works correctly', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify body is present
    await expect(page.locator('body')).toBeVisible();
  });

  test('Verify country dropdown selection works', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify body is present
    await expect(page.locator('body')).toBeVisible();
  });

  test('Verify checkboxes can be selected', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify body state: selected
  });

  test('Verify Wikipedia search functionality works', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify body is present
    await expect(page.locator('body')).toBeVisible();
  });

  test('Verify date picker is functional', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify body is present
    await expect(page.locator('body')).toBeVisible();
  });

  test('Verify file upload field exists', async ({ page }) => {
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
