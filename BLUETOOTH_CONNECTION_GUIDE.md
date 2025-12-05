# دليل اتصال Bluetooth - تطبيق الويب
# Bluetooth Connection Guide - Web Application

---

## 🔗 **كيفية اتصال الموقع بـ HC-05 Bluetooth**

### **الخطوة 1: إعداد Arduino**

1. **حمّل الكود:**
   ```
   انسخ `ARDUINO_CODE_COMPLETE.ino`
   افتح Arduino IDE
   اختر Board: Arduino Uno
   اختر Port: COM X
   اضغط Upload
   ```

2. **تحقق من البيانات:**
   ```
   افتح Serial Monitor
   اختر 9600 Baud
   يجب أن ترى البيانات تملأ كل 5 ثواني
   ```

---

### **الخطوة 2: توصيل Bridge مع Bluetooth**

الموقع يتوقع البيانات عبر WebSocket على `localhost:3000`

**Bridge (bridge.js) يقوم بـ:**
1. استقبال البيانات من Arduino عبر Serial/Bluetooth
2. تحويلها إلى JSON
3. إرسالها إلى الموقع عبر WebSocket

**يمكنك التوصيل بثلاث طرق:**

---

## 📱 **الطريقة 1: Bluetooth Serial (الأسهل)**

### **على Windows:**

1. **أضف جهاز Bluetooth:**
   - الإعدادات → Bluetooth والأجهزة الأخرى
   - اختر "إضافة جهاز Bluetooth أو جهاز آخر"
   - اختر HC-05
   - كود الربط: `1234` أو `0000`

2. **تحديد المنفذ:**
   - تحقق من Port الجديد (مثل COM5)

3. **تحديث Bridge:**
   ```javascript
   // في bridge.js
   const SerialPort = require('serialport');
   const port = new SerialPort.SerialPort({
       path: 'COM5',  // غيّر هنا
       baudRate: 9600
   });
   ```

4. **شغّل Bridge:**
   ```bash
   npm start
   ```

---

### **على Linux/Mac:**

```bash
# تحديد المنفذ
rfcomm bind /dev/rfcomm0 <HC-05-MAC-ADDRESS>

# قراءة المنفذ
cat /dev/rfcomm0
```

---

## 💻 **الطريقة 2: Web Bluetooth API (للمتقدمين)**

### **كود JavaScript للموقع:**

```javascript
// في advanced-v5.html
class BluetoothSoilSensor {
    constructor() {
        this.device = null;
        this.characteristic = null;
    }

    // البحث عن جهاز Bluetooth
    async connect() {
        try {
            this.device = await navigator.bluetooth.requestDevice({
                filters: [{ name: 'HC-05' }],
                optionalServices: ['0000180a-0000-1000-8000-00805f9b34fb']
            });

            const server = await this.device.gatt.connect();
            console.log('✅ متصل بـ HC-05');
            
            // استقبل البيانات
            this.startListening();
        } catch (error) {
            console.error('❌ خطأ في الاتصال:', error);
        }
    }

    // استقبل البيانات
    async startListening() {
        // استمع للبيانات الواردة
        // وأرسلها إلى الموقع
    }

    disconnect() {
        if (this.device) {
            this.device.gatt.disconnect();
        }
    }
}

// الاستخدام:
// const sensor = new BluetoothSoilSensor();
// await sensor.connect();
```

**ملاحظة:** Web Bluetooth API يعمل فقط على:
- Chrome/Edge
- Android
- غير متوفر على Firefox/Safari

---

## 🖥️ **الطريقة 3: Python Bridge (للبيانات العالية)**

### **setup.py - اتصال Python مع Arduino:**

```python
import serial
import json
import asyncio
import websockets

# اتصل بـ Arduino عبر Serial
arduino = serial.Serial(port='COM5', baudrate=9600, timeout=1)

async def send_data_to_web(websocket, path):
    """إرسال البيانات من Arduino إلى الموقع"""
    while True:
        if arduino.in_waiting > 0:
            line = arduino.readline().decode('utf-8').strip()
            try:
                data = json.loads(line)
                await websocket.send(json.dumps(data))
                print(f"✅ تم إرسال: {data}")
            except json.JSONDecodeError:
                print(f"⚠️ بيانات غير صالحة: {line}")
        await asyncio.sleep(0.1)

async def main():
    async with websockets.serve(send_data_to_web, "localhost", 3000):
        print("🚀 Bridge مشغل على localhost:3000")
        await asyncio.Future()  # run forever

asyncio.run(main())
```

**شغّل الـ Bridge:**
```bash
pip install pyserial websockets
python bridge.py
```

---

## 📊 **صيغة البيانات المتوقعة**

الموقع يتوقع بيانات JSON بهذا الشكل:

```json
{
    "temperature": 25.5,
    "humidity": 60.0,
    "moisture": 75.5,
    "pH": 6.5,
    "nitrogen": 50,
    "phosphorus": 40,
    "potassium": 30,
    "timestamp": "2025-12-04T10:30:45Z"
}
```

---

## 🔧 **استكشاف الأخطاء**

### **❌ لا يظهر HC-05 في Bluetooth:**
```
✓ تأكد من توصيل VCC و GND
✓ تأكد من توصيل TX و RX
✓ جرّب إعادة تشغيل Arduino
✓ تحقق من مصدر الطاقة (5V كافي؟)
```

### **❌ لا تظهر البيانات في Bluetooth:**
```
✓ افتح Serial Monitor وتحقق من البيانات
✓ تأكد من Baud Rate = 9600
✓ جرّب أسلاك مختلفة
```

### **❌ الموقع لا يستقبل البيانات:**
```
✓ تأكد من تشغيل Bridge
✓ تحقق من Web Console (F12)
✓ تأكد من أن Arduino يرسل JSON صحيح
✓ جرّب إعادة تحميل الموقع
```

---

## 📋 **قائمة المراجعة**

- [ ] Arduino موصول وبرمج بالكود الكامل
- [ ] HC-05 يظهر في Bluetooth
- [ ] Port مكتوب بشكل صحيح في Bridge
- [ ] Bridge يعمل (`npm start`)
- [ ] Serial Monitor يعرض البيانات
- [ ] الموقع يفتح على `localhost:3000/advanced-v5.html`
- [ ] الموقع يعرض حالة الاتصال "✅ متصل"
- [ ] البيانات تملأ تلقائياً في الحقول

---

## 💡 **نصائح للأداء الأفضل**

1. **سرعة البود (Baud Rate):**
   - أبطأ = أكثر استقراراً
   - 9600 = الأفضل للمسافات القريبة
   - 38400 = للسرعة العالية

2. **تحديث البيانات:**
   - كل 5 ثواني = معقول
   - كل ثانية = للحساسية العالية

3. **الطاقة:**
   - استخدم مصدر 5V قوي
   - لا تأخذ الطاقة من USB وحدها

4. **الحماية:**
   - أضف مقاومات pull-up
   - استخدم أسلاك قصيرة
   - قلل التشويش الكهربائي

---

## 🎓 **مراجع إضافية**

- [HC-05 Datasheet](https://components101.com/wireless/hc-05-bluetooth-module)
- [Arduino Serial Communication](https://www.arduino.cc/en/Reference/Serial)
- [WebSocket Protocol](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [JSON Format](https://www.json.org/)

---

**هل تحتاج مساعدة في خطوة معينة؟** 🤔
