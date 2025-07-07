// Define the TestScenario interface
export interface TestScenario {
  id: string;
  name: string;
  description: string;
  url: string;
  steps?: TestStep[];
  verifyStatements?: string[];
}

// Define the TestStep interface
export interface TestStep {
  action: 'navigate' | 'click' | 'fill' | 'verify' | 'wait' | 'screenshot';
  target: string;
  value?: string;
  expected?: string;
  timeout?: number;
}

// Define the VerifyStatement interface
export interface VerifyStatement {
  selector: string;
  assertion: string;
  value?: string;
}

// Define TestFixtures interface if needed
export interface TestFixtures {
  [key: string]: any;
}
