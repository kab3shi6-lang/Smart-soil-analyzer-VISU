// نظام WiFi للتواصل مع ESP-01
class ESP01WiFiHandler {
  constructor() {
    this.ipAddress = null;
    this.isConnected = false;
    this.port = 8080;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  // الاتصال بـ ESP-01
  async connect(ipAddress = null) {
    try {
      // إذا لم يتم إدخال IP، استخدم من localStorage
      this.ipAddress = ipAddress || localStorage.getItem('esp01_ip') || 'http://192.168.1.100';
      
      console.log('📡 محاولة الاتصال بـ:', this.ipAddress);

      // اختبار الاتصال
      const response = await fetch(`${this.ipAddress}:${this.port}/status`, {
        method: 'GET',
        timeout: 5000
      });

      if (response.ok) {
        this.isConnected = true;
        localStorage.setItem('esp01_ip', this.ipAddress);
        console.log('✅ تم الاتصال بنجاح بـ ESP-01');
        this.reconnectAttempts = 0;
        return true;
      }
    } catch (error) {
      console.error('❌ خطأ في الاتصال:', error.message);
      this.isConnected = false;
      this.reconnectAttempts++;
      return false;
    }
  }

  // الحصول على البيانات من ESP-01
  async getSensorData() {
    if (!this.isConnected) {
      console.error('❌ لا يوجد اتصال بـ ESP-01');
      return null;
    }

    try {
      const response = await fetch(`${this.ipAddress}:${this.port}/data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📨 بيانات واردة من ESP-01:', data);
        return this.parseSensorData(data);
      }
    } catch (error) {
      console.error('❌ خطأ في استقبال البيانات:', error);
      return null;
    }
  }

  // بدء المراقبة المستمرة
  startMonitoring(intervalSeconds = 2) {
    console.log('📊 بدء مراقبة البيانات كل', intervalSeconds, 'ثانية');
    
    this.monitoringInterval = setInterval(async () => {
      const data = await this.getSensorData();
      if (data) {
        this.updateFormWithData(data);
      } else if (this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log('🔄 محاولة إعادة الاتصال...');
        await this.connect();
      }
    }, intervalSeconds * 1000);
  }

  // إيقاف المراقبة
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      console.log('⏹️ تم إيقاف المراقبة');
    }
  }

  // تحليل بيانات ESP-01
  parseSensorData(rawData) {
    try {
      const data = {};

      // تنسيق JSON
      if (typeof rawData === 'object') {
        data.TEMP = parseFloat(rawData.temperature || rawData.temp || 0);
        data.MOISTURE = parseFloat(rawData.moisture || rawData.humid || 0);
        data.PH = parseFloat(rawData.pH || rawData.ph || 0);
        data.N = parseFloat(rawData.nitrogen || rawData.n || 0);
        data.P = parseFloat(rawData.phosphorus || rawData.p || 0);
        data.K = parseFloat(rawData.potassium || rawData.k || 0);
      }
      // تنسيق نصي
      else if (typeof rawData === 'string') {
        if (rawData.includes(':')) {
          // TEMP:22.5,MOISTURE:65,...
          const pairs = rawData.split(',');
          pairs.forEach(pair => {
            const [key, value] = pair.split(':');
            const cleanKey = key.trim().toUpperCase();
            const cleanValue = parseFloat(value.trim());
            
            if (!isNaN(cleanValue)) {
              data[cleanKey] = cleanValue;
            }
          });
        } else {
          // 22.5,65,6.5,75,60,70
          const values = rawData.split(',').map(v => parseFloat(v.trim()));
          if (values.length >= 6) {
            data.TEMP = values[0];
            data.MOISTURE = values[1];
            data.PH = values[2];
            data.N = values[3];
            data.P = values[4];
            data.K = values[5];
          }
        }
      }

      return (Object.keys(data).length > 0) ? data : null;
    } catch (error) {
      console.error('❌ خطأ في تحليل البيانات:', error);
      return null;
    }
  }

  // تحديث النموذج بالبيانات
  updateFormWithData(readings) {
    const mapping = {
      'TEMP': 'temp',
      'MOISTURE': 'moisture',
      'PH': 'ph',
      'N': 'n',
      'P': 'p',
      'K': 'k'
    };

    Object.entries(mapping).forEach(([sensorKey, inputId]) => {
      if (readings[sensorKey] !== undefined) {
        const input = document.getElementById(inputId);
        if (input) {
          input.value = readings[sensorKey].toFixed(1);
          
          // تأثير بصري
          input.style.backgroundColor = '#c6f6d5';
          setTimeout(() => {
            input.style.backgroundColor = '';
          }, 500);
          
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    });

    // إطلاق حدث مخصص
    const event = new CustomEvent('espDataReceived', { detail: readings });
    document.dispatchEvent(event);
  }

  // إرسال أمر إلى ESP-01
  async sendCommand(command, params = {}) {
    if (!this.isConnected) {
      console.error('❌ لا يوجد اتصال');
      return null;
    }

    try {
      const url = new URL(`${this.ipAddress}:${this.port}/command`);
      url.searchParams.append('cmd', command);
      
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      const response = await fetch(url, { method: 'GET' });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ تم تنفيذ الأمر:', command);
        return result;
      }
    } catch (error) {
      console.error('❌ خطأ في إرسال الأمر:', error);
      return null;
    }
  }

  // قطع الاتصال
  async disconnect() {
    try {
      this.stopMonitoring();
      this.isConnected = false;
      console.log('✅ تم قطع الاتصال');
      return true;
    } catch (error) {
      console.error('❌ خطأ في قطع الاتصال:', error);
      return false;
    }
  }

  // التحقق من حالة الاتصال
  getStatus() {
    return {
      connected: this.isConnected,
      ipAddress: this.ipAddress,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// إنشاء مثيل عام
let esp01Handler = new ESP01WiFiHandler();

console.log('✅ ESP-01 WiFi Handler جاهز');
