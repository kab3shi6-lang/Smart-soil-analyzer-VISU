const fs = require('fs');
const path = require('path');

const bridgePath = path.join(__dirname, 'bridge.js');
const content = fs.readFileSync(bridgePath, 'utf8');
console.log(content);
