"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyStatementParser = void 0;
class VerifyStatementParser {
    parseVerifyStatement(statement) {
        const parsed = {
            statement: statement.toLowerCase(),
            selectors: []
        };
        // Parse different types of verify statements
        if (this.isPresenceCheck(statement)) {
            parsed.action = 'checkPresence';
            parsed.element = this.extractElement(statement);
            parsed.selectors = this.generateSelectors(parsed.element);
        }
        else if (this.isTextCheck(statement)) {
            parsed.action = 'checkText';
            parsed.element = this.extractElement(statement);
            parsed.expectedText = this.extractExpectedText(statement);
            parsed.selectors = this.generateSelectors(parsed.element);
        }
        else if (this.isValidationCheck(statement)) {
            parsed.action = 'checkValidation';
            parsed.element = this.extractElement(statement);
            parsed.condition = this.extractCondition(statement);
            parsed.selectors = this.generateSelectors(parsed.element);
        }
        else if (this.isStateCheck(statement)) {
            parsed.action = 'checkState';
            parsed.element = this.extractElement(statement);
            parsed.condition = this.extractCondition(statement);
            parsed.selectors = this.generateSelectors(parsed.element);
        }
        else {
            // Default to presence check
            parsed.action = 'checkPresence';
            parsed.element = this.extractElement(statement);
            parsed.selectors = this.generateSelectors(parsed.element);
        }
        return parsed;
    }
    isPresenceCheck(statement) {
        const presenceKeywords = ['is present', 'exists', 'is visible', 'appears', 'is displayed'];
        return presenceKeywords.some(keyword => statement.toLowerCase().includes(keyword));
    }
    isTextCheck(statement) {
        const textKeywords = ['contains', 'displays', 'shows', 'has text', 'includes'];
        return textKeywords.some(keyword => statement.toLowerCase().includes(keyword));
    }
    isValidationCheck(statement) {
        const validationKeywords = ['validation', 'error', 'warning', 'invalid', 'shows error'];
        return validationKeywords.some(keyword => statement.toLowerCase().includes(keyword));
    }
    isStateCheck(statement) {
        const stateKeywords = ['disabled', 'enabled', 'checked', 'selected', 'hidden', 'active'];
        return stateKeywords.some(keyword => statement.toLowerCase().includes(keyword));
    }
    extractElement(statement) {
        // Extract element types from natural language
        const elementMappings = {
            'header': 'header',
            'main header': 'header h1, main h1',
            'navigation': 'nav',
            'nav': 'nav',
            'menu': 'nav, .menu, ul.menu',
            'navigation menu': 'nav, .nav, .navigation',
            'form': 'form',
            'contact form': 'form[name*="contact"], form#contact, .contact-form',
            'login form': 'form[name*="login"], form#login, .login-form',
            'email field': 'input[type="email"], input[name*="email"]',
            'password field': 'input[type="password"], input[name*="password"]',
            'submit button': 'button[type="submit"], input[type="submit"]',
            'get started button': 'button:has-text("get started"), a:has-text("get started")',
            'button': 'button',
            'link': 'a',
            'image': 'img',
            'heading': 'h1, h2, h3, h4, h5, h6',
            'main heading': 'h1',
            'title': 'title, h1',
            'footer': 'footer',
            'sidebar': 'aside, .sidebar',
            'content': 'main, .content, #content',
            'search box': 'input[type="search"], input[name*="search"]',
            'search button': 'button[type="submit"]:has-text("search"), button:has-text("search")'
        };
        // Find the most specific match
        const sortedKeys = Object.keys(elementMappings).sort((a, b) => b.length - a.length);
        for (const keyword of sortedKeys) {
            if (statement.toLowerCase().includes(keyword)) {
                return elementMappings[keyword];
            }
        }
        return 'body'; // Default fallback
    }
    extractExpectedText(statement) {
        // Extract text between quotes
        const quotedText = statement.match(/['"`]([^'"`]+)['"`]/);
        if (quotedText) {
            return quotedText[1];
        }
        // Extract text after "contains"
        const containsMatch = statement.match(/contains\s+(.+?)(?:\s+and|$)/i);
        if (containsMatch) {
            return containsMatch[1].trim().replace(/['"`]/g, '');
        }
        // Extract text after "shows" or "displays"
        const showsMatch = statement.match(/(?:shows|displays)\s+(.+?)(?:\s+and|$)/i);
        if (showsMatch) {
            return showsMatch[1].trim().replace(/['"`]/g, '');
        }
        return '';
    }
    extractCondition(statement) {
        if (statement.includes('disabled'))
            return 'disabled';
        if (statement.includes('enabled'))
            return 'enabled';
        if (statement.includes('empty'))
            return 'empty';
        if (statement.includes('invalid'))
            return 'invalid';
        if (statement.includes('error'))
            return 'error';
        if (statement.includes('checked'))
            return 'checked';
        if (statement.includes('selected'))
            return 'selected';
        if (statement.includes('hidden'))
            return 'hidden';
        if (statement.includes('active'))
            return 'active';
        return '';
    }
    generateSelectors(element) {
        // Generate multiple selector options for robustness
        const selectors = [element];
        // Add common variations
        if (element.includes('header')) {
            selectors.push('header', 'h1', '.header', '#header');
        }
        if (element.includes('nav')) {
            selectors.push('nav', '.nav', '.navigation', '#navigation');
        }
        if (element.includes('button')) {
            selectors.push('button', 'input[type="button"]', 'input[type="submit"]', '.btn');
        }
        if (element.includes('form')) {
            selectors.push('form', '.form', '#form');
        }
        return [...new Set(selectors)]; // Remove duplicates
    }
    generateTestActions(parsed) {
        var _a;
        const actions = [];
        const primarySelector = ((_a = parsed.selectors) === null || _a === void 0 ? void 0 : _a[0]) || parsed.element || 'body';
        switch (parsed.action) {
            case 'checkPresence':
                actions.push(`// Verify ${parsed.element} is present`);
                actions.push(`await expect(page.locator('${primarySelector}')).toBeVisible();`);
                break;
            case 'checkText':
                actions.push(`// Verify ${parsed.element} contains text: ${parsed.expectedText}`);
                actions.push(`await expect(page.locator('${primarySelector}')).toContainText('${parsed.expectedText}');`);
                break;
            case 'checkValidation':
                actions.push(`// Verify validation behavior for ${parsed.element}`);
                if (parsed.condition === 'invalid' || parsed.condition === 'error') {
                    actions.push(`// Test invalid input to trigger validation`);
                    actions.push(`await page.locator('${primarySelector}').fill('invalid-input');`);
                    actions.push(`await page.locator('${primarySelector}').blur();`);
                    actions.push(`await expect(page.locator('${primarySelector}, ${primarySelector} + .error, .error')).toBeVisible();`);
                }
                break;
            case 'checkState':
                actions.push(`// Verify ${parsed.element} state: ${parsed.condition}`);
                if (parsed.condition === 'disabled') {
                    actions.push(`await expect(page.locator('${primarySelector}')).toBeDisabled();`);
                }
                else if (parsed.condition === 'enabled') {
                    actions.push(`await expect(page.locator('${primarySelector}')).toBeEnabled();`);
                }
                else if (parsed.condition === 'checked') {
                    actions.push(`await expect(page.locator('${primarySelector}')).toBeChecked();`);
                }
                else if (parsed.condition === 'hidden') {
                    actions.push(`await expect(page.locator('${primarySelector}')).toBeHidden();`);
                }
                break;
            default:
                actions.push(`// Default verification for: ${parsed.statement}`);
                actions.push(`await expect(page.locator('${primarySelector}')).toBeVisible();`);
        }
        return actions;
    }
}
exports.VerifyStatementParser = VerifyStatementParser;
//# sourceMappingURL=verify-parser.js.map