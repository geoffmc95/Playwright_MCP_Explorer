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
test_1.test.describe('{{testSuiteName}}', () => {
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Setup code here
        {
            {
                beforeEachCode;
            }
        }
    }));
    (0, test_1.test)('{{testName}}', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navigate to the target URL
        yield page.goto('{{baseUrl}}');
        {
            {
                testSteps;
            }
        }
        // Additional assertions
        {
            {
                assertions;
            }
        }
    }));
    test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Cleanup code here
        {
            {
                afterEachCode;
            }
        }
    }));
});
