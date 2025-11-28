/*
 * كود ESP-01 WiFi لقراءة الحساسات وإرسال البيانات
 * 
 * المتطلبات:
 * - ESP-01 (ESP8266)
 * - Arduino IDE مع لوحة ESP8266
 * - مكتبات: WiFi, Wire, DHT
 */

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <DHT.h>

// ========== التكوين ==========
const char* ssid = "YOUR_SSID";           // اسم شبكتك
const char* password = "YOUR_PASSWORD";    // كلمة المرور
const char* hostname = "esp01-soil";       // اسم الجهاز

#define DHTPIN D4          // DHT22 data pin
#define DHTTYPE DHT22      // نوع الحساس

// الحساسات التناظرية
#define MOISTURE_PIN A0    // GPIO17 (تناظري)
#define PH_PIN 5           // GPIO5 (D1)
#define N_PIN 4            // GPIO4 (D2)
#define P_PIN 0            // GPIO0 (D3)
#define K_PIN 2            // GPIO2 (D4)

// ========== الكائنات ==========
DHT dht(DHTPIN, DHTTYPE);
ESP8266WebServer server(8080);

// ========== متغيرات البيانات ==========
struct {
  float temperature = 0;
  float moisture = 0;
  float pH = 0;
  float nitrogen = 0;
  float phosphorus = 0;
  float potassium = 0;
  unsigned long lastUpdate = 0;
} sensorData;

// ========== إعدادات المعايرة ==========
const struct {
  int moisture_dry = 950;
  int moisture_wet = 300;
  float pH_offset = 7.0;
  float temp_offset = 0;
} calibration;

// ========== البدء ==========
void setup() {
  Serial.begin(115200);
  delay(2000);
  
  Serial.println("\n\n");
  Serial.println("╔═══════════════════════════════════╗");
  Serial.println("║     ESP-01 Soil Analyzer          ║");
  Serial.println("╚═══════════════════════════════════╝");
  
  // تهيئة الحساسات
  initSensors();
  
  // الاتصال بـ WiFi
  connectToWiFi();
  
  // إعداد الخادم
  setupWebServer();
  
  Serial.println("✅ النظام جاهز!");
  printStatus();
}

// ========== الحلقة الرئيسية ==========
void loop() {
  server.handleClient();
  
  // قراءة البيانات كل ثانية
  if (millis() - sensorData.lastUpdate >= 1000) {
    readAllSensors();
    sensorData.lastUpdate = millis();
    printSensorValues();
  }
}

// ========== تهيئة الحساسات ==========
void initSensors() {
  Serial.println("🔧 تهيئة الحساسات...");
  
  dht.begin();
  
  // تهيئة الحساسات الرقمية
  pinMode(PH_PIN, INPUT);
  pinMode(N_PIN, INPUT);
  pinMode(P_PIN, INPUT);
  pinMode(K_PIN, INPUT);
  
  Serial.println("✅ تم تهيئة الحساسات");
}

// ========== الاتصال بـ WiFi ==========
void connectToWiFi() {
  Serial.println("📡 جاري الاتصال بـ WiFi...");
  Serial.print("SSID: ");
  Serial.println(ssid);
  
  WiFi.mode(WIFI_STA);
  WiFi.hostname(hostname);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ متصل بـ WiFi!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal Strength: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println("\n❌ فشل الاتصال! تحقق من بيانات WiFi");
  }
}

// ========== إعداد خادم الويب ==========
void setupWebServer() {
  Serial.println("🌐 إعداد خادم الويب...");
  
  // مسار الحالة
  server.on("/status", HTTP_GET, handleStatus);
  
  // مسار البيانات (الرئيسي)
  server.on("/data", HTTP_GET, handleData);
  
  // مسار الأوامر
  server.on("/command", HTTP_GET, handleCommand);
  
  // مسار المعلومات
  server.on("/info", HTTP_GET, handleInfo);
  
  // مسار المعايرة
  server.on("/calibrate", HTTP_POST, handleCalibrate);
  
  server.onNotFound(handleNotFound);
  
  server.begin();
  Serial.println("✅ خادم الويب جاهز على المنفذ 8080");
}

// ========== قراءة جميع الحساسات ==========
void readAllSensors() {
  // درجة الحرارة والرطوبة (DHT22)
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  
  if (!isnan(temp)) {
    sensorData.temperature = temp + calibration.temp_offset;
  }
  
  if (!isnan(hum)) {
    sensorData.moisture = hum;
  }
  
  // الرطوبة (التربة)
  int rawMoisture = analogRead(MOISTURE_PIN);
  sensorData.moisture = map(rawMoisture, calibration.moisture_dry, 
                            calibration.moisture_wet, 0, 100);
  
  // درجة الحموضة
  int rawPH = analogRead(PH_PIN);
  sensorData.pH = calibration.pH_offset + (rawPH - 512) * 0.0078125;
  
  // العناصر الغذائية (محاكاة أو حساسات حقيقية)
  sensorData.nitrogen = map(analogRead(N_PIN), 0, 1023, 0, 100);
  sensorData.phosphorus = map(analogRead(P_PIN), 0, 1023, 0, 100);
  sensorData.potassium = map(analogRead(K_PIN), 0, 1023, 0, 100);
}

// ========== معالجات HTTP ==========

// GET /status - التحقق من الاتصال
void handleStatus() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", "{\"status\":\"OK\"}");
}

// GET /data - الحصول على بيانات الحساسات
void handleData() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  
  String json = "{";
  json += "\"temperature\":" + String(sensorData.temperature, 1) + ",";
  json += "\"moisture\":" + String(sensorData.moisture, 0) + ",";
  json += "\"pH\":" + String(sensorData.pH, 1) + ",";
  json += "\"nitrogen\":" + String(sensorData.nitrogen, 0) + ",";
  json += "\"phosphorus\":" + String(sensorData.phosphorus, 0) + ",";
  json += "\"potassium\":" + String(sensorData.potassium, 0) + ",";
  json += "\"timestamp\":" + String(millis());
  json += "}";
  
  server.send(200, "application/json", json);
}

// GET /command - تنفيذ أوامر
void handleCommand() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  
  if (server.hasArg("cmd")) {
    String cmd = server.arg("cmd");
    
    if (cmd == "restart") {
      server.send(200, "application/json", "{\"result\":\"Restarting...\"}");
      delay(1000);
      ESP.restart();
    }
    else if (cmd == "reset_wifi") {
      WiFi.disconnect(true);
      delay(1000);
      ESP.restart();
    }
    else if (cmd == "info") {
      handleInfo();
    }
    else {
      server.send(400, "application/json", "{\"error\":\"Unknown command\"}");
    }
  } else {
    server.send(400, "application/json", "{\"error\":\"No command specified\"}");
  }
}

// GET /info - معلومات الجهاز
void handleInfo() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  
  String json = "{";
  json += "\"deviceName\":\"" + String(hostname) + "\",";
  json += "\"ssid\":\"" + String(WiFi.SSID()) + "\",";
  json += "\"ip\":\"" + WiFi.localIP().toString() + "\",";
  json += "\"rssi\":" + String(WiFi.RSSI()) + ",";
  json += "\"uptime\":" + String(millis()/1000) + ",";
  json += "\"version\":\"1.0.0\"";
  json += "}";
  
  server.send(200, "application/json", json);
}

// POST /calibrate - معايرة الحساسات
void handleCalibrate() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  
  // سيتم التوسع لاحقاً
  server.send(200, "application/json", "{\"result\":\"Calibration mode started\"}");
}

// معالج 404
void handleNotFound() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(404, "application/json", "{\"error\":\"Endpoint not found\"}");
}

// ========== طباعة القيم ==========
void printSensorValues() {
  Serial.println("📊 قراءة الحساسات:");
  Serial.print("  🌡️  درجة الحرارة: ");
  Serial.print(sensorData.temperature);
  Serial.println(" °C");
  
  Serial.print("  💧 الرطوبة: ");
  Serial.print(sensorData.moisture);
  Serial.println(" %");
  
  Serial.print("  🧪 pH: ");
  Serial.println(sensorData.pH);
  
  Serial.print("  🟢 N: ");
  Serial.print(sensorData.nitrogen);
  Serial.print("  🔵 P: ");
  Serial.print(sensorData.phosphorus);
  Serial.print("  🟡 K: ");
  Serial.println(sensorData.potassium);
}

// طباعة الحالة
void printStatus() {
  Serial.println("\n╔════════════════════════════════╗");
  Serial.println("║        System Status           ║");
  Serial.print("║ IP: ");
  Serial.print(WiFi.localIP());
  Serial.println("      ║");
  Serial.println("║ Port: 8080                      ║");
  Serial.println("║ Ready for connections!          ║");
  Serial.println("╚════════════════════════════════╝\n");
}

// EOF
