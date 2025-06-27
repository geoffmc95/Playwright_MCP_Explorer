"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield this.client.connect(this.transport);
                console.log('Connected to MCP server');
            }
            catch (error) {
                console.error('Failed to connect to MCP server:', error);
                throw error;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client) {
                yield this.client.close();
                this.client = null;
            }
            if (this.transport) {
                yield this.transport.close();
                this.transport = null;
            }
        });
    }
    exploreWebsite(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                throw new Error('MCP client not connected');
            }
            try {
                const result = yield this.client.callTool({
                    name: 'playwright_navigate',
                    arguments: { url }
                });
                return result;
            }
            catch (error) {
                console.error('Failed to explore website:', error);
                throw error;
            }
        });
    }
    generateTestFromScenario(scenario) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                throw new Error('MCP client not connected');
            }
            try {
                // Use MCP to analyze the scenario and generate test code
                const result = yield this.client.callTool({
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
        });
    }
    capturePageInfo(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                throw new Error('MCP client not connected');
            }
            try {
                const result = yield this.client.callTool({
                    name: 'playwright_capture_page_info',
                    arguments: { url }
                });
                return result;
            }
            catch (error) {
                console.error('Failed to capture page info:', error);
                throw error;
            }
        });
    }
    exploreWebsiteForVerification(url, verifyStatements) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                throw new Error('MCP client not connected');
            }
            try {
                // Analyze each verify statement
                const explorationResults = [];
                for (const statement of verifyStatements) {
                    const result = yield this.analyzeVerifyStatement(url, statement);
                    explorationResults.push(result);
                }
                return {
                    url,
                    verificationAnalysis: explorationResults
                };
            }
            catch (error) {
                console.error('Failed to explore website for verification:', error);
                throw error;
            }
        });
    }
    analyzeVerifyStatement(url, statement) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    exploreWebsiteWithPrompt(url, testName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                throw new Error('MCP client not connected');
            }
            try {
                // Load the exploration prompt
                const prompt = yield this.promptLoader.loadPrompt('explore_and_generate');
                // Process the prompt template with variables
                const processedPrompt = this.promptLoader.processPromptTemplate(prompt.content, {
                    URL: url,
                    TestSuiteName: testName
                });
                // Use MCP to analyze the website with the prompt
                const result = yield this.client.callTool({
                    name: 'write_file',
                    arguments: {
                        path: 'temp-exploration-prompt.md',
                        content: processedPrompt
                    }
                });
                return {
                    url,
                    testName,
                    prompt: processedPrompt,
                    explorationResult: result
                };
            }
            catch (error) {
                console.error('Failed to explore website with prompt:', error);
                throw error;
            }
        });
    }
    generateFromScenariosWithPrompt(scenarios) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                throw new Error('MCP client not connected');
            }
            try {
                // Load the scenarios prompt
                const prompt = yield this.promptLoader.loadPrompt('generate_from_scenarios');
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
        });
    }
}
exports.MCPPlaywrightClient = MCPPlaywrightClient;
