#!/usr/bin/env node

/**
 * Quick Verification Script
 * التحقق من جاهزية نظام Bluetooth
 * 
 * الاستخدام:
 *   node verify-system.js
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

function log(status, message) {
    let icon = '';
    let color = '';
    
    if (status === 'ok') {
        icon = '✅';
        color = colors.green;
    } else if (status === 'error') {
        icon = '❌';
        color = colors.red;
    } else if (status === 'warning') {
        icon = '⚠️ ';
        color = colors.yellow;
    } else if (status === 'info') {
        icon = 'ℹ️ ';
        color = colors.blue;
    } else {
        icon = status;
    }
    
    console.log(`${color}${icon} ${message}${colors.reset}`);
}

function checkFile(filename, description) {
    const filePath = path.join(__dirname, filename);
    const exists = fs.existsSync(filePath);
    
    if (exists) {
        log('ok', `${description} (${filename})`);
        return true;
    } else {
        log('error', `${description} (${filename}) - غير موجود`);
        return false;
    }
}

function checkPackage(packageName) {
    try {
        require.resolve(packageName);
        log('ok', `مكتبة ${packageName}`);
        return true;
    } catch (e) {
        log('warning', `مكتبة ${packageName} غير مثبتة`);
        return false;
    }
}

console.log('\n' + '='.repeat(60));
console.log('🧪 التحقق من نظام Bluetooth');
console.log('='.repeat(60) + '\n');

let passed = 0;
let failed = 0;

// ==================== التحقق من الملفات ====================

console.log(colors.bold + '📁 الملفات الأساسية:' + colors.reset);
console.log('-'.repeat(60));

const files = [
    ['advanced-v5.html', '🌐 الموقع الرئيسي'],
    ['bridge.js', '🌉 الخادم'],
    ['bridge-enhanced.js', '🌉 الخادم المحسّن'],
    ['plants-advanced.js', '🌿 قاعدة النباتات'],
    ['ai-advanced.js', '🧠 محرك التحليل'],
    ['ARDUINO_CODE_COMPLETE.ino', '🤖 كود Arduino'],
    ['bluetooth-test.js', '🧪 اختبار Bluetooth'],
    ['bluetooth-manager.js', '🔗 مدير Bluetooth'],
    ['bluetooth-integration.js', '📱 دمج Bluetooth'],
    ['QUICK_BLUETOOTH_SETUP.md', '📖 إعدادات سريعة']
];

files.forEach(([file, desc]) => {
    if (checkFile(file, desc)) {
        passed++;
    } else {
        failed++;
    }
});

console.log();

// ==================== التحقق من المكتبات ====================

console.log(colors.bold + '📦 المكتبات المطلوبة:' + colors.reset);
console.log('-'.repeat(60));

const packages = ['express', 'cors', 'ws'];
let missingPackages = 0;

packages.forEach(pkg => {
    if (!checkPackage(pkg)) {
        missingPackages++;
    }
});

console.log();

// ==================== التحقق من الإعدادات ====================

console.log(colors.bold + '⚙️  الإعدادات:' + colors.reset);
console.log('-'.repeat(60));

// تحقق من package.json
if (checkFile('package.json', 'ملف package.json')) {
    const pkg = require('./package.json');
    
    if (pkg.name && pkg.version) {
        log('ok', `المشروع: ${pkg.name} v${pkg.version}`);
    }
    
    if (pkg.dependencies) {
        if (pkg.dependencies.express) {
            log('ok', 'Express مثبتة');
        } else {
            log('error', 'Express غير مثبتة');
        }
    }
} else {
    log('error', 'package.json غير موجود');
}

console.log();

// ==================== قائمة المراجعة ====================

console.log(colors.bold + '✅ قائمة المراجعة:' + colors.reset);
console.log('-'.repeat(60));

const checklist = [
    ['اختبر الاتصال', 'node bluetooth-test.js COM5'],
    ['شغّل Bridge', 'npm start'],
    ['افتح الموقع', 'http://localhost:3000/advanced-v5.html'],
    ['تحقق من البيانات', 'يجب أن تملأ تلقائياً كل 5 ثواني'],
    ['اختبر الأوضاع', 'جرّب Auto و Manual'],
    ['اختبر اللغات', 'جرّب جميع 10 لغات']
];

checklist.forEach((item, index) => {
    log('info', `${index + 1}. ${item[0]}: ${item[1]}`);
});

console.log();

// ==================== النتيجة النهائية ====================

console.log(colors.bold + '📊 النتائج:' + colors.reset);
console.log('-'.repeat(60));

const totalChecks = passed + failed;
const percentage = (passed / totalChecks) * 100;

log('info', `الملفات الموجودة: ${passed}/${totalChecks} (${percentage.toFixed(0)}%)`);

if (missingPackages > 0) {
    log('warning', `مكتبات ناقصة: ${missingPackages}`);
    log('info', 'شغّل: npm install');
} else {
    log('ok', 'جميع المكتبات مثبتة');
}

console.log();

// ==================== التوصيات ====================

console.log(colors.bold + '💡 التوصيات:' + colors.reset);
console.log('-'.repeat(60));

if (failed === 0 && missingPackages === 0) {
    log('ok', 'نظامك جاهز 100%! 🎉');
    log('info', 'الخطوة التالية: node bluetooth-test.js');
} else {
    if (failed > 0) {
        log('error', `${failed} ملف(ات) ناقص(ة) - تأكد من المسار الصحيح`);
    }
    if (missingPackages > 0) {
        log('error', `${missingPackages} مكتبة(ات) ناقصة - شغّل: npm install`);
    }
}

console.log();

// ==================== الملفات التفصيلية ====================

console.log(colors.bold + '📚 الملفات المتوفرة:' + colors.reset);
console.log('-'.repeat(60));

const categories = {
    'الموقع': ['advanced-v5.html', 'advanced-v5-with-bluetooth.html'],
    'الخادم': ['bridge.js', 'bridge-enhanced.js'],
    'Bluetooth': ['bluetooth-test.js', 'bluetooth-manager.js', 'bluetooth-integration.js'],
    'الأدلة': [
        'QUICK_BLUETOOTH_SETUP.md',
        'BLUETOOTH_CONNECTION_GUIDE.md',
        'BLUETOOTH_COMPLETE_GUIDE.md',
        'BLUETOOTH_SYSTEM_READY.md'
    ]
};

Object.entries(categories).forEach(([category, files]) => {
    log('info', `${category}:`);
    files.forEach(file => {
        const exists = fs.existsSync(path.join(__dirname, file));
        const icon = exists ? '✓' : '✗';
        console.log(`   ${icon} ${file}`);
    });
});

console.log();

// ==================== الملفات الاختياري ====================

console.log(colors.bold + '🎨 الملفات الإضافية:' + colors.reset);
console.log('-'.repeat(60));

const optional = [
    'plants-multilingual.js',
    'plants-db.js',
    'i18n.js'
];

optional.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    if (exists) {
        log('ok', file);
    }
});

console.log();

// ==================== الخطوات التالية ====================

console.log(colors.bold + '🚀 الخطوات التالية:' + colors.reset);
console.log('='.repeat(60));

console.log(`
1️⃣  اختبر الاتصال:
    ${colors.bold}node bluetooth-test.js COM5${colors.reset}

2️⃣  شغّل الخادم:
    ${colors.bold}npm start${colors.reset}

3️⃣  افتح الموقع:
    ${colors.bold}http://localhost:3000/advanced-v5.html${colors.reset}

4️⃣  اقرأ الأدلة:
    ${colors.bold}📖 QUICK_BLUETOOTH_SETUP.md${colors.reset}

5️⃣  استمتع! 🎉
`);

console.log('='.repeat(60));
console.log();

process.exit(failed > 0 || missingPackages > 0 ? 1 : 0);
