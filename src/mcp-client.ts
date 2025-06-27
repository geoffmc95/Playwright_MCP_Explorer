import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { VerifyStatementParser, VerifyStatement } from './verify-parser.js';
import { PromptLoader } from './prompt-loader.js';

export interface MCPConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  url: string;
  steps?: TestStep[];
  verifyStatements?: string[];
}

export interface TestStep {
  action: 'navigate' | 'click' | 'fill' | 'verify' | 'wait' | 'screenshot';
  target: string;
  value?: string;
  expected?: string;
  timeout?: number;
}

export class MCPPlaywrightClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private verifyParser = new VerifyStatementParser();
  private promptLoader = new PromptLoader();

  constructor(private config: MCPConfig) {}

  async connect(): Promise<void> {
    try {
      // Create transport and client
      this.transport = new StdioClientTransport({
        command: this.config.command,
        args: this.config.args
      });

      this.client = new Client({
        name: 'playwright-test-client',
        version: '1.0.0'
      }, {
        capabilities: {}
      });

      await this.client.connect(this.transport);
      console.log('Connected to MCP server');
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
    if (this.transport) {
      await this.transport.close();
      this.transport = null;
    }
  }

  async exploreWebsite(url: string): Promise<any> {
    if (!this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      const result = await this.client.callTool({
        name: 'playwright_navigate',
        arguments: { url }
      });

      return result;
    } catch (error) {
      console.error('Failed to explore website:', error);
      throw error;
    }
  }

  async generateTestFromScenario(scenario: TestScenario): Promise<string> {
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

      return result.content as string;
    } catch (error) {
      console.error('Failed to generate test:', error);
      throw error;
    }
  }

  async capturePageInfo(url: string): Promise<any> {
    if (!this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      const result = await this.client.callTool({
        name: 'playwright_capture_page_info',
        arguments: { url }
      });

      return result;
    } catch (error) {
      console.error('Failed to capture page info:', error);
      throw error;
    }
  }

  async exploreWebsiteForVerification(url: string, verifyStatements: string[]): Promise<any> {
    if (!this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      // Analyze each verify statement
      const explorationResults = [];

      for (const statement of verifyStatements) {
        const result = await this.analyzeVerifyStatement(url, statement);
        explorationResults.push(result);
      }

      return {
        url,
        verificationAnalysis: explorationResults
      };
    } catch (error) {
      console.error('Failed to explore website for verification:', error);
      throw error;
    }
  }

  private async analyzeVerifyStatement(url: string, statement: string): Promise<any> {
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

  async exploreWebsiteWithPrompt(url: string, testName: string): Promise<any> {
    if (!this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      // Load the exploration prompt
      const prompt = await this.promptLoader.loadPrompt('explore_and_generate');

      // Process the prompt template with variables
      const processedPrompt = this.promptLoader.processPromptTemplate(prompt.content, {
        URL: url,
        TestSuiteName: testName
      });

      // Use MCP to analyze the website with the prompt
      const result = await this.client.callTool({
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
    } catch (error) {
      console.error('Failed to explore website with prompt:', error);
      throw error;
    }
  }

  async generateFromScenariosWithPrompt(scenarios: TestScenario[]): Promise<any> {
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
    } catch (error) {
      console.error('Failed to generate from scenarios with prompt:', error);
      throw error;
    }
  }
}
