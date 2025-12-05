/**
 * Bluetooth Testing Suite
 * اختبر اتصال Bluetooth الخاص بك
 * 
 * الاستخدام:
 * node bluetooth-test.js [port] [baudrate]
 * 
 * مثال:
 * node bluetooth-test.js COM5 9600
 * node bluetooth-test.js /dev/ttyUSB0 9600
 */

const fs = require('fs');

// محاولة استيراد SerialPort
let SerialPort;
try {
    SerialPort = require('serialport').SerialPort;
} catch (e) {
    console.error('❌ serialport غير مثبتة');
    console.log('اتبع الخطوات:');
    console.log('  npm install serialport');
    process.exit(1);
}

// ==================== الإعدادات ====================

const args = process.argv.slice(2);
const PORT = args[0] || (process.platform === 'win32' ? 'COM5' : '/dev/ttyUSB0');
const BAUD_RATE = parseInt(args[1] || 9600);

console.log('\n' + '='.repeat(50));
console.log('🧪 Bluetooth Connection Test');
console.log('='.repeat(50));
console.log(`📍 المنفذ: ${PORT}`);
console.log(`⚡ السرعة: ${BAUD_RATE} baud`);
console.log('='.repeat(50) + '\n');

// ==================== اختبر المنافذ ====================

async function testPorts() {
    console.log('🔍 البحث عن المنافذ المتاحة...\n');

    try {
        const { SerialPortFactory } = require('serialport');
        const ports = await SerialPortFactory.list();

        if (ports.length === 0) {
            console.log('❌ لم يتم العثور على أي منافذ متاحة');
            console.log('✓ تأكد من توصيل الجهاز');
            return [];
        }

        console.log(`✅ وجدت ${ports.length} منفذ(ة):\n`);
        ports.forEach((port, index) => {
            console.log(`[${index}] ${port.path}`);
            console.log(`    الصانع: ${port.manufacturer || 'غير معروف'}`);
            console.log(`    الوصف: ${port.description || 'بدون وصف'}`);
            console.log(`    رقم السيريال: ${port.serialNumber || 'لا يتوفر'}`);
            console.log();
        });

        return ports;
    } catch (error) {
        console.error('❌ خطأ:', error.message);
        return [];
    }
}

// ==================== اتصل واختبر ====================

async function testConnection() {
    console.log(`\n⏳ جاري الاتصال بـ ${PORT}...\n`);

    return new Promise((resolve) => {
        const port = new SerialPort({
            path: PORT,
            baudRate: BAUD_RATE,
            autoOpen: false
        });

        let dataCount = 0;
        let errorCount = 0;
        let lastData = null;
        const startTime = Date.now();
        const testDuration = 30000; // 30 ثانية

        // حدث الفتح
        port.on('open', () => {
            console.log(`✅ تم الاتصال بـ ${PORT} (${BAUD_RATE} baud)`);
            console.log('⏳ جاري استقبال البيانات... (30 ثانية)\n');
            console.log('[الوقت]           [البيانات]');
            console.log('-'.repeat(50));
        });

        // استقبل البيانات
        port.on('data', (data) => {
            dataCount++;
            const timestamp = new Date().toLocaleTimeString('ar-SA');
            const text = data.toString().trim();

            if (text) {
                console.log(`${timestamp}    ${text.substring(0, 40)}...`);
                
                try {
                    lastData = JSON.parse(text);
                } catch (e) {
                    // ليست JSON
                }
            }
        });

        // حدث الخطأ
        port.on('error', (error) => {
            errorCount++;
            console.error(`\n❌ خطأ: ${error.message}`);
        });

        // حاول الفتح
        port.open((error) => {
            if (error) {
                console.error(`❌ فشل الاتصال: ${error.message}`);
                console.log('\nحلول:');
                console.log('  1. تأكد من توصيل الجهاز');
                console.log('  2. حاول منفذ مختلف: node bluetooth-test.js COM6');
                console.log('  3. جرّب سرعة مختلفة: node bluetooth-test.js COM5 38400');
                resolve(false);
                return;
            }

            // انتظر 30 ثانية ثم أغلق
            setTimeout(() => {
                console.log('-'.repeat(50));
                port.close((error) => {
                    if (error) console.error('خطأ في الإغلاق:', error);
                    resolve(dataCount > 0);
                });
            }, testDuration);
        });
    });
}

// ==================== عرض النتائج ====================

async function showResults(success, dataCount) {
    console.log('\n' + '='.repeat(50));
    console.log('📊 نتائج الاختبار');
    console.log('='.repeat(50) + '\n');

    if (success) {
        console.log('✅ النتيجة: النجاح');
        console.log(`   - استقبلت ${dataCount} حزمة بيانات`);
        console.log('   - الاتصال مستقر');
        console.log('\n✨ يمكنك الآن:');
        console.log('   1. تشغيل Bridge: npm start');
        console.log('   2. فتح الموقع: http://localhost:3000');
        console.log('   3. البيانات ستملأ تلقائياً في الحقول');
    } else {
        console.log('❌ النتيجة: فشل');
        console.log('   - لم يتم استقبال بيانات');
        console.log('   - تحقق من الاتصالات');
        console.log('\n🔧 استكشاف الأخطاء:');
        console.log('   1. هل Arduino بعث البيانات؟');
        console.log('      → افتح Serial Monitor في Arduino IDE');
        console.log('   2. هل المنفذ صحيح؟');
        console.log('      → جرّب: node bluetooth-test.js');
        console.log('      → حدد المنفذ من القائمة');
        console.log('   3. هل السرعة صحيحة (9600)?');
        console.log('      → جرّب: node bluetooth-test.js COM5 38400');
        console.log('   4. هل HC-05 موصول؟');
        console.log('      → تأكد من TX/RX والطاقة');
    }

    console.log('\n' + '='.repeat(50));
}

// ==================== البرنامج الرئيسي ====================

async function main() {
    try {
        // اختبر المنافذ
        const ports = await testPorts();

        // اتصل واختبر
        const success = await testConnection();

        // عرض النتائج
        await showResults(success, 0);
    } catch (error) {
        console.error('❌ خطأ غير متوقع:', error);
    }
}

// شغّل البرنامج
main().catch(console.error);
