#!/usr/bin/env node

/**
 * Auto-Setup Script for Smart Soil Website
 * This script configures everything needed for automatic readings
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Smart Soil Website - Auto Setup\n');

// ============================================
// Step 1: Verify package.json has start script
// ============================================
console.log('📋 Step 1: Checking package.json...');

const packagePath = path.join(__dirname, 'package.json');
let packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

if (!packageData.scripts) {
  packageData.scripts = {};
}

if (!packageData.scripts.start) {
  console.log('   ✅ Adding start script to package.json');
  packageData.scripts.start = 'node bridge.js';
  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
} else {
  console.log('   ✓ Start script already configured');
}

// ============================================
// Step 2: Check bridge.js configuration
// ============================================
console.log('\n📋 Step 2: Checking bridge.js...');

const bridgePath = path.join(__dirname, 'bridge.js');
if (fs.existsSync(bridgePath)) {
  const bridgeContent = fs.readFileSync(bridgePath, 'utf8');
  if (bridgeContent.includes('COM5') || bridgeContent.includes('PORT')) {
    console.log('   ✓ bridge.js appears to be configured');
  } else {
    console.log('   ⚠ bridge.js may need COM port configuration');
  }
} else {
  console.log('   ⚠ bridge.js not found');
}

// ============================================
// Step 3: Check advanced-v5.html configuration
// ============================================
console.log('\n📋 Step 3: Checking advanced-v5.html...');

const htmlPath = path.join(__dirname, 'advanced-v5.html');
if (fs.existsSync(htmlPath)) {
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  if (htmlContent.includes('localhost:3000') || htmlContent.includes('http://')) {
    console.log('   ✓ advanced-v5.html has server connection configured');
  } else {
    console.log('   ⚠ advanced-v5.html may need connection configuration');
  }
} else {
  console.log('   ⚠ advanced-v5.html not found');
}

// ============================================
// Step 4: Create startup guide
// ============================================
console.log('\n📋 Step 4: Creating startup guide...');

const startupGuide = `# 🚀 QUICK START - Automatic Readings Setup

## Step 1: Connect Arduino
- Connect Arduino via USB cable
- In Device Manager, note the COM port (usually COM3, COM4, or COM5)

## Step 2: Update bridge.js (if needed)
If your Arduino is on a different COM port:
- Open bridge.js
- Find: const PORT = 'COM5';
- Change to your COM port

## Step 3: Start the Bridge Server
Open PowerShell in this directory and run:
\`\`\`
npm start
\`\`\`

You should see:
✓ Bridge running on port 3000
✓ Waiting for sensor data...

## Step 4: Open Website
Open your browser to:
\`\`\`
http://localhost:3000/advanced-v5.html
\`\`\`

## ✅ Success!
Readings should now appear automatically every 5 seconds.

---

## 🔧 Troubleshooting

### Readings not appearing?

1. **Check Arduino connection:**
   \`\`\`
   npm run test
   \`\`\`

2. **Verify Bridge is running:**
   - Check PowerShell shows "Bridge running on port 3000"

3. **Check device list in Device Manager:**
   - Arduino should appear as "COM?" device

4. **Try opening in browser DevTools:**
   - Press F12
   - Check Console for any errors

### Still stuck?
Make sure:
- [ ] Arduino is plugged in
- [ ] Bridge server is running (\`npm start\`)
- [ ] Website opened at http://localhost:3000/advanced-v5.html
- [ ] COM port matches your Arduino port in bridge.js
`;

fs.writeFileSync(path.join(__dirname, 'QUICK_START_AUTO.md'), startupGuide);
console.log('   ✅ Created QUICK_START_AUTO.md');

// ============================================
// Summary
// ============================================
console.log('\n✅ Setup Complete!\n');
console.log('📚 Next Steps:');
console.log('   1. npm start          (Start the Bridge server)');
console.log('   2. Open http://localhost:3000/advanced-v5.html');
console.log('   3. Readings appear automatically!\n');
console.log('📖 For detailed help, see: QUICK_START_AUTO.md\n');
