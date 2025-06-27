#!/usr/bin/env node

const { MCPPlaywrightClient } = require('../src/mcp-client.js');
const { PlaywrightTestGenerator } = require('../src/test-generator.js');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  mcpServer: {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', './tests', './test-data'],
    env: {}
  },
  generator: {
    outputDir: './tests/generated',
    templateDir: './test-templates',
    defaultTimeout: 30000
  },
  scenariosFile: './test-data/testautomation-scenarios.json'
};

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('🚀 Starting MCP-Playwright Test Generator...');

  // Initialize MCP client and test generator
  const mcpClient = new MCPPlaywrightClient(CONFIG.mcpServer);
  const testGenerator = new PlaywrightTestGenerator(mcpClient, CONFIG.generator);

  try {
    // Connect to MCP server
    await mcpClient.connect();
    console.log('✅ Connected to MCP server');

    switch (command) {
      case 'scenarios':
        await generateFromScenarios(testGenerator);
        break;
      
      case 'explore':
        const url = args[1];
        const testName = args[2] || 'Exploration Test';
        if (!url) {
          console.error('❌ URL is required for explore command');
          process.exit(1);
        }
        await exploreAndGenerate(testGenerator, url, testName);
        break;
      
      case 'interactive':
        await interactiveMode(mcpClient, testGenerator);
        break;
      
      default:
        showHelp();
        break;
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    // Cleanup
    await mcpClient.disconnect();
    console.log('🔌 Disconnected from MCP server');
  }
}

async function generateFromScenarios(testGenerator) {
  console.log('📋 Generating tests from scenarios...');

  try {
    const scenariosContent = await fs.readFile(CONFIG.scenariosFile, 'utf-8');
    const data = JSON.parse(scenariosContent);
    const scenarios = data.scenarios || [];

    const generatedFiles = [];
    for (const scenario of scenarios) {
      let filepath;

      // Check if scenario uses verify statements or traditional steps
      if (scenario.verifyStatements && scenario.verifyStatements.length > 0) {
        console.log(`🔍 Exploring website and generating verification tests for: ${scenario.name}`);
        filepath = await testGenerator.generateFromScenarioWithVerification(scenario);
      } else {
        console.log(`📝 Generating traditional step-based test for: ${scenario.name}`);
        const testContent = await testGenerator.generateTestFromScenario(scenario);
        const filename = `${scenario.id}.spec.ts`;
        filepath = path.join(CONFIG.generator.outputDir, filename);
        await fs.writeFile(filepath, testContent, 'utf-8');
      }

      generatedFiles.push(filepath);
      console.log(`Generated test saved to: ${filepath}`);
    }

    console.log('✅ Generated tests:');
    generatedFiles.forEach(file => {
      console.log(`   📄 ${file}`);
    });

    console.log(`\n🎉 Successfully generated ${generatedFiles.length} test files!`);
  } catch (error) {
    console.error('❌ Failed to generate tests from scenarios:', error.message);
    throw error;
  }
}

async function exploreAndGenerate(testGenerator, url, testName) {
  console.log(`🔍 Exploring website: ${url}`);

  try {
    const generatedFile = await testGenerator.generateFromWebsiteExploration(url, testName);

    console.log('✅ Generated test from exploration:');
    console.log(`   📄 ${generatedFile}`);

    console.log('\n🎉 Successfully generated test from website exploration!');
  } catch (error) {
    console.error('❌ Failed to explore and generate test:', error.message);
    throw error;
  }
}

async function interactiveMode(mcpClient, testGenerator) {
  console.log('🎮 Starting interactive mode...');
  console.log('Type "help" for available commands, "exit" to quit');
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'mcp-playwright> '
  });

  rl.prompt();

  rl.on('line', async (input) => {
    const [command, ...args] = input.trim().split(' ');

    try {
      switch (command) {
        case 'help':
          console.log(`
Available commands:
  explore <url> [testName]  - Explore a website and generate a test
  scenarios                 - Generate tests from scenarios file
  list                      - List generated tests
  clean                     - Clean generated tests directory
  exit                      - Exit interactive mode
          `);
          break;

        case 'explore':
          if (args.length === 0) {
            console.log('❌ URL is required');
            break;
          }
          const url = args[0];
          const testName = args.slice(1).join(' ') || 'Interactive Test';
          await exploreAndGenerate(testGenerator, url, testName);
          break;

        case 'scenarios':
          await generateFromScenarios(testGenerator);
          break;

        case 'list':
          await listGeneratedTests();
          break;

        case 'clean':
          await cleanGeneratedTests();
          break;

        case 'exit':
          console.log('👋 Goodbye!');
          rl.close();
          return;

        default:
          console.log(`❌ Unknown command: ${command}. Type "help" for available commands.`);
          break;
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
    }

    rl.prompt();
  });

  rl.on('close', () => {
    process.exit(0);
  });
}

async function listGeneratedTests() {
  try {
    const files = await fs.readdir(CONFIG.generator.outputDir);
    const testFiles = files.filter(file => file.endsWith('.spec.ts'));
    
    if (testFiles.length === 0) {
      console.log('📭 No generated tests found');
      return;
    }

    console.log('📋 Generated test files:');
    testFiles.forEach(file => {
      console.log(`   📄 ${file}`);
    });
  } catch (error) {
    console.log('📭 No generated tests directory found');
  }
}

async function cleanGeneratedTests() {
  try {
    await fs.rmdir(CONFIG.generator.outputDir, { recursive: true });
    console.log('🧹 Cleaned generated tests directory');
  } catch (error) {
    console.log('📭 No generated tests directory to clean');
  }
}

function showHelp() {
  console.log(`
🎭 MCP-Playwright Test Generator

Usage:
  node scripts/generate-tests.js <command> [options]

Commands:
  scenarios                    Generate tests from scenarios file
  explore <url> [testName]     Explore a website and generate a test
  interactive                  Start interactive mode

Examples:
  node scripts/generate-tests.js scenarios
  node scripts/generate-tests.js explore https://example.com "Example Site Test"
  node scripts/generate-tests.js interactive
  `);
}

// Run the main function
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { main, CONFIG };
