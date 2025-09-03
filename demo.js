#!/usr/bin/env node

/**
 * Example usage script for gutHIVe platform
 * Demonstrates various actions with Copilot integration
 */

const GutHIVePlatform = require('./src/index');

async function demonstrateGutHIVe() {
  console.log('🎭 gutHIVe Platform Demonstration\n');
  
  const platform = new GutHIVePlatform();
  await platform.start();
  
  console.log('\n🔮 Demonstrating various actions...\n');
  
  // Demonstrate repository creation
  await platform.executeAction('create-repo', {
    name: 'awesome-project',
    description: 'An awesome project built with gutHIVe',
    isPrivate: false
  });
  
  console.log('\n');
  
  // Demonstrate code commit
  await platform.executeAction('commit-code', {
    message: 'feat: implement core platform functionality',
    files: ['src/index.js', 'src/copilot.js', 'README.md']
  });
  
  console.log('\n');
  
  // Demonstrate code analysis
  await platform.executeAction('analyze-code', {
    path: './src',
    language: 'javascript'
  });
  
  console.log('\n');
  
  // Demonstrate deployment
  await platform.executeAction('deploy', {
    environment: 'staging',
    version: '1.0.0'
  });
  
  console.log('\n');
  
  // Demonstrate documentation generation
  await platform.executeAction('generate-docs', {
    format: 'markdown',
    output: 'docs/api.md'
  });
  
  console.log('\n');
  
  // Demonstrate custom action
  await platform.executeAction('custom', {
    command: 'npm run build && npm run test',
    description: 'Build and test the project'
  });
  
  console.log('\n🎉 Demonstration complete! gutHIVe is ready to replace your GitHub workflow.');
  console.log('💡 Try the interactive mode: node src/cli.js interactive');
}

// Run demonstration if called directly
if (require.main === module) {
  demonstrateGutHIVe().catch(console.error);
}

module.exports = { demonstrateGutHIVe };