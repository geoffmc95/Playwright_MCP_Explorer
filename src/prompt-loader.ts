import * as fs from 'fs/promises';
import * as path from 'path';

export interface PromptTemplate {
  content: string;
  tools: string[];
  mode: string;
}

export class PromptLoader {
  private promptsDir: string;
  private promptCache: Map<string, PromptTemplate> = new Map();

  constructor(promptsDir: string = '.github/workflows/prompts') {
    this.promptsDir = promptsDir;
  }

  async loadPrompt(promptName: string): Promise<PromptTemplate> {
    // Check cache first
    if (this.promptCache.has(promptName)) {
      return this.promptCache.get(promptName)!;
    }

    const promptPath = path.join(this.promptsDir, `${promptName}.prompt.md`);
    
    try {
      const content = await fs.readFile(promptPath, 'utf-8');
      const prompt = this.parsePrompt(content);
      
      // Cache the parsed prompt
      this.promptCache.set(promptName, prompt);
      
      return prompt;
    } catch (error) {
      throw new Error(`Failed to load prompt '${promptName}': ${error}`);
    }
  }

  private parsePrompt(content: string): PromptTemplate {
    // Normalize line endings to handle both Unix and Windows
    const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Parse YAML frontmatter
    const frontmatterMatch = normalizedContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!frontmatterMatch) {
      throw new Error('Invalid prompt format: missing YAML frontmatter');
    }

    const frontmatter = frontmatterMatch[1];
    const promptContent = frontmatterMatch[2];

    // Parse YAML frontmatter (simple parsing for our use case)
    const tools = this.extractYamlArray(frontmatter, 'tools') || ['playwright'];
    const mode = this.extractYamlValue(frontmatter, 'mode') || 'agent';

    return {
      content: promptContent.trim(),
      tools,
      mode
    };
  }

  private extractYamlArray(yaml: string, key: string): string[] | null {
    // Handle JSON array format: tools: ["playwright"]
    const jsonMatch = yaml.match(new RegExp(`${key}:\\s*\\[([^\\]]+)\\]`));
    if (jsonMatch) {
      return jsonMatch[1].split(',').map(item => item.trim().replace(/['"]/g, ''));
    }

    // Handle YAML array format: tools: - playwright
    const yamlMatch = yaml.match(new RegExp(`${key}:\\s*\\n((?:\\s*-\\s*.+\\n?)+)`));
    if (yamlMatch) {
      return yamlMatch[1].split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.substring(1).trim());
    }

    return null;
  }

  private extractYamlValue(yaml: string, key: string): string | null {
    const match = yaml.match(new RegExp(`${key}:\\s*['"]?([^'"\n]+)['"]?`));
    return match ? match[1].trim().replace(/['"]/g, '') : null;
  }

  async getAvailablePrompts(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.promptsDir);
      return files
        .filter(file => file.endsWith('.prompt.md'))
        .map(file => file.replace('.prompt.md', ''));
    } catch (error) {
      console.warn(`Could not read prompts directory: ${error}`);
      return [];
    }
  }

  processPromptTemplate(template: string, variables: Record<string, string>): string {
    let processed = template;
    
    // Replace template variables like {{URL}}, {{testName}}, etc.
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      processed = processed.replace(regex, value);
    }
    
    return processed;
  }

  clearCache(): void {
    this.promptCache.clear();
  }
}
