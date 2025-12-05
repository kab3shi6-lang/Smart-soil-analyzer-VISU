const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, 'package.json');
const content = fs.readFileSync(packagePath, 'utf-8');
console.log(content);
