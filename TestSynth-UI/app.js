// TestSynth MCP Explorer - Simple UI
class TestSynthUI {
    constructor() {
        this.currentTestContent = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTabs();
    }

    setupEventListeners() {
        // Tab switching
        document.getElementById('exploreTab').addEventListener('click', () => this.showTab('explore'));
        document.getElementById('scenarioTab').addEventListener('click', () => this.showTab('scenario'));

        // Form submissions
        document.getElementById('exploreForm').addEventListener('submit', (e) => this.handleExploreSubmit(e));
        document.getElementById('scenarioForm').addEventListener('submit', (e) => this.handleScenarioSubmit(e));

        // Add statement button
        document.getElementById('addStatement').addEventListener('click', () => this.addVerifyStatement());

        // Results actions
        document.getElementById('copyBtn').addEventListener('click', () => this.copyToClipboard());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadTest());

        // URL validation
        document.getElementById('url').addEventListener('input', (e) => this.validateUrl(e.target));
        document.getElementById('scenarioUrl').addEventListener('input', (e) => this.validateUrl(e.target));
    }

    setupTabs() {
        this.showTab('explore');
    }

    showTab(tab) {
        const exploreTab = document.getElementById('exploreTab');
        const scenarioTab = document.getElementById('scenarioTab');
        const exploreSection = document.getElementById('exploreSection');
        const scenarioSection = document.getElementById('scenarioSection');

        if (tab === 'explore') {
            exploreTab.className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors bg-white text-blue-600 shadow-sm';
            scenarioTab.className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-gray-900';
            exploreSection.classList.remove('hidden');
            scenarioSection.classList.add('hidden');
        } else {
            scenarioTab.className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors bg-white text-green-600 shadow-sm';
            exploreTab.className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-gray-900';
            scenarioSection.classList.remove('hidden');
            exploreSection.classList.add('hidden');
        }
    }

    validateUrl(input) {
        const errorDiv = input.id === 'url' ? document.getElementById('urlError') : null;
        
        try {
            if (input.value) {
                new URL(input.value);
                input.classList.remove('border-red-300', 'focus:border-red-500', 'focus:ring-red-500');
                input.classList.add('border-gray-300', 'focus:border-blue-500', 'focus:ring-blue-500');
                if (errorDiv) {
                    errorDiv.classList.add('hidden');
                }
                return true;
            }
        } catch {
            if (input.value) {
                input.classList.remove('border-gray-300', 'focus:border-blue-500', 'focus:ring-blue-500');
                input.classList.add('border-red-300', 'focus:border-red-500', 'focus:ring-red-500');
                if (errorDiv) {
                    errorDiv.textContent = 'Please enter a valid URL (e.g., https://example.com)';
                    errorDiv.classList.remove('hidden');
                }
                return false;
            }
        }
        return true;
    }

    async handleExploreSubmit(e) {
        e.preventDefault();
        
        const url = document.getElementById('url').value;
        const testName = document.getElementById('testName').value || `Test for ${new URL(url).hostname}`;
        
        if (!this.validateUrl(document.getElementById('url'))) {
            return;
        }

        this.showLoading();
        
        try {
            const response = await fetch('http://localhost:3001/api/explore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, testName }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate test');
            }
            
            const data = await response.json();
            this.showResults(data.testContent);
        } catch (error) {
            console.error('Error generating test:', error);
            this.showError('Failed to generate test. Make sure the backend server is running on port 3001.');
        }
    }

    async handleScenarioSubmit(e) {
        e.preventDefault();
        
        const testName = document.getElementById('scenarioTestName').value;
        const url = document.getElementById('scenarioUrl').value;
        const description = document.getElementById('scenarioDescription').value;
        
        // Collect verify statements
        const statementInputs = document.querySelectorAll('#verifyStatements input');
        const verifyStatements = Array.from(statementInputs)
            .map(input => input.value.trim())
            .filter(statement => statement.length > 0);
        
        if (verifyStatements.length === 0) {
            alert('Please add at least one verify statement.');
            return;
        }

        if (!this.validateUrl(document.getElementById('scenarioUrl'))) {
            return;
        }

        this.showLoading();
        
        try {
            const scenario = {
                id: testName.toLowerCase().replace(/\s+/g, '-'),
                name: testName,
                description: description,
                url: url,
                verifyStatements: verifyStatements
            };

            const response = await fetch('http://localhost:3001/api/scenarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scenario }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate test');
            }
            
            const data = await response.json();
            this.showResults(data.testContent);
        } catch (error) {
            console.error('Error generating test:', error);
            this.showError('Failed to generate test. Make sure the backend server is running on port 3001.');
        }
    }

    addVerifyStatement() {
        const container = document.getElementById('verifyStatements');
        const statementCount = container.children.length + 1;
        
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-3';
        div.innerHTML = `
            <input
                type="text"
                placeholder="Verify statement ${statementCount} (e.g., &quot;Verify login button exists&quot;)"
                class="flex-1 block rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
            <button
                type="button"
                onclick="this.parentElement.remove()"
                class="text-red-600 hover:text-red-700 p-1"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        `;
        
        container.appendChild(div);
    }

    showLoading() {
        document.getElementById('loadingSection').classList.remove('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
    }

    showResults(testContent) {
        this.currentTestContent = testContent;
        document.getElementById('testCode').textContent = testContent;
        document.getElementById('loadingSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');
        
        // Scroll to results
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }

    showError(message) {
        document.getElementById('loadingSection').classList.add('hidden');
        alert(message);
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.currentTestContent);
            const btn = document.getElementById('copyBtn');
            const originalText = btn.innerHTML;
            btn.innerHTML = `
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Copied!</span>
            `;
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard');
        }
    }

    downloadTest() {
        const blob = new Blob([this.currentTestContent], { type: 'text/typescript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-test.spec.ts';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the UI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TestSynthUI();
});
