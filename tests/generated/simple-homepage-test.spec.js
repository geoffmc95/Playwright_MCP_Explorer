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
test_1.test.describe('Simple Homepage Test', () => {
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Setup code here
        yield page.goto('https://playwright.dev');
        yield page.waitForLoadState('networkidle');
    }));
    (0, test_1.test)('Verify header is present', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://playwright.dev');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify header is present
        yield (0, test_1.expect)(page.locator('header')).toBeVisible();
    }));
    (0, test_1.test)('Verify navigation menu exists', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://playwright.dev');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify nav, .nav, .navigation is present
        yield (0, test_1.expect)(page.locator('nav, .nav, .navigation')).toBeVisible();
    }));
    (0, test_1.test)('Verify main heading is visible', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('https://playwright.dev');
        // Wait for page to load
        yield page.waitForLoadState('networkidle');
        // Verify h1 is present
        yield (0, test_1.expect)(page.locator('h1')).toBeVisible();
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
