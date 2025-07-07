import { PromptLoader } from './prompt-loader.js';
import { TestScenario } from './types';
export interface MCPConfig {
    command: string;
    args: string[];
    env?: Record<string, string>;
}
export declare class MCPPlaywrightClient {
    private config;
    private client;
    private transport;
    private verifyParser;
    promptLoader: PromptLoader;
    constructor(config: MCPConfig);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    exploreWebsite(url: string): Promise<any>;
    generateTestFromScenario(scenario: TestScenario): Promise<string>;
    capturePageInfo(url: string): Promise<any>;
    exploreWebsiteForVerification(url: string, verifyStatements: string[]): Promise<any>;
    private analyzeVerifyStatement;
    exploreWebsiteWithPrompt(url: string, testName: string): Promise<any>;
    generateFromScenariosWithPrompt(scenarios: TestScenario[]): Promise<any>;
}
