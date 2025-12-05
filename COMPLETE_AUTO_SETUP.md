# 🎯 COMPLETE SETUP - Automatic Readings

## ⚡ Quick Start (3 Commands)

```powershell
# 1. Run setup
node setup-auto-readings.js

# 2. Start the Bridge server
npm start

# 3. Open in browser
# http://localhost:3000/advanced-v5.html
```

---

## 📊 How It Works

```
Arduino (Sensors)
    ↓
    [USB/Serial Connection]
    ↓
Bridge Server (Node.js) - Reads sensor data
    ↓
    [localhost:3000]
    ↓
Website (advanced-v5.html) - Displays data
    ↓
Automatic Updates Every 5 Seconds
```

---

## 🔧 Configuration

### 1. **Bridge Configuration** (`bridge.js`)

Make sure your COM port matches:
```javascript
const PORT = 'COM5'; // Change if needed
```

**To find your COM port:**
1. Device Manager → Ports (COM & LPT)
2. Look for "Arduino" or "CH340"
3. Update the COM port in bridge.js

### 2. **Website Configuration** (`advanced-v5.html`)

The website automatically connects to:
```
http://localhost:3000/api/readings
```

### 3. **Data Format**

The Bridge sends data in this format:
```json
{
  "timestamp": 1701806400000,
  "temperature": 28.5,
  "humidity": 65.3,
  "soilMoisture": 45.2,
  "light": 720,
  "ph": 6.8
}
```

---

## ✅ Verification Checklist

Before running, verify:

- [ ] Arduino is plugged in via USB
- [ ] Arduino code is uploaded (ARDUINO_CODE_COMPLETE.ino)
- [ ] Sensors are connected to Arduino
- [ ] Node.js is installed (`node --version`)
- [ ] Dependencies installed (`npm install`)
- [ ] COM port in bridge.js matches Device Manager

---

## 🚀 Startup Process

### Step 1: Start Bridge Server
```powershell
npm start
```

**Expected output:**
```
✓ Connecting to COM5...
✓ Bridge running on port 3000
✓ Waiting for sensor data...
✓ Data received: {"temperature": 28.5, ...}
```

### Step 2: Open Website
- Go to: `http://localhost:3000/advanced-v5.html`
- Website auto-connects to Bridge
- Readings update every 5 seconds

### Step 3: Monitor in Browser Console
Press F12 to see:
```
Connected to Bridge ✓
Fetching readings...
Data received: {...}
```

---

## 🔍 Troubleshooting

### Problem: "Cannot find module 'serialport'"
**Solution:**
```powershell
npm install
```

### Problem: "Error: ENOENT No such file or directory"
**Solution:**
- Check COM port in bridge.js
- Verify Arduino is connected

### Problem: "Connection refused"
**Solution:**
- Make sure `npm start` is running
- Check port 3000 is not blocked
- Try: `netstat -ano | findstr :3000`

### Problem: Website loads but no readings
**Solution:**
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab - look for `/api/readings` requests
4. Verify Bridge server shows "Data received"

---

## 📝 Files Used

| File | Purpose |
|------|---------|
| `bridge.js` | Reads from Arduino, serves data |
| `advanced-v5.html` | Website that displays readings |
| `package.json` | Project configuration & start script |
| `ARDUINO_CODE_COMPLETE.ino` | Arduino sensor code |
| `bluetooth-test.js` | For testing connections |

---

## ✨ Features

✅ **Automatic Updates** - Data refreshes every 5 seconds  
✅ **Real-time Graphs** - Visual data display  
✅ **Local Server** - No internet required  
✅ **Auto-Reconnect** - Handles disconnections  
✅ **Error Handling** - Shows connection status  

---

## 🎓 What Happens When You Run `npm start`

1. **Node.js starts Bridge server** on port 3000
2. **Opens serial port** to Arduino (e.g., COM5)
3. **Reads sensor data** from Arduino every second
4. **Serves data** via HTTP endpoint `/api/readings`
5. **Website polls** endpoint every 5 seconds
6. **Displays readings** on your dashboard
7. **Updates graphs** with new data points

---

## 💡 Pro Tips

1. **Keep Bridge running** - Don't close the terminal
2. **Multiple pages** - Open `advanced-v5.html` in multiple browser tabs (all sync)
3. **Mobile access** - Can access from phone on same WiFi if bridge config updated
4. **Logs** - Bridge shows all data being received in terminal
5. **Restart** - If website stops updating, restart Bridge and refresh browser

---

## 📞 Need Help?

1. Check Console (F12) for JavaScript errors
2. Check PowerShell for Bridge errors
3. Verify Arduino code is running
4. Test connection: `node bluetooth-test.js COM5`

Good luck! 🌱
