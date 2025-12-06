// ============================================================
// 🌉 جسر Bluetooth Node.js - Bluetooth to HTTP Bridge
// ============================================================

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// CORS و Body Parser
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ============================================================
// ⚙️ إعدادات البلوتوث
// ============================================================

let port = null;
let parser = null;
let isConnected = false;
let lastSensorData = {};

// قائمة المنافذ المتاحة (اختيار تلقائي HC-05)
const BLUETOOTH_PORTS = ['COM3', 'COM4', 'COM5', '/dev/ttyUSB0', '/dev/ttyUSB1'];
const BAUD_RATE = 9600;

// ============================================================
// 📡 محاكاة بيانات Bluetooth (بدون المكتبة)
// ============================================================

let simulationInterval = null;

async function initBluetoothConnection() {
  console.log('🔍 تهيئة نظام المحاكاة...');
  
  try {
    console.log('✅ وضع المحاكاة مفعل - سيتم توليد بيانات تجريبية');
    console.log('📋 ملاحظة: عند توصيل HC-05 فعلي، استبدل هذه الدالة بـ SerialPort');
    
    isConnected = true;
    
    // محاكاة البيانات كل 5 ثوان
    simulationInterval = setInterval(() => {
      const mockData = generateMockSensorData();
      console.log(`📨 بيانات المحاكاة: ${mockData}`);
      processSensorData(mockData);
    }, 5000);
    
    return true;
  } catch (error) {
    console.error('❌ خطأ في التهيئة:', error.message);
    return false;
  }
}

// توليد بيانات وهمية للاختبار
function generateMockSensorData() {
  const temp = (20 + Math.random() * 10).toFixed(1);
  const moisture = (60 + Math.random() * 20).toFixed(1);
  const ph = (6 + Math.random() * 1).toFixed(1);
  const n = Math.round(40 + Math.random() * 40);
  const p = Math.round(30 + Math.random() * 30);
  const k = Math.round(40 + Math.random() * 30);
  
  return `TEMP:${temp},MOISTURE:${moisture},PH:${ph},N:${n},P:${p},K:${k}`;
}

// ============================================================
// 📊 معالجة بيانات المستشعرات
// ============================================================

function processSensorData(rawData) {
  try {
    // محاولة تحليل البيانات بصيغ مختلفة
    let data = {};

    // الصيغة 1: JSON format from Arduino
    if (rawData.trim().startsWith('{')) {
      try {
        const jsonData = JSON.parse(rawData.trim());
        // Map Arduino JSON keys to standard keys
        data.TEMP = jsonData.temperature || jsonData.TEMP || jsonData.temp;
        data.MOISTURE = jsonData.moisture || jsonData.MOISTURE;
        data.PH = jsonData.pH || jsonData.PH || jsonData.ph;
        data.N = jsonData.nitrogen || jsonData.N || jsonData.n;
        data.P = jsonData.phosphorus || jsonData.P || jsonData.p;
        data.K = jsonData.potassium || jsonData.K || jsonData.k;
        data.HUMIDITY = jsonData.humidity || jsonData.HUMIDITY;
      } catch (e) {
        console.log('JSON parse error, trying other formats');
      }
    }
    // الصيغة 2: TEMP:22.5,MOISTURE:65,PH:6.5,N:75,P:60,K:70
    else if (rawData.includes(':') && rawData.includes(',')) {
      const pairs = rawData.split(',');
      pairs.forEach(pair => {
        const [key, value] = pair.split(':').map(s => s.trim());
        if (key && value) {
          const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
          data[cleanKey] = parseFloat(value);
        }
      });
    }
    // الصيغة 2: JSON
    else if (rawData.startsWith('{')) {
      data = JSON.parse(rawData);
    }
    // الصيغة 3: قيم مفصولة بفواصل (ترتيب ثابت: temp, moisture, pH, N, P, K)
    else if (rawData.includes(',')) {
      const values = rawData.split(',').map(v => parseFloat(v.trim()));
      if (values.length >= 6) {
        data = {
          TEMP: values[0],
          MOISTURE: values[1],
          PH: values[2],
          N: values[3],
          P: values[4],
          K: values[5]
        };
      }
    }

    // تحديث البيانات الأخيرة
    if (Object.keys(data).length > 0) {
      lastSensorData = {
        ...data,
        timestamp: new Date().toISOString()
      };
      console.log('✅ تم معالجة البيانات:', lastSensorData);
    }
  } catch (error) {
    console.error('⚠️ خطأ في معالجة البيانات:', error.message);
  }
}

// ============================================================
// 🌐 نقاط النهاية (API Endpoints)
// ============================================================

// GET /status - التحقق من حالة الاتصال
app.get('/api/status', (req, res) => {
  res.json({
    connected: isConnected,
    lastUpdate: lastSensorData.timestamp || null,
    status: isConnected ? 'متصل' : 'غير متصل'
  });
});

// GET /api/data - الحصول على آخر بيانات المستشعرات
app.get('/api/data', (req, res) => {
  if (!isConnected) {
    return res.status(503).json({
      error: 'جهاز Bluetooth غير متصل',
      code: 'BLUETOOTH_DISCONNECTED'
    });
  }

  if (Object.keys(lastSensorData).length === 0) {
    return res.status(204).json({
      message: 'لم تصل بيانات بعد'
    });
  }

  res.json(lastSensorData);
});

// POST /api/command - إرسال أمر إلى الأردوينو
app.post('/api/command', (req, res) => {
  const { command } = req.body;

  if (!isConnected || !port) {
    return res.status(503).json({
      error: 'جهاز Bluetooth غير متصل',
      code: 'BLUETOOTH_DISCONNECTED'
    });
  }

  try {
    port.write(command + '\n');
    console.log(`📤 أمر مرسل: ${command}`);
    res.json({
      success: true,
      message: 'تم إرسال الأمر بنجاح',
      command: command
    });
  } catch (error) {
    res.status(500).json({
      error: 'خطأ في إرسال الأمر',
      details: error.message
    });
  }
});

// GET /api/history - الحصول على سجل البيانات (في الذاكرة)
let dataHistory = [];
const MAX_HISTORY = 100;

app.get('/api/history', (req, res) => {
  res.json({
    data: dataHistory,
    count: dataHistory.length,
    limit: MAX_HISTORY
  });
});

// WebSocket للتحديثات الفورية
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

let wsClients = [];

wss.on('connection', (ws) => {
  console.log('🔌 متصفح جديد متصل');
  wsClients.push(ws);

  // إرسال البيانات الحالية
  ws.send(JSON.stringify({
    type: 'status',
    connected: isConnected,
    data: lastSensorData
  }));

  ws.on('close', () => {
    console.log('🔌 متصفح قطع الاتصال');
    wsClients = wsClients.filter(client => client !== ws);
  });
});

// ============================================================
// 📤 بث البيانات للمتصفحات المتصلة
// ============================================================

function broadcastData() {
  const message = JSON.stringify({
    type: 'data',
    data: lastSensorData,
    timestamp: new Date().toISOString()
  });

  wsClients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}

// إضافة بيانات جديدة إلى السجل
setInterval(() => {
  if (Object.keys(lastSensorData).length > 0) {
    dataHistory.unshift({
      ...lastSensorData,
      id: dataHistory.length + 1
    });

    if (dataHistory.length > MAX_HISTORY) {
      dataHistory.pop();
    }

    broadcastData();
  }
}, 5000);

// ============================================================
// 🚀 بدء الخادم
// ============================================================

const server = app.listen(PORT, async () => {
  console.log('\n╔═══════════════════════════════════╗');
  console.log('║  🌉 جسر Bluetooth Node.js 🌉     ║');
  console.log('╚═══════════════════════════════════╝\n');
  console.log(`🚀 الخادم يعمل على: http://localhost:${PORT}`);
  console.log(`📊 البيانات متاحة على: http://localhost:${PORT}/api/data`);
  console.log(`📱 WebSocket متاح على: ws://localhost:${PORT}\n`);

  // محاولة الاتصال بـ Bluetooth
  await initBluetoothConnection();
});

// ترقية HTTP إلى WebSocket
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// ============================================================
// 🛑 الإغلاق الآمن
// ============================================================

process.on('SIGINT', () => {
  console.log('\n🛑 جاري إغلاق الجسر...');
  if (port && port.isOpen) {
    port.close(() => {
      console.log('✅ تم إغلاق الاتصال');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

console.log('⏳ بدء الجسر... اضغط Ctrl+C للإيقاف');
