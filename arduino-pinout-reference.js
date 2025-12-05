/**
 * ملف توصيلات Arduino للطباعة
 * Arduino Wiring Pinout Reference
 * 
 * يمكن طباعة هذا الملف وحفظه كـ PDF
 */

const wiringPinout = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║          🔌 توصيلات Arduino الكاملة - Complete Pinout Reference           ║
║                                                                              ║
║                     نسخة: 1.0 | التاريخ: 2024 | Arduino Uno                 ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝


┌────────────────────────────────────────────────────────────────────────────┐
│ 🎯 ملخص المستشعرات والتوصيلات                                             │
└────────────────────────────────────────────────────────────────────────────┘

  المستشعر              | VCC  | GND  | Signal | Arduino Pin | ملاحظات
 ───────────────────────┼──────┼──────┼────────┼─────────────┼──────────────
  DHT11                 | 5V   | GND  | DATA   | Pin 2       | +4.7kΩ pull-up
  Soil Moisture Sensor  | 5V   | GND  | AO     | A0          | Analog
  PH Sensor             | 5V   | GND  | PO     | A1          | Analog
  NPK Sensor (N)        | 5V   | GND  | N      | A2          | Analog
  NPK Sensor (P)        | 5V   | GND  | P      | A3          | Analog
  NPK Sensor (K)        | 5V   | GND  | K      | A4          | Analog
  HC-05 Bluetooth (TX)  | 5V   | GND  | TX     | Pin 11      | SoftwareSerial
  HC-05 Bluetooth (RX)  | 5V   | GND  | RX     | Pin 10      | مقسم جهد


┌────────────────────────────────────────────────────────────────────────────┐
│ 📌 Pin Configuration Reference                                            │
└────────────────────────────────────────────────────────────────────────────┘

Digital Pins:
  Pin 0  → Serial RX (لا تستخدم)
  Pin 1  → Serial TX (لا تستخدم)
  Pin 2  → DHT11 DATA ✓
  Pin 3  → PWM
  Pin 4  → Available
  Pin 5  → PWM
  Pin 6  → PWM
  Pin 7  → Available
  Pin 8  → Available
  Pin 9  → PWM
  Pin 10 → HC-05 RX (SoftwareSerial) ✓
  Pin 11 → HC-05 TX (SoftwareSerial) ✓
  Pin 12 → Available
  Pin 13 → LED (Built-in)

Analog Pins:
  A0 → Soil Moisture Sensor ✓
  A1 → PH Sensor ✓
  A2 → NPK Nitrogen ✓
  A3 → NPK Phosphorus ✓
  A4 → NPK Potassium ✓
  A5 → Available

Power Pins:
  5V  → All sensors
  GND → All sensors
  3.3V → For HC-05 (if needed)
  VIN → External power


┌────────────────────────────────────────────────────────────────────────────┐
│ 🔴 DHT11 Detailed Wiring                                                  │
└────────────────────────────────────────────────────────────────────────────┘

DHT11 Connection Diagram:

    DHT11 Sensor
    ├─ Pin 1: VCC ────────────────→ 5V
    ├─ Pin 2: DATA ───┬───────────→ Arduino Pin 2
    │                 │
    │             [4.7kΩ]
    │                 │
    │                 ├───────────→ 5V (Pull-up resistor)
    │                 │
    │                 └───────────→ GND
    │
    └─ Pin 4: GND ────────────────→ GND

Important: 
  ✅ Must use 4.7kΩ pull-up resistor between Pin 2 and 5V
  ❌ Do NOT use without pull-up resistor


┌────────────────────────────────────────────────────────────────────────────┐
│ 📊 Analog Sensors Wiring                                                   │
└────────────────────────────────────────────────────────────────────────────┘

Soil Moisture Sensor:
  VCC (Red)   ──→ 5V
  GND (Black) ──→ GND
  AO (Yellow) ──→ Arduino A0
  DO (Green)  ──→ Not used

PH Sensor:
  VCC ──→ 5V
  GND ──→ GND
  PO  ──→ Arduino A1
  DO  ──→ Not used

NPK Sensor (Analog Version):
  VCC ──→ 5V
  GND ──→ GND
  N   ──→ Arduino A2
  P   ──→ Arduino A3
  K   ──→ Arduino A4


┌────────────────────────────────────────────────────────────────────────────┐
│ 🔗 HC-05 Bluetooth Wiring (IMPORTANT!)                                     │
└────────────────────────────────────────────────────────────────────────────┘

HC-05 Pin Configuration:

  HC-05 Pin Layout:
    ┌─────────┐
    │ 1 2 3 4 │
    │ 5 6 7 8 │
    └─────────┘

  Pin 1: GND
  Pin 2: VCC (5V)
  Pin 3: RX
  Pin 4: TX

Connection:
  HC-05 GND ──────────────────→ Arduino GND
  HC-05 VCC ──────────────────→ 5V
  HC-05 TX ───────────────────→ Arduino Pin 11 (SoftwareSerial RX)
  HC-05 RX ───┬───────────────→ Arduino Pin 10 (SoftwareSerial TX)
              │
          [Voltage Divider]
              │
              5V ───[10kΩ]───┬─→ GND
                             │
                        [20kΩ]
                             │
                            GND

Voltage Divider Calculation:
  V_out = V_in × R2 / (R1 + R2)
  V_out = 5V × 20kΩ / (10kΩ + 20kΩ)
  V_out = 3.33V ✅ Safe for HC-05

❌ CRITICAL: Do NOT connect 5V directly to HC-05 RX pin!


┌────────────────────────────────────────────────────────────────────────────┐
│ ⚡ Power Supply Requirements                                                │
└────────────────────────────────────────────────────────────────────────────┘

Required Power Supply:
  Voltage: 5V
  Current: 2A (minimum)
  Type: Regulated DC power supply

Power Distribution:
  Arduino Uno     → 500mA
  DHT11           → 50mA
  Sensors         → 100mA
  HC-05           → 300mA (at peak)
  Reserve         → 1000mA
  ─────────────────────────
  Total           → 2000mA (2A)

❌ WARNING:
  Do NOT use USB power alone!
  Do NOT use weak power supplies!
  Do NOT skip capacitors!


┌────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ Capacitors for Protection                                               │
└────────────────────────────────────────────────────────────────────────────┘

Required Capacitors:

  Location              | Value   | Quantity | Purpose
  ──────────────────────┼─────────┼──────────┼──────────────────
  Near IC VCC pins      | 0.1µF   | 3×       | High-frequency noise
  Main power supply     | 10µF    | 1×       | Medium-frequency noise
  Power input           | 100µF   | 1×       | Low-frequency noise
  HC-05 VCC             | 0.1µF   | 1×       | Additional filtering

Connection:
  VCC ──[Capacitor]──┐
                      │
                     GND


┌────────────────────────────────────────────────────────────────────────────┐
│ 📋 Wiring Checklist (Before Powering On)                                   │
└────────────────────────────────────────────────────────────────────────────┘

Basic Connections:
  ☐ 5V connected to all VCC pins
  ☐ GND connected to all GND pins
  ☐ GND connected between power supply and Arduino

DHT11:
  ☐ DHT11 VCC → 5V
  ☐ DHT11 GND → GND
  ☐ DHT11 DATA → Pin 2
  ☐ 4.7kΩ pull-up resistor installed

Analog Sensors:
  ☐ Soil Moisture AO → A0
  ☐ PH Sensor PO → A1
  ☐ NPK N → A2
  ☐ NPK P → A3
  ☐ NPK K → A4
  ☐ All GND connected

HC-05 Bluetooth:
  ☐ HC-05 VCC → 5V
  ☐ HC-05 GND → GND
  ☐ HC-05 TX → Pin 11
  ☐ HC-05 RX → Pin 10 (with voltage divider)
  ☐ Voltage divider: 10kΩ and 20kΩ installed

Power Supply:
  ☐ 5V/2A power supply ready
  ☐ Power supply GND connected to Arduino GND
  ☐ Capacitors installed
  ☐ All connections secure

Tools:
  ☐ Multimeter available
  ☐ USB cable for programming
  ☐ Serial monitor ready


┌────────────────────────────────────────────────────────────────────────────┐
│ 🧪 Testing Procedure                                                       │
└────────────────────────────────────────────────────────────────────────────┘

Step 1: Visual Inspection
  ☐ No obvious shorts
  ☐ All connections secure
  ☐ No reversed polarity

Step 2: Multimeter Check
  ☐ Measure 5V on power rails
  ☐ Measure GND continuity
  ☐ Check for shorts between VCC and GND

Step 3: Power On (Carefully!)
  ☐ Connect power supply slowly
  ☐ Watch for smoke or strange behavior
  ☐ Monitor temperature of components

Step 4: Serial Monitor Test
  ☐ Open Arduino IDE
  ☐ Upload test sketch
  ☐ Check Serial Monitor output
  ☐ Verify sensor readings

Step 5: Individual Sensor Test
  ☐ Test DHT11
  ☐ Test Soil Moisture
  ☐ Test PH Sensor
  ☐ Test NPK Sensor
  ☐ Test HC-05 Bluetooth


┌────────────────────────────────────────────────────────────────────────────┐
│ ⚠️ Troubleshooting Guide                                                   │
└────────────────────────────────────────────────────────────────────────────┘

DHT11 Not Reading:
  ✓ Check 4.7kΩ pull-up resistor
  ✓ Check Pin 2 connection
  ✓ Try different pin
  ✓ Replace DHT11

Analog Sensors Wrong Values:
  ✓ Check GND connection
  ✓ Use multimeter to measure voltage
  ✓ Try different analog pin
  ✓ Calibrate sensor

HC-05 Not Connecting:
  ✓ Check voltage divider on RX
  ✓ Check TX/RX connections
  ✓ Verify Baud Rate = 9600
  ✓ Reset HC-05

Power Issues:
  ✓ Check power supply voltage (should be 5V)
  ✓ Check current (should be < 2A)
  ✓ Add larger capacitors
  ✓ Use different power supply


┌────────────────────────────────────────────────────────────────────────────┐
│ 📞 Important Notes                                                         │
└────────────────────────────────────────────────────────────────────────────┘

1. Always use a multimeter to verify connections
2. Use quality components (not cheap clones)
3. Keep wires short and organized
4. Label all connections
5. Take photos before assembly
6. Test one sensor at a time
7. Keep power supply nearby for quick shutdown
8. Wear ESD protection when handling electronics
9. Don't force anything - if it doesn't fit, check the diagram
10. When in doubt, double-check the wiring diagram


═══════════════════════════════════════════════════════════════════════════════

تم إنشاؤه بواسطة: Smart Soil Analyzer System
الإصدار: 2.0 | Bluetooth Ready
التاريخ: 2024

═══════════════════════════════════════════════════════════════════════════════
`;

// طباعة الملخص
console.log(wiringPinout);

// حفظ في ملف (للمتصفح - عرض فقط)
window.wirePinoutRef = wiringPinout;

// دالة الطباعة
function printPinout() {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<pre style="font-family: monospace; font-size: 10px;">' + wiringPinout + '</pre>');
    printWindow.print();
}

// تصدير النص
function exportPinout() {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(wiringPinout));
    element.setAttribute("download", "Arduino_Pinout_Reference.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
