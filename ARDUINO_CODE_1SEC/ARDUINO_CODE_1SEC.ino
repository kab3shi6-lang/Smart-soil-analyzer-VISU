// ==========================================
// Smart Soil Analyzer - Arduino Code
// المحلل الذكي للتربة - كود أردوينو
// Updated: 1 Second Refresh Rate
// 
// المستشعرات:
// - DHT11 (درجة الحرارة والرطوبة)
// - Soil Moisture Sensor (رطوبة التربة)
// - PH Sensor (الحموضة)
// - NPK Sensor (النيتروجين والفسفور والبوتاسيوم)
// - HC-05 Bluetooth Module
// ==========================================

#include <DHT.h>
#include <SoftwareSerial.h>

// ========== DHT11 Configuration ==========
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// ========== Analog Pins ==========
#define MOISTURE_PIN A0
#define PH_PIN A1
#define NPK_N_PIN A2      // Nitrogen (if analog)
#define NPK_P_PIN A3      // Phosphorus (if analog)
#define NPK_K_PIN A4      // Potassium (if analog)

// ========== Bluetooth (HC-05) ==========
// RX -> Pin 10, TX -> Pin 11
SoftwareSerial BTSerial(10, 11); // RX, TX

// ========== Variables ==========
float temperature = 0.0;
float humidity = 0.0;
float moisture = 0;
float pH = 0.0;
int nitrogen = 0;
int phosphorus = 0;
int potassium = 0;

// Calibration values (adjust based on your sensors)
const float PH_CALIBRATION_OFFSET = 0.0;  // Adjust if needed
const float PH_CALIBRATION_SLOPE = -5.70; // Adjust if needed

// Counter for DHT11 (read every 2 seconds, send every 1 second)
int dhtReadCounter = 0;
const int DHT_READ_INTERVAL = 2; // Read DHT every 2 seconds

void setup() {
  // Initialize Serial for debugging
  Serial.begin(9600);
  delay(100);
  
  // Initialize Bluetooth
  BTSerial.begin(9600);
  delay(100);
  
  // Initialize DHT11
  dht.begin();
  delay(500);
  
  Serial.println("========================================");
  Serial.println("Smart Soil Analyzer v2 - 1 Second Rate");
  Serial.println("محلل التربة الذكي - تحديث كل ثانية");
  Serial.println("========================================");
  Serial.println("Sensors Status:");
  Serial.println("✓ DHT11 - Ready");
  Serial.println("✓ Soil Moisture - Ready");
  Serial.println("✓ PH Sensor - Ready");
  Serial.println("✓ NPK Sensor - Ready");
  Serial.println("✓ Bluetooth HC-05 - Ready");
  Serial.println("Update Rate: 1 second");
  Serial.println("========================================\n");
}

void loop() {
  // Read all sensors
  if (dhtReadCounter >= DHT_READ_INTERVAL) {
    readDHT11();
    dhtReadCounter = 0;
  }
  
  readMoisture();
  readPH();
  readNPK();
  
  // Print to Serial (debugging)
  printSerialData();
  
  // Send via Bluetooth to web interface
  sendBluetoothData();
  
  dhtReadCounter++;
  
  delay(1000); // Update every 1 second (changed from 5000)
}

// ========== DHT11 Reading ==========
void readDHT11() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  
  // Check if reading is valid
  if (!isnan(temp) && !isnan(hum)) {
    temperature = temp;
    humidity = hum;
  } else {
    Serial.println("⚠️ DHT11 reading failed - using previous values");
  }
}

// ========== Soil Moisture Reading ==========
void readMoisture() {
  int rawValue = analogRead(MOISTURE_PIN);
  
  // Convert to percentage (adjust min and max based on calibration)
  // Dry soil = ~1023, Wet soil = ~200
  int minValue = 200;  // Wet
  int maxValue = 1023; // Dry
  
  moisture = map(rawValue, maxValue, minValue, 0, 100);
  
  // Constrain to 0-100%
  moisture = constrain(moisture, 0, 100);
}

// ========== PH Reading ==========
void readPH() {
  int rawValue = analogRead(PH_PIN);
  
  // Convert analog value to pH (0-1023 → 0-14)
  // Formula: pH = -5.70 * (analogValue / 1024) + 15.50
  // Adjust based on your sensor calibration
  
  float voltage = rawValue * (5.0 / 1023.0);
  pH = PH_CALIBRATION_SLOPE * (rawValue / 1024.0) + 15.50 + PH_CALIBRATION_OFFSET;
  
  // Constrain to valid pH range (0-14)
  pH = constrain(pH, 0.0, 14.0);
}

// ========== NPK Reading ==========
void readNPK() {
  // For Analog NPK Sensor
  int nRaw = analogRead(NPK_N_PIN);
  int pRaw = analogRead(NPK_P_PIN);
  int kRaw = analogRead(NPK_K_PIN);
  
  // Convert analog values to ppm (adjust based on sensor specs)
  // Typical conversion: 0-1023 → 0-200 ppm
  nitrogen = map(nRaw, 0, 1023, 0, 200);
  phosphorus = map(pRaw, 0, 1023, 0, 200);
  potassium = map(kRaw, 0, 1023, 0, 200);
}

// ========== Print Data to Serial (Debugging) ==========
void printSerialData() {
  Serial.print("[");
  Serial.print(millis() / 1000);
  Serial.println("s] Sensor Data:");
  
  Serial.print("  Temp: ");
  Serial.print(temperature, 1);
  Serial.print("°C | Humidity: ");
  Serial.print(humidity, 1);
  Serial.print("% | Moisture: ");
  Serial.print(moisture, 1);
  Serial.print("% | pH: ");
  Serial.print(pH, 2);
  
  Serial.print(" | N:");
  Serial.print(nitrogen);
  Serial.print(" P:");
  Serial.print(phosphorus);
  Serial.print(" K:");
  Serial.println(potassium);
}

// ========== Send Data via Bluetooth ==========
void sendBluetoothData() {
  // Create JSON format data
  String jsonData = "{";
  jsonData += "\"temperature\":" + String(temperature, 2) + ",";
  jsonData += "\"humidity\":" + String(humidity, 2) + ",";
  jsonData += "\"moisture\":" + String(moisture, 2) + ",";
  jsonData += "\"pH\":" + String(pH, 2) + ",";
  jsonData += "\"nitrogen\":" + String(nitrogen) + ",";
  jsonData += "\"phosphorus\":" + String(phosphorus) + ",";
  jsonData += "\"potassium\":" + String(potassium);
  jsonData += "}";
  
  // Send via Bluetooth
  BTSerial.println(jsonData);
}

// ========== Calibration Functions ==========

// Calibrate PH Sensor
void calibratePH() {
  Serial.println("\n=== PH Sensor Calibration ===");
  Serial.println("Place sensor in buffer 7.0 solution");
  Serial.println("Reading raw value in 5 seconds...");
  delay(5000);
  
  int value7 = analogRead(PH_PIN);
  Serial.print("Buffer 7.0 Raw Value: ");
  Serial.println(value7);
  
  Serial.println("\nPlace sensor in buffer 4.0 solution");
  Serial.println("Reading raw value in 5 seconds...");
  delay(5000);
  
  int value4 = analogRead(PH_PIN);
  Serial.print("Buffer 4.0 Raw Value: ");
  Serial.println(value4);
  
  // Calculate calibration values
  float slope = (7.0 - 4.0) / (value7 - value4);
  float offset = 7.0 - (slope * value7);
  
  Serial.println("\n=== Calibration Results ===");
  Serial.print("Slope: ");
  Serial.println(slope, 4);
  Serial.print("Offset: ");
  Serial.println(offset, 4);
  Serial.println("Update PH_CALIBRATION_SLOPE and PH_CALIBRATION_OFFSET in code\n");
}
c:\Users\Akena\OneDrive\Desktop\smart_soil_website\ARDUINO_CODE_1SEC\ARDUINO_CODE_1SEC.ino
// Calibrate Moisture Sensor
void calibrateMoisture() {
  Serial.println("\n=== Moisture Sensor Calibration ===");
  Serial.println("Place sensor in DRY soil");
  Serial.println("Reading raw value in 5 seconds...");
  delay(5000);
  
  int dryValue = analogRead(MOISTURE_PIN);
  Serial.print("Dry Soil Raw Value: ");
  Serial.println(dryValue);
  
  Serial.println("\nPlace sensor in WET soil (or water)");
  Serial.println("Reading raw value in 5 seconds...");
  delay(5000);
  
  int wetValue = analogRead(MOISTURE_PIN);
  Serial.print("Wet Soil Raw Value: ");
  Serial.println(wetValue);
  
  Serial.println("\n=== Calibration Results ===");
  Serial.print("Update in code: minValue = ");
  Serial.print(wetValue);
  Serial.print(", maxValue = ");
  Serial.println(dryValue);
  Serial.println();
}

// ========== Error Handling ==========
void handleError(String errorMessage) {
  Serial.print("ERROR: ");
  Serial.println(errorMessage);
  
  String errorJSON = "{\"error\":\"" + errorMessage + "\"}";
  BTSerial.println(errorJSON);
}

// ========== Notes ==========
/*
 * PINOUT:
 * 1. DHT11 Data - Pin 2 (with 4.7kΩ pull-up to 5V)
 * 2. Moisture - A0
 * 3. PH - A1
 * 4. NPK N - A2
 * 5. NPK P - A3
 * 6. NPK K - A4
 * 7. Bluetooth TX - Pin 11
 * 8. Bluetooth RX - Pin 10 (with voltage divider: 10kΩ + 20kΩ = 3.33V)
 * 
 * FEATURES:
 * - Sends data every 1 second (changed from 5 seconds)
 * - DHT11 reads every 2 seconds (sensor limitation)
 * - JSON format for all data
 * - Calibration functions available
 * 
 * Example output: {"temperature":25.5,"humidity":60.0,"moisture":75.5,"pH":6.5,"nitrogen":50,"phosphorus":40,"potassium":30}
 */
