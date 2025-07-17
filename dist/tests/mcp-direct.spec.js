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
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
// Test configuration
const TEST_CONFIG = {
    mcpServer: {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-filesystem', './tests', './test-data'],
        env: {}
    },
    outputDir: './test-output/mcp-direct'
};
(0, test_1.test)('Direct MCP tool call', async ({ page }) => {
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
        await fs.writeFile(resultPath, JSON.stringify(result, null, 2));
        console.log(`Direct result saved to ${resultPath}`);
        // Verify the result
        (0, test_1.expect)(result).toBeDefined();
        // Take a screenshot with Playwright for comparison
        await page.goto(testUrl);
        await page.screenshot({
            path: path.join(TEST_CONFIG.outputDir, 'playwright-screenshot.png'),
            fullPage: true
        });
    }
    finally {
        // Disconnect from MCP server
        await mcpClient.disconnect();
        console.log('Disconnected from MCP server');
    }
});
//# sourceMappingURL=mcp-direct.spec.js.map