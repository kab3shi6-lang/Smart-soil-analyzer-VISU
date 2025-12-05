#!/usr/bin/env node

/**
 * 🌉 Smart Soil Analyzer - Bridge Server (محسّن)
 * يتصل بـ HC-05 Bluetooth ويبث البيانات عبر WebSocket و HTTP API
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');

// ⚙️ الإعدادات الأساسية
const PORT = process.env.PORT || 3000;
const MOCK_MODE = process.env.MOCK_MODE !== 'false'; // تفعيل المحاكاة بشكل افتراضي

console.log('\n╔═══════════════════════════════════╗');
console.log('║  🌉 جسر البيانات Node.js  🌉     ║');
console.log('╚═══════════════════════════════════╝\n');

// 📦 إنشاء تطبيق Express
const app = express();
const server = http.createServer(app);

// 🔌 إعدادات CORS و Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 📡 WebSocket Server
const wss = new WebSocket.Server({ server });

// 🗂️ متغيرات عامة
let lastData = null;
let dataCount = 0;
let connectedClients = 0;
let serialPort = null;
let isSerialConnected = false;

// ✅ البيانات الأخيرة
let sensorData = {
    TEMP: '--',
    MOISTURE: '--',
    PH: '--',
    N: '--',
    P: '--',
    K: '--',
    timestamp: new Date().toISOString()
};

// 🚀 محاكاة البيانات (لغرض الاختبار)
function generateMockData() {
    return {
        TEMP: (20 + Math.random() * 10).toFixed(1),
        MOISTURE: (50 + Math.random() * 40).toFixed(1),
        PH: (5.5 + Math.random() * 2).toFixed(1),
        N: Math.floor(30 + Math.random() * 100),
        P: Math.floor(30 + Math.random() * 70),
        K: Math.floor(40 + Math.random() * 80),
        timestamp: new Date().toISOString()
    };
}

// 📊 معالجة البيانات
function processSensorData(rawData) {
    try {
        // محاولة فك بيانات النص الخام
        // الصيغ المدعومة:
        // 1. JSON: {"TEMP":25,"MOISTURE":60,...}
        // 2. String: TEMP:25,MOISTURE:60,PH:6.5,N:50,P:40,K:60
        
        let data;
        
        // محاولة فك JSON
        if (rawData.startsWith('{')) {
            data = JSON.parse(rawData);
        } else {
            // فك صيغة String
            const parts = rawData.split(',');
            data = {};
            
            parts.forEach(part => {
                const [key, value] = part.trim().split(':');
                if (key && value) {
                    data[key.trim()] = isNaN(value) ? value : parseFloat(value);
                }
            });
        }
        
        // إضافة الطابع الزمني
        data.timestamp = new Date().toISOString();
        
        return data;
    } catch (error) {
        console.error('❌ خطأ في فك البيانات:', error.message);
        return null;
    }
}

// 📡 بث البيانات عبر WebSocket
function broadcastData(data) {
    if (!data) return;
    
    dataCount++;
    console.log(`\n📊 بيانة رقم ${dataCount} - ${new Date().toLocaleTimeString('ar-SA')}`);
    console.log(`✅ البيانات:`, data);
    console.log(`📱 العملاء المتصلون: ${connectedClients}`);
    
    // إرسال البيانات لجميع العملاء
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// 🔵 معالج اتصالات WebSocket
wss.on('connection', (ws) => {
    connectedClients++;
    console.log(`\n🔗 متصفح جديد متصل (إجمالي: ${connectedClients})`);
    
    // إرسال البيانات الأخيرة فوراً
    if (lastData) {
        ws.send(JSON.stringify(lastData));
    }
    
    // معالج الرسائل الواردة
    ws.on('message', (message) => {
        try {
            const msg = JSON.parse(message);
            console.log('📨 رسالة من المتصفح:', msg);
        } catch (e) {
            console.log('📨 رسالة نصية:', message);
        }
    });
    
    // معالج الخطأ
    ws.on('error', (error) => {
        console.error('❌ خطأ WebSocket:', error.message);
    });
    
    // معالج القطع
    ws.on('close', () => {
        connectedClients--;
        console.log(`\n🔌 قطع الاتصال (المتبقي: ${connectedClients})`);
    });
});

// 🔷 محاولة الاتصال بـ Bluetooth (إذا كان متوفراً)
function initializeSerialConnection() {
    try {
        const SerialPort = require('serialport');
        const { ReadlineParser } = require('@serialport/parser-readline');
        
        console.log('🔍 البحث عن أجهزة متسلسلة...\n');
        
        SerialPort.list().then(ports => {
            if (ports.length === 0) {
                console.log('⚠️ لم يتم العثور على أجهزة متسلسلة');
                console.log('📌 سيتم استخدام المحاكاة بدلاً منها\n');
                initializeMockMode();
                return;
            }
            
            console.log('✅ الأجهزة المتسلسلة المتاحة:');
            ports.forEach((port, index) => {
                console.log(`   ${index + 1}. ${port.path} - ${port.manufacturer || 'غير معروف'}`);
            });
            
            // استخدام أول جهاز (عادة HC-05)
            const comPort = ports[0].path;
            console.log(`\n🔌 محاولة الاتصال بـ: ${comPort}\n`);
            
            serialPort = new SerialPort.SerialPort({
                path: comPort,
                baudRate: 9600,
                autoOpen: true
            });
            
            const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));
            
            serialPort.on('open', () => {
                isSerialConnected = true;
                console.log(`✅ متصل بـ ${comPort}`);
                console.log(`🚀 في انتظار البيانات من Bluetooth...\n`);
            });
            
            parser.on('data', (line) => {
                const data = processSensorData(line.trim());
                if (data && Object.keys(data).length > 1) {
                    sensorData = data;
                    lastData = data;
                    broadcastData(data);
                }
            });
            
            serialPort.on('error', (error) => {
                console.error('❌ خطأ في المنفذ المتسلسل:', error.message);
                initializeMockMode();
            });
            
            serialPort.on('close', () => {
                isSerialConnected = false;
                console.log('⚠️ تم قطع الاتصال بـ Bluetooth');
                initializeMockMode();
            });
        });
    } catch (error) {
        console.log('⚠️ لم يتم العثور على serialport package');
        console.log('📌 تفعيل المحاكاة بدلاً منها\n');
        initializeMockMode();
    }
}

// 🎮 تفعيل وضع المحاكاة
function initializeMockMode() {
    if (!MOCK_MODE) return;
    
    console.log('✅ وضع المحاكاة مفعّل - توليد بيانات تجريبية كل 5 ثواني\n');
    
    setInterval(() => {
        const data = generateMockData();
        console.log(`📨 بيانات المحاكاة: TEMP:${data.TEMP},MOISTURE:${data.MOISTURE},PH:${data.PH},N:${data.N},P:${data.P},K:${data.K}`);
        sensorData = data;
        lastData = data;
        broadcastData(data);
    }, 5000);
}

// 📡 نقاط النهاية HTTP API
app.get('/api/data', (req, res) => {
    res.json({
        success: true,
        data: sensorData,
        status: isSerialConnected ? 'connected' : 'mock',
        clients: connectedClients,
        dataCount: dataCount
    });
});

app.get('/api/status', (req, res) => {
    res.json({
        serverRunning: true,
        port: PORT,
        wsConnections: connectedClients,
        serialConnected: isSerialConnected,
        mockMode: MOCK_MODE,
        uptime: process.uptime()
    });
});

// ❌ معالج الأخطاء العامة
app.use((err, req, res, next) => {
    console.error('❌ خطأ:', err);
    res.status(500).json({ error: err.message });
});

// 🚀 بدء الخادم
server.listen(PORT, () => {
    console.log(`\n🚀 الخادم يعمل على: http://localhost:${PORT}`);
    console.log(`📊 البيانات متاحة على: http://localhost:${PORT}/api/data`);
    console.log(`📱 WebSocket متاح على: ws://localhost:${PORT}`);
    console.log(`\n📌 نصيحة: افتح http://localhost:${PORT}/advanced-v5.html\n`);
    
    // محاولة الاتصال بـ Bluetooth أو تفعيل المحاكاة
    setTimeout(() => {
        if (process.env.NO_SERIAL !== 'true') {
            initializeSerialConnection();
        } else {
            initializeMockMode();
        }
    }, 1000);
});

// معالج الخروج
process.on('SIGINT', () => {
    console.log('\n\n⛔ إيقاف الخادم...');
    if (serialPort && isSerialConnected) {
        serialPort.close();
    }
    server.close();
    process.exit(0);
});
