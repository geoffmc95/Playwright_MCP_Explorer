"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPPlaywrightClient = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
const verify_parser_js_1 = require("./verify-parser.js");
const prompt_loader_js_1 = require("./prompt-loader.js");
class MCPPlaywrightClient {
    constructor(config) {
        this.config = config;
        this.client = null;
        this.transport = null;
        this.verifyParser = new verify_parser_js_1.VerifyStatementParser();
        this.promptLoader = new prompt_loader_js_1.PromptLoader();
    }
    async connect() {
        try {
            // Create transport and client
            this.transport = new stdio_js_1.StdioClientTransport({
                command: this.config.command,
                args: this.config.args
            });
            this.client = new index_js_1.Client({
                name: 'playwright-test-client',
                version: '1.0.0'
            }, {
                capabilities: {}
            });
            await this.client.connect(this.transport);
            console.log('Connected to MCP server');
        }
        catch (error) {
            console.error('Failed to connect to MCP server:', error);
            throw error;
        }
    }
    async disconnect() {
        if (this.client) {
            await this.client.close();
            this.client = null;
        }
        if (this.transport) {
            await this.transport.close();
            this.transport = null;
        }
    }
    async exploreWebsite(url) {
        if (!this.client) {
            throw new Error('MCP client not connected');
        }
        try {
            // Use the correct tool name - 'playwright' instead of 'playwright_navigate'
            const result = await this.client.callTool({
                name: 'playwright',
                arguments: {
                    action: 'navigate',
                    url: url,
                    options: {
                        headless: true,
                        timeout: 30000,
                        waitForSelector: 'body',
                        captureScreenshot: true,
                        captureHtml: true
                    }
                }
            });
            return result;
        }
        catch (error) {
            console.error('Failed to explore website:', error);
            throw error;
        }
    }
    async generateTestFromScenario(scenario) {
        if (!this.client) {
            throw new Error('MCP client not connected');
        }
        try {
            // Use MCP to analyze the scenario and generate test code
            const result = await this.client.callTool({
                name: 'generate_playwright_test',
                arguments: {
                    scenario: scenario,
                    template: 'basic-test'
                }
            });
            return result.content;
        }
        catch (error) {
            console.error('Failed to generate test:', error);
            throw error;
        }
    }
    async capturePageInfo(url) {
        try {
            // Check if client is null
            if (!this.client) {
                throw new Error('MCP client not connected');
            }
            console.log(`Capturing page info for ${url}...`);
            // Use Playwright to capture basic page information
            const result = await this.client.callTool({
                name: 'playwright',
                arguments: {
                    action: 'capture_info',
                    url: url,
                    options: {
                        headless: true,
                        timeout: 30000,
                        waitForSelector: 'body'
                    }
                }
            });
            console.log(`Page info captured.`);
            return result;
        }
        catch (error) {
            console.error('Failed to capture page info:', error);
            throw error;
        }
    }
    async exploreWebsiteForVerification(url, verifyStatements) {
        try {
            // Check if client is null
            if (!this.client) {
                throw new Error('MCP client not connected');
            }
            console.log(`Starting verification exploration of ${url} with ${verifyStatements.length} statements...`);
            // Use Playwright to explore the website with verification statements
            const result = await this.client.callTool({
                name: 'playwright',
                arguments: {
                    action: 'verify_explore',
                    url: url,
                    statements: verifyStatements,
                    options: {
                        headless: true,
                        timeout: 60000,
                        waitForSelector: 'body',
                        captureScreenshot: true,
                        captureHtml: true
                    }
                }
            });
            console.log(`Verification exploration completed.`);
            return result;
        }
        catch (error) {
            console.error('Failed to explore website with verification statements:', error);
            throw error;
        }
    }
    async analyzeVerifyStatement(url, statement) {
        // Parse the verify statement using our parser
        const parsed = this.verifyParser.parseVerifyStatement(statement);
        // Generate test actions based on the parsed statement
        const testActions = this.verifyParser.generateTestActions(parsed);
        return {
            statement,
            parsed,
            testActions,
            suggestedSelectors: parsed.selectors || [parsed.element || 'body']
        };
    }
    async exploreWebsiteWithPrompt(url, testName) {
        if (!this.client) {
            throw new Error('MCP client not connected');
        }
        try {
            // Load the exploration prompt
            const prompt = await this.promptLoader.loadPrompt('explore_and_generate');
            // Process the prompt template with the URL and test name
            const processedPrompt = this.promptLoader.processPromptTemplate(prompt.content, {
                URL: url,
                TestSuiteName: testName
            });
            console.log(`Starting exploration of ${url} with prompt...`);
            // First, use Playwright to actually explore the website
            const result = await this.client.callTool({
                name: 'playwright',
                arguments: {
                    action: 'explore',
                    url: url,
                    prompt: processedPrompt,
                    options: {
                        headless: true,
                        timeout: 60000,
                        waitForSelector: 'body',
                        captureScreenshot: true,
                        captureHtml: true
                    }
                }
            });
            console.log(`Exploration completed. Generating tests based on exploration results...`);
            // No need to check again since we already checked above
            const testGenerationResult = await this.client.callTool({
                name: 'generate_test',
                arguments: {
                    url: url,
                    testName: testName,
                    explorationResults: result,
                    prompt: processedPrompt
                }
            });
            return {
                url,
                testName,
                prompt: processedPrompt,
                explorationResult: result,
                testGenerationResult: testGenerationResult
            };
        }
        catch (error) {
            console.error('Failed to explore website with prompt:', error);
            throw error;
        }
    }
    async generateFromScenariosWithPrompt(scenarios) {
        if (!this.client) {
            throw new Error('MCP client not connected');
        }
        try {
            // Load the scenarios prompt
            const prompt = await this.promptLoader.loadPrompt('generate_from_scenarios');
            // Process scenarios and generate tests using the prompt
            const results = [];
            for (const scenario of scenarios) {
                const processedPrompt = this.promptLoader.processPromptTemplate(prompt.content, {
                    scenarioName: scenario.name,
                    url: scenario.url,
                    verifyStatements: JSON.stringify(scenario.verifyStatements || [])
                });
                results.push({
                    scenario,
                    prompt: processedPrompt
                });
            }
            return results;
        }
        catch (error) {
            console.error('Failed to generate from scenarios with prompt:', error);
            throw error;
        }
    }
}
exports.MCPPlaywrightClient = MCPPlaywrightClient;
//# sourceMappingURL=mcp-client.js.map