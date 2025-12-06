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

// pH Calibration constants - adjusted for typical pH sensor
// Standard pH sensor outputs ~2.5V at pH 7, ranging 0-5V for pH 0-14
const float PH_CALIBRATION_OFFSET = 0.0;  // Offset adjustment for fine-tuning
const float PH_CALIBRATION_SLOPE = 14.0;  // Full pH range (0-14)

// ==========================================
// Smoothing/Averaging Configuration
// تكوين التنعيم والمتوسط لثبات القراءات
// ==========================================
const int NUM_SAMPLES = 20;  // Number of samples to average (عدد العينات للمتوسط - زيادة للثبات)
const float SMOOTHING_FACTOR = 0.1;  // Exponential smoothing factor (0.1 = أكثر ثباتاً - more stable)

// Previous values for exponential smoothing
float prevMoisture = 0.0;
float prevPH = 0.0;
float prevNitrogen = 0.0;
float prevPhosphorus = 0.0;
float prevPotassium = 0.0;
bool firstReading = true;

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
  
  delay(3000);  // 3 ثواني بين القراءات للثبات الأفضل (3 seconds for better stability)
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
  // Take multiple samples and average for stability
  // أخذ عينات متعددة وحساب المتوسط للثبات
  long total = 0;
  for (int i = 0; i < NUM_SAMPLES; i++) {
    total += analogRead(MOISTURE_PIN);
    delay(2);  // Small delay between readings
  }
  int rawValue = total / NUM_SAMPLES;
  
  int minValue = 200;
  int maxValue = 1023;
  
  float newMoisture = map(rawValue, maxValue, minValue, 0, 100);
  newMoisture = constrain(newMoisture, 0, 100);
  
  // Apply exponential smoothing for stability
  // تطبيق التنعيم الأسي للثبات
  if (firstReading) {
    moisture = newMoisture;
  } else {
    moisture = (SMOOTHING_FACTOR * newMoisture) + ((1 - SMOOTHING_FACTOR) * prevMoisture);
  }
  prevMoisture = moisture;
}

void readPH() {
  // Take multiple samples and average for stability
  // أخذ عينات متعددة وحساب المتوسط للثبات
  long total = 0;
  for (int i = 0; i < NUM_SAMPLES; i++) {
    total += analogRead(PH_PIN);
    delay(2);  // Small delay between readings
  }
  int rawValue = total / NUM_SAMPLES;
  
  // More accurate pH calculation for typical pH sensor
  // Raw value 0-1023 maps to voltage 0-5V
  // Most pH sensors output ~2.5V at pH 7, with ~0.059V per pH unit change
  // This formula scales raw 0-1023 to pH 0-14 linearly (for uncalibrated testing)
  // For production, calibrate with pH 4 and pH 7 buffer solutions
  float voltage = rawValue * (5.0 / 1023.0);
  // Standard pH sensor: pH = 3.5 * voltage + PH_CALIBRATION_OFFSET
  // Simpler mapping for testing: 0V = pH 0, 5V = pH 14
  float newPH = (voltage / 5.0) * 14.0 + PH_CALIBRATION_OFFSET;
  newPH = constrain(newPH, 0.0, 14.0);
  
  // Apply exponential smoothing for stability
  // تطبيق التنعيم الأسي للثبات
  if (firstReading) {
    pH = newPH;
  } else {
    pH = (SMOOTHING_FACTOR * newPH) + ((1 - SMOOTHING_FACTOR) * prevPH);
  }
  prevPH = pH;
}

void readNPK() {
  // Take multiple samples and average for stability
  // أخذ عينات متعددة وحساب المتوسط للثبات
  long nTotal = 0, pTotal = 0, kTotal = 0;
  for (int i = 0; i < NUM_SAMPLES; i++) {
    nTotal += analogRead(NPK_N_PIN);
    pTotal += analogRead(NPK_P_PIN);
    kTotal += analogRead(NPK_K_PIN);
    delay(2);  // Small delay between readings
  }
  int nRaw = nTotal / NUM_SAMPLES;
  int pRaw = pTotal / NUM_SAMPLES;
  int kRaw = kTotal / NUM_SAMPLES;
  
  float newN = map(nRaw, 0, 1023, 0, 200);
  float newP = map(pRaw, 0, 1023, 0, 200);
  float newK = map(kRaw, 0, 1023, 0, 200);
  
  // Apply exponential smoothing for stability
  // تطبيق التنعيم الأسي للثبات
  if (firstReading) {
    nitrogen = newN;
    phosphorus = newP;
    potassium = newK;
    firstReading = false;  // Mark first reading complete
  } else {
    nitrogen = (SMOOTHING_FACTOR * newN) + ((1 - SMOOTHING_FACTOR) * prevNitrogen);
    phosphorus = (SMOOTHING_FACTOR * newP) + ((1 - SMOOTHING_FACTOR) * prevPhosphorus);
    potassium = (SMOOTHING_FACTOR * newK) + ((1 - SMOOTHING_FACTOR) * prevPotassium);
  }
  prevNitrogen = nitrogen;
  prevPhosphorus = phosphorus;
  prevPotassium = potassium;
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
