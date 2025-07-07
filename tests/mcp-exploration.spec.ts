 import { test, expect } from '@playwright/test';
import { MCPPlaywrightClient } from '../src/mcp-client';
import * as fs from 'fs/promises';
import * as path from 'path';

// Test configuration
const TEST_CONFIG = {
  mcpServer: {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', './tests', './test-data'],
    env: {}
  },
  outputDir: './test-output/mcp-exploration'
};

test('MCP web exploration test', async ({ page }) => {
  // Create output directory
  await fs.mkdir(TEST_CONFIG.outputDir, { recursive: true });
  
  // Initialize MCP client
  const mcpClient = new MCPPlaywrightClient(TEST_CONFIG.mcpServer);
  
  try {
    // Connect to MCP server
    await mcpClient.connect();
    console.log('Connected to MCP server');
    
    // Test URL to explore
    const testUrl = 'https://playwright.dev/';
    
    // Use the exploreWebsite method
    console.log(`Starting exploration of ${testUrl}`);
    const explorationResult = await mcpClient.exploreWebsite(testUrl);
    
    // Save the exploration result
    const resultPath = path.join(TEST_CONFIG.outputDir, 'exploration-result.json');
    await fs.writeFile(
      resultPath,
      JSON.stringify(explorationResult, null, 2)
    );
    
    console.log(`Exploration result saved to ${resultPath}`);
    
    // Verify the result has meaningful content
    expect(explorationResult).toBeDefined();
    expect(typeof explorationResult).toBe('object');
    
    // Log some key information from the result
    console.log('Exploration result summary:');
    if (explorationResult.title) {
      console.log(`Page title: ${explorationResult.title}`);
    }
    if (explorationResult.url) {
      console.log(`Final URL: ${explorationResult.url}`);
    }
    
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