#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'bridge.js');

console.log('===== BRIDGE.JS CONTENT =====\n');
try {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(content);
  console.log('\n===== END OF FILE =====');
} catch (error) {
  console.error('Error reading bridge.js:', error.message);
}
