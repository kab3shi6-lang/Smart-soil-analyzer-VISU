/**
 * 🔌 Arduino Setup Integration
 * Integration between arduino-pinout-reference.js and your actual Arduino setup
 * 
 * This file helps you:
 * 1. Verify all pin connections
 * 2. Configure Arduino code with correct pins
 * 3. Integrate with your website
 * 4. Test sensor connections
 */

// ==================== Pin Configuration ====================

const ARDUINO_PINS = {
  // Digital Pins
  DIGITAL: {
    DHT11_DATA: 2,
    HC05_RX: 10,    // SoftwareSerial RX (from HC-05)
    HC05_TX: 11     // SoftwareSerial TX (to HC-05)
  },
  
  // Analog Pins
  ANALOG: {
    SOIL_MOISTURE: 0,   // A0
    PH_SENSOR: 1,       // A1
    NPK_N: 2,           // A2
    NPK_P: 3,           // A3
    NPK_K: 4            // A4
  },
  
  // Power Pins
  POWER: {
    VCC: '5V',
    GND: 'GND'
  }
};

// ==================== Arduino Code Template ====================

const ARDUINO_CODE_TEMPLATE = `
#include <DHT.h>
#include <SoftwareSerial.h>

// ========== Pin Configuration ==========
#define DHTPIN ${ARDUINO_PINS.DIGITAL.DHT11_DATA}
#define DHTTYPE DHT11

#define SOIL_MOISTURE_PIN A${ARDUINO_PINS.ANALOG.SOIL_MOISTURE}
#define PH_PIN A${ARDUINO_PINS.ANALOG.PH_SENSOR}
#define NPK_N_PIN A${ARDUINO_PINS.ANALOG.NPK_N}
#define NPK_P_PIN A${ARDUINO_PINS.ANALOG.NPK_P}
#define NPK_K_PIN A${ARDUINO_PINS.ANALOG.NPK_K}

// ========== HC-05 Bluetooth Configuration ==========
SoftwareSerial BTSerial(${ARDUINO_PINS.DIGITAL.HC05_RX}, ${ARDUINO_PINS.DIGITAL.HC05_TX}); // RX, TX

// ========== DHT11 Setup ==========
DHT dht(DHTPIN, DHTTYPE);

// ========== Variables ==========
float temperature = 0.0;
float humidity = 0.0;
float soilMoisture = 0.0;
float pH = 0.0;
int nitrogen = 0;
int phosphorus = 0;
int potassium = 0;

// ========== Calibration Values ==========
const float PH_OFFSET = 0.0;        // Adjust if needed
const float MOISTURE_MIN = 0;       // Adjust based on sensor
const float MOISTURE_MAX = 1023;

void setup() {
  Serial.begin(9600);       // For debugging
  BTSerial.begin(9600);     // HC-05 Bluetooth (standard baud rate)
  dht.begin();              // DHT11 initialization
  
  delay(2000);
  Serial.println("✅ Arduino Initialized");
  Serial.println("📊 System Ready for Sensor Reading");
  BTSerial.println("READY");
}

void loop() {
  // Read all sensors
  readAllSensors();
  
  // Send data
  sendData();
  
  // Wait before next read
  delay(5000); // Change this for different intervals
}

// ========== Read All Sensors ==========
void readAllSensors() {
  // Read DHT11 (Temperature & Humidity)
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  
  // Read Analog Sensors
  int rawMoisture = analogRead(SOIL_MOISTURE_PIN);
  soilMoisture = map(rawMoisture, MOISTURE_MAX, MOISTURE_MIN, 0, 100);
  
  int rawPH = analogRead(PH_PIN);
  pH = 7.0 + (rawPH - 512) * 0.0078125 + PH_OFFSET;
  
  nitrogen = (analogRead(NPK_N_PIN) / 1023.0) * 200;      // 0-200 ppm
  phosphorus = (analogRead(NPK_P_PIN) / 1023.0) * 200;    // 0-200 ppm
  potassium = (analogRead(NPK_K_PIN) / 1023.0) * 200;     // 0-200 ppm
}

// ========== Send Data via Bluetooth ==========
void sendData() {
  // Format: TEMP:22.5,HUMIDITY:65,MOISTURE:70,PH:6.5,N:75,P:60,K:70
  String data = "TEMP:" + String(temperature, 1) + 
                ",HUMIDITY:" + String(humidity, 1) +
                ",MOISTURE:" + String(soilMoisture, 0) + 
                ",PH:" + String(pH, 2) + 
                ",N:" + String(nitrogen) + 
                ",P:" + String(phosphorus) + 
                ",K:" + String(potassium);
  
  BTSerial.println(data);
  
  // Also print to Serial for debugging
  Serial.println(data);
}

// ========== JSON Alternative ==========
void sendDataJSON() {
  String json = "{";
  json += "\\"TEMP\\":" + String(temperature, 1) + ",";
  json += "\\"HUMIDITY\\":" + String(humidity, 1) + ",";
  json += "\\"MOISTURE\\":" + String(soilMoisture, 0) + ",";
  json += "\\"PH\\":" + String(pH, 2) + ",";
  json += "\\"N\\":" + String(nitrogen) + ",";
  json += "\\"P\\":" + String(phosphorus) + ",";
  json += "\\"K\\":" + String(potassium);
  json += "}";
  
  BTSerial.println(json);
}
`;

// ==================== Connection Verification ====================

const CONNECTION_CHECKLIST = {
  digital: [
    { pin: 2, device: 'DHT11', signal: 'DATA', notes: 'Needs 4.7kΩ pull-up to 5V' },
    { pin: 10, device: 'HC-05', signal: 'RX', notes: 'Needs voltage divider (10kΩ + 20kΩ)' },
    { pin: 11, device: 'HC-05', signal: 'TX', notes: 'Direct connection, no voltage divider needed' }
  ],
  
  analog: [
    { pin: 'A0', device: 'Soil Moisture', output: 'AO', range: '0-1023 (0-100%)' },
    { pin: 'A1', device: 'PH Sensor', output: 'PO', range: '0-1023 (0-14 pH)' },
    { pin: 'A2', device: 'NPK N', output: 'N', range: '0-1023 (0-200+ ppm)' },
    { pin: 'A3', device: 'NPK P', output: 'P', range: '0-1023 (0-200+ ppm)' },
    { pin: 'A4', device: 'NPK K', output: 'K', range: '0-1023 (0-200+ ppm)' }
  ],
  
  power: [
    { source: '5V', devices: 'All sensors and HC-05', current: '~2A minimum' },
    { source: 'GND', devices: 'All sensors and HC-05', notes: 'Common ground required' }
  ]
};

// ==================== Setup Functions ====================

/**
 * Generate Arduino code with your pin configuration
 */
function generateArduinoCode() {
  return ARDUINO_CODE_TEMPLATE;
}

/**
 * Verify pin configuration
 */
function verifyPinConfiguration() {
  const verification = {
    digital: true,
    analog: true,
    power: true,
    issues: []
  };
  
  // Check if pins are unique
  const digitalPins = Object.values(ARDUINO_PINS.DIGITAL);
  if (new Set(digitalPins).size !== digitalPins.length) {
    verification.digital = false;
    verification.issues.push('❌ Digital pins have duplicates');
  }
  
  // Check analog pins
  const analogPins = Object.values(ARDUINO_PINS.ANALOG);
  if (new Set(analogPins).size !== analogPins.length) {
    verification.analog = false;
    verification.issues.push('❌ Analog pins have duplicates');
  }
  
  if (verification.digital && verification.analog) {
    verification.issues.push('✅ All pin assignments are valid');
  }
  
  return verification;
}

/**
 * Create HTML wiring diagram
 */
function createWiringDiagram() {
  return `
    <div class="wiring-diagram">
      <h2>🔌 Complete Wiring Diagram</h2>
      
      <div class="wiring-section">
        <h3>Digital Pins</h3>
        <ul>
          <li>Pin 2: DHT11 DATA (with 4.7kΩ pull-up)</li>
          <li>Pin 10: HC-05 RX (with voltage divider)</li>
          <li>Pin 11: HC-05 TX (direct)</li>
        </ul>
      </div>
      
      <div class="wiring-section">
        <h3>Analog Pins</h3>
        <ul>
          <li>A0: Soil Moisture Sensor</li>
          <li>A1: PH Sensor</li>
          <li>A2: NPK Nitrogen</li>
          <li>A3: NPK Phosphorus</li>
          <li>A4: NPK Potassium</li>
        </ul>
      </div>
      
      <div class="wiring-section">
        <h3>Power</h3>
        <ul>
          <li>5V: All sensors and HC-05</li>
          <li>GND: Common ground for all</li>
          <li>VIN: External 5V/2A power supply</li>
        </ul>
      </div>
    </div>
  `;
}

/**
 * Integration with Node.js Bridge
 */
function getBridgeConfiguration() {
  return {
    description: 'Arduino sends data in this format:',
    format: 'TEMP:22.5,HUMIDITY:65,MOISTURE:70,PH:6.5,N:75,P:60,K:70',
    baudRate: 9600,
    dataInterval: '5 seconds',
    
    // Example Node.js code for parsing
    nodeJsExample: `
      // In bridge.js
      parser.on('data', (data) => {
        const parts = data.toString().split(',');
        const readings = {};
        
        parts.forEach(part => {
          const [key, value] = part.split(':');
          readings[key.toLowerCase()] = parseFloat(value);
        });
        
        // Broadcast to website
        ws.clients.forEach(client => {
          client.send(JSON.stringify(readings));
        });
      });
    `
  };
}

/**
 * Troubleshooting guide
 */
const TROUBLESHOOTING = {
  dht11: {
    symptom: 'DHT11 not reading',
    solutions: [
      'Check 4.7kΩ pull-up resistor between Pin 2 and 5V',
      'Verify connection to Pin 2',
      'Ensure DHT11 library is installed',
      'Test with different pin (3, 4, 5)',
      'Replace DHT11 sensor'
    ]
  },
  
  analog: {
    symptom: 'Analog sensors showing wrong values',
    solutions: [
      'Check GND connection is shared',
      'Use multimeter to verify voltage',
      'Calibrate sensor (especially PH)',
      'Try different analog pin',
      'Clean sensor contacts'
    ]
  },
  
  bluetooth: {
    symptom: 'HC-05 not connecting',
    solutions: [
      'Check voltage divider on RX pin (should be 3.3V)',
      'Verify TX/RX connections (not reversed)',
      'Ensure Bluetooth baud rate is 9600',
      'Check HC-05 LED (should blink)',
      'Reset HC-05 (press button on module)'
    ]
  },
  
  power: {
    symptom: 'System unstable or restarting',
    solutions: [
      'Use external 5V/2A power supply (not USB)',
      'Check all GND connections',
      'Add larger capacitors (10µF, 100µF)',
      'Verify no shorts between VCC and GND',
      'Check power supply voltage (should be 5.0V ±0.2V)'
    ]
  }
};

// ==================== Export Functions ====================

/**
 * Print setup guide
 */
function printSetupGuide() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   🔌 Arduino Integration Setup Guide                     ║
╚═══════════════════════════════════════════════════════════╝

📋 Pin Configuration:
${JSON.stringify(ARDUINO_PINS, null, 2)}

✅ Verification:
${JSON.stringify(verifyPinConfiguration(), null, 2)}

📝 Next Steps:
1. Copy the Arduino code template above
2. Paste into Arduino IDE
3. Upload to your Arduino Uno
4. Check Serial Monitor for output
5. Test Bluetooth connection with: node bluetooth-test.js COM5

🔗 Then integrate with website:
- Make sure bridge.js is running: npm start
- Open: http://localhost:3000/advanced-v5.html
- Data should auto-fill from your Arduino
  `);
}

/**
 * Export for use in HTML/Node.js
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ARDUINO_PINS,
    ARDUINO_CODE_TEMPLATE,
    CONNECTION_CHECKLIST,
    TROUBLESHOOTING,
    generateArduinoCode,
    verifyPinConfiguration,
    createWiringDiagram,
    getBridgeConfiguration,
    printSetupGuide
  };
}
