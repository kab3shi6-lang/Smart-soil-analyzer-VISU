const fs = require('fs');
const path = require('path');

const files = [
  'bridge.js',
  'advanced-v5.html',
  'app-advanced.js'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log(`\n${'='.repeat(80)}`);
    console.log(`FILE: ${file}`);
    console.log(`${'='.repeat(80)}\n`);
    console.log(content);
  } catch (err) {
    console.log(`Error reading ${file}: ${err.message}`);
  }
});
