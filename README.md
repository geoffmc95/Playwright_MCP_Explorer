# Playwright_MCP_Explorer #
Intelligent Playwright test generation tool using MCP that both autonomously explores websites and generates tests, as well as generates specific scenarios based on the user's verify statements.


MCP-Playwright is a revolutionary automated testing framework that combines the power of Model Context Protocol (MCP) with Playwright to generate comprehensive test suites using natural language descriptions and autonomous website exploration.

# Key Features #
-AI-Powered Test Generation: Convert natural language statements into robust Playwright tests<br/>
-Autonomous Website Exploration-Automatically discover and test website functionality Natural Language Scenarios<br/>
-Write tests using simple verify statements<br/>
-Smart Selector Generation-Automatically generates resilient, maintainable selectors<br/>
-Cross-Browser Testing-Run tests across Chromium, Firefox, and WebKit<br/>

**1. Natural Language Test Generation**
Write simple verify statements and let AI generate comprehensive tests:

**2. Autonomous Website Exploration**
Let the system explore websites and generate tests automatically:
 
**Prerequisites**
Node.js 18+
npm or yarn
Git

# Installation #
**1. Clone the repository**<br/>
```git clone https://github.com/yourusername/mcp-playwright-suite.git```<br/>
,```cd mcp-playwright-suite```

**2. Install dependencies**<br/>
```npm install```

**3. Install Playwright browsers**<br/>
```npx playwright install --with-deps```

**4. Build the project**<br/>
```npm run build```


# Usage Examples #
Natural Language Test Generation

**1. Edit scenarios in  test-data/scenarios.json:**
```{
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
```

**2. Generate tests:**<br/>
```npm run mcp:generate scenarios```

**3. Run tests:**<br/>
```npm test tests/generated/login-flow.spec.ts```

**4. Website Exploration**<br/>
```npm run mcp:generate explore https://github.com "GitHub Homepage Test"```

**5. Interactive mode for multiple operations**<br/>
```npm run mcp:generate interactive```


# AI-Powered Features #
**Smart Natural Language Processing**
The system understands various types of verify statements:<br/>

**Presence checks**: "is present", "exists", "is visible"<br/>
**Text content**: "contains", "displays", "shows"<br/>
**State checks**: "disabled", "enabled", "checked"<br/>
**Validation**: "shows error", "validation"<br/>

**Intelligent Selector Generation**
Automatically maps natural language to robust selectors:

```"header" → header, h1, h2, h3, h4, h5, h6```<br/>
```"navigation menu" → nav, .nav, .navigation, .menu```<br/>
```"submit button" → button[type="submit"], input[type="submit"]```<br/>
```"email field" → input[type="email"], input[name*="email"]```<br/>

**Test Quality Features**<br/>
-Resilient Selectors - Prioritizes data-testid, aria-label, and semantic selectors<br/>
-Wait Conditions - Automatic handling of dynamic content loading<br/>
-Error Handling - Screenshot capture on test failures<br/>
-Cross-Browser - Tests run on Chromium, Firefox, and WebKit<br/>
-Parallel Execution - Fast test execution with worker processes<br/>

**MCP Server Configuration ( mcp-config.json)**
```
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./tests", "./test-data"]
    }
  },
  "testGeneration": {
    "outputDir": "./tests/generated",
    "defaultTimeout": 30000,
    "browsers": ["chromium", "firefox", "webkit"]
  }
}
```

**Playwright Configuration**
Fully configurable through  playwright.config.ts with sensible defaults for:

-Multi-browser testing<br/>
-Parallel execution<br/>
-HTML reporting<br/>
-Screenshot and video capture<br/>

**Available Commands**
# Test Generation
```npm run mcp:generate scenarios```            # Generate from scenarios file<br/>
```npm run mcp:generate explore <url> <name>``` # Explore website and generate<br/>
```npm run mcp:generate interactive```          # Interactive mode<br/>

# Test Execution  
```npm test```                                   # Run all tests<br/>
```npm run test:headed```                        # Run with visible browser<br/>
```npm run test:debug```                         # Debug mode<br/>
```npm run test:ui```                            # Playwright UI mode

**Example Generated Test**
From the verify statement "Verify header is present and contains 'Welcome'":

```import { test, expect } from '@playwright/test';

test.describe('Homepage Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.com');
    await page.waitForLoadState('networkidle');
  });


  test('Verify header is present and contains \'Welcome\'', async ({ page }) => {
    // Navigate to the target URL
```

# Contributing <br/>
I welcome contributions! Please see our Contributing Guide for details.<br/>

1. Fork the repository<br/>
2. Create a feature branch (git checkout -b feature/amazing-feature)<br/>
3. Commit your changes (git commit -m 'Add amazing feature')<br/>
4. Push to the branch (git push origin feature/amazing-feature)<br/>
5. Open a Pull Request<br/>
   
# License 
This project is licensed under the MIT License - see the LICENSE file for details.

# Acknowledgments <br/>
-**Playwright** - For the excellent browser automation framework<br/>
-**Model Context Protocol** - For enabling AI-powered automation<br/>
-**TypeScript** - For type safety and developer experience<br/>
