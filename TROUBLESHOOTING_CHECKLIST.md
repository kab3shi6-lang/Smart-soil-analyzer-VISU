# 📋 COMPLETE HARDWARE DATA FLOW TROUBLESHOOTING CHECKLIST

## System Overview
```
Arduino (Sensors) 
    ↓ (Serial/COM5)
Bridge.js (Node.js Server)
    ↓ (WebSocket ws://localhost:3000)
advanced-v5.html (Browser)
    ↓ (JavaScript Update)
Display on Page
```

---

## PHASE 1: HARDWARE & ARDUINO VERIFICATION

### Check #1: Arduino Board Connected
- [ ] Arduino plugged into USB port
- [ ] LED on Arduino is blinking (indicates power)
- [ ] Windows detects device in Device Manager
  - Open: Start → Device Manager → Ports (COM & LPT)
  - Should see: "Arduino Uno (COM5)" or similar
  - Note the COM port number: **COM____**

### Check #2: Arduino Code Running
- [ ] Sketch uploaded successfully (no compile errors)
- [ ] Serial monitor shows data output
  - In Arduino IDE: Tools → Serial Monitor
  - Set baud rate: 9600
  - Should show: `temp:25.5,humidity:60,moisture:70,...`
- [ ] Data updates every 5 seconds (or your configured interval)

### Check #3: Sensor Data Format
- [ ] Arduino sends complete string with ALL values
  - Example: `temp:25.5,humidity:60,moisture:70,ph:6.5,nitrogen:50,phosphorus:40,potassium:45`
- [ ] Each value is numeric (no text like "warm" or "dry")
- [ ] Values separated by commas
- [ ] Key:value pairs consistent every message

---

## PHASE 2: BRIDGE.JS CONFIGURATION

### Check #4: COM Port Configuration
**File: bridge.js**
```javascript
// Look for this line:
const PORT = 'COM5';  // ← Change COM5 to YOUR port from Check #1
```
- [ ] Set to correct COM port
- [ ] Example valid values: COM3, COM4, COM5, COM6
- [ ] Check your Device Manager for the exact port

### Check #5: Baud Rate Match
**File: bridge.js**
```javascript
const BAUD_RATE = 9600;  // ← Must match Arduino IDE setting
```
- [ ] Bridge baud rate matches Arduino
- [ ] Check Arduino IDE: Tools → Board → Baud Rate
- [ ] Typical: 9600 or 115200

### Check #6: Server Port Configuration
**File: bridge.js**
```javascript
const SERVER_PORT = 3000;  // ← Web server port
const WS_PORT = 3000;      // ← WebSocket port (usually same)
```
- [ ] SERVER_PORT set (usually 3000)
- [ ] WS_PORT set to same value
- [ ] These ports are free (not used by other apps)

### Check #7: Serial Port Open Check
**File: bridge.js - Look for:**
```javascript
serialPort.open((err) => {
    if (err) console.error('❌ Failed to open port:', err);
    else console.log('✅ Serial port opened');
});
```
- [ ] Function exists to handle port opening
- [ ] Error handling present

### Check #8: Data Parsing Function
**File: bridge.js - Look for parsing logic:**
```javascript
// Should have something like:
serialPort.on('data', (chunk) => {
    const line = chunk.toString().trim();
    // Parse the string into JSON object
    const data = parseData(line);
    // Broadcast to WebSocket clients
});
```
- [ ] Data reception handler exists
- [ ] String is trimmed (whitespace removed)
- [ ] Parsing converts string to object
- [ ] Result is JSON formatted

---

## PHASE 3: WEBSOCKET CONFIGURATION

### Check #9: WebSocket Server Setup
**File: bridge.js**
```javascript
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({ port: WS_PORT });
```
- [ ] WebSocket server is instantiated
- [ ] Port matches WS_PORT variable
- [ ] Connection handler exists:
  ```javascript
  wss.on('connection', (ws) => {
      console.log('✅ Client connected');
  });
  ```

### Check #10: Broadcasting Logic
**File: bridge.js**
```javascript
// Must broadcast to all connected clients
wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsedData));
    }
});
```
- [ ] Function exists to send data to all clients
- [ ] Only sends to OPEN connections
- [ ] Data is JSON stringified
- [ ] Called when new data received from Arduino

---

## PHASE 4: ADVANCED-V5.HTML CONFIGURATION

### Check #11: WebSocket Connection URL
**File: advanced-v5.html**
```javascript
// Search for:
const ws = new WebSocket('ws://localhost:3000');
```
- [ ] Port in URL matches WS_PORT in bridge.js
- [ ] Protocol is `ws://` (not `wss://` unless HTTPS)
- [ ] Hostname is `localhost` or `127.0.0.1`
- [ ] No typos in URL

### Check #12: WebSocket Event Handlers
**File: advanced-v5.html** - Should have:
```javascript
ws.onopen = () => {
    console.log('✅ WebSocket connected');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Update display here
};

ws.onerror = (error) => {
    console.error('❌ WebSocket error:', error);
};

ws.onclose = () => {
    console.log('⚠️ WebSocket closed');
};
```
- [ ] onopen handler exists
- [ ] onmessage handler exists
- [ ] onerror handler exists
- [ ] onclose handler exists

---

## PHASE 5: HTML ELEMENT IDs

### Check #13: Display Elements Exist
**File: advanced-v5.html - Search for elements like:**
```html
<span id="temperature-value"></span>
<span id="humidity-value"></span>
<span id="moisture-value"></span>
<span id="ph-value"></span>
<span id="nitrogen-value"></span>
<span id="phosphorus-value"></span>
<span id="potassium-value"></span>
```
- [ ] Temperature element with ID
- [ ] Humidity element with ID
- [ ] Moisture element with ID
- [ ] pH element with ID
- [ ] Nitrogen element with ID
- [ ] Phosphorus element with ID
- [ ] Potassium element with ID

Note the exact IDs: **_______________**

### Check #14: JavaScript Uses Correct IDs
**File: app-advanced.js or advanced-v5.html** - Search for:
```javascript
document.getElementById('temperature-value').textContent = data.temperature;
document.getElementById('humidity-value').textContent = data.humidity;
// etc.
```
- [ ] All getElementById() calls match HTML element IDs
- [ ] IDs are case-sensitive (match exactly)
- [ ] No typos in ID names

---

## PHASE 6: TESTING & VERIFICATION

### Check #15: Start Bridge Server
```powershell
cd c:\Users\Akena\OneDrive\Desktop\smart_soil_website
npm start
```

Expected console output:
```
✓ Bridge running on port 3000
✓ WebSocket listening on port 3000
✓ Serial port COM5 opened
✓ Waiting for sensor data...
✓ Data received: temp:25.5,humidity:60,...
```

- [ ] No errors shown
- [ ] "Bridge running" message appears
- [ ] "Serial port opened" message appears
- [ ] "Data received" message appears every 5 seconds

### Check #16: Open Website
- [ ] Open in browser: `http://localhost:3000/advanced-v5.html`
- [ ] Page loads without errors
- [ ] No blank page or 404 error

### Check #17: Browser Console Check
- [ ] Press F12 to open Developer Tools
- [ ] Go to Console tab
- [ ] Look for these messages:

Good signs:
```
✅ WebSocket connected
📊 Data received: {temperature: 25.5, humidity: 60, ...}
```

Bad signs (if you see these):
```
❌ WebSocket connection failed
❌ TypeError: Cannot set property 'textContent' of null
❌ JSON.parse error
❌ Failed to open serial port
```

### Check #18: Display Updates
- [ ] Sensor values appear on page
  - Temperature shows a number
  - Humidity shows a number
  - Moisture shows a number
  - pH shows a number
- [ ] Values change every 5 seconds
- [ ] No "NaN" or "undefined" displayed
- [ ] No zeros or dummy values

---

## PHASE 7: TROUBLESHOOTING

### If Bridge won't start:

**Error: "Cannot find module 'express'"**
- [ ] Run: `npm install`
- [ ] Wait for completion
- [ ] Try npm start again

**Error: "Address already in use"**
- [ ] Port 3000 already in use
- [ ] Run: `npx kill-port 3000`
- [ ] Or change WS_PORT to 8080 in bridge.js

**Error: "Failed to open serial port"**
- [ ] Wrong COM port in bridge.js
- [ ] Arduino not connected
- [ ] Try unplugging/replugging Arduino
- [ ] Check Device Manager for correct port

### If WebSocket won't connect:

**No "WebSocket connected" in Console**
- [ ] Wrong port in HTML (check URL matches bridge.js)
- [ ] Bridge not running
- [ ] Try refreshing page (F5)
- [ ] Clear browser cache (Ctrl+Shift+Del)

**"Connection refused" error**
- [ ] Port mismatch (bridge.js vs advanced-v5.html)
- [ ] Bridge crashed or stopped
- [ ] Different machine (localhost won't work)

### If values don't appear:

**"Cannot set property 'textContent' of null"**
- [ ] HTML element ID doesn't exist
- [ ] JavaScript is looking for wrong ID
- [ ] Search advanced-v5.html for exact element ID
- [ ] Update JavaScript to match

**Values show NaN or undefined**
- [ ] Data parsing failed
- [ ] Arduino format doesn't match expectations
- [ ] Check Bridge console for parsed data format

**Values don't update**
- [ ] WebSocket not receiving data
- [ ] Arduino not sending data
- [ ] Bridge not broadcasting
- [ ] Check each component separately

---

## PHASE 8: DATA FLOW VERIFICATION

### Step 1: Arduino Sends Data
```
Terminal → Arduino Serial Monitor
Expected: temp:25.5,humidity:60,moisture:70,ph:6.5,N:50,P:40,K:45
```

### Step 2: Bridge Receives Data
```
Command Line → npm start console
Expected: ✓ Data received: temp:25.5,humidity:60,...
```

### Step 3: Bridge Broadcasts
```
Browser → F12 Console
Expected: 📊 Data received: {temperature: 25.5, humidity: 60, ...}
```

### Step 4: Display Updates
```
Website → Page content
Expected: Temperature: 25.5°C, Humidity: 60%, etc.
```

---

## FINAL VALIDATION

Before declaring success, all these must be TRUE:

- [ ] Arduino console shows data every 5 seconds
- [ ] Bridge console shows "Data received" every 5 seconds
- [ ] Browser console shows received data objects
- [ ] Website displays all sensor values
- [ ] Values update in real-time (not frozen)
- [ ] No error messages in Console
- [ ] Page works after refresh (F5)
- [ ] Page works after browser restart

---

## QUICK REFERENCE PORTS & IDs

**Ports (must match):**
- Bridge: `_____` (usually 3000)
- HTML WebSocket: `ws://localhost:_____`

**Arduino COM Port:**
- COM: `_____` (from Device Manager)

**Element IDs (must exist in HTML and match JavaScript):**
- Temperature: `_____`
- Humidity: `_____`
- Moisture: `_____`
- pH: `_____`
- Nitrogen: `_____`
- Phosphorus: `_____`
- Potassium: `_____`

---

## SUCCESS CRITERIA

✅ **System is working when:**
1. Arduino sends sensor data continuously
2. Bridge receives and parses data without errors
3. Browser connects to WebSocket and receives data
4. Website displays all sensor readings
5. Values update every 5 seconds
6. No error messages in Bridge console or Browser console

---

**Print this document and keep it handy while testing!**
