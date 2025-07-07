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
    outputDir: './tests/verification',
    templateDir: './test-templates',
    defaultTimeout: 30000
  }
};

// Create a simplified test
test('Basic test', async ({ page }) => {
  // Create output directory if it doesn't exist
  await fs.mkdir(TEST_CONFIG.generator.outputDir, { recursive: true });
  
  // Initialize MCP client and test generator
  const mcpClient = new MCPPlaywrightClient(TEST_CONFIG.mcpServer);
  const testGenerator = new PlaywrightTestGenerator(mcpClient, TEST_CONFIG.generator);
  
  try {
    // Connect to MCP server
    await mcpClient.connect();
    
    // Test URL and name
    const testUrl = 'https://www.pavanonlinetrainings.com/p/udemy-courses.html';
    const testName = 'Prompt Verification Test';
    
    // Load the prompt directly
    const promptLoader = mcpClient.promptLoader;
    const prompt = await promptLoader.loadPrompt('explore_and_generate');
    
    // Verify prompt was loaded
    expect(prompt).toBeDefined();
    expect(prompt.content).toContain('Explore and Generate Tests Prompt');
    
    // Process the prompt
    const processedPrompt = promptLoader.processPromptTemplate(prompt.content, {
      URL: testUrl,
      TestSuiteName: testName
    });
    
    // Verify URL was inserted correctly
    expect(processedPrompt).toContain(testUrl);
    expect(processedPrompt).toContain(testName);
    
    // Write processed prompt to file for inspection
    await fs.writeFile(
      path.join(TEST_CONFIG.generator.outputDir, 'processed-prompt.md'),
      processedPrompt
    );
    
    console.log('Processed prompt saved for inspection');
  } finally {
    // Disconnect from MCP server
    await mcpClient.disconnect();
  }
});



