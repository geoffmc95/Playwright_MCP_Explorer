# MCP-Playwright Setup Guide

This guide will walk you through setting up your fully automated test suite using MCP server and Playwright.

## 🎯 What You'll Achieve

By following this guide, you'll have:
- ✅ A working MCP-Playwright integration
- ✅ Automated test generation from scenarios
- ✅ Website exploration and test creation
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Interactive test generation mode

## 📋 Prerequisites Check

Before starting, ensure you have:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check git
git --version
```

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies

```bash
# Install all dependencies and Playwright browsers
npm run setup
```

This command will:
- Install npm dependencies
- Install Playwright browsers with system dependencies
- Set up the project structure

### Step 2: Verify Installation

```bash
# Run the example tests to verify everything works
npm test
```

You should see tests running across multiple browsers.

### Step 3: Test MCP Integration

```bash
# Generate tests from scenarios
npm run mcp:generate scenarios
```

This will:
- Connect to the MCP server
- Read scenarios from `test-data/scenarios.json`
- Generate Playwright tests in `tests/generated/`

### Step 4: Run Generated Tests

```bash
# Run all tests including generated ones
npm test
```

### Step 5: Try Interactive Mode

```bash
# Start interactive test generation
npm run mcp:generate interactive
```

Try these commands in interactive mode:
```
mcp-playwright> help
mcp-playwright> scenarios
mcp-playwright> list
mcp-playwright> exit
```

## 🔧 Configuration

### Customize Test Scenarios

Edit `test-data/scenarios.json` to add your own test scenarios:

```json
{
  "scenarios": [
    {
      "id": "your-test",
      "name": "Your Custom Test",
      "description": "Description of what this test does",
      "url": "https://your-website.com",
      "steps": [
        { "action": "navigate", "target": "/" },
        { "action": "click", "target": ".your-button" },
        { "action": "verify", "target": ".result", "expected": "Success" }
      ]
    }
  ]
}
```

### Customize Test Data

Edit `test-data/fixtures.json` to add your test data:

```json
{
  "users": {
    "yourUser": {
      "name": "Your Test User",
      "email": "your-test@example.com"
    }
  },
  "selectors": {
    "yourApp": {
      "loginButton": ".login-btn",
      "usernameField": "#username"
    }
  }
}
```

### Update MCP Configuration

Edit `mcp-config.json` for your specific needs:

```json
{
  "testGeneration": {
    "outputDir": "./tests/generated",
    "defaultTimeout": 30000,
    "browsers": ["chromium", "firefox", "webkit"]
  }
}
```

## 🎮 Usage Examples

### Generate Tests for Your Website

```bash
# Explore your website and generate tests
npm run mcp:generate explore https://your-website.com "Your Website Test"
```

### Create Custom Scenarios

1. Add your scenario to `test-data/scenarios.json`
2. Generate tests: `npm run mcp:generate scenarios`
3. Run tests: `npm test`

### Use in CI/CD

The GitHub Actions workflow is already configured. It will:
- Run on every push/PR
- Generate tests daily at 2 AM UTC
- Support manual triggers with custom parameters

## 🔍 Troubleshooting

### Common Issues

**Issue: MCP server connection fails**
```bash
# Check if MCP package is properly installed
npm list mcp

# Reinstall if needed
npm install mcp@latest
```

**Issue: Playwright browsers not installed**
```bash
# Reinstall browsers
npx playwright install --with-deps
```

**Issue: Generated tests directory not found**
```bash
# Create the directory manually
mkdir -p tests/generated
```

**Issue: Permission errors on scripts**
```bash
# Make scripts executable (Linux/Mac)
chmod +x scripts/generate-tests.js
```

### Debug Mode

Run tests in debug mode to troubleshoot:

```bash
# Debug mode with visible browser
npm run test:debug

# Headed mode to see browser actions
npm run test:headed
```

### Verbose Logging

Enable verbose logging for MCP operations:

```bash
# Set debug environment variable
DEBUG=mcp:* npm run mcp:generate scenarios
```

## 🧪 Testing Your Setup

### Quick Verification Tests

1. **Basic Playwright Test**
   ```bash
   npm test tests/example.spec.ts
   ```

2. **MCP Integration Test**
   ```bash
   npm test tests/examples/mcp-integration.spec.ts
   ```

3. **Generated Test**
   ```bash
   npm run mcp:generate scenarios
   npm test tests/generated/
   ```

### Expected Results

After successful setup, you should see:
- ✅ All example tests passing
- ✅ Generated tests in `tests/generated/`
- ✅ Test reports in `playwright-report/`
- ✅ Screenshots in `test-results/` (if any tests fail)

## 🚀 Next Steps

Now that your setup is complete:

1. **Customize for Your Project**
   - Update scenarios for your application
   - Add your test data to fixtures
   - Configure selectors for your UI

2. **Integrate with Your Workflow**
   - Set up branch protection rules
   - Configure notifications
   - Add custom test environments

3. **Scale Your Testing**
   - Add more complex scenarios
   - Implement visual regression testing
   - Set up performance monitoring

4. **Monitor and Maintain**
   - Review test reports regularly
   - Update scenarios as your app changes
   - Keep dependencies updated

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🆘 Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Review the main README.md
3. Check existing GitHub issues
4. Create a new issue with:
   - Your operating system
   - Node.js version
   - Error messages
   - Steps to reproduce

---

**Congratulations! 🎉 Your MCP-Playwright automated test suite is ready!**
