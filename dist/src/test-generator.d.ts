import { MCPPlaywrightClient } from './mcp-client';
import { TestScenario } from './types';
export interface TestGeneratorConfig {
    outputDir: string;
    templateDir: string;
    defaultTimeout?: number;
}
export declare class PlaywrightTestGenerator {
    private mcpClient;
    private config;
    constructor(mcpClient: MCPPlaywrightClient, config: TestGeneratorConfig);
    generateTestFromScenario(scenario: TestScenario): Promise<string>;
    generateFromScenarioWithVerification(scenario: TestScenario): Promise<string>;
    generateFromWebsiteExploration(url: string, testName: string): Promise<string>;
    private generateTestStepsCode;
    private generateAssertionsCode;
    saveGeneratedTest(testCode: string, filename: string): Promise<string>;
    generateTestsFromScenariosFile(scenariosPath: string): Promise<string[]>;
    exploreAndGenerateTest(url: string, testName: string): Promise<string>;
    private buildTestFromVerificationExploration;
    private generateVerificationCode;
    private buildTestFromExploration;
    private buildGenericTest;
    private sanitizeFilename;
}
