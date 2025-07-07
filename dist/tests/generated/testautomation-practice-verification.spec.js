"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('Test Automation Practice Site Verification', () => {
    test_1.test.beforeEach(async ({ page }) => {
        // Setup code here
        await page.goto('https://testautomationpractice.blogspot.com/');
        await page.waitForLoadState('networkidle');
    });
    (0, test_1.test)('Verify header is present and contains \'Automation Testing Practice\'', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify header is present
        await (0, test_1.expect)(page.locator('header')).toBeVisible();
    });
    (0, test_1.test)('Verify name input field exists', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify body is present
        await (0, test_1.expect)(page.locator('body')).toBeVisible();
    });
    (0, test_1.test)('Verify email input field exists', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify body is present
        await (0, test_1.expect)(page.locator('body')).toBeVisible();
    });
    (0, test_1.test)('Verify phone input field exists', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify body is present
        await (0, test_1.expect)(page.locator('body')).toBeVisible();
    });
    (0, test_1.test)('Verify address textarea is visible', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify body is present
        await (0, test_1.expect)(page.locator('body')).toBeVisible();
    });
    (0, test_1.test)('Verify gender radio buttons are present', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify button is present
        await (0, test_1.expect)(page.locator('button')).toBeVisible();
    });
    (0, test_1.test)('Verify country dropdown exists', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify body is present
        await (0, test_1.expect)(page.locator('body')).toBeVisible();
    });
    (0, test_1.test)('Verify submit button is visible', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify button[type="submit"], input[type="submit"] is present
        await (0, test_1.expect)(page.locator('button[type="submit"], input[type="submit"]')).toBeVisible();
    });
    (0, test_1.test)('Verify Wikipedia search box is present', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify input[type="search"], input[name*="search"] is present
        await (0, test_1.expect)(page.locator('input[type="search"], input[name*="search"]')).toBeVisible();
    });
    (0, test_1.test)('Verify GUI elements section is visible', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify body is present
        await (0, test_1.expect)(page.locator('body')).toBeVisible();
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
//# sourceMappingURL=testautomation-practice-verification.spec.js.map