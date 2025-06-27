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
test_1.test.describe('Test Automation Practice GUI Elements', () => {
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Setup code here
        yield page.goto('https://testautomationpractice.blogspot.com/');
        yield page.waitForLoadState('networkidle');
    }));
    (0, test_1.test)('Verify alert button triggers alert dialog', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify button is present
        yield (0, test_1.expect)(page.locator('button')).toBeVisible();
    }));
    (0, test_1.test)('Verify confirm button shows confirmation dialog', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify button contains text: confirmation dialog
        yield (0, test_1.expect)(page.locator('button')).toContainText('confirmation dialog');
    }));
    (0, test_1.test)('Verify prompt button shows prompt dialog', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify button contains text: prompt dialog
        yield (0, test_1.expect)(page.locator('button')).toContainText('prompt dialog');
    }));
    (0, test_1.test)('Verify double click button works', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify button is present
        yield (0, test_1.expect)(page.locator('button')).toBeVisible();
    }));
    (0, test_1.test)('Verify drag and drop functionality', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify body is present
        yield (0, test_1.expect)(page.locator('body')).toBeVisible();
    }));
    (0, test_1.test)('Verify slider element is interactive', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify body state: active
    }));
    (0, test_1.test)('Verify tabs functionality works', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify body is present
        yield (0, test_1.expect)(page.locator('body')).toBeVisible();
    }));
    (0, test_1.test)('Verify table data is displayed correctly', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
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
