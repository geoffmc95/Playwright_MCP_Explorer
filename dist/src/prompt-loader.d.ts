export interface PromptTemplate {
    content: string;
    tools: string[];
    mode: string;
}
export declare class PromptLoader {
    private promptsDir;
    private promptCache;
    constructor(promptsDir?: string);
    loadPrompt(promptName: string): Promise<PromptTemplate>;
    private parsePrompt;
    private extractYamlArray;
    private extractYamlValue;
    getAvailablePrompts(): Promise<string[]>;
    processPromptTemplate(template: string, variables: Record<string, string>): string;
    clearCache(): void;
}
