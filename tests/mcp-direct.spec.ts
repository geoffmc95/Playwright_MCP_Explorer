import { test, expect } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';

// Test configuration
const TEST_CONFIG = {
  mcpServer: {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', './tests', './test-data'],
    env: {}
  },
  outputDir: './test-output/mcp-direct'
};

test('Direct MCP tool call', async ({ page }) => {
  // Create output directory
  await fs.mkdir(TEST_CONFIG.outputDir, { recursive: true });
  
  // Import the MCP client dynamically to ensure we get the latest version
  const { MCPPlaywrightClient } = require('../dist/src/mcp-client');
  
  // Initialize MCP client
  const mcpClient = new MCPPlaywrightClient(TEST_CONFIG.mcpServer);
  
  try {
    // Connect to MCP server
    await mcpClient.connect();
    console.log('Connected to MCP server');
    
    // Test URL to explore
    const testUrl = 'https://playwright.dev/';
    
    // Get the raw client to make a direct tool call
    const rawClient = mcpClient.client;
    
    // Call the playwright tool directly with the correct parameters
    console.log(`Starting direct exploration of ${testUrl}`);
    const result = await rawClient.callTool({
      name: 'playwright',
      arguments: { 
        action: 'navigate',
        url: testUrl,
        options: {
          headless: true,
          timeout: 30000,
          waitForSelector: 'body',
          captureScreenshot: true,
          captureHtml: true
        }
      }
    });
    
    // Save the result
    const resultPath = path.join(TEST_CONFIG.outputDir, 'direct-result.json');
    await fs.writeFile(
      resultPath,
      JSON.stringify(result, null, 2)
    );
    
    console.log(`Direct result saved to ${resultPath}`);
    
    // Verify the result
    expect(result).toBeDefined();
    
    // Take a screenshot with Playwright for comparison
    await page.goto(testUrl);
    await page.screenshot({
      path: path.join(TEST_CONFIG.outputDir, 'playwright-screenshot.png'),
      fullPage: true
    });
    
  } finally {
    // Disconnect from MCP server
    await mcpClient.disconnect();
    console.log('Disconnected from MCP server');
  }
});