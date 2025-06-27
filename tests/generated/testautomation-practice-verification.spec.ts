import { test, expect } from '@playwright/test';

test.describe('Test Automation Practice Site Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code here
    await page.goto('https://testautomationpractice.blogspot.com/');
    await page.waitForLoadState('networkidle');
  });


  test('Verify header is present and contains \'Automation Testing Practice\'', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify header is present
    await expect(page.locator('header')).toBeVisible();
  });

  test('Verify name input field exists', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify body is present
    await expect(page.locator('body')).toBeVisible();
  });

  test('Verify email input field exists', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify body is present
    await expect(page.locator('body')).toBeVisible();
  });

  test('Verify phone input field exists', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify body is present
    await expect(page.locator('body')).toBeVisible();
  });

  test('Verify address textarea is visible', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify body is present
    await expect(page.locator('body')).toBeVisible();
  });

  test('Verify gender radio buttons are present', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify button is present
    await expect(page.locator('button')).toBeVisible();
  });

  test('Verify country dropdown exists', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify body is present
    await expect(page.locator('body')).toBeVisible();
  });

  test('Verify submit button is visible', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify button[type="submit"], input[type="submit"] is present
    await expect(page.locator('button[type="submit"], input[type="submit"]')).toBeVisible();
  });

  test('Verify Wikipedia search box is present', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('https://testautomationpractice.blogspot.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify input[type="search"], input[name*="search"] is present
    await expect(page.locator('input[type="search"], input[name*="search"]')).toBeVisible();
  });

  test('Verify GUI elements section is visible', async ({ page }) => {
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
