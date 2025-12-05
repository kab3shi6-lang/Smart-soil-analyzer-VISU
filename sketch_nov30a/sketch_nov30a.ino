#include <SoftwareSerial.h>
#include <DHT.h>

// -------------------- DHT11 CONFIG --------------------
#define DHTPIN 7
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// -------------------- NPK SENSOR CONFIG --------------------
SoftwareSerial npkSerial(2, 3);  // RX = 2, TX = 3
byte requestData[8] = {0x01, 0x03, 0x00, 0x00, 0x00, 0x03, 0x05, 0xCB};
byte responseData[11];

// -------------------- BLUETOOTH HC-05 --------------------
SoftwareSerial BT(10, 11); // RX = 10, TX = 11

// -------------------- ANALOG SENSORS --------------------
#define PH_PIN A0
#define SOIL_PIN A1


// ===================== SETUP =====================
void setup() {
  Serial.begin(9600);
  BT.begin(9600);
  npkSerial.begin(9600);
  dht.begin();

  Serial.println("System Ready...");
  BT.println("Bluetooth Connected...");
}



// ===================== READ PH =====================
float readPH() {
  int sensorValue = analogRead(PH_PIN);
  float voltage = sensorValue * (5.0 / 1023.0);
  float phValue = 3.5 * voltage + 1.0; // تعديل حسب معايرة الحساس
  return phValue;
}



// ===================== READ SOIL MOISTURE =====================
int readSoilMoisture() {
  int value = analogRead(SOIL_PIN);
  int moisture = map(value, 1023, 300, 0, 100);
  moisture = constrain(moisture, 0, 100);
  return moisture;
}



// ===================== READ NPK SENSOR =====================
bool readNPK(int &N, int &P, int &K) {

  npkSerial.write(requestData, 8);
  delay(150);

  if (npkSerial.available() >= 11) {
    for (int i = 0; i < 11; i++) {
      responseData[i] = npkSerial.read();
    }

    N = responseData[3];
    P = responseData[5];
    K = responseData[7];

    return true;
  }

  return false;
}



// ===================== MAIN LOOP =====================
void loop() {

  // ----- Read Sensors -----
  float temperature = dht.readTemperature();
  float humidity    = dht.readHumidity();
  float phValue     = readPH();
  int soil          = readSoilMoisture();

  int N = 0, P = 0, K = 0;
  bool npk_OK = readNPK(N, P, K);


  // ----------- Build JSON STRING -----------
  String json = "{";

  json += "\"temperature\":" + String(temperature) + ",";
  json += "\"humidity\":" + String(humidity) + ",";
  json += "\"ph\":" + String(phValue) + ",";
  json += "\"soil\":" + String(soil) + ",";

  if (npk_OK) {
    json += "\"N\":" + String(N) + ",";
    json += "\"P\":" + String(P) + ",";
    json += "\"K\":" + String(K);
  } else {
    json += "\"N\":0,\"P\":0,\"K\":0";
  }

  json += "}";

  // ----------- Output to Serial Monitor -----------
  Serial.println(json);

  // ----------- Send JSON Over Bluetooth -----------  
  BT.println(json);

  delay(1500);
}
