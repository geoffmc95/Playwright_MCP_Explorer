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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptLoader = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class PromptLoader {
    constructor(promptsDir = '.github/workflows/prompts') {
        this.promptCache = new Map();
        this.promptsDir = promptsDir;
    }
    loadPrompt(promptName) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check cache first
            if (this.promptCache.has(promptName)) {
                return this.promptCache.get(promptName);
            }
            const promptPath = path.join(this.promptsDir, `${promptName}.prompt.md`);
            try {
                const content = yield fs.readFile(promptPath, 'utf-8');
                const prompt = this.parsePrompt(content);
                // Cache the parsed prompt
                this.promptCache.set(promptName, prompt);
                return prompt;
            }
            catch (error) {
                throw new Error(`Failed to load prompt '${promptName}': ${error}`);
            }
        });
    }
    parsePrompt(content) {
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
    extractYamlArray(yaml, key) {
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
    extractYamlValue(yaml, key) {
        const match = yaml.match(new RegExp(`${key}:\\s*['"]?([^'"\n]+)['"]?`));
        return match ? match[1].trim().replace(/['"]/g, '') : null;
    }
    getAvailablePrompts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield fs.readdir(this.promptsDir);
                return files
                    .filter(file => file.endsWith('.prompt.md'))
                    .map(file => file.replace('.prompt.md', ''));
            }
            catch (error) {
                console.warn(`Could not read prompts directory: ${error}`);
                return [];
            }
        });
    }
    processPromptTemplate(template, variables) {
        let processed = template;
        // Replace template variables like {{URL}}, {{testName}}, etc.
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            processed = processed.replace(regex, value);
        }
        return processed;
    }
    clearCache() {
        this.promptCache.clear();
    }
}
exports.PromptLoader = PromptLoader;
