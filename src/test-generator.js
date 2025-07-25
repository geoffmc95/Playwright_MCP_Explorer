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
exports.PlaywrightTestGenerator = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const verify_parser_js_1 = require("./verify-parser.js");
class PlaywrightTestGenerator {
    constructor(mcpClient, config) {
        this.mcpClient = mcpClient;
        this.config = config;
        this.verifyParser = new verify_parser_js_1.VerifyStatementParser();
    }
    generateTestFromScenario(scenario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Load the test template
                const templatePath = path.join(this.config.templateDir, 'basic-test.template.ts');
                const template = yield fs.readFile(templatePath, 'utf-8');
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
            }
            catch (error) {
                console.error('Failed to generate test from scenario:', error);
                throw error;
            }
        });
    }
    generateFromScenarioWithVerification(scenario) {
        return __awaiter(this, void 0, void 0, function* () {
            if (scenario.verifyStatements && scenario.verifyStatements.length > 0) {
                // Use MCP to explore the website and generate comprehensive tests
                const explorationResults = yield this.mcpClient.exploreWebsiteForVerification(scenario.url, scenario.verifyStatements);
                const testContent = this.buildTestFromVerificationExploration(scenario, explorationResults);
                const filename = `${scenario.id}.spec.ts`;
                const filepath = path.join(this.config.outputDir, filename);
                yield fs.writeFile(filepath, testContent, 'utf-8');
                return filepath;
            }
            else {
                // Fall back to traditional step-based generation
                const testContent = yield this.generateTestFromScenario(scenario);
                const filename = `${scenario.id}.spec.ts`;
                const filepath = path.join(this.config.outputDir, filename);
                yield fs.writeFile(filepath, testContent, 'utf-8');
                return filepath;
            }
        });
    }
    generateFromWebsiteExploration(url, testName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Use MCP to explore the website with enhanced prompts
                const explorationResult = yield this.mcpClient.exploreWebsiteWithPrompt(url, testName);
                // Generate test based on exploration
                const testContent = this.buildTestFromExploration(url, testName, explorationResult);
                const filename = `${this.sanitizeFilename(testName)}.spec.ts`;
                const filepath = path.join(this.config.outputDir, filename);
                yield fs.writeFile(filepath, testContent, 'utf-8');
                return filepath;
            }
            catch (error) {
                console.error('Failed to generate test from website exploration:', error);
                throw error;
            }
        });
    }
    generateTestStepsCode(steps) {
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
    generateAssertionsCode(steps) {
        const verifySteps = steps.filter(step => step.action === 'verify');
        if (verifySteps.length === 0) {
            return '    // No additional assertions';
        }
        return verifySteps.map(step => {
            if (step.expected) {
                return `    await expect(page.locator('${step.target}')).toContainText('${step.expected}');`;
            }
            else {
                return `    await expect(page.locator('${step.target}')).toBeVisible();`;
            }
        }).join('\n');
    }
    saveGeneratedTest(testCode, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ensure output directory exists
                yield fs.mkdir(this.config.outputDir, { recursive: true });
                // Generate full file path
                const filePath = path.join(this.config.outputDir, filename);
                // Write the test file
                yield fs.writeFile(filePath, testCode, 'utf-8');
                console.log(`Generated test saved to: ${filePath}`);
                return filePath;
            }
            catch (error) {
                console.error('Failed to save generated test:', error);
                throw error;
            }
        });
    }
    generateTestsFromScenariosFile(scenariosPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Read scenarios file
                const scenariosContent = yield fs.readFile(scenariosPath, 'utf-8');
                const scenariosData = JSON.parse(scenariosContent);
                const generatedFiles = [];
                // Generate tests for each scenario
                for (const scenario of scenariosData.scenarios) {
                    const testCode = yield this.generateTestFromScenario(scenario);
                    const filename = `${scenario.id}.spec.ts`;
                    const filePath = yield this.saveGeneratedTest(testCode, filename);
                    generatedFiles.push(filePath);
                }
                return generatedFiles;
            }
            catch (error) {
                console.error('Failed to generate tests from scenarios file:', error);
                throw error;
            }
        });
    }
    exploreAndGenerateTest(url, testName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Use MCP client to explore the website
                const pageInfo = yield this.mcpClient.capturePageInfo(url);
                // Create a basic scenario from the exploration
                const scenario = {
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
                const testCode = yield this.generateTestFromScenario(scenario);
                const filename = `${scenario.id}.spec.ts`;
                return yield this.saveGeneratedTest(testCode, filename);
            }
            catch (error) {
                console.error('Failed to explore and generate test:', error);
                throw error;
            }
        });
    }
    buildTestFromVerificationExploration(scenario, explorationResults) {
        const verificationTests = scenario.verifyStatements.map((statement, index) => {
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
    buildTestFromExploration(url, testName, explorationResult) {
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
    sanitizeFilename(name) {
        return name.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
}
exports.PlaywrightTestGenerator = PlaywrightTestGenerator;
