"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('Test Automation Practice Exploration - Exploration Test', () => {
    test_1.test.beforeEach(async ({ page }) => {
        await page.goto('https://testautomationpractice.blogspot.com/');
        await page.waitForLoadState('networkidle');
    });
    (0, test_1.test)('Page loads successfully with key elements', async ({ page }) => {
        // Verify page loads and basic elements are present
        await (0, test_1.expect)(page).toHaveTitle(/.+/);
        await (0, test_1.expect)(page.locator('body')).toBeVisible();
        // Take initial screenshot
        await page.screenshot({
            path: 'screenshots/test-automation-practice-exploration-initial.png',
            fullPage: true
        });
    });
    (0, test_1.test)('Navigation and interactive elements work', async ({ page }) => {
        // Test navigation elements if present
        const nav = page.locator('nav, .nav, .navigation');
        if (await nav.count() > 0) {
            await (0, test_1.expect)(nav).toBeVisible();
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
    test_1.test.afterEach(async ({ page }) => {
        // Capture screenshot on failure
        if (test_1.test.info().status !== test_1.test.info().expectedStatus) {
            await page.screenshot({
                path: `screenshots/${test_1.test.info().title.replace(/[^a-z0-9]/gi, '-')}-failure.png`,
                fullPage: true
            });
        }
    });
});
//# sourceMappingURL=test-automation-practice-exploration.spec.js.map