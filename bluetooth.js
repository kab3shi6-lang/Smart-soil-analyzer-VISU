// نظام Bluetooth للتواصل مع الأردوينو
class ArduinoBluetoothHandler {
  constructor() {
    this.device = null;
    this.server = null;
    this.characteristic = null;
    this.isConnected = false;
  }

  // البحث والاتصال بجهاز Bluetooth
  async connect() {
    try {
      // فتح نافذة اختيار الجهاز
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['0000ffe0-0000-1000-8000-00805f9b34fb'] }, // HC-05 service UUID
          { name: 'HC-05' },
          { name: 'HM-10' }
        ],
        acceptAllDevices: false
      });

      console.log('✅ تم اختيار الجهاز:', this.device.name);

      // الاتصال بـ GATT server
      this.server = await this.device.gatt.connect();
      console.log('✅ تم الاتصال بـ GATT server');

      // الحصول على الخدمة
      const service = await this.server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
      console.log('✅ تم الحصول على الخدمة');

      // الحصول على الخاصية
      this.characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');
      console.log('✅ تم الحصول على الخاصية');

      // الاستماع للبيانات الواردة
      await this.characteristic.startNotifications();
      this.characteristic.addEventListener('characteristicvaluechanged', 
        this.handleData.bind(this));

      this.isConnected = true;
      console.log('✅ تم الاتصال بنجاح');

      return true;
    } catch (error) {
      console.error('❌ خطأ في الاتصال:', error);
      this.isConnected = false;
      return false;
    }
  }

  // معالجة البيانات الواردة من الأردوينو
  handleData(event) {
    const value = event.target.value;
    const decoder = new TextDecoder();
    const data = decoder.decode(value);
    
    console.log('📨 بيانات واردة:', data);
    
    // محاولة تحليل البيانات
    try {
      const readings = this.parseArduinoData(data);
      if (readings) {
        console.log('✅ تم تحليل البيانات:', readings);
        
        // تحديث النموذج بالبيانات الجديدة
        this.updateFormWithData(readings);
      }
    } catch (error) {
      console.error('❌ خطأ في تحليل البيانات:', error);
    }
  }

  // تحليل بيانات الأردوينو
  parseArduinoData(rawData) {
    // الصيغة المتوقعة: "TEMP:22.5,MOISTURE:65,PH:6.5,N:75,P:60,K:70"
    // أو: "22.5,65,6.5,75,60,70"
    
    try {
      const data = {};
      
      if (rawData.includes(':')) {
        // تنسيق مع المفاتيح
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
        // تنسيق بدون مفاتيح (ترتيب ثابت)
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

    Object.entries(mapping).forEach(([arduinoKey, inputId]) => {
      if (readings[arduinoKey] !== undefined) {
        const input = document.getElementById(inputId);
        if (input) {
          input.value = readings[arduinoKey].toFixed(1);
          
          // إضافة تأثير بصري للإشارة للتحديث
          input.style.backgroundColor = '#c6f6d5';
          setTimeout(() => {
            input.style.backgroundColor = '';
          }, 500);
          
          // إطلاق حدث input للتحديث الفوري
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    });

    // إطلاق حدث مخصص
    const event = new CustomEvent('arduinoDataReceived', { detail: readings });
    document.dispatchEvent(event);
  }

  // إرسال بيانات إلى الأردوينو
  async sendData(command) {
    if (!this.isConnected || !this.characteristic) {
      console.error('❌ لا يوجد اتصال');
      return false;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(command);
      await this.characteristic.writeValue(data);
      console.log('✅ تم إرسال الأمر:', command);
      return true;
    } catch (error) {
      console.error('❌ خطأ في الإرسال:', error);
      return false;
    }
  }

  // قطع الاتصال
  async disconnect() {
    try {
      if (this.device && this.device.gatt.connected) {
        await this.device.gatt.disconnect();
        this.isConnected = false;
        console.log('✅ تم قطع الاتصال');
      }
    } catch (error) {
      console.error('❌ خطأ في قطع الاتصال:', error);
    }
  }

  // التحقق من دعم Web Bluetooth
  static isSupported() {
    return 'bluetooth' in navigator;
  }
}

// إنشاء مثيل عام
let bluetoothHandler = null;

// تهيئة Bluetooth عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  if (ArduinoBluetoothHandler.isSupported()) {
    bluetoothHandler = new ArduinoBluetoothHandler();
    console.log('✅ Web Bluetooth متاح');
  } else {
    console.warn('⚠️ Web Bluetooth غير متاح في هذا المتصفح');
  }
});
