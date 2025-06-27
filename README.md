# Playwright_MCP_Explorer
Intelligent Playwright test generation tool using MCP that both autonomously explores websites and generates tests, as well as generates specific scenarios based on the user's verify statements.


MCP-Playwright is a revolutionary automated testing framework that combines the power of Model Context Protocol (MCP) with Playwright to generate comprehensive test suites using natural language descriptions and autonomous website exploration.

** Key Features**
-AI-Powered Test Generation - Convert natural language statements into robust Playwright tests
-Autonomous Website Exploration - Automatically discover and test website functionality Natural Language Scenarios - Write tests using simple verify statements
-Smart Selector Generation - Automatically generates resilient, maintainable selectors
-Cross-Browser Testing - Run tests across Chromium, Firefox, and WebKit

**1. Natural Language Test Generation**
Write simple verify statements and let AI generate comprehensive tests:

**2. Autonomous Website Exploration**
Let the system explore websites and generate tests automatically:
 
**Prerequisites**
Node.js 18+
npm or yarn
Git

**Installation**
# Clone the repository
git clone https://github.com/yourusername/mcp-playwright-suite.git
cd mcp-playwright-suite

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Build the project
npm run build

**Generate Your First Test**

# Generate tests from natural language scenarios
npm run mcp:generate scenarios

# Explore a website and generate tests automatically
npm run mcp:generate explore https://playwright.dev "Playwright Website Test"

# Run the generated tests
npm test

**Usage Examples**
Natural Language Test Generation
**1. Edit scenarios in  test-data/scenarios.json:**
{
  "scenarios": [
    {
      "id": "login-flow",
      "name": "User Login Flow",
      "url": "https://myapp.com/login",
      "verifyStatements": [
        "Verify email field exists",
        "Verify password field exists", 
        "Verify login button is present",
        "Verify form validation shows error for invalid email"
      ]
    }
  ]
}

**2. Generate tests:**
npm run mcp:generate scenarios

**3. Run tests:**
npm test tests/generated/login-flow.spec.ts

**Website Exploration**
# Explore any website
npm run mcp:generate explore https://github.com "GitHub Homepage Test"

# Interactive mode for multiple operations
npm run mcp:generate interactive


**AI-Powered Features**
**Smart Natural Language Processing**
The system understands various types of verify statements:

Presence checks: "is present", "exists", "is visible"
Text content: "contains", "displays", "shows"
State checks: "disabled", "enabled", "checked"
Validation: "shows error", "validation"

**Intelligent Selector Generation**
Automatically maps natural language to robust selectors:

"header" → header, h1, h2, h3, h4, h5, h6
"navigation menu" → nav, .nav, .navigation, .menu
"submit button" → button[type="submit"], input[type="submit"]
"email field" → input[type="email"], input[name*="email"]

**Test Quality Features**
-Resilient Selectors - Prioritizes data-testid, aria-label, and semantic selectors
-Wait Conditions - Automatic handling of dynamic content loading
-Error Handling - Screenshot capture on test failures
-Cross-Browser - Tests run on Chromium, Firefox, and WebKit
-Parallel Execution - Fast test execution with worker processes

**Configuration**
**MCP Server Configuration ( mcp-config.json)**
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./tests", "./test-data"]
    }
  },
  "testGeneration": {
    "outputDir": "./tests/generated",

**Playwright Configuration**
Fully configurable through  playwright.config.ts with sensible defaults for:

Multi-browser testing
Parallel execution
HTML reporting
Screenshot and video capture

**Available Commands**
# Test Generation
npm run mcp:generate scenarios              # Generate from scenarios file
npm run mcp:generate explore <url> <name>  # Explore website and generate
npm run mcp:generate interactive           # Interactive mode

# Test Execution  
npm test                                    # Run all tests
npm run test:headed                         # Run with visible browser
npm run test:debug                          # Debug mode
npm run test:ui                            # Playwright UI mode

**Example Generated Test**
From the verify statement "Verify header is present and contains 'Welcome'":

import { test, expect } from '@playwright/test';

test.describe('Homepage Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.com');
    await page.waitForLoadState('networkidle');
  });

  test('Verify header is present and contains \'Welcome\'', async ({ page }) => {
    // Navigate to the target URL

**Contributing**
I welcome contributions! Please see our Contributing Guide for details.

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request
   
**License**
This project is licensed under the MIT License - see the LICENSE file for details.

**Acknowledgments**
Playwright - For the excellent browser automation framework
Model Context Protocol - For enabling AI-powered automation
TypeScript - For type safety and developer experience
