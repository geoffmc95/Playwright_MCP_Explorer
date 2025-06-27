import * as fs from 'fs/promises';
import * as path from 'path';

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

export class TestDataManager {
  private fixtures: TestFixtures | null = null;
  private scenarios: any[] = [];
  private currentEnvironment: string = 'development';

  constructor(
    private fixturesPath: string = './test-data/fixtures.json',
    private scenariosPath: string = './test-data/scenarios.json'
  ) {}

  async loadFixtures(): Promise<TestFixtures> {
    if (this.fixtures) {
      return this.fixtures;
    }

    try {
      const fixturesContent = await fs.readFile(this.fixturesPath, 'utf-8');
      this.fixtures = JSON.parse(fixturesContent);
      return this.fixtures!; // Non-null assertion since we just assigned it
    } catch (error) {
      console.error('Failed to load fixtures:', error);
      throw new Error(`Could not load test fixtures from ${this.fixturesPath}`);
    }
  }

  async loadScenarios(): Promise<any[]> {
    if (this.scenarios.length > 0) {
      return this.scenarios;
    }

    try {
      const scenariosContent = await fs.readFile(this.scenariosPath, 'utf-8');
      const scenariosData = JSON.parse(scenariosContent);
      this.scenarios = scenariosData.scenarios || [];
      return this.scenarios;
    } catch (error) {
      console.error('Failed to load scenarios:', error);
      throw new Error(`Could not load test scenarios from ${this.scenariosPath}`);
    }
  }

  async getUser(userKey: string): Promise<any> {
    const fixtures = await this.loadFixtures();
    const user = fixtures.users[userKey];
    
    if (!user) {
      throw new Error(`User '${userKey}' not found in fixtures`);
    }

    return { ...user };
  }

  async getFormData(formKey: string): Promise<any> {
    const fixtures = await this.loadFixtures();
    const formData = fixtures.forms[formKey];
    
    if (!formData) {
      throw new Error(`Form data '${formKey}' not found in fixtures`);
    }

    return { ...formData };
  }

  async getSelector(category: string, selectorKey: string): Promise<string> {
    const fixtures = await this.loadFixtures();
    const categorySelectors = fixtures.selectors[category];
    
    if (!categorySelectors) {
      throw new Error(`Selector category '${category}' not found in fixtures`);
    }

    const selector = categorySelectors[selectorKey];
    if (!selector) {
      throw new Error(`Selector '${selectorKey}' not found in category '${category}'`);
    }

    return selector;
  }

  async getEnvironmentUrl(environment?: string): Promise<string> {
    const fixtures = await this.loadFixtures();
    const env = environment || this.currentEnvironment;
    const envConfig = fixtures.urls[env];
    
    if (!envConfig) {
      throw new Error(`Environment '${env}' not found in fixtures`);
    }

    return envConfig.base;
  }

  setEnvironment(environment: string): void {
    this.currentEnvironment = environment;
  }

  async getRandomTestData(category: string, subcategory?: string): Promise<any> {
    const fixtures = await this.loadFixtures();
    const categoryData = fixtures.testData[category];
    
    if (!categoryData) {
      throw new Error(`Test data category '${category}' not found`);
    }

    if (subcategory) {
      const subcategoryData = categoryData[subcategory];
      if (!subcategoryData || !Array.isArray(subcategoryData)) {
        throw new Error(`Test data subcategory '${subcategory}' not found or not an array`);
      }
      
      const randomIndex = Math.floor(Math.random() * subcategoryData.length);
      return subcategoryData[randomIndex];
    }

    if (Array.isArray(categoryData)) {
      const randomIndex = Math.floor(Math.random() * categoryData.length);
      return categoryData[randomIndex];
    }

    return categoryData;
  }

  async createTestDataVariant(baseData: any, overrides: any = {}): Promise<any> {
    return {
      ...baseData,
      ...overrides,
      // Add timestamp to make data unique
      timestamp: new Date().toISOString(),
      uniqueId: Math.random().toString(36).substr(2, 9)
    };
  }

  async saveScenario(scenario: any): Promise<void> {
    try {
      const scenarios = await this.loadScenarios();
      scenarios.push(scenario);

      const scenariosData = { scenarios };
      await fs.writeFile(this.scenariosPath, JSON.stringify(scenariosData, null, 2), 'utf-8');
      
      // Update in-memory cache
      this.scenarios = scenarios;
    } catch (error) {
      console.error('Failed to save scenario:', error);
      throw error;
    }
  }

  async generateTestReport(testResults: any[]): Promise<string> {
    const report = {
      timestamp: new Date().toISOString(),
      environment: this.currentEnvironment,
      totalTests: testResults.length,
      passed: testResults.filter(r => r.status === 'passed').length,
      failed: testResults.filter(r => r.status === 'failed').length,
      skipped: testResults.filter(r => r.status === 'skipped').length,
      results: testResults
    };

    const reportPath = path.join('./test-results', `report-${Date.now()}.json`);
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    
    // Save report
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8');
    
    return reportPath;
  }
}
