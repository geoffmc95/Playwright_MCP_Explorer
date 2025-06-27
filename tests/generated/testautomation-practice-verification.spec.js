"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('Test Automation Practice Site Verification', () => {
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Setup code here
        yield page.goto('https://testautomationpractice.blogspot.com/');
        yield page.waitForLoadState('networkidle');
    }));
    (0, test_1.test)('Verify header is present and contains \'Automation Testing Practice\'', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify header is present
        yield (0, test_1.expect)(page.locator('header')).toBeVisible();
    }));
    (0, test_1.test)('Verify name input field exists', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify body is present
        yield (0, test_1.expect)(page.locator('body')).toBeVisible();
    }));
    (0, test_1.test)('Verify email input field exists', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify body is present
        yield (0, test_1.expect)(page.locator('body')).toBeVisible();
    }));
    (0, test_1.test)('Verify phone input field exists', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify body is present
        yield (0, test_1.expect)(page.locator('body')).toBeVisible();
    }));
    (0, test_1.test)('Verify address textarea is visible', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify body is present
        yield (0, test_1.expect)(page.locator('body')).toBeVisible();
    }));
    (0, test_1.test)('Verify gender radio buttons are present', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify button is present
        yield (0, test_1.expect)(page.locator('button')).toBeVisible();
    }));
    (0, test_1.test)('Verify country dropdown exists', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify body is present
        yield (0, test_1.expect)(page.locator('body')).toBeVisible();
    }));
    (0, test_1.test)('Verify submit button is visible', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify button[type="submit"], input[type="submit"] is present
        yield (0, test_1.expect)(page.locator('button[type="submit"], input[type="submit"]')).toBeVisible();
    }));
    (0, test_1.test)('Verify Wikipedia search box is present', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify input[type="search"], input[name*="search"] is present
        yield (0, test_1.expect)(page.locator('input[type="search"], input[name*="search"]')).toBeVisible();
    }));
    (0, test_1.test)('Verify GUI elements section is visible', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify body is present
        yield (0, test_1.expect)(page.locator('body')).toBeVisible();
    }));
    test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Cleanup code here
        // Take screenshot on failure
        if (test_1.test.info().status !== test_1.test.info().expectedStatus) {
            yield page.screenshot({
                path: `screenshots/${test_1.test.info().title.replace(/[^a-z0-9]/gi, '-')}-failure.png`,
                fullPage: true
            });
        }
    }));
});
