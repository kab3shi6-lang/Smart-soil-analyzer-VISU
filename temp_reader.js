// This file will read the contents
const fs = require('fs');

// Read bridge.js
console.log('='.repeat(80));
console.log('READING: bridge.js');
console.log('='.repeat(80));

try {
  const bridgeContent = fs.readFileSync('c:\\Users\\Akena\\OneDrive\\Desktop\\smart_soil_website\\bridge.js', 'utf-8');
  console.log(bridgeContent);
} catch (e) {
  console.log('Error:', e.message);
}
