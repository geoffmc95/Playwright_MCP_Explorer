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
        outputDir: './tests/verification',
        templateDir: './test-templates',
        defaultTimeout: 30000
    }
};
// Create a simplified test
(0, test_1.test)('Basic test', async ({ page }) => {
    // Create output directory if it doesn't exist
    await fs.mkdir(TEST_CONFIG.generator.outputDir, { recursive: true });
    // Initialize MCP client and test generator
    const mcpClient = new mcp_client_1.MCPPlaywrightClient(TEST_CONFIG.mcpServer);
    const testGenerator = new test_generator_1.PlaywrightTestGenerator(mcpClient, TEST_CONFIG.generator);
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
        (0, test_1.expect)(prompt).toBeDefined();
        (0, test_1.expect)(prompt.content).toContain('Explore and Generate Tests Prompt');
        // Process the prompt
        const processedPrompt = promptLoader.processPromptTemplate(prompt.content, {
            URL: testUrl,
            TestSuiteName: testName
        });
        // Verify URL was inserted correctly
        (0, test_1.expect)(processedPrompt).toContain(testUrl);
        (0, test_1.expect)(processedPrompt).toContain(testName);
        // Write processed prompt to file for inspection
        await fs.writeFile(path.join(TEST_CONFIG.generator.outputDir, 'processed-prompt.md'), processedPrompt);
        console.log('Processed prompt saved for inspection');
    }
    finally {
        // Disconnect from MCP server
        await mcpClient.disconnect();
    }
});
//# sourceMappingURL=mcp-exploration-verification.spec.js.map