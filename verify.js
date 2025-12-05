#!/usr/bin/env node

/**
 * 🔍 أداة التحقق من النظام
 * System Verification Tool
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m'
};

console.log(`${colors.blue}${colors.bold}🔍 التحقق من نظام محلل التربة الذكي\n${colors.reset}`);

// ============================================================
// الملفات المطلوبة
// ============================================================

const requiredFiles = [
  // الملفات الأساسية
  { name: 'bridge.js', type: '🌐 جسر البلوتوث' },
  { name: 'app-new.js', type: '⚙️ منطق التطبيق' },
  { name: 'plants-database.js', type: '🌱 قاعدة البيانات' },
  { name: 'index-new.html', type: '🎨 الواجهة' },
  { name: 'style_comprehensive.css', type: '🎨 الأنماط' },
  
  // ملفات التوثيق
  { name: 'SETUP_GUIDE.md', type: '📖 دليل التثبيت' },
  { name: 'README_V2.md', type: '📖 التوثيق الكامل' },
  { name: 'UPDATE_SUMMARY.md', type: '📖 ملخص التحديثات' },
  { name: 'QUICK_START_V2.md', type: '⚡ البدء السريع' },
  
  // ملفات التكوين
  { name: 'package.json', type: '📦 الحزم' },
  { name: 'test.js', type: '🧪 الاختبارات' }
];

// ============================================================
// التحقق
// ============================================================

let allGood = true;
const projectDir = process.cwd();

console.log(`${colors.blue}📂 المجلد: ${projectDir}\n${colors.reset}`);

requiredFiles.forEach(file => {
  const filePath = path.join(projectDir, file.name);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024).toFixed(1);
    console.log(`${colors.green}✅${colors.reset} ${file.type.padEnd(20)} - ${file.name} (${size}KB)`);
  } else {
    console.log(`${colors.red}❌${colors.reset} ${file.type.padEnd(20)} - ${file.name} ${colors.yellow}(مفقود)${colors.reset}`);
    allGood = false;
  }
});

// ============================================================
// فحص Node.js
// ============================================================

console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
console.log(`${colors.blue}💻 فحص البيئة${colors.reset}\n`);

try {
  const nodeVersion = process.version;
  console.log(`${colors.green}✅${colors.reset} Node.js: ${nodeVersion}`);
} catch (e) {
  console.log(`${colors.red}❌${colors.reset} Node.js غير مثبت`);
  allGood = false;
}

// ============================================================
// فحص الحزم
// ============================================================

const packageJsonPath = path.join(projectDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const dependencies = packageJson.dependencies || {};
    
    console.log(`${colors.green}✅${colors.reset} package.json موجود`);
    console.log(`\n   الحزم المطلوبة:`);
    
    Object.keys(dependencies).forEach(dep => {
      console.log(`   - ${dep}: ${dependencies[dep]}`);
    });
  } catch (e) {
    console.log(`${colors.red}❌${colors.reset} خطأ في قراءة package.json: ${e.message}`);
  }
}

// ============================================================
// ملخص النتائج
// ============================================================

console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
console.log(`${colors.blue}📊 النتائج${colors.reset}\n`);

if (allGood) {
  console.log(`${colors.green}${colors.bold}✅ جميع الملفات موجودة!${colors.reset}`);
  console.log(`\n${colors.green}الخطوات التالية:${colors.reset}`);
  console.log(`1. تثبيت الحزم: ${colors.bold}npm install${colors.reset}`);
  console.log(`2. تشغيل الجسر: ${colors.bold}npm start${colors.reset}`);
  console.log(`3. فتح الموقع: ${colors.bold}index-new.html${colors.reset}`);
  console.log(`\n${colors.green}اقرأ: QUICK_START_V2.md للتفاصيل${colors.reset}`);
} else {
  console.log(`${colors.red}❌ بعض الملفات مفقودة${colors.reset}`);
  console.log(`\n${colors.yellow}حاول:${colors.reset}`);
  console.log(`- تأكد من أنك في المجلد الصحيح`);
  console.log(`- أعد تحميل الملفات من GitHub`);
  console.log(`- تحقق من SETUP_GUIDE.md`);
}

console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

process.exit(allGood ? 0 : 1);
