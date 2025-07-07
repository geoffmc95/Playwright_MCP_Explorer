export interface TestFixtures {
    users: Record<string, any>;
    products: Record<string, any>;
    forms: Record<string, any>;
    urls: Record<string, any>;
    selectors: Record<string, any>;
    testData: Record<string, any>;
}
export interface TestEnvironment {
    name: string;
    baseUrl: string;
    apiUrl?: string;
    credentials?: Record<string, any>;
}
export declare class TestDataManager {
    private fixturesPath;
    private scenariosPath;
    private fixtures;
    private scenarios;
    private currentEnvironment;
    constructor(fixturesPath?: string, scenariosPath?: string);
    loadFixtures(): Promise<TestFixtures>;
    loadScenarios(): Promise<any[]>;
    getUser(userKey: string): Promise<any>;
    getFormData(formKey: string): Promise<any>;
    getSelector(category: string, selectorKey: string): Promise<string>;
    getEnvironmentUrl(environment?: string): Promise<string>;
    setEnvironment(environment: string): void;
    getRandomTestData(category: string, subcategory?: string): Promise<any>;
    createTestDataVariant(baseData: any, overrides?: any): Promise<any>;
    saveScenario(scenario: any): Promise<void>;
    generateTestReport(testResults: any[]): Promise<string>;
}
