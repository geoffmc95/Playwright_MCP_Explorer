"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const test_data_manager_1 = require("../../src/test-data-manager");
// Example test demonstrating MCP-Playwright integration
test_1.test.describe('MCP-Playwright Integration Examples', () => {
    let dataManager;
    test_1.test.beforeAll(async () => {
        dataManager = new test_data_manager_1.TestDataManager();
        await dataManager.loadFixtures();
    });
    (0, test_1.test)('Example 1: Using test data fixtures', async ({ page }) => {
        // Get test data from fixtures
        const user = await dataManager.getUser('testUser');
        const formData = await dataManager.getFormData('contactForm');
        // Navigate to a demo form (using a real demo site)
        await page.goto('https://demo.playwright.dev/todomvc');
        // Example of using fixture data in test
        const todoInput = page.getByPlaceholder('What needs to be done?');
        await todoInput.fill(formData.message);
        await todoInput.press('Enter');
        // Verify the todo was added
        await (0, test_1.expect)(page.getByTestId('todo-item')).toContainText(formData.message);
    });
    (0, test_1.test)('Example 2: Dynamic selector usage', async ({ page }) => {
        // Get selectors from fixtures
        const submitSelector = await dataManager.getSelector('forms', 'submitButton');
        await page.goto('https://demo.playwright.dev/todomvc');
        // Add a todo item
        await page.getByPlaceholder('What needs to be done?').fill('Test dynamic selectors');
        await page.getByPlaceholder('What needs to be done?').press('Enter');
        // Verify todo count
        await (0, test_1.expect)(page.getByTestId('todo-count')).toContainText('1');
    });
    (0, test_1.test)('Example 3: Environment-based testing', async ({ page }) => {
        // This would typically use different URLs based on environment
        const baseUrl = await dataManager.getEnvironmentUrl('development');
        // For demo purposes, we'll use the Playwright demo site
        await page.goto('https://demo.playwright.dev/todomvc');
        // Example of environment-specific testing
        await (0, test_1.expect)(page).toHaveTitle(/TodoMVC/);
    });
    (0, test_1.test)('Example 4: Random test data generation', async ({ page }) => {
        // Get random test data
        const randomEmail = await dataManager.getRandomTestData('validEmails');
        const strongPassword = await dataManager.getRandomTestData('passwords', 'strong');
        await page.goto('https://demo.playwright.dev/todomvc');
        // Use random data in test (simulating a registration form)
        const todoText = `Register user: ${randomEmail}`;
        await page.getByPlaceholder('What needs to be done?').fill(todoText);
        await page.getByPlaceholder('What needs to be done?').press('Enter');
        await (0, test_1.expect)(page.getByTestId('todo-item')).toContainText(randomEmail);
    });
    (0, test_1.test)('Example 5: Test data variants', async ({ page }) => {
        // Create a variant of base user data
        const baseUser = await dataManager.getUser('testUser');
        const userVariant = await dataManager.createTestDataVariant(baseUser, {
            name: 'Modified Test User',
            email: 'modified@example.com'
        });
        await page.goto('https://demo.playwright.dev/todomvc');
        // Use the variant data
        const todoText = `User: ${userVariant.name} (${userVariant.email})`;
        await page.getByPlaceholder('What needs to be done?').fill(todoText);
        await page.getByPlaceholder('What needs to be done?').press('Enter');
        await (0, test_1.expect)(page.getByTestId('todo-item')).toContainText(userVariant.name);
    });
    (0, test_1.test)('Example 6: Multi-step scenario simulation', async ({ page }) => {
        // Simulate a complex user journey
        const scenarios = await dataManager.loadScenarios();
        await page.goto('https://demo.playwright.dev/todomvc');
        // Add multiple todos (simulating scenario steps)
        const todos = ['Plan test automation', 'Implement MCP integration', 'Run automated tests'];
        for (const todo of todos) {
            await page.getByPlaceholder('What needs to be done?').fill(todo);
            await page.getByPlaceholder('What needs to be done?').press('Enter');
        }
        // Verify all todos were added
        await (0, test_1.expect)(page.getByTestId('todo-item')).toHaveCount(3);
        // Complete first todo
        await page.getByTestId('todo-item').first().getByRole('checkbox').check();
        // Verify completion
        await (0, test_1.expect)(page.getByTestId('todo-item').first()).toHaveClass(/completed/);
    });
    (0, test_1.test)('Example 7: Screenshot and reporting', async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc');
        // Add some test data
        await page.getByPlaceholder('What needs to be done?').fill('Screenshot test');
        await page.getByPlaceholder('What needs to be done?').press('Enter');
        // Take a screenshot for reporting
        await page.screenshot({
            path: 'test-results/mcp-integration-example.png',
            fullPage: true
        });
        // Verify the todo exists
        await (0, test_1.expect)(page.getByTestId('todo-item')).toContainText('Screenshot test');
    });
    test_1.test.afterAll(async () => {
        // Generate a test report (example)
        const mockResults = [
            { name: 'Example 1', status: 'passed', duration: 1500 },
            { name: 'Example 2', status: 'passed', duration: 1200 },
            { name: 'Example 3', status: 'passed', duration: 800 }
        ];
        try {
            const reportPath = await dataManager.generateTestReport(mockResults);
            console.log(`Test report generated: ${reportPath}`);
        }
        catch (error) {
            console.log('Could not generate test report:', error instanceof Error ? error.message : String(error));
        }
    });
});
//# sourceMappingURL=mcp-integration.spec.js.map