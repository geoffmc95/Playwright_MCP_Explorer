"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const mcp_client_1 = require("../src/mcp-client");
const test_generator_1 = require("../src/test-generator");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
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
(0, test_1.test)('MCP test generation', async ({ page }) => {
    // Create output directory
    await fs.mkdir(TEST_CONFIG.generator.outputDir, { recursive: true });
    // Initialize MCP client and test generator
    const mcpClient = new mcp_client_1.MCPPlaywrightClient(TEST_CONFIG.mcpServer);
    const testGenerator = new test_generator_1.PlaywrightTestGenerator(mcpClient, TEST_CONFIG.generator);
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
        (0, test_1.expect)(testContent).toContain('import { test, expect }');
        (0, test_1.expect)(testContent).toContain(testUrl);
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
        }
        catch (runError) {
            console.log('Could not run the generated test:', runError instanceof Error ? runError.message : String(runError));
        }
    }
    finally {
        // Disconnect from MCP server
        await mcpClient.disconnect();
        console.log('Disconnected from MCP server');
    }
});
//# sourceMappingURL=mcp-test-generation.spec.js.map