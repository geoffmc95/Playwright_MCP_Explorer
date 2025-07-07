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
export interface VerifyStatement {
    selector: string;
    assertion: string;
    value?: string;
}
export interface TestFixtures {
    [key: string]: any;
}
