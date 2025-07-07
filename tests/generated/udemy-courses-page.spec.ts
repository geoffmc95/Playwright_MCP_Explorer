import { test, expect } from '@playwright/test';

test.describe('Udemy Courses Page - Exploration Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.pavanonlinetrainings.com/p/udemy-courses.html');
    await page.waitForLoadState('networkidle');
  });

  test('Page loads successfully with key elements', async ({ page }) => {
    // Verify page loads and basic elements are present
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator('body')).toBeVisible();

    // Take initial screenshot
    await page.screenshot({
      path: 'screenshots/udemy-courses-page-initial.png',
      fullPage: true
    });
  });

  test('Navigation and interactive elements work', async ({ page }) => {
    // Test navigation elements if present
    const nav = page.locator('nav, .nav, .navigation');
    if (await nav.count() > 0) {
      await expect(nav).toBeVisible();
    }

    // Test buttons if present
    const buttons = page.locator('button, input[type="button"], input[type="submit"]');
    const buttonCount = await buttons.count();
    if (buttonCount > 0) {
      console.log(`Found ${buttonCount} interactive buttons`);
    }

    // Test forms if present
    const forms = page.locator('form');
    const formCount = await forms.count();
    if (formCount > 0) {
      console.log(`Found ${formCount} forms`);
    }
  });

  test.afterEach(async ({ page }) => {
    // Capture screenshot on failure
    if (test.info().status !== test.info().expectedStatus) {
      await page.screenshot({
        path: `screenshots/${test.info().title.replace(/[^a-z0-9]/gi, '-')}-failure.png`,
        fullPage: true
      });
    }
  });
});
