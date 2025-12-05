#!/usr/bin/env node

/**
 * 🔧 أداة اختبار الاتصال بـ Bridge
 * للتحقق من أن البيانات تصل بشكل صحيح
 */

const http = require('http');
const WebSocket = require('ws');

const HOST = 'localhost';
const PORT = 3000;

console.log('\n╔════════════════════════════════════╗');
console.log('║  🔧 أداة اختبار الاتصال  🔧     ║');
console.log('╚════════════════════════════════════╝\n');

// اختبار HTTP API
console.log('📡 اختبار HTTP API...\n');

http.get(`http://${HOST}:${PORT}/api/status`, (res) => {
    let data = '';
    
    res.on('data', chunk => {
        data += chunk;
    });
    
    res.on('end', () => {
        try {
            const status = JSON.parse(data);
            console.log('✅ حالة الخادم:');
            console.table(status);
            console.log('');
            
            // اختبار البيانات
            http.get(`http://${HOST}:${PORT}/api/data`, (res) => {
                let data = '';
                
                res.on('data', chunk => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const sensorData = JSON.parse(data);
                        console.log('📊 آخر البيانات المستقبلة:');
                        console.table(sensorData.data);
                        
                        // اختبار WebSocket
                        console.log('\n📡 اختبار WebSocket...\n');
                        testWebSocket();
                    } catch (e) {
                        console.error('❌ خطأ:', e.message);
                    }
                });
            }).on('error', (e) => {
                console.error('❌ خطأ في الاتصال:', e.message);
                process.exit(1);
            });
        } catch (e) {
            console.error('❌ خطأ:', e.message);
            process.exit(1);
        }
    });
}).on('error', (e) => {
    console.error('❌ لا يمكن الاتصال بـ Bridge على http://' + HOST + ':' + PORT);
    console.log('\n💡 تأكد من:');
    console.log('   1. Bridge يعمل (npm start)');
    console.log('   2. Port 3000 متاح');
    console.log('   3. لا توجد تطبيقات أخرى على نفس الـ Port');
    process.exit(1);
});

// اختبار WebSocket
function testWebSocket() {
    const wsUrl = `ws://${HOST}:${PORT}`;
    let dataReceived = 0;
    
    console.log(`🔗 الاتصال بـ: ${wsUrl}\n`);
    
    const ws = new WebSocket(wsUrl);
    
    ws.on('open', () => {
        console.log('✅ متصل بـ WebSocket');
        console.log('📨 في انتظار البيانات...\n');
    });
    
    ws.on('message', (data) => {
        try {
            const parsed = JSON.parse(data);
            dataReceived++;
            
            console.log(`📊 بيانة رقم ${dataReceived}:`);
            console.log(`   • درجة الحرارة: ${parsed.TEMP}°C`);
            console.log(`   • الرطوبة: ${parsed.MOISTURE}%`);
            console.log(`   • الـ pH: ${parsed.PH}`);
            console.log(`   • النيتروجين: ${parsed.N} ppm`);
            console.log(`   • الفسفور: ${parsed.P} ppm`);
            console.log(`   • البوتاسيوم: ${parsed.K} ppm`);
            console.log(`   • الوقت: ${new Date(parsed.timestamp).toLocaleString('ar-SA')}`);
            console.log('');
        } catch (e) {
            console.error('❌ خطأ في فك البيانات:', e.message);
        }
    });
    
    ws.on('error', (error) => {
        console.error('❌ خطأ WebSocket:', error.message);
        process.exit(1);
    });
    
    ws.on('close', () => {
        console.log('\n⛔ تم إغلاق الاتصال');
        console.log(`📊 تم استقبال ${dataReceived} بيانة بنجاح`);
        process.exit(0);
    });
    
    // إغلاق بعد 15 ثانية
    setTimeout(() => {
        console.log('\n⏱️ انتهى الاختبار');
        ws.close();
    }, 15000);
}
