# 🌱 Smart Soil Analyzer

Real-time soil monitoring system with AI-powered analysis for optimal plant growth.

## ✨ Features

- 📊 **Real-time Sensor Data** - Temperature, Humidity, pH, NPK levels
- 🤖 **AI Analysis** - Intelligent soil recommendations
- 🌾 **Plant Database** - 2000+ plants with specific requirements
- 📱 **Bluetooth Integration** - HC-05 wireless connectivity
- 🎯 **Automatic & Manual Modes** - Choose how you monitor
- 🌐 **Web Interface** - Beautiful responsive dashboard
- 📡 **WebSocket Real-time Updates** - Live data streaming

## 🚀 Quick Start

### Prerequisites
- Node.js >= 14.0.0
- npm >= 6.0.0
- Optional: Arduino with sensors + HC-05 Bluetooth module

### Installation

```bash
# Clone the repository
git clone https://github.com/kab3shi6-lang/Smart-soil-analyzer-VISU.git
cd Smart-soil-analyzer-VISU

# Install dependencies
npm install

# Start the server
npm start
```

Open browser to: **http://localhost:3000/advanced-v5.html**

## 📖 Documentation

- [Setup Guide](./SETUP_GUIDE.md)
- [Arduino Configuration](./ARDUINO_GUIDE.md)
- [Bluetooth Setup](./BLUETOOTH_COMPLETE_GUIDE.md)
- [Quick Fix Guide](./FIX_SENSOR_DATA.md)

## 🔧 Usage

### Automatic Mode
- Connect sensors/Arduino
- Data streams automatically
- AI analyzes in real-time
- Recommendations updated every 5 seconds

### Manual Mode
- Enter soil parameters manually
- Select plant from database
- Get instant analysis
- View compatibility percentage
- See specific recommendations

## 📡 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Communication**: WebSocket, HTTP REST API
- **Hardware**: Arduino, HC-05 Bluetooth, Soil Sensors
- **AI**: Custom analysis engine

## 📊 API Endpoints

```
GET  /api/data      - Current sensor data
GET  /api/status    - Server status
WS   /              - WebSocket for real-time data
```

## 🔌 Hardware Setup

### Sensors Supported
- Temperature sensor (DS18B20, DHT22)
- Soil moisture sensor (Capacitive)
- pH sensor
- NPK sensor

### Connection
- Arduino → HC-05 Bluetooth module
- HC-05 → Computer (USB dongle or built-in)
- Data → Bridge Server → Web Dashboard

## 🛠️ Configuration

### Environment Variables
```
PORT=3000              # Server port
MOCK_MODE=true         # Enable mock data
NO_SERIAL=false        # Disable serial connection
```

### Serial Connection
The system auto-detects:
- Available COM ports
- Baud rate: 9600
- Data format: `TEMP:25,MOISTURE:60,PH:6.5,N:50,P:40,K:60`

## 📝 Plant Database

Over 2000 plants with:
- Ideal temperature range
- Soil moisture requirements
- pH preferences
- NPK nutrient needs
- Growing season information

## 🐛 Troubleshooting

### Data not showing?
```bash
# Test connection
node test-connection.js

# Check server status
curl http://localhost:3000/api/status
```

### WebSocket connection fails?
- Ensure port 3000 is available
- Check firewall settings
- Clear browser cache

### Serial port issues?
- Verify Arduino is connected
- Check COM port in Device Manager
- Try mock mode: `MOCK_MODE=true npm start`

## 📄 License

MIT License - see LICENSE file

## 👨‍💻 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Make your changes
4. Submit pull request

## 📞 Support

For issues and questions:
- Check [Troubleshooting Guide](./FIX_SENSOR_DATA.md)
- Open GitHub Issues
- Read documentation files

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Cloud data storage
- [ ] Historical analysis
- [ ] Weather integration
- [ ] Multi-garden support
- [ ] Email notifications

---

**Made with ❤️ for better plant growth**

[⭐ Star us on GitHub](https://github.com/kab3shi6-lang/Smart-soil-analyzer-VISU)
