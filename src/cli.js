#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const GutHIVePlatform = require('./index');

const program = new Command();
const platform = new GutHIVePlatform();

program
  .name('guthive')
  .description('gutHIVe - A free and open-source platform for arbitrary actions with Copilot integrations')
  .version('1.0.0');

program
  .command('start')
  .description('Start the gutHIVe platform')
  .action(async () => {
    await platform.start();
  });

program
  .command('action <type>')
  .description('Execute an arbitrary action with Copilot assistance')
  .option('-p, --params <params>', 'Action parameters as JSON string')
  .action(async (type, options) => {
    let params = {};
    
    if (options.params) {
      try {
        params = JSON.parse(options.params);
      } catch (error) {
        console.error('❌ Invalid JSON parameters:', error.message);
        process.exit(1);
      }
    }
    
    try {
      await platform.executeAction(type, params);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('interactive')
  .description('Start interactive mode for executing actions')
  .action(async () => {
    console.log('🎯 gutHIVe Interactive Mode');
    console.log('Select actions to execute with Copilot assistance\n');
    
    const actions = [
      'create-repo',
      'commit-code', 
      'review-code',
      'deploy',
      'collaborate',
      'analyze-code',
      'generate-docs',
      'run-tests',
      'custom'
    ];
    
    while (true) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [...actions, 'Exit']
        }
      ]);
      
      if (action === 'Exit') {
        console.log('👋 Goodbye!');
        break;
      }
      
      const params = await getActionParams(action);
      
      try {
        await platform.executeAction(action, params);
        console.log('\n');
      } catch (error) {
        console.error(`❌ Error: ${error.message}\n`);
      }
    }
  });

async function getActionParams(actionType) {
  const paramPrompts = {
    'create-repo': [
      { type: 'input', name: 'name', message: 'Repository name:' },
      { type: 'input', name: 'description', message: 'Repository description:' },
      { type: 'confirm', name: 'isPrivate', message: 'Private repository?', default: false }
    ],
    'commit-code': [
      { type: 'input', name: 'message', message: 'Commit message:' },
      { type: 'input', name: 'files', message: 'Files to commit (comma-separated, leave empty for all):' }
    ],
    'review-code': [
      { type: 'input', name: 'branch', message: 'Branch to review:' },
      { type: 'input', name: 'reviewer', message: 'Reviewer (optional):' }
    ],
    'deploy': [
      { type: 'input', name: 'environment', message: 'Environment:', default: 'production' },
      { type: 'input', name: 'version', message: 'Version (optional):' }
    ],
    'collaborate': [
      { type: 'input', name: 'action', message: 'Collaboration action:' },
      { type: 'input', name: 'collaborator', message: 'Collaborator:' },
      { type: 'input', name: 'repository', message: 'Repository:' }
    ],
    'analyze-code': [
      { type: 'input', name: 'path', message: 'Code path to analyze:' },
      { type: 'input', name: 'language', message: 'Programming language (optional):' }
    ],
    'generate-docs': [
      { type: 'list', name: 'format', message: 'Documentation format:', choices: ['markdown', 'html', 'pdf'] },
      { type: 'input', name: 'output', message: 'Output file (optional):' }
    ],
    'run-tests': [
      { type: 'input', name: 'suite', message: 'Test suite (optional):' },
      { type: 'confirm', name: 'coverage', message: 'Enable coverage?', default: false }
    ],
    'custom': [
      { type: 'input', name: 'command', message: 'Custom command:' },
      { type: 'input', name: 'description', message: 'Description:' }
    ]
  };
  
  const prompts = paramPrompts[actionType] || [];
  const answers = await inquirer.prompt(prompts);
  
  // Process files input for commit-code
  if (actionType === 'commit-code' && answers.files) {
    answers.files = answers.files.split(',').map(f => f.trim()).filter(f => f);
  }
  
  return answers;
}

program
  .command('list-actions')
  .description('List all available actions')
  .action(() => {
    console.log('📋 Available Actions:');
    console.log('  • create-repo     - Create a new repository');
    console.log('  • commit-code     - Commit code changes');
    console.log('  • review-code     - Review code changes');
    console.log('  • deploy          - Deploy application');
    console.log('  • collaborate     - Collaboration actions');
    console.log('  • analyze-code    - Analyze code quality');
    console.log('  • generate-docs   - Generate documentation');
    console.log('  • run-tests       - Run test suites');
    console.log('  • custom          - Execute custom actions');
  });

// If no command provided, show help
if (process.argv.length === 2) {
  program.help();
}

program.parse();