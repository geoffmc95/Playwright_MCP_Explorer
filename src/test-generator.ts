import * as fs from 'fs/promises';
import * as path from 'path';
import { MCPPlaywrightClient, TestScenario, TestStep } from './mcp-client.js';
import { VerifyStatementParser, VerifyStatement } from './verify-parser.js';

export interface GeneratorConfig {
  outputDir: string;
  templateDir: string;
  defaultTimeout: number;
}

export class PlaywrightTestGenerator {
  private verifyParser = new VerifyStatementParser();

  constructor(
    private mcpClient: MCPPlaywrightClient,
    private config: GeneratorConfig
  ) {}

  async generateTestFromScenario(scenario: TestScenario): Promise<string> {
    try {
      // Load the test template
      const templatePath = path.join(this.config.templateDir, 'basic-test.template.ts');
      const template = await fs.readFile(templatePath, 'utf-8');

      // Generate test steps code
      const testStepsCode = this.generateTestStepsCode(scenario.steps || []);
      const assertionsCode = this.generateAssertionsCode(scenario.steps || []);

      // Replace template placeholders
      let testCode = template
        .replace('{{testSuiteName}}', scenario.name)
        .replace('{{testName}}', scenario.description)
        .replace('{{baseUrl}}', scenario.url)
        .replace('{{testSteps}}', testStepsCode)
        .replace('{{assertions}}', assertionsCode)
        .replace('{{beforeEachCode}}', '// Setup completed')
        .replace('{{afterEachCode}}', '// Cleanup completed');

      return testCode;
    } catch (error) {
      console.error('Failed to generate test from scenario:', error);
      throw error;
    }
  }

  async generateFromScenarioWithVerification(scenario: TestScenario): Promise<string> {
    if (scenario.verifyStatements && scenario.verifyStatements.length > 0) {
      // Use MCP to explore the website and generate comprehensive tests
      const explorationResults = await this.mcpClient.exploreWebsiteForVerification(
        scenario.url,
        scenario.verifyStatements
      );

      const testContent = this.buildTestFromVerificationExploration(scenario, explorationResults);
      const filename = `${scenario.id}.spec.ts`;
      const filepath = path.join(this.config.outputDir, filename);

      await fs.writeFile(filepath, testContent, 'utf-8');
      return filepath;
    } else {
      // Fall back to traditional step-based generation
      const testContent = await this.generateTestFromScenario(scenario);
      const filename = `${scenario.id}.spec.ts`;
      const filepath = path.join(this.config.outputDir, filename);

      await fs.writeFile(filepath, testContent, 'utf-8');
      return filepath;
    }
  }

  async generateFromWebsiteExploration(url: string, testName: string): Promise<string> {
    try {
      // Use MCP to explore the website with enhanced prompts
      const explorationResult = await this.mcpClient.exploreWebsiteWithPrompt(url, testName);

      // Generate test based on exploration
      const testContent = this.buildTestFromExploration(url, testName, explorationResult);
      const filename = `${this.sanitizeFilename(testName)}.spec.ts`;
      const filepath = path.join(this.config.outputDir, filename);

      await fs.writeFile(filepath, testContent, 'utf-8');
      return filepath;
    } catch (error) {
      console.error('Failed to generate test from website exploration:', error);
      throw error;
    }
  }

  private generateTestStepsCode(steps: TestStep[]): string {
    return steps.map(step => {
      switch (step.action) {
        case 'navigate':
          return `    await page.goto('${step.target}');`;
        
        case 'click':
          return `    await page.locator('${step.target}').click();`;
        
        case 'fill':
          return `    await page.locator('${step.target}').fill('${step.value}');`;
        
        case 'wait':
          const timeout = step.timeout || this.config.defaultTimeout;
          return `    await page.waitForTimeout(${timeout});`;
        
        case 'screenshot':
          return `    await page.screenshot({ path: 'screenshots/${step.target}' });`;
        
        default:
          return `    // Unknown action: ${step.action}`;
      }
    }).join('\n');
  }

  private generateAssertionsCode(steps: TestStep[]): string {
    const verifySteps = steps.filter(step => step.action === 'verify');
    
    if (verifySteps.length === 0) {
      return '    // No additional assertions';
    }

    return verifySteps.map(step => {
      if (step.expected) {
        return `    await expect(page.locator('${step.target}')).toContainText('${step.expected}');`;
      } else {
        return `    await expect(page.locator('${step.target}')).toBeVisible();`;
      }
    }).join('\n');
  }

  async saveGeneratedTest(testCode: string, filename: string): Promise<string> {
    try {
      // Ensure output directory exists
      await fs.mkdir(this.config.outputDir, { recursive: true });

      // Generate full file path
      const filePath = path.join(this.config.outputDir, filename);

      // Write the test file
      await fs.writeFile(filePath, testCode, 'utf-8');

      console.log(`Generated test saved to: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error('Failed to save generated test:', error);
      throw error;
    }
  }

  async generateTestsFromScenariosFile(scenariosPath: string): Promise<string[]> {
    try {
      // Read scenarios file
      const scenariosContent = await fs.readFile(scenariosPath, 'utf-8');
      const scenariosData = JSON.parse(scenariosContent);

      const generatedFiles: string[] = [];

      // Generate tests for each scenario
      for (const scenario of scenariosData.scenarios) {
        const testCode = await this.generateTestFromScenario(scenario);
        const filename = `${scenario.id}.spec.ts`;
        const filePath = await this.saveGeneratedTest(testCode, filename);
        generatedFiles.push(filePath);
      }

      return generatedFiles;
    } catch (error) {
      console.error('Failed to generate tests from scenarios file:', error);
      throw error;
    }
  }

  async exploreAndGenerateTest(url: string, testName: string): Promise<string> {
    try {
      // Use MCP client to explore the website
      const pageInfo = await this.mcpClient.capturePageInfo(url);

      // Create a basic scenario from the exploration
      const scenario: TestScenario = {
        id: testName.toLowerCase().replace(/\s+/g, '-'),
        name: testName,
        description: `Auto-generated test for ${url}`,
        url: url,
        steps: [
          { action: 'navigate', target: '/' },
          { action: 'screenshot', target: `${testName}-initial.png` },
          { action: 'verify', target: 'body', expected: '' }
        ]
      };

      // Generate and save the test
      const testCode = await this.generateTestFromScenario(scenario);
      const filename = `${scenario.id}.spec.ts`;
      return await this.saveGeneratedTest(testCode, filename);
    } catch (error) {
      console.error('Failed to explore and generate test:', error);
      throw error;
    }
  }

  private buildTestFromVerificationExploration(scenario: TestScenario, explorationResults: any): string {
    const verificationTests = scenario.verifyStatements!.map((statement, index) => {
      const analysis = explorationResults.verificationAnalysis[index];
      const testActions = analysis.testActions || [];

      // Escape quotes in the statement for the test name
      const escapedStatement = statement.replace(/'/g, "\\'");

      return `
  test('${escapedStatement}', async ({ page }) => {
    // Navigate to the target URL
    await page.goto('${scenario.url}');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    ${testActions.join('\n    ')}
  });`;
    }).join('\n');

    return `import { test, expect } from '@playwright/test';

test.describe('${scenario.name}', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code here
    await page.goto('${scenario.url}');
    await page.waitForLoadState('networkidle');
  });

${verificationTests}

  test.afterEach(async ({ page }) => {
    // Cleanup code here
    // Take screenshot on failure
    if (test.info().status !== test.info().expectedStatus) {
      await page.screenshot({
        path: \`screenshots/\${test.info().title.replace(/[^a-z0-9]/gi, '-')}-failure.png\`,
        fullPage: true
      });
    }
  });
});
`;
  }

  private buildTestFromExploration(url: string, testName: string, explorationResult: any): string {
    return `import { test, expect } from '@playwright/test';

test.describe('${testName} - Exploration Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('${url}');
    await page.waitForLoadState('networkidle');
  });

  test('Page loads successfully with key elements', async ({ page }) => {
    // Verify page loads and basic elements are present
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator('body')).toBeVisible();

    // Take initial screenshot
    await page.screenshot({
      path: 'screenshots/${this.sanitizeFilename(testName)}-initial.png',
      fullPage: true
    });
  });

  test('Navigation and interactive elements work', async ({ page }) => {
    // Test navigation elements if present
    const nav = page.locator('nav, .nav, .navigation');
    if (await nav.count() > 0) {
      await expect(nav).toBeVisible();
    }

    // Test buttons if present
    const buttons = page.locator('button, input[type="button"], input[type="submit"]');
    const buttonCount = await buttons.count();
    if (buttonCount > 0) {
      console.log(\`Found \${buttonCount} interactive buttons\`);
    }

    // Test forms if present
    const forms = page.locator('form');
    const formCount = await forms.count();
    if (formCount > 0) {
      console.log(\`Found \${formCount} forms\`);
    }
  });

  test.afterEach(async ({ page }) => {
    // Capture screenshot on failure
    if (test.info().status !== test.info().expectedStatus) {
      await page.screenshot({
        path: \`screenshots/\${test.info().title.replace(/[^a-z0-9]/gi, '-')}-failure.png\`,
        fullPage: true
      });
    }
  });
});
`;
  }

  private sanitizeFilename(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
