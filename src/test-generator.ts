import * as fs from 'fs/promises';
import * as path from 'path';
import { MCPPlaywrightClient } from './mcp-client';
import { TestScenario, TestStep, VerifyStatement } from './types';

export interface TestGeneratorConfig {
  outputDir: string;
  templateDir: string;
  defaultTimeout?: number;
}

export class PlaywrightTestGenerator {
  constructor(
    private mcpClient: MCPPlaywrightClient,
    private config: TestGeneratorConfig
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
    }
    
    // Fallback to regular scenario test generation
    const testContent = await this.generateTestFromScenario(scenario);
    const filename = `${scenario.id}.spec.ts`;
    const filepath = path.join(this.config.outputDir, filename);
    
    await fs.writeFile(filepath, testContent, 'utf-8');
    return filepath;
  }

  async generateFromWebsiteExploration(url: string, testName: string): Promise<string> {
    try {
      console.log(`Generating test from website exploration: ${url}`);
      
      // Use MCP client to explore the website with a prompt
      const explorationResult = await this.mcpClient.exploreWebsiteWithPrompt(url, testName);
      
      // Build test from exploration results
      const testContent = this.buildTestFromExploration(url, testName, explorationResult);
      
      // Save the test
      const filename = `${this.sanitizeFilename(testName)}.spec.ts`;
      return await this.saveGeneratedTest(testContent, filename);
    } catch (error) {
      console.error('Failed to generate test from website exploration:', error);
      throw error;
    }
  }

  // Generate code for test steps
  private generateTestStepsCode(steps: TestStep[]): string {
    let code = '';
    
    steps.forEach((step, index) => {
      switch (step.action) {
        case 'navigate':
          code += `    // Navigate to page\n`;
          code += `    await page.goto('${step.target}');\n`;
          code += `    await page.waitForLoadState('networkidle');\n\n`;
          break;
          
        case 'click':
          code += `    // Click element\n`;
          code += `    await page.locator('${step.target}').click();\n\n`;
          break;
          
        case 'fill':
          code += `    // Fill form field\n`;
          code += `    await page.locator('${step.target}').fill('${step.value || ''}');\n\n`;
          break;
          
        case 'screenshot':
          code += `    // Take screenshot\n`;
          code += `    await page.screenshot({ path: '${step.target}' });\n\n`;
          break;
          
        default:
          code += `    // Custom action: ${step.action}\n`;
          code += `    console.log('Executing custom action: ${step.action}');\n\n`;
      }
    });
    
    return code;
  }

  // Generate assertions code
  private generateAssertionsCode(steps: TestStep[]): string {
    let code = '';
    
    steps.forEach(step => {
      if (step.action === 'verify' && step.expected) {
        code += `    // Verify element\n`;
        code += `    await expect(page.locator('${step.target}')).toHaveText('${step.expected}');\n\n`;
      }
    });
    
    return code;
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
    const verificationTests = scenario.verifyStatements!.map((statement: string, index: number) => {
      return `
  test('Verification ${index + 1}: ${statement}', async ({ page }) => {
    await page.goto('${scenario.url}');
    await page.waitForLoadState('networkidle');
    
    // Verification logic based on exploration results
    ${this.generateVerificationCode(statement, explorationResults)}
  });`;
    }).join('\n');

    return `import { test, expect } from '@playwright/test';

test.describe('${scenario.name}', () => {
  test.beforeEach(async () => {
    // Common setup
  });
  
${verificationTests}

  test.afterEach(async ({ page }) => {
    // Capture screenshot on failure
    if (test.info().status !== test.info().expectedStatus) {
      await page.screenshot({
        path: \`screenshots/\${test.info().title.replace(/[^a-z0-9]/gi, '-')}-failure.png\`,
        fullPage: true
      });
    }
  });
});`;
  }

  // Helper method to generate verification code
  private generateVerificationCode(statement: string, explorationResults: any): string {
    // Default verification code
    return `
    // TODO: Generate specific verification based on: "${statement}"
    await expect(page.locator('body')).toBeVisible();
    console.log('Verifying: ${statement.replace(/'/g, "\\'")}');`;
  }

  private buildTestFromExploration(url: string, testName: string, explorationResult: any): string {
    // Check if we have specific exploration results
    if (!explorationResult || !explorationResult.explorationResult) {
      console.warn('No detailed exploration results available, generating generic test');
      return this.buildGenericTest(url, testName);
    }

    // Extract exploration data
    const exploration = explorationResult.explorationResult;
  
    // Log what we found during exploration
    console.log(`Building test from exploration results for ${url}`);
    if (exploration.pageTitle) {
      console.log(`Page title: ${exploration.pageTitle}`);
    }
  
    if (exploration.elements) {
      console.log(`Found ${exploration.elements.length} elements during exploration`);
    }

    // Use the test generation result if available
    if (explorationResult.testGenerationResult && explorationResult.testGenerationResult.content) {
      console.log('Using AI-generated test content from exploration');
      return explorationResult.testGenerationResult.content;
    }

    // Otherwise build a more specific test based on exploration data
    let testContent = `import { test, expect } from '@playwright/test';

test.describe('${testName}', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('${url}');
    await page.waitForLoadState('networkidle');
  });

`;

    // Add page title test if available
    if (exploration.pageTitle) {
      testContent += `
  test('Page has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/${exploration.pageTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/);
  });
`;
    }

    // Add element tests if available
    if (exploration.elements && exploration.elements.length > 0) {
      testContent += `
  test('Key page elements are present', async ({ page }) => {`;

      exploration.elements.forEach((element: any) => {
        if (element.selector && element.type) {
          testContent += `
    // Check ${element.type} element
    await expect(page.locator('${element.selector}')).toBeVisible();`;
        }
      });

      testContent += `
  });
`;
    }

    // Add navigation tests if available
    if (exploration.links && exploration.links.length > 0) {
      testContent += `
  test('Navigation links work correctly', async ({ page }) => {`;

      exploration.links.slice(0, 3).forEach((link: any, index: number) => {
        if (link.selector && link.url) {
          testContent += `
    // Test link to ${link.url}
    const link${index} = page.locator('${link.selector}');
    await expect(link${index}).toBeVisible();
    
    // Click and verify navigation
    const [response${index}] = await Promise.all([
      page.waitForNavigation(),
      link${index}.click()
    ]);
    
    // Verify navigation worked
    await expect(page).toHaveURL(/${link.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/);
    
    // Navigate back
    await page.goBack();
    await page.waitForLoadState('networkidle');`;
        }
      });

      testContent += `
  });
`;
    }

    // Add form tests if available
    if (exploration.forms && exploration.forms.length > 0) {
      testContent += `
  test('Forms can be filled out', async ({ page }) => {`;

      exploration.forms.slice(0, 2).forEach((form: any, index: number) => {
        if (form.selector) {
          testContent += `
    // Test form ${index}
    const form${index} = page.locator('${form.selector}');
    await expect(form${index}).toBeVisible();
    
    // Fill form fields`;

          if (form.fields && form.fields.length > 0) {
            form.fields.forEach((field: any) => {
              if (field.selector && field.type) {
                let testValue = '"Test"';
                if (field.type === 'email') testValue = '"test@example.com"';
                if (field.type === 'number') testValue = '"123"';
                
                testContent += `
    await page.locator('${field.selector}').fill(${testValue});`;
              }
            });
          }
        }
      });

      testContent += `
  });
`;
    }

    // Add afterEach hook
    testContent += `
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

    return testContent;
  }

  // Fallback method for generic test
  private buildGenericTest(url: string, testName: string): string {
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

  // More generic tests...
  
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

  // Helper method to sanitize filenames
  private sanitizeFilename(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/gi, '-');
  }
}
