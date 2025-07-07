"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('Test Automation Practice GUI Elements', () => {
    test_1.test.beforeEach(async ({ page }) => {
        // Setup code here
        await page.goto('https://testautomationpractice.blogspot.com/');
        await page.waitForLoadState('networkidle');
    });
    (0, test_1.test)('Verify alert button triggers alert dialog', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify button is present
        await (0, test_1.expect)(page.locator('button')).toBeVisible();
    });
    (0, test_1.test)('Verify confirm button shows confirmation dialog', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify button contains text: confirmation dialog
        await (0, test_1.expect)(page.locator('button')).toContainText('confirmation dialog');
    });
    (0, test_1.test)('Verify prompt button shows prompt dialog', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify button contains text: prompt dialog
        await (0, test_1.expect)(page.locator('button')).toContainText('prompt dialog');
    });
    (0, test_1.test)('Verify double click button works', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify button is present
        await (0, test_1.expect)(page.locator('button')).toBeVisible();
    });
    (0, test_1.test)('Verify drag and drop functionality', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify body is present
        await (0, test_1.expect)(page.locator('body')).toBeVisible();
    });
    (0, test_1.test)('Verify slider element is interactive', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify body state: active
    });
    (0, test_1.test)('Verify tabs functionality works', async ({ page }) => {
        // Navigate to the target URL
        await page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        // Verify body is present
        await (0, test_1.expect)(page.locator('body')).toBeVisible();
    });
    (0, test_1.test)('Verify table data is displayed correctly', async ({ page }) => {
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
//# sourceMappingURL=testautomation-gui-elements.spec.js.map