const fs = require('fs');
const path = require('path');

const files = [
  'bridge.js',
  'package.json',
  'advanced-v5.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`\n${'='.repeat(80)}\nFILE: ${file}\n${'='.repeat(80)}\n`);
    console.log(content);
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
});
