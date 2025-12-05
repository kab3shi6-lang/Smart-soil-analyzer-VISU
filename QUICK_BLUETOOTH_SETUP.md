# 🔗 اتصل بـ Bluetooth بـ 3 خطوات سريعة

## الخطوة 1️⃣: شغّل Bridge

```bash
npm start
```

**المتوقع:**
```
🚀 Bridge مشغل بنجاح
📍 الموقع: http://localhost:3000
📍 الموقع الكامل: http://localhost:3000/advanced-v5.html
📨 WebSocket: ws://localhost:3000
```

---

## الخطوة 2️⃣: صل Arduino

**اختر الطريقة المناسبة:**

### ✅ **الطريقة 1: Windows + Bluetooth**

1. **أضف HC-05:**
   - الإعدادات → Bluetooth والأجهزة الأخرى
   - "إضافة جهاز"
   - اختر `HC-05`
   - كود الربط: `1234` أو `0000`

2. **ابحث عن المنفذ:**
   ```powershell
   # في Windows PowerShell
   Get-WmiObject Win32_SerialPort | Select-Object Name, Description
   ```

3. **عدّل `bridge-enhanced.js`:**
   ```javascript
   // السطر 41 تقريباً - غيّر المنفذ
   await initializeSerialConnection('COM5');  // استخدم المنفذ صحيح
   ```

### ✅ **الطريقة 2: Web Serial API (Chrome 89+)**

```html
<!-- أضف في advanced-v5.html -->
<button onclick="connectBluetooth()">🔗 اتصل بـ Bluetooth</button>

<script src="bluetooth-manager.js"></script>
<script>
const manager = new BluetoothManager();

async function connectBluetooth() {
    const success = await manager.connect();
    if (success) {
        console.log('✅ متصل!');
        manager.onDataReceived = (data) => {
            console.log('📊 البيانات:', data);
        };
    }
}
</script>
```

---

## الخطوة 3️⃣: افتح الموقع

1. افتح المتصفح
2. اذهب إلى: `http://localhost:3000/advanced-v5.html`
3. انتظر ظهور البيانات تلقائياً

---

## 🔍 التحقق من الاتصال

### ✅ متصل بـ Bluetooth؟

```
✓ هل يظهر البيانات في console؟ (F12 → Console)
✓ هل تتحدث البيانات كل 5 ثواني؟
✓ هل تملأ الحقول تلقائياً؟
```

### ❌ لا يعمل؟

**تحقق من:**
1. هل Bridge يعمل؟ (`npm start`)
2. هل Arduino يرسل البيانات؟ (Serial Monitor)
3. هل الكود صحيح في bridge-enhanced.js؟
4. هل المنفذ صحيح؟ (COM5, COM6, إلخ)

---

## 📱 اختبر البيانات

```javascript
// في F12 Console
fetch('http://localhost:3000/api/status')
    .then(r => r.json())
    .then(data => console.log(data))
```

**يجب أن تظهر:**
```json
{
    "status": "online",
    "currentData": {
        "temperature": 25.5,
        "humidity": 60.0,
        ...
    },
    "connectedClients": 1
}
```

---

## 🚀 استخدم bridge-enhanced.js

**بدل bridge.js الحالي:**

```bash
mv bridge.js bridge-old.js
mv bridge-enhanced.js bridge.js
npm start
```

**الفوائد الجديدة:**
- ✅ دعم اتصالات Bluetooth متعددة
- ✅ إعادة اتصال تلقائية
- ✅ معلومات التشخيص أفضل
- ✅ API جديدة للتحكم

---

## 💡 نصائح

- **إذا انقطع الاتصال:** سيحاول البرنامج الاتصال مجدداً تلقائياً
- **إذا أردت تغيير المنفذ:** عدّل السطر في bridge-enhanced.js
- **اختبر بـ Serial Monitor:** تأكد أن Arduino يرسل البيانات

---

## 📞 هل تحتاج مساعدة؟

- [BLUETOOTH_CONNECTION_GUIDE.md](./BLUETOOTH_CONNECTION_GUIDE.md) - دليل شامل
- [ARDUINO_CODE_COMPLETE.ino](./ARDUINO_CODE_COMPLETE.ino) - كود Arduino
- [bluetooth-manager.js](./bluetooth-manager.js) - مدير Bluetooth

**اسأل إذا احتجت توضيح** 🤔
