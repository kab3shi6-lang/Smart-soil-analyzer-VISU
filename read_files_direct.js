#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\Akena\\OneDrive\\Desktop\\smart_soil_website';

const files = ['bridge.js', 'advanced-v5.html', 'app-advanced.js'];

files.forEach(filename => {
  const filePath = path.join(baseDir, filename);
  console.log('\n' + '='.repeat(100));
  console.log(`FILE: ${filename}`);
  console.log('='.repeat(100) + '\n');
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log(content);
    console.log('\n' + '='.repeat(100) + '\n');
  } catch (err) {
    console.error(`Failed to read ${filename}: ${err.message}`);
  }
});
