"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('Simple Homepage Test', () => {
    test_1.test.beforeEach(async ({ page }) => {
        // Setup code here
        await page.goto('https://playwright.dev');
        await page.waitForLoadState('networkidle');
    });
    (0, test_1.test)('Verify header is present', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://playwright.dev');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify header is present
        await (0, test_1.expect)(page.locator('header')).toBeVisible();
    });
    (0, test_1.test)('Verify navigation menu exists', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://playwright.dev');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify nav, .nav, .navigation is present
        await (0, test_1.expect)(page.locator('nav, .nav, .navigation')).toBeVisible();
    });
    (0, test_1.test)('Verify main heading is visible', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://playwright.dev');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify h1 is present
        await (0, test_1.expect)(page.locator('h1')).toBeVisible();
    });
    test_1.test.afterEach(async ({ page }) => {
        // Cleanup code here
        // Take screenshot on failure
        if (test_1.test.info().status !== test_1.test.info().expectedStatus) {
            await page.screenshot({
                path: `screenshots/${test_1.test.info().title.replace(/[^a-z0-9]/gi, '-')}-failure.png`,
                fullPage: true
            });
        }
    });
});
//# sourceMappingURL=simple-homepage-test.spec.js.map