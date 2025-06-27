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
const test_data_manager_1 = require("../../src/test-data-manager");
// Example test demonstrating MCP-Playwright integration
test_1.test.describe('MCP-Playwright Integration Examples', () => {
    let dataManager;
    test_1.test.beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        dataManager = new test_data_manager_1.TestDataManager();
        yield dataManager.loadFixtures();
    }));
    (0, test_1.test)('Example 1: Using test data fixtures', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Get test data from fixtures
        const user = yield dataManager.getUser('testUser');
        const formData = yield dataManager.getFormData('contactForm');
        // Navigate to a demo form (using a real demo site)
        yield page.goto('https://demo.playwright.dev/todomvc');
        // Example of using fixture data in test
        const todoInput = page.getByPlaceholder('What needs to be done?');
        yield todoInput.fill(formData.message);
        yield todoInput.press('Enter');
        // Verify the todo was added
        yield (0, test_1.expect)(page.getByTestId('todo-item')).toContainText(formData.message);
    }));
    (0, test_1.test)('Example 2: Dynamic selector usage', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Get selectors from fixtures
        const submitSelector = yield dataManager.getSelector('forms', 'submitButton');
        yield page.goto('https://demo.playwright.dev/todomvc');
        // Add a todo item
        yield page.getByPlaceholder('What needs to be done?').fill('Test dynamic selectors');
        yield page.getByPlaceholder('What needs to be done?').press('Enter');
        // Verify todo count
        yield (0, test_1.expect)(page.getByTestId('todo-count')).toContainText('1');
    }));
    (0, test_1.test)('Example 3: Environment-based testing', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // This would typically use different URLs based on environment
        const baseUrl = yield dataManager.getEnvironmentUrl('development');
        // For demo purposes, we'll use the Playwright demo site
        yield page.goto('https://demo.playwright.dev/todomvc');
        // Example of environment-specific testing
        yield (0, test_1.expect)(page).toHaveTitle(/TodoMVC/);
    }));
    (0, test_1.test)('Example 4: Random test data generation', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Get random test data
        const randomEmail = yield dataManager.getRandomTestData('validEmails');
        const strongPassword = yield dataManager.getRandomTestData('passwords', 'strong');
        yield page.goto('https://demo.playwright.dev/todomvc');
        // Use random data in test (simulating a registration form)
        const todoText = `Register user: ${randomEmail}`;
        yield page.getByPlaceholder('What needs to be done?').fill(todoText);
        yield page.getByPlaceholder('What needs to be done?').press('Enter');
        yield (0, test_1.expect)(page.getByTestId('todo-item')).toContainText(randomEmail);
    }));
    (0, test_1.test)('Example 5: Test data variants', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Create a variant of base user data
        const baseUser = yield dataManager.getUser('testUser');
        const userVariant = yield dataManager.createTestDataVariant(baseUser, {
            name: 'Modified Test User',
            email: 'modified@example.com'
        });
        yield page.goto('https://demo.playwright.dev/todomvc');
        // Use the variant data
        const todoText = `User: ${userVariant.name} (${userVariant.email})`;
        yield page.getByPlaceholder('What needs to be done?').fill(todoText);
        yield page.getByPlaceholder('What needs to be done?').press('Enter');
        yield (0, test_1.expect)(page.getByTestId('todo-item')).toContainText(userVariant.name);
    }));
    (0, test_1.test)('Example 6: Multi-step scenario simulation', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Simulate a complex user journey
        const scenarios = yield dataManager.loadScenarios();
        yield page.goto('https://demo.playwright.dev/todomvc');
        // Add multiple todos (simulating scenario steps)
        const todos = ['Plan test automation', 'Implement MCP integration', 'Run automated tests'];
        for (const todo of todos) {
            yield page.getByPlaceholder('What needs to be done?').fill(todo);
            yield page.getByPlaceholder('What needs to be done?').press('Enter');
        }
        // Verify all todos were added
        yield (0, test_1.expect)(page.getByTestId('todo-item')).toHaveCount(3);
        // Complete first todo
        yield page.getByTestId('todo-item').first().getByRole('checkbox').check();
        // Verify completion
        yield (0, test_1.expect)(page.getByTestId('todo-item').first()).toHaveClass(/completed/);
    }));
    (0, test_1.test)('Example 7: Screenshot and reporting', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto('https://demo.playwright.dev/todomvc');
        // Add some test data
        yield page.getByPlaceholder('What needs to be done?').fill('Screenshot test');
        yield page.getByPlaceholder('What needs to be done?').press('Enter');
        // Take a screenshot for reporting
        yield page.screenshot({
            path: 'test-results/mcp-integration-example.png',
            fullPage: true
        });
        // Verify the todo exists
        yield (0, test_1.expect)(page.getByTestId('todo-item')).toContainText('Screenshot test');
    }));
    test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Generate a test report (example)
        const mockResults = [
            { name: 'Example 1', status: 'passed', duration: 1500 },
            { name: 'Example 2', status: 'passed', duration: 1200 },
            { name: 'Example 3', status: 'passed', duration: 800 }
        ];
        try {
            const reportPath = yield dataManager.generateTestReport(mockResults);
            console.log(`Test report generated: ${reportPath}`);
        }
        catch (error) {
            console.log('Could not generate test report:', error instanceof Error ? error.message : String(error));
        }
    }));
});
