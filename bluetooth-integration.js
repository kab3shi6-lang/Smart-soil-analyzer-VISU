/**
 * Bluetooth Integration for Advanced Soil Analyzer
 * يجب أن يُضاف إلى advanced-v5.html
 * 
 * هذا الملف يوفر وظائف Bluetooth للاتصال المباشر من الموقع
 */

// ==================== متغيرات Bluetooth ====================

let bluetoothConnected = false;
let bluetoothManager = null;
let autoConnectAttempts = 0;
const MAX_AUTO_CONNECT_ATTEMPTS = 3;

// ==================== تهيئة Bluetooth ====================

async function initializeBluetoothConnection() {
    console.log('🔄 تهيئة اتصال Bluetooth...');

    try {
        // تحقق من توفر Web Serial API
        if (!navigator.serial) {
            console.log('⚠️  Web Serial API غير متوفرة');
            console.log('💡 استخدم Chrome 89+ أو Edge');
            return false;
        }

        // نسخة مبسطة من BluetoothManager
        bluetoothManager = {
            ports: [],
            isConnected: false,

            // احصل على المنافذ المتاحة
            async getPorts() {
                try {
                    const ports = await navigator.serial.getPorts();
                    this.ports = ports;
                    console.log(`🔍 وجدت ${ports.length} منفذ(ة)`);
                    return ports;
                } catch (error) {
                    console.error('❌ خطأ في البحث:', error);
                    return [];
                }
            },

            // اتصل بمنفذ
            async connect(portIndex = 0) {
                try {
                    let port = this.ports[portIndex];
                    
                    if (!port) {
                        // اطلب منفذ جديد
                        port = await navigator.serial.requestPort();
                    }

                    await port.open({ baudRate: 9600 });
                    this.port = port;
                    this.isConnected = true;

                    console.log('✅ اتصال Bluetooth نجح!');
                    updateBluetoothUI(true);
                    
                    // ابدأ قراءة البيانات
                    this.startReading();
                    return true;
                } catch (error) {
                    console.error('❌ فشل الاتصال:', error);
                    return false;
                }
            },

            // قراءة البيانات المستمرة
            async startReading() {
                const reader = this.port.readable.getReader();
                let buffer = '';

                try {
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;

                        const text = new TextDecoder().decode(value);
                        buffer += text;

                        // ابحث عن أسطر كاملة
                        while (buffer.includes('\n')) {
                            const lineEnd = buffer.indexOf('\n');
                            const line = buffer.substring(0, lineEnd).trim();
                            buffer = buffer.substring(lineEnd + 1);

                            if (line) {
                                try {
                                    const data = JSON.parse(line);
                                    handleBluetoothData(data);
                                } catch (e) {
                                    console.log('📝 ', line);
                                }
                            }
                        }
                    }
                } finally {
                    reader.releaseLock();
                    this.isConnected = false;
                    updateBluetoothUI(false);
                }
            },

            // قطع الاتصال
            async disconnect() {
                try {
                    if (this.port) {
                        await this.port.close();
                    }
                    this.isConnected = false;
                    updateBluetoothUI(false);
                    console.log('✅ تم قطع الاتصال');
                } catch (error) {
                    console.error('❌ خطأ في قطع الاتصال:', error);
                }
            }
        };

        // احصل على المنافذ المتاحة
        await bluetoothManager.getPorts();
        return true;
    } catch (error) {
        console.error('❌ خطأ في التهيئة:', error);
        return false;
    }
}

// ==================== معالجة بيانات Bluetooth ====================

function handleBluetoothData(data) {
    console.log('📊 بيانات Bluetooth:', data);

    // حدّث الحقول في الصفحة
    if (data.temperature !== undefined) {
        updateFieldValue('manualTemp', data.temperature);
    }
    if (data.humidity !== undefined) {
        updateFieldValue('manualHumidity', data.humidity);
    }
    if (data.moisture !== undefined) {
        updateFieldValue('manualMoisture', data.moisture);
    }
    if (data.pH !== undefined) {
        updateFieldValue('manualPH', data.pH);
    }
    if (data.nitrogen !== undefined) {
        updateFieldValue('manualNitrogen', data.nitrogen);
    }
    if (data.phosphorus !== undefined) {
        updateFieldValue('manualPhosphorus', data.phosphorus);
    }
    if (data.potassium !== undefined) {
        updateFieldValue('manualPotassium', data.potassium);
    }

    // أرسل أيضاً إلى Bridge
    sendToWebSocket(data);
}

function updateFieldValue(fieldId, value) {
    const field = document.getElementById(fieldId);
    if (field && !field.value) {
        // فقط ملأ الحقول الفارغة
        field.value = typeof value === 'number' 
            ? value.toFixed(2) 
            : value;
    }
}

// ==================== واجهة المستخدم ====================

function updateBluetoothUI(connected) {
    bluetoothConnected = connected;
    const statusEl = document.getElementById('bluetoothStatus');
    
    if (statusEl) {
        if (connected) {
            statusEl.innerHTML = '🟢 متصل';
            statusEl.style.color = 'green';
        } else {
            statusEl.innerHTML = '🔴 غير متصل';
            statusEl.style.color = 'red';
        }
    }
}

// ==================== أزرار التحكم ====================

async function connectToBluetoothUI() {
    if (bluetoothConnected) {
        await bluetoothManager.disconnect();
        return;
    }

    // حاول الاتصال
    const success = await bluetoothManager.connect();
    
    if (!success) {
        alert('فشل الاتصال. تأكد من:\n1. توصيل Arduino\n2. توصيل HC-05\n3. اختيار المنفذ الصحيح');
    }
}

// ==================== إضافة أزرار إلى الواجهة ====================

function addBluetoothUI() {
    // أضف مربع Bluetooth في أعلى الصفحة
    const header = document.querySelector('header') || document.querySelector('body');
    
    if (!document.getElementById('bluetoothPanel')) {
        const panel = document.createElement('div');
        panel.id = 'bluetoothPanel';
        panel.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 10px 20px;
            margin: 10px;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
            font-weight: bold;
        `;

        panel.innerHTML = `
            <div style="display: flex; gap: 15px; align-items: center;">
                <span>🔗 Bluetooth:</span>
                <span id="bluetoothStatus" style="font-size: 14px;">🔴 غير متصل</span>
            </div>
            <button 
                onclick="connectToBluetoothUI()"
                style="
                    background: white;
                    color: #667eea;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 12px;
                "
            >
                🔗 اتصل بـ HC-05
            </button>
        `;

        if (header) {
            header.insertAdjacentElement('afterbegin', panel);
        }
    }
}

// ==================== البدء التلقائي ====================

// نسخة مبسطة من WebSocket الحالية
function sendToWebSocket(data) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
}

// استدعِ عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    // تهيئة Bluetooth (إن أمكن)
    await initializeBluetoothConnection();
    
    // أضف واجهة المستخدم
    addBluetoothUI();
    
    console.log('✅ تم تهيئة Bluetooth');
});

// ==================== مثال متقدم: Auto Connect ====================

async function autoConnectBluetooth() {
    console.log('🔄 محاولة الاتصال التلقائي...');
    
    if (autoConnectAttempts >= MAX_AUTO_CONNECT_ATTEMPTS) {
        console.log('⚠️  تم تجاوز محاولات الاتصال');
        return;
    }

    autoConnectAttempts++;

    if (!bluetoothManager || !bluetoothManager.ports.length) {
        // لا توجد منافذ متاحة حالياً
        console.log('⏳ جاري البحث عن منافذ...');
        setTimeout(autoConnectBluetooth, 2000);
        return;
    }

    // جرّب الاتصال بأول منفذ
    const success = await bluetoothManager.connect(0);
    
    if (success) {
        autoConnectAttempts = 0; // أعد العداد
    } else {
        // حاول مجدداً بعد 3 ثواني
        setTimeout(autoConnectBluetooth, 3000);
    }
}

// ==================== التصدير ====================

window.BluetoothIntegration = {
    connect: connectToBluetoothUI,
    disconnect: () => bluetoothManager?.disconnect(),
    autoConnect: autoConnectBluetooth,
    getStatus: () => ({
        connected: bluetoothConnected,
        ready: bluetoothManager !== null
    })
};
