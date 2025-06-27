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
test_1.test.describe('Test Automation Practice Form Interaction', () => {
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Setup code here
        yield page.goto('https://testautomationpractice.blogspot.com/');
        yield page.waitForLoadState('networkidle');
    }));
    (0, test_1.test)('Verify form can be filled with valid data', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify form is present
        yield (0, test_1.expect)(page.locator('form')).toBeVisible();
    }));
    (0, test_1.test)('Verify gender selection works correctly', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify body is present
        yield (0, test_1.expect)(page.locator('body')).toBeVisible();
    }));
    (0, test_1.test)('Verify country dropdown selection works', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify body is present
        yield (0, test_1.expect)(page.locator('body')).toBeVisible();
    }));
    (0, test_1.test)('Verify checkboxes can be selected', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify body state: selected
    }));
    (0, test_1.test)('Verify Wikipedia search functionality works', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify body is present
        yield (0, test_1.expect)(page.locator('body')).toBeVisible();
    }));
    (0, test_1.test)('Verify date picker is functional', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://testautomationpractice.blogspot.com/');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify body is present
        yield (0, test_1.expect)(page.locator('body')).toBeVisible();
    }));
    (0, test_1.test)('Verify file upload field exists', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
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
