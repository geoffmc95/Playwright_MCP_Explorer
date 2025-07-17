# TestSynth MCP Explorer

Generate intelligent Playwright tests by exploring websites or writing natural language scenarios.

## Quick Start

**Explore any website and generate tests:**
```bash
node scripts/generate-tests.js explore https://example.com "My Test"
```

**Generate tests from scenarios:**
```bash
node scripts/generate-tests.js scenarios
```

## How It Works

### 🔍 Website Exploration
The MCP (Model Context Protocol) actually visits your website, analyzes the page structure, and creates specific tests based on what it finds - not generic templates.

**Example:** Exploring `https://playwright.dev` generates tests for:
- Specific headings: "Playwright enables reliable end-to-end testing"
- Real buttons: "Get started", "Search"
- Actual links: "TypeScript", "JavaScript", "Python"

### 📝 Scenario-Based Testing
Write what you want to test in plain English, and get working Playwright code.

**Create scenarios in `test-data/scenarios.json`:**
```json
{
  "scenarios": [
    {
      "id": "login-flow",
      "name": "User Login Flow",
      "url": "https://myapp.com/login",
      "verifyStatements": [
        "Verify login form is visible",
        "Verify email field accepts input",
        "Verify password field is secure",
        "Verify submit button becomes enabled"
      ]
    }
  ]
}
```

## Commands

### Explore Websites
```bash
# Basic exploration
node scripts/generate-tests.js explore https://playwright.dev "Homepage Test"

# Complex sites work too
node scripts/generate-tests.js explore https://github.com "GitHub Test"
```

### Generate from Scenarios
```bash
# Uses test-data/scenarios.json
node scripts/generate-tests.js scenarios
```

### Run Generated Tests
```bash
# Run all generated tests
npx playwright test tests/generated/

# Run specific test
npx playwright test tests/generated/homepage-test.spec.ts

# Debug mode (browser visible)
npx playwright test tests/generated/homepage-test.spec.ts --headed
```

## What Makes This Different

Unlike other test generators that create generic templates, this system:

✅ **Actually visits your website** using a real browser
✅ **Finds specific elements** like buttons, forms, and text content
✅ **Generates meaningful assertions** based on what's actually there
✅ **Creates working tests** that you can run immediately

## Example Output

When you explore `https://example.com`, you get tests like:

```typescript
test('Page headings are present and contain expected text', async ({ page }) => {
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).toContainText('Example Domain');
});

test('Links are present and accessible', async ({ page }) => {
  await expect(page.locator('a:has-text("More information...")')).toBeVisible();
  await expect(page.locator('a:has-text("More information...")')).toContainText('More information...');
});
```

## Writing Good Verify Statements

**Be specific:**
- ✅ `"Verify login button exists"`
- ❌ `"Verify button exists"`

**Include expected content:**
- ✅ `"Verify header contains 'Welcome'"`
- ❌ `"Verify header is present"`

**Use clear element names:**
- ✅ `"Verify email field accepts input"`
- ❌ `"Verify input works"`

## Project Structure

```
├── src/                    # TypeScript source
│   ├── mcp-client.ts      # MCP integration
│   ├── test-generator.ts  # Test creation logic
│   └── verify-parser.ts   # Natural language parsing
├── tests/generated/       # Your generated tests
├── test-data/            # Scenario configurations
├── scripts/              # Generation scripts
└── mcp-config.json      # MCP server setup
```

## Troubleshooting

**First time setup:**
```bash
npm install
npm run build
npx playwright install
```

**Clean slate:**
```bash
# Remove all generated tests
Remove-Item tests/generated/*.spec.ts -Force
```

**MCP not working?**
The system uses `@playwright/mcp` to actually browse websites. Make sure it's installed:
```bash
npm install @playwright/mcp@latest
```
