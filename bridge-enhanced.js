const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');

// محاولة استخدام Serial Port (اختياري)
let SerialPort;
let serialPort = null;

try {
    SerialPort = require('serialport').SerialPort;
    console.log('✅ مكتبة SerialPort محملة');
} catch (e) {
    console.log('⚠️  SerialPort غير متوفرة - استخدام البيانات المحاكاة فقط');
    console.log('   لتثبيتها: npm install serialport');
    SerialPort = null;
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.static(__dirname));

// متغيرات البيانات الحالية
let currentSensorData = {
    temperature: 25.5,
    humidity: 60.0,
    moisture: 75.5,
    pH: 6.5,
    nitrogen: 50,
    phosphorus: 40,
    potassium: 30
};

// ==================== الاتصال بـ Serial/Bluetooth ====================

async function initializeSerialConnection(portPath = null, baudRate = 9600) {
    if (!SerialPort) {
        console.log('⚠️  SerialPort غير متوفر');
        return false;
    }

    try {
        // البحث عن المنافذ المتاحة
        const { SerialPortFactory } = require('serialport');
        const ports = await SerialPortFactory.list();
        
        console.log('\n📋 المنافذ المتاحة:');
        ports.forEach((port, index) => {
            console.log(`  [${index}] ${port.path} - ${port.manufacturer || 'غير معروف'}`);
        });

        // استخدم المنفذ المحدد أو البحث عن HC-05
        let targetPort = portPath;
        if (!targetPort && ports.length > 0) {
            // ابحث عن HC-05 أولاً
            const hc05Port = ports.find(p => p.manufacturer?.includes('Silicon'));
            targetPort = hc05Port ? hc05Port.path : ports[0].path;
            console.log(`\n🔍 استخدام المنفذ: ${targetPort}`);
        }

        if (!targetPort) {
            console.log('❌ لم يتم العثور على منفذ متاح');
            return false;
        }

        serialPort = new SerialPort({
            path: targetPort,
            baudRate: baudRate,
            autoOpen: true
        });

        serialPort.on('open', () => {
            console.log(`✅ تم الاتصال بـ ${targetPort} (${baudRate} baud)`);
        });

        serialPort.on('data', (data) => {
            const message = data.toString().trim();
            if (message) {
                try {
                    // حاول تحليل JSON
                    const jsonData = JSON.parse(message);
                    currentSensorData = jsonData;
                    console.log('📊 بيانات مستقبلة:', jsonData);
                    
                    // بث للمتصلين
                    broadcastToClients(jsonData);
                } catch (e) {
                    console.log('⚠️  بيانات غير صالحة:', message);
                }
            }
        });

        serialPort.on('error', (err) => {
            console.error('❌ خطأ في Serial:', err.message);
            // حاول إعادة الاتصال بعد 5 ثواني
            setTimeout(() => initializeSerialConnection(targetPort, baudRate), 5000);
        });

        return true;
    } catch (error) {
        console.error('❌ خطأ في تهيئة الاتصال:', error.message);
        return false;
    }
}

// ==================== إرسال البيانات للمتصلين ====================

function broadcastToClients(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// ==================== بيانات محاكاة ====================

function generateMockData() {
    return {
        temperature: 20 + Math.random() * 15,
        humidity: 40 + Math.random() * 40,
        moisture: 50 + Math.random() * 50,
        pH: 5 + Math.random() * 4,
        nitrogen: 30 + Math.random() * 70,
        phosphorus: 20 + Math.random() * 80,
        potassium: 40 + Math.random() * 60
    };
}

// إذا لم يكن هناك اتصال Serial، استخدم البيانات المحاكاة
if (!SerialPort) {
    setInterval(() => {
        currentSensorData = generateMockData();
        broadcastToClients(currentSensorData);
    }, 5000);
    console.log('🤖 استخدام البيانات المحاكاة (كل 5 ثواني)');
}

// ==================== WebSocket ====================

wss.on('connection', (ws, req) => {
    const clientIP = req.socket.remoteAddress;
    console.log(`\n👤 عميل جديد متصل: ${clientIP}`);
    console.log(`   إجمالي المتصلين: ${wss.clients.size}`);

    // أرسل البيانات الحالية مباشرة
    ws.send(JSON.stringify(currentSensorData));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('📨 رسالة من العميل:', data);
            
            // إذا كانت بيانات حقيقية، حدّث
            if (data.temperature !== undefined) {
                currentSensorData = data;
                broadcastToClients(data);
            }
        } catch (e) {
            console.log('⚠️  رسالة غير صالحة:', message);
        }
    });

    ws.on('close', () => {
        console.log(`👤 عميل قطع الاتصال: ${clientIP}`);
        console.log(`   إجمالي المتصلين: ${wss.clients.size}`);
    });

    ws.on('error', (error) => {
        console.error(`❌ خطأ WebSocket: ${error.message}`);
    });
});

// ==================== HTTP Routes ====================

app.get('/api/sensors', (req, res) => {
    res.json(currentSensorData);
});

app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        currentData: currentSensorData,
        connectedClients: wss.clients.size,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/ports', async (req, res) => {
    if (!SerialPort) {
        return res.json({ ports: [], error: 'SerialPort غير متوفر' });
    }

    try {
        const { SerialPortFactory } = require('serialport');
        const ports = await SerialPortFactory.list();
        res.json({ ports });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/connect/:port', async (req, res) => {
    const portPath = `/dev/${req.params.port}` || `COM${req.params.port}`;
    const success = await initializeSerialConnection(portPath);
    res.json({ success, port: portPath });
});

// ==================== بدء الخادم ====================

const PORT = 3000;

// حاول الاتصال بـ Serial عند البدء
if (SerialPort) {
    initializeSerialConnection().catch(err => {
        console.log('⚠️  لم يتمكن من الاتصال بـ Serial - استخدام المحاكاة');
    });
}

server.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 Bridge مشغل بنجاح');
    console.log('='.repeat(50));
    console.log(`📍 الموقع: http://localhost:${PORT}`);
    console.log(`📍 الموقع الكامل: http://localhost:${PORT}/advanced-v5.html`);
    console.log(`📨 WebSocket: ws://localhost:${PORT}`);
    console.log(`🔌 API: http://localhost:${PORT}/api/status`);
    console.log('='.repeat(50));
    console.log('💡 نصائح:');
    console.log('  1. افتح الموقع في المتصفح');
    console.log('  2. تحقق من Web Console للرسائل');
    console.log('  3. تأكد من توصيل Arduino و HC-05');
    console.log('='.repeat(50) + '\n');
});

// ==================== معالجة الإغلاق ====================

process.on('SIGINT', () => {
    console.log('\n⏹️  إيقاف Bridge...');
    if (serialPort) {
        serialPort.close();
    }
    server.close();
    process.exit(0);
});

module.exports = { app, wss, initializeSerialConnection };
