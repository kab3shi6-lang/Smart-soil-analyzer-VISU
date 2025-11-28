# 🚀 خطوات عملية سريعة: ربط الأردوينو بالموقع

## ⚡ الطريقة السريعة (5 دقائق)

### الخطوة 1️⃣: تحضير الأردوينو

انسخ هذا الكود وحمّله على الأردوينو:

```cpp
#include <SoftwareSerial.h>

// HC-05: RX=11, TX=10
SoftwareSerial BTSerial(11, 10);

void setup() {
  Serial.begin(9600);
  BTSerial.begin(9600);
  delay(1000);
  BTSerial.println("CONNECTED");
}

void loop() {
  // قراءة من الحساسات (قيم تجريبية)
  float temp = 22.5;
  float moisture = 65;
  float pH = 6.5;
  float N = 75;
  float P = 60;
  float K = 70;
  
  // إرسال البيانات
  String data = "TEMP:" + String(temp, 1) + 
                ",MOISTURE:" + String(moisture, 0) + 
                ",PH:" + String(pH, 1) + 
                ",N:" + String(N, 0) + 
                ",P:" + String(P, 0) + 
                ",K:" + String(K, 0);
  
  BTSerial.println(data);
  Serial.println(data);
  
  delay(2000); // إرسال كل ثانيتين
}
```

### الخطوة 2️⃣: التوصيلات

```
HC-05 وصلة الأردوينو
GND ←→ GND (الأرضي)
VCC ←→ 5V (الطاقة)
TX ←→ Pin 10 (البيانات)
RX ←→ Pin 11 (البيانات)
```

### الخطوة 3️⃣: فتح الموقع

```
https://kab3shi6-lang.github.io/Smart-soil-analyzer-VISU
```

### الخطوة 4️⃣: الضغط على زر Bluetooth

1. ستظهر نافذة اختيار الجهاز
2. اختر **HC-05** أو جهازك
3. اضغط **Connect**
4. بعد الاتصال سيتغير لون الزر ✅

### الخطوة 5️⃣: استقبال البيانات

- البيانات ستظهر تلقائياً في النموذج
- الحقول ستضيء بلون أخضر عند التحديث
- اضغط "تحليل التربة" للحصول على النتائج

---

## 🎯 التحقق من الاتصال

### فتح Developer Console:
```
Windows: Ctrl + Shift + J
Mac: Cmd + Option + J
```

### ستشاهد رسائل مثل:
```
✅ Web Bluetooth متاح
✅ تم اختيار الجهاز: HC-05
✅ تم الاتصال بـ GATT server
✅ تم الاتصال بنجاح
📨 بيانات واردة: TEMP:22.5,MOISTURE:65,...
✅ تم تحليل البيانات: {TEMP: 22.5, MOISTURE: 65, ...}
```

---

## 🔌 توصيل الحساسات الفعلية

### مستشعر الحرارة (DHT22):

```cpp
#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  dht.begin();
}

float getTemperature() {
  return dht.readTemperature();
}
```

### مستشعر الرطوبة (Capacitive):

```cpp
#define MOISTURE_PIN A0

float getMoisture() {
  int rawValue = analogRead(MOISTURE_PIN);
  return map(rawValue, 1023, 0, 0, 100); // %
}
```

### مستشعر pH:

```cpp
#define PH_PIN A1

float getPH() {
  int rawValue = analogRead(PH_PIN);
  // معادلة المعايرة
  return 7.0 + (rawValue - 512) * 0.0078125;
}
```

### مستشعرات NPK (تقريبية):

```cpp
#define N_PIN A2
#define P_PIN A3
#define K_PIN A4

float getNitrogen() { return analogRead(N_PIN) * 0.097; }
float getPhosphorus() { return analogRead(P_PIN) * 0.097; }
float getPotassium() { return analogRead(K_PIN) * 0.097; }
```

---

## 📝 الكود الكامل المتقدم

```cpp
#include <SoftwareSerial.h>
#include <DHT.h>

// تعريفات الحساسات
SoftwareSerial BTSerial(11, 10); // RX=11, TX=10
DHT dht(2, DHT22);

#define MOISTURE_PIN A0
#define PH_PIN A1
#define N_PIN A2
#define P_PIN A3
#define K_PIN A4

// متغيرات البيانات
struct SensorData {
  float temperature;
  float moisture;
  float pH;
  float nitrogen;
  float phosphorus;
  float potassium;
} sensorData;

void setup() {
  Serial.begin(9600);
  BTSerial.begin(9600);
  dht.begin();
  
  delay(2000);
  Serial.println("System Ready");
  BTSerial.println("ARDUINO_READY");
}

void loop() {
  readAllSensors();
  sendData();
  handleBluetoothCommands();
  delay(2000);
}

void readAllSensors() {
  // قراءة الحرارة والرطوبة من DHT22
  sensorData.temperature = dht.readTemperature();
  
  // قراءة الرطوبة
  int rawMoisture = analogRead(MOISTURE_PIN);
  sensorData.moisture = map(rawMoisture, 1023, 0, 0, 100);
  
  // قراءة pH
  int rawPH = analogRead(PH_PIN);
  sensorData.pH = 7.0 + (rawPH - 512) * 0.0078125;
  
  // قراءة العناصر الغذائية
  sensorData.nitrogen = analogRead(N_PIN) * 0.097;
  sensorData.phosphorus = analogRead(P_PIN) * 0.097;
  sensorData.potassium = analogRead(K_PIN) * 0.097;
}

void sendData() {
  String data = "TEMP:" + String(sensorData.temperature, 1) +
                ",MOISTURE:" + String(sensorData.moisture, 0) +
                ",PH:" + String(sensorData.pH, 1) +
                ",N:" + String(sensorData.nitrogen, 0) +
                ",P:" + String(sensorData.phosphorus, 0) +
                ",K:" + String(sensorData.potassium, 0);
  
  BTSerial.println(data);
  Serial.println(data);
}

void handleBluetoothCommands() {
  if (BTSerial.available()) {
    String command = BTSerial.readStringUntil('\n');
    
    if (command.indexOf("GET_DATA") > -1) {
      sendData();
    }
    else if (command.indexOf("CALIBRATE") > -1) {
      BTSerial.println("CALIBRATION_MODE");
    }
  }
}
```

---

## 🐛 مشاكل شائعة والحلول

### ❌ لا يظهر HC-05 في الخيارات

**الأسباب:**
- HC-05 لم يتم إقرانه من قبل
- جهاز الكمبيوتر ليس له Bluetooth
- الأردوينو لم يتم توصيله

**الحل:**
1. تأكد من توصيل HC-05 بالطاقة
2. اضغط زر الاقتران على HC-05
3. جرب متصفح Chrome آخر
4. أعد تشغيل Bluetooth

### ❌ البيانات لا تظهر في النموذج

**الأسباب:**
- صيغة البيانات خاطئة
- سرعة البود غير متطابقة (9600)
- توصيل TX/RX معكوس

**الحل:**
1. افتح Console (F12)
2. تحقق من الرسائل والأخطاء
3. تأكد من الصيغة: `TEMP:22.5,MOISTURE:65,...`
4. جرب صيغة بدون مسافات

### ❌ الاتصال ينقطع بسرعة

**الأسباب:**
- توصيلات ضعيفة
- أسلاك مفكوكة
- بطارية ضعيفة

**الحل:**
1. تحقق من التوصيلات
2. استخدم كابل USB عالي الجودة
3. جرب جهاز كمبيوتر آخر

---

## 📊 معايرة الحساسات

### خطوات المعايرة:

```cpp
void calibrateSensors() {
  // ضع المستشعر في محيط معروف
  // اقرأ القيم الخام
  // احسب المعادلة
  
  Serial.println("RAW VALUES:");
  Serial.println(analogRead(MOISTURE_PIN));
  Serial.println(analogRead(PH_PIN));
  Serial.println(analogRead(N_PIN));
}
```

### مثال (مستشعر الرطوبة):

1. ضع المستشعر في تربة جافة
   - قراءة: 1023
   - هذا = 0%

2. ضع المستشعر في تربة مبللة
   - قراءة: 200
   - هذا = 100%

3. استخدم الصيغة:
```cpp
moisture = map(rawValue, 1023, 200, 0, 100);
```

---

## 🎯 نصائح للنجاح

✅ ابدأ بقيم ثابتة أولاً (جرب الكود بدون حساسات)  
✅ استخدم Serial Monitor للتحقق من البيانات  
✅ تأكد من سرعة البود (9600)  
✅ استخدم كابل USB قصير وعالي الجودة  
✅ ركّب مكثفات بالقرب من الحساسات  
✅ استخدم مصدر طاقة منفصل إذا أمكن  
✅ اختبر كل حساس بشكل منفصل  

---

## ✅ قائمة تفقد نهائية

- [ ] HC-05 مزود بالطاقة ومشغل
- [ ] كود الأردوينو محمّل
- [ ] التوصيلات صحيحة (GND, VCC, TX, RX)
- [ ] Serial Monitor يُظهر البيانات
- [ ] الموقع مفتوح والزر مرئي
- [ ] اختيار HC-05 من القائمة
- [ ] الاتصال نجح (زر أخضر)
- [ ] البيانات تظهر في النموذج
- [ ] النتائج تُحلّل بشكل صحيح

---

## 🎉 تم!

الآن لديك نظام ذكي كامل لتحليل التربة باستخدام الأردوينو والموقع!

**استمتع بالمشروع! 🌱**
