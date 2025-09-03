#!/usr/bin/env node

const CopilotIntegration = require('./copilot');
const ActionExecutor = require('./actions');

class GutHIVePlatform {
  constructor() {
    this.copilot = new CopilotIntegration();
    this.executor = new ActionExecutor();
  }

  async start() {
    console.log('🚀 Welcome to gutHIVe - Your GitHub Alternative!');
    console.log('📝 A free and open-source platform for arbitrary actions with Copilot integrations\n');
    
    // Initialize platform components
    await this.copilot.initialize();
    
    console.log('✅ Platform ready! Use "guthive --help" for available commands');
  }

  async executeAction(actionType, params = {}) {
    try {
      console.log(`🔧 Executing action: ${actionType}`);
      
      // Get Copilot assistance if needed
      const suggestion = await this.copilot.getSuggestion(actionType, params);
      if (suggestion) {
        console.log(`💡 Copilot suggestion: ${suggestion}`);
      }
      
      // Execute the action
      const result = await this.executor.execute(actionType, params);
      console.log(`✅ Action completed: ${result}`);
      
      return result;
    } catch (error) {
      console.error(`❌ Error executing action: ${error.message}`);
      throw error;
    }
  }
}

// If run directly, start the platform
if (require.main === module) {
  const platform = new GutHIVePlatform();
  platform.start().catch(console.error);
}

module.exports = GutHIVePlatform;