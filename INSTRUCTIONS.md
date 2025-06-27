# MCP-Playwright Test Generation Instructions

## Overview

This project provides automated test generation using Model Context Protocol (MCP) and Playwright. You can generate tests in two ways:

1. **Specific test cases** using natural language verify statements
2. **Automatic exploration** of webpages to generate comprehensive tests

---

## Scenario 1: Generate Specific Test Cases Using Natural Language Verify Statements

### Quick Command

```bash
npm run mcp:generate scenarios
```

### Step-by-Step Process

1. **Edit your scenarios file** (`test-data/scenarios.json`):

```json
{
  "scenarios": [
    {
      "id": "my-custom-test",
      "name": "My Custom Test",
      "description": "Test specific functionality I want to verify",
      "url": "https://example.com",
      "verifyStatements": [
        "Verify header is present and contains 'Welcome'",
        "Verify login button exists",
        "Verify contact form is visible",
        "Verify footer contains copyright text"
      ]
    }
  ]
}
```

2. **Run the generation command**:

```bash
npm run mcp:generate scenarios
```

3. **Run your generated tests**:

```bash
npm test tests/generated/my-custom-test.spec.ts
```

### Natural Language Examples You Can Use:

- `"Verify header is present"`
- `"Verify navigation menu exists"`
- `"Verify main heading contains 'Welcome'"`
- `"Verify submit button is disabled"`
- `"Verify email field validation shows error for invalid email"`
- `"Verify search box is visible"`
- `"Verify footer is present"`

---

## Scenario 2: Explore Webpage and Auto-Generate Test Cases

### Quick Command

```bash
npm run mcp:generate explore <URL> "<Test Name>"
```

### Examples

**Explore a website and generate basic tests:**

```bash
npm run mcp:generate explore https://playwright.dev "Playwright Homepage Test"
```

**Explore an e-commerce site:**

```bash
npm run mcp:generate explore https://demo.playwright.dev/todomvc "Todo App Test"
```

**Explore a form-heavy site:**

```bash
npm run mcp:generate explore https://example.com/contact "Contact Form Test"
```

### What This Does:

1. **Connects to MCP server** to analyze the webpage
2. **Captures page structure** and identifies key elements
3. **Generates comprehensive test** with:
   - Basic navigation verification
   - Element visibility checks
   - Page title validation
   - Screenshot capture
   - Error handling

---

## Interactive Mode (Advanced)

For more control, use interactive mode:

```bash
npm run mcp:generate interactive
```

**Available commands in interactive mode:**

- `explore <url> [testName]` - Explore and generate tests
- `scenarios` - Generate from scenarios file
- `list` - Show generated test files
- `clean` - Remove generated test files
- `help` - Show help
- `exit` - Exit interactive mode

---

## Running Your Generated Tests

**Run all generated tests:**

```bash
npm test tests/generated/
```

**Run specific test:**

```bash
npm test tests/generated/your-test-name.spec.ts
```

**Run with browser visible:**

```bash
npm run test:headed tests/generated/your-test-name.spec.ts
```

**Debug mode:**

```bash
npm run test:debug tests/generated/your-test-name.spec.ts
```

---

## Tips for Best Results

### For Verify Statements:

- Be specific about elements: `"Verify login button exists"` vs `"Verify button exists"`
- Include expected text: `"Verify header contains 'Welcome'"`
- Use common web elements: header, navigation, form, button, link, etc.

### For Website Exploration:

- Use URLs with rich content for better test generation
- Public demo sites work well (like demo.playwright.dev)
- The system works best with standard web elements

### File Locations:

- **Generated tests**: `tests/generated/`
- **Screenshots**: `screenshots/`
- **Scenarios config**: `test-data/scenarios.json`

---

## Project Structure

```
├── .github/workflows/prompts/   # MCP prompt templates
│   ├── explore_and_generate.prompt.md     # Website exploration prompts
│   └── generate_from_scenarios.prompt.md  # Scenario generation prompts
├── src/                          # TypeScript source files
│   ├── mcp-client.ts            # MCP client integration
│   ├── test-generator.ts        # Test generation logic
│   ├── test-data-manager.ts     # Test data management
│   ├── verify-parser.ts         # Natural language parser
│   └── prompt-loader.ts         # Prompt template loader
├── tests/
│   ├── generated/               # Auto-generated test files
│   └── examples/                # Example test files
├── test-data/
│   ├── scenarios.json           # Test scenarios configuration
│   └── fixtures.json            # Test data fixtures
├── scripts/
│   └── generate-tests.js        # Main generation script
├── screenshots/                 # Test screenshots
└── mcp-config.json             # MCP server configuration
```

## Enhanced Features

### AI-Powered Prompt System

The system now includes sophisticated AI prompts that guide the MCP server to generate higher-quality tests:

- **Exploration Prompts**: Guide autonomous website exploration and comprehensive test generation
- **Scenario Prompts**: Convert natural language verify statements into robust test cases
- **Template Variables**: Dynamic prompt customization with URL, test names, and scenarios

---

## Troubleshooting

**Build the project first:**

```bash
npm run build
```

**Clean generated tests:**

```bash
Remove-Item tests/generated/*.spec.ts -Force  # Windows
rm tests/generated/*.spec.ts                  # Linux/Mac
```

**Check MCP server connection:**
The system uses `@modelcontextprotocol/server-filesystem` to analyze files and generate tests.

That's it! The system handles all the complex MCP integration, element detection, and Playwright test code generation automatically.
