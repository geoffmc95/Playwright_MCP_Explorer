import { test, expect } from '@playwright/test';
import { MCPPlaywrightClient } from '../src/mcp-client';
import { PlaywrightTestGenerator } from '../src/test-generator';
import * as fs from 'fs/promises';
import * as path from 'path';

// Test configuration
const TEST_CONFIG = {
  mcpServer: {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', './tests', './test-data'],
    env: {}
  },
  generator: {
    outputDir: './test-output/generated-tests',
    templateDir: './test-templates',
    defaultTimeout: 30000
  }
};

test('MCP test generation', async ({ page }) => {
  // Create output directory
  await fs.mkdir(TEST_CONFIG.generator.outputDir, { recursive: true });
  
  // Initialize MCP client and test generator
  const mcpClient = new MCPPlaywrightClient(TEST_CONFIG.mcpServer);
  const testGenerator = new PlaywrightTestGenerator(mcpClient, TEST_CONFIG.generator);
  
  try {
    // Connect to MCP server
    await mcpClient.connect();
    console.log('Connected to MCP server');
    
    // Test URL and name
    const testUrl = 'https://playwright.dev/';
    const testName = 'Playwright Homepage Test';
    
    // Generate test from website exploration
    console.log(`Generating test for ${testUrl}`);
    const generatedTestPath = await testGenerator.generateFromWebsiteExploration(testUrl, testName);
    
    console.log(`Test generated at: ${generatedTestPath}`);
    
    // Read the generated test file
    const testContent = await fs.readFile(generatedTestPath, 'utf8');
    
    // Verify the test content
    expect(testContent).toContain('import { test, expect }');
    expect(testContent).toContain(testUrl);
    
    // Log test content for inspection
    console.log('Generated test content:');
    console.log(testContent);
    
    // Try to run the generated test if possible
    try {
      // This is experimental and may not work in all environments
      console.log('Attempting to run the generated test...');
      
      // Take a screenshot of the page for comparison
      await page.goto(testUrl);
      await page.screenshot({
        path: path.join(TEST_CONFIG.generator.outputDir, 'actual-page.png'),
        fullPage: true
      });
      
      console.log('Screenshot taken for comparison');
    } catch (runError) {
      console.log('Could not run the generated test:', runError instanceof Error ? runError.message : String(runError));
    }
    
  } finally {
    // Disconnect from MCP server
    await mcpClient.disconnect();
    console.log('Disconnected from MCP server');
  }
});