# دليل التوصيلات - Bluetooth + المستشعرات
## Wiring Guide - Bluetooth Module + Sensors

---

## 📱 **موديول البلوثوث HC-05**
### HC-05 Bluetooth Module Wiring

```
HC-05 Pin    →    Arduino/ESP32 Pin
─────────────────────────────────
VCC          →    5V (أو 3.3V)
GND          →    GND
TX           →    RX (Pin 0) أو RX2
RX           →    TX (Pin 1) أو TX2
```

### التوصيل التفصيلي (Arduino Uno):
```
┌─────────────┐
│  HC-05      │
├─────────────┤
│ VCC    ─────┼─→ 5V (عبر مقاوم 1kΩ للحماية)
│ GND    ─────┼─→ GND
│ TX     ─────┼─→ RX (Pin 0)
│ RX     ─────┼─→ TX (Pin 1)
└─────────────┘
```

**ملاحظة:** استخدم SoftwareSerial إذا أردت الحفاظ على Serial الأصلي للـ debugging

---

## 🌡️ **DHT11 - مستشعر درجة الحرارة والرطوبة**
### DHT11 Temperature & Humidity Sensor

```
DHT11 Pin    →    Arduino Pin
─────────────────────────────
VCC          →    5V
GND          →    GND
DATA         →    Pin 2 (أو أي Pin رقمي)
```

### الرسم التفصيلي:
```
┌──────────────┐
│  DHT11       │
├──────────────┤
│ (+) VCC  ────┼─→ 5V
│ (out) DATA──┼─→ Pin 2 + مقاوم pull-up 4.7kΩ إلى VCC
│ (-) GND  ────┼─→ GND
│ (empty)      │
└──────────────┘
```

---

## 💧 **Soil Moisture Sensor - مستشعر رطوبة التربة**
### Capacitive Soil Moisture Sensor

```
Soil Moisture   →    Arduino Pin
───────────────────────────────
VCC             →    5V
GND             →    GND
AO (Analog)     →    A0 (Pin Analog)
DO (Digital)    →    Pin 3 (اختياري)
```

### الوصلة:
```
┌────────────────────────────┐
│  Soil Moisture Sensor      │
├────────────────────────────┤
│ VCC       ────────────────→ 5V
│ GND       ────────────────→ GND
│ AO (out)  ────────────────→ A0
│ DO (out)  ────────────────→ Pin 3 (اختياري)
└────────────────────────────┘
```

---

## 🧪 **PH Sensor - مستشعر الحموضة**
### Analog PH Sensor Module

```
PH Sensor    →    Arduino Pin
──────────────────────────────
VCC          →    5V
GND          →    GND
PO (Analog)  →    A1 (Pin Analog)
```

### التوصيل:
```
┌──────────────────┐
│  PH Sensor       │
├──────────────────┤
│ VCC  ───────────→ 5V
│ GND  ───────────→ GND
│ PO   ───────────→ A1
└──────────────────┘
```

**معادلة القراءة:**
```
pH = -5.70 * analogRead(A1) / 1024 + 15.50  // ستحتاج للمعايرة
```

---

## 🌾 **NPK Sensor - مستشعر النيتروجين والفسفور والبوتاسيوم**
### NPK (Nitrogen, Phosphorus, Potassium) Sensor

توصيل NPK يعتمد على نوع المستشعر:

### **نوع UART/Serial:**
```
NPK Sensor   →    Arduino Pin
────────────────────────────
VCC          →    5V
GND          →    GND
TX           →    RX (Software Serial Pin)
RX           →    TX (Software Serial Pin)
```

### **نوع Analog (أقل شيوعاً):**
```
NPK Sensor   →    Arduino Pin
────────────────────────────
VCC          →    5V
GND          →    GND
N_OUT        →    A2
P_OUT        →    A3
K_OUT        →    A4
```

---

## 🔌 **مخطط التوصيلات الكامل (Arduino Uno)**

```
                    ┌─────────────────┐
                    │    Arduino UNO  │
                    ├─────────────────┤
    ┌──────────────→ 5V          ← GND ←──────────────┐
    │               │                 │                │
    │      ┌───────→ RX (0)      TX (1) ──────┐       │
    │      │        │                 │       │       │
    │      │   ┌───→ Pin 2      Pin 3 ←──┐   │       │
    │      │   │    │                 │   │   │       │
    │      │   │    │    A0, A1, A2   │   │   │       │
    │      │   │    │    A3, A4       │   │   │       │
    │      │   │    └─────────────────┘   │   │       │
    │      │   │                           │   │       │
    │      │   │                           │   │       │
┌───┴──────┴───┴──────┬──────┬──────┬───┬─┴───┴───┬──┴──────┐
│                     │      │      │   │         │         │
│  HC-05        DHT11│ NPK  │ PH  │ Soil │         │
│  Bluetooth    Temp │ Sensor│Sensor│Moisture    │
└─────────────────────┴──────┴──────┴───┴─────────┴─────────┘
     VCC               VCC    VCC    VCC   VCC
     GND               GND    GND    GND   GND
     TX/RX             DATA   UART   A1    A0
```

---

## 📊 **ملخص الـ Pins المستخدمة**

| الجهاز | VCC | GND | البيانات | Pin Number |
|-------|-----|-----|---------|-----------|
| **HC-05 Bluetooth** | 5V | GND | TX/RX | 0/1 |
| **DHT11** | 5V | GND | DATA | 2 |
| **NPK Sensor** | 5V | GND | UART | TX/RX (Software Serial) |
| **Soil Moisture** | 5V | GND | AO | A0 |
| **PH Sensor** | 5V | GND | PO | A1 |

---

## ⚠️ **نصائح مهمة**

1. **الطاقة 💡:**
   - استخدم مصدر طاقة قوي (5V, 2A على الأقل)
   - لا تأخذ الطاقة من Arduino مباشرة إذا كان لديك عدة مستشعرات

2. **Pull-up Resistors 🔌:**
   - DHT11: 4.7kΩ من DATA إلى VCC
   - I2C (إن وجد): 4.7kΩ لـ SDA و SCL

3. **الأسلاك 🧵:**
   - استخدم أسلاك ملونة (حمراء=VCC، سوداء=GND، ملونة=البيانات)
   - تأكد من التوصيلات محكمة

4. **المعايرة 📏:**
   - PH Sensor تحتاج معايرة بحلول معروفة
   - NPK Sensor قد تحتاج معايرة حسب نوعها

5. **المكتبات المطلوبة 📚:**
   - DHT: DHT library by Adafruit
   - PH: Analog reading فقط
   - NPK: قد تحتاج مكتبة خاصة حسب نوع المستشعر
   - Bluetooth: SoftwareSerial أو HardwareSerial

---

## 🔧 **معايرة المستشعرات**

### **PH Sensor Calibration:**
```
قيمة 7 = محايد
قيم أقل = حمضي
قيم أكثر = قلوي

استخدم محاليل معايرة:
- Buffer 4.0
- Buffer 7.0
- Buffer 10.0
```

### **NPK Sensor Calibration:**
- اتبع تعليمات المستشعر الخاصة
- عادة يحتاج معايرة في البداية

---

## 📝 **اختبار التوصيلات**

استخدم الكود التالي لاختبار كل مستشعر:

```cpp
void setup() {
  Serial.begin(9600);
}

void loop() {
  // اختبر كل مستشعر واحداً تلو الآخر
  int moisture = analogRead(A0);
  int ph = analogRead(A1);
  
  Serial.print("Moisture: ");
  Serial.println(moisture);
  Serial.print("PH: ");
  Serial.println(ph);
  
  delay(1000);
}
```

---

**هل تحتاج توصيلات لكارت معين؟ مثل ESP32 أو Raspberry Pi؟** 🤔
