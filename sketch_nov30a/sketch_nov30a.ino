#include <DHT.h>
#include <SoftwareSerial.h>

// --------------------------
// تعريف الحساسات
// --------------------------
#define DHTPIN 6
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

#define SOIL_PIN A1   // A0 in module → A1 in Arduino
#define PH_PIN A0     // Po → A0 in Arduino

// Bluetooth
SoftwareSerial BT(10, 11); // RX, TX

void setup() {
  Serial.begin(9600);
  BT.begin(9600);

  dht.begin();
  delay(2000);
}

void loop() {
  // --------------------------
  // قراءة DHT22
  // --------------------------
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("DHT ERROR");
    return;
  }

  // --------------------------
  // قراءة Soil Moisture
  // --------------------------
  int soilValue = analogRead(SOIL_PIN); 
  int soilPercent = map(soilValue, 1023, 300, 0, 100); 
  soilPercent = constrain(soilPercent, 0, 100);

  // --------------------------
  // قراءة pH Sensor
  // --------------------------
  int phRaw = analogRead(PH_PIN);
  float voltage = phRaw * (5.0 / 1023.0);
  float pH = 7 + ((2.5 - voltage) * 3.5);   // معادلة تقريبية

  // --------------------------
  // إرسال البيانات عبر Serial و Bluetooth
  // صيغة الإرسال متوافقة 100% مع موقعك
  // TEMP: , MOISTURE: , PH:
  // --------------------------
  String data = 
    "TEMP:" + String(temperature, 1) +
    ",MOISTURE:" + String(soilPercent) +
    ",PH:" + String(pH, 2) +
    ",N:70,P:60,K:80";  // قيم ثابتة مؤقتاً لحين إضافة NPK الحقيقي

  Serial.println(data);
  BT.println(data);

  delay(2000);
}
