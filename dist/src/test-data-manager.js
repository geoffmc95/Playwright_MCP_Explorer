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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDataManager = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class TestDataManager {
    constructor(fixturesPath = './test-data/fixtures.json', scenariosPath = './test-data/scenarios.json') {
        this.fixturesPath = fixturesPath;
        this.scenariosPath = scenariosPath;
        this.fixtures = null;
        this.scenarios = [];
        this.currentEnvironment = 'development';
    }
    async loadFixtures() {
        if (this.fixtures) {
            return this.fixtures;
        }
        try {
            const fixturesContent = await fs.readFile(this.fixturesPath, 'utf-8');
            this.fixtures = JSON.parse(fixturesContent);
            return this.fixtures; // Non-null assertion since we just assigned it
        }
        catch (error) {
            console.error('Failed to load fixtures:', error);
            throw new Error(`Could not load test fixtures from ${this.fixturesPath}`);
        }
    }
    async loadScenarios() {
        if (this.scenarios.length > 0) {
            return this.scenarios;
        }
        try {
            const scenariosContent = await fs.readFile(this.scenariosPath, 'utf-8');
            const scenariosData = JSON.parse(scenariosContent);
            this.scenarios = scenariosData.scenarios || [];
            return this.scenarios;
        }
        catch (error) {
            console.error('Failed to load scenarios:', error);
            throw new Error(`Could not load test scenarios from ${this.scenariosPath}`);
        }
    }
    async getUser(userKey) {
        const fixtures = await this.loadFixtures();
        const user = fixtures.users[userKey];
        if (!user) {
            throw new Error(`User '${userKey}' not found in fixtures`);
        }
        return { ...user };
    }
    async getFormData(formKey) {
        const fixtures = await this.loadFixtures();
        const formData = fixtures.forms[formKey];
        if (!formData) {
            throw new Error(`Form data '${formKey}' not found in fixtures`);
        }
        return { ...formData };
    }
    async getSelector(category, selectorKey) {
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
    async getEnvironmentUrl(environment) {
        const fixtures = await this.loadFixtures();
        const env = environment || this.currentEnvironment;
        const envConfig = fixtures.urls[env];
        if (!envConfig) {
            throw new Error(`Environment '${env}' not found in fixtures`);
        }
        return envConfig.base;
    }
    setEnvironment(environment) {
        this.currentEnvironment = environment;
    }
    async getRandomTestData(category, subcategory) {
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
    async createTestDataVariant(baseData, overrides = {}) {
        return {
            ...baseData,
            ...overrides,
            // Add timestamp to make data unique
            timestamp: new Date().toISOString(),
            uniqueId: Math.random().toString(36).substr(2, 9)
        };
    }
    async saveScenario(scenario) {
        try {
            const scenarios = await this.loadScenarios();
            scenarios.push(scenario);
            const scenariosData = { scenarios };
            await fs.writeFile(this.scenariosPath, JSON.stringify(scenariosData, null, 2), 'utf-8');
            // Update in-memory cache
            this.scenarios = scenarios;
        }
        catch (error) {
            console.error('Failed to save scenario:', error);
            throw error;
        }
    }
    async generateTestReport(testResults) {
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
exports.TestDataManager = TestDataManager;
//# sourceMappingURL=test-data-manager.js.map