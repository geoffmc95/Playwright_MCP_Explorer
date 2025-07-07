export interface VerifyStatement {
    statement: string;
    action?: string;
    element?: string;
    expectedText?: string;
    condition?: string;
    selectors?: string[];
}
export declare class VerifyStatementParser {
    parseVerifyStatement(statement: string): VerifyStatement;
    private isPresenceCheck;
    private isTextCheck;
    private isValidationCheck;
    private isStateCheck;
    private extractElement;
    private extractExpectedText;
    private extractCondition;
    private generateSelectors;
    generateTestActions(parsed: VerifyStatement): string[];
}
