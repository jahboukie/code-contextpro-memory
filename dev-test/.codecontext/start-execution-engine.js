#!/usr/bin/env node
const { app } = require('../../execution-engine/dist/index.js');
const path = require('path');

// Set project path for memory integration
process.env.PROJECT_PATH = 'C:\Users\scorp\projects\vibe-extension\code-context-pro\dev-test';
process.env.SANDBOX_DIR = 'C:\Users\scorp\projects\vibe-extension\code-context-pro\dev-test\.codecontext\sandbox';

console.log('🚀 Starting CodeContext Pro Execution Engine...');
console.log('📁 Project:', 'C:\Users\scorp\projects\vibe-extension\code-context-pro\dev-test');
console.log('🏗️  Sandbox:', 'C:\Users\scorp\projects\vibe-extension\code-context-pro\dev-test\.codecontext\sandbox');
