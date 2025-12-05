// ==========================================
// Smart Soil Analyzer - Arduino Code
// المحلل الذكي للتربة - كود أردوينو
// ==========================================

#include <DHT.h>
#include <SoftwareSerial.h>

#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#define MOISTURE_PIN A0
#define PH_PIN A1
#define NPK_N_PIN A2
#define NPK_P_PIN A3
#define NPK_K_PIN A4

SoftwareSerial BTSerial(10, 11);

float temperature = 0.0;
float humidity = 0.0;
float moisture = 0;
float pH = 0.0;
int nitrogen = 0;
int phosphorus = 0;
int potassium = 0;

const float PH_CALIBRATION_OFFSET = 0.0;
const float PH_CALIBRATION_SLOPE = -5.70;

void setup() {
  Serial.begin(9600);
  delay(100);
  
  BTSerial.begin(9600);
  delay(100);
  
  dht.begin();
  delay(500);
  
  Serial.println("========================================");
  Serial.println("Smart Soil Analyzer - Initialized");
  Serial.println("محلل التربة الذكي - تم التهيئة");
  Serial.println("========================================\n");
}

void loop() {
  readDHT11();
  readMoisture();
  readPH();
  readNPK();
  
  printSerialData();
  sendBluetoothData();
  
  delay(1000);
}

void readDHT11() {
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("ERROR: DHT11 reading failed!");
    temperature = 0.0;
    humidity = 0.0;
  }
}

void readMoisture() {
  int rawValue = analogRead(MOISTURE_PIN);
  int minValue = 200;
  int maxValue = 1023;
  
  moisture = map(rawValue, maxValue, minValue, 0, 100);
  moisture = constrain(moisture, 0, 100);
}

void readPH() {
  int rawValue = analogRead(PH_PIN);
  pH = PH_CALIBRATION_SLOPE * (rawValue / 1024.0) + 15.50 + PH_CALIBRATION_OFFSET;
  pH = constrain(pH, 0.0, 14.0);
}

void readNPK() {
  int nRaw = analogRead(NPK_N_PIN);
  int pRaw = analogRead(NPK_P_PIN);
  int kRaw = analogRead(NPK_K_PIN);
  
  nitrogen = map(nRaw, 0, 1023, 0, 200);
  phosphorus = map(pRaw, 0, 1023, 0, 200);
  potassium = map(kRaw, 0, 1023, 0, 200);
}

void printSerialData() {
  Serial.println("\n=== Sensor Readings ===");
  Serial.print("Temp: ");
  Serial.print(temperature);
  Serial.print("°C | Humidity: ");
  Serial.print(humidity);
  Serial.print("% | Moisture: ");
  Serial.print(moisture);
  Serial.print("% | pH: ");
  Serial.print(pH);
  Serial.print(" | N:");
  Serial.print(nitrogen);
  Serial.print(" P:");
  Serial.print(phosphorus);
  Serial.print(" K:");
  Serial.println(potassium);
}

void sendBluetoothData() {
  String jsonData = "{";
  jsonData += "\"temperature\":" + String(temperature, 2) + ",";
  jsonData += "\"humidity\":" + String(humidity, 2) + ",";
  jsonData += "\"moisture\":" + String(moisture, 2) + ",";
  jsonData += "\"pH\":" + String(pH, 2) + ",";
  jsonData += "\"nitrogen\":" + String(nitrogen) + ",";
  jsonData += "\"phosphorus\":" + String(phosphorus) + ",";
  jsonData += "\"potassium\":" + String(potassium);
  jsonData += "}";
  
  BTSerial.println(jsonData);
  Serial.print("BT: ");
  Serial.println(jsonData);
}
