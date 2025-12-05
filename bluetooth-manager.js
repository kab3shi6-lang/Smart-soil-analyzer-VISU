/**
 * Bluetooth Connection Manager
 * لإدارة اتصالات Bluetooth من الموقع مع Arduino
 * 
 * الاستخدام:
 * const manager = new BluetoothManager();
 * await manager.connect('COM5');
 * manager.onDataReceived = (data) => { console.log(data); };
 */

class BluetoothManager {
    constructor() {
        this.isConnected = false;
        this.device = null;
        this.port = null;
        this.reader = null;
        this.writer = null;
        this.readBuffer = '';
        this.dataQueue = [];
        this.onDataReceived = null;
        this.onError = null;
        this.onConnectionChange = null;
        this.reconnectInterval = null;
    }

    /**
     * ابحث عن الأجهزة المتاحة
     */
    async getPorts() {
        try {
            if (!navigator.serial) {
                throw new Error('Web Serial API غير مدعوم في هذا المتصفح');
            }

            // طلب منفذ جديد من المستخدم
            const ports = await navigator.serial.getPorts();
            console.log('🔍 المنافذ المتاحة:', ports);
            return ports;
        } catch (error) {
            console.error('❌ خطأ في البحث عن المنافذ:', error);
            throw error;
        }
    }

    /**
     * اتصل بـ Bluetooth عبر Serial
     */
    async connect(portIndex = 0, baudRate = 9600) {
        try {
            if (!navigator.serial) {
                throw new Error('Web Serial API غير مدعوم - استخدم Chrome 89+');
            }

            // احصل على المنافذ
            let ports = await navigator.serial.getPorts();
            
            if (ports.length === 0) {
                // اطلب منفذ جديد
                this.port = await navigator.serial.requestPort();
                console.log('✅ تم تحديد منفذ جديد');
            } else {
                this.port = ports[portIndex];
                console.log(`✅ استخدام المنفذ: ${portIndex}`);
            }

            // فتح المنفذ
            await this.port.open({ baudRate });
            console.log(`✅ تم الاتصال بـ Bluetooth (${baudRate} baud)`);
            
            this.isConnected = true;
            this.notifyConnectionChange(true);
            
            // ابدأ القراءة
            this.startReading();

            return true;
        } catch (error) {
            console.error('❌ خطأ في الاتصال:', error.message);
            this.notifyError(error);
            return false;
        }
    }

    /**
     * ابدأ قراءة البيانات
     */
    async startReading() {
        try {
            this.reader = this.port.readable.getReader();

            while (true) {
                const { value, done } = await this.reader.read();
                if (done) {
                    console.log('🔴 انقطع الاتصال');
                    this.disconnect();
                    break;
                }

                // حول البيانات إلى نصوص
                const text = new TextDecoder().decode(value);
                this.processIncomingData(text);
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('❌ خطأ في القراءة:', error);
                this.notifyError(error);
            }
        } finally {
            if (this.reader) {
                this.reader.releaseLock();
            }
        }
    }

    /**
     * معالجة البيانات الواردة
     */
    processIncomingData(text) {
        this.readBuffer += text;

        // ابحث عن أسطر كاملة (تنتهي بـ \n)
        while (this.readBuffer.includes('\n')) {
            const lineEnd = this.readBuffer.indexOf('\n');
            const line = this.readBuffer.substring(0, lineEnd).trim();
            this.readBuffer = this.readBuffer.substring(lineEnd + 1);

            if (line) {
                try {
                    // حاول تحليل JSON
                    const data = JSON.parse(line);
                    this.handleData(data);
                    console.log('📊 بيانات مستقبلة:', data);
                } catch (e) {
                    // ربما تكون رسالة نصية عادية
                    console.log('📝 رسالة:', line);
                }
            }
        }
    }

    /**
     * معالجة البيانات المستقبلة
     */
    handleData(data) {
        this.dataQueue.push(data);
        
        // استدعِ callback
        if (this.onDataReceived) {
            this.onDataReceived(data);
        }

        // أرسل إلى Bridge أيضاً
        this.sendToBridge(data);
    }

    /**
     * أرسل البيانات إلى Bridge
     */
    async sendToBridge(data) {
        try {
            // افترض أن Bridge يعمل على localhost:3000
            await fetch('http://localhost:3000/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).catch(err => {
                // Bridge قد لا يكون متاحاً، لكن لا تقطع الاتصال
                console.log('⚠️  Bridge غير متاح:', err.message);
            });
        } catch (error) {
            console.error('❌ خطأ في إرسال البيانات:', error);
        }
    }

    /**
     * أرسل أمر إلى Arduino
     */
    async sendCommand(command) {
        try {
            if (!this.isConnected || !this.port) {
                throw new Error('غير متصل');
            }

            const writer = this.port.writable.getWriter();
            const encoder = new TextEncoder();
            await writer.write(encoder.encode(command + '\n'));
            writer.releaseLock();

            console.log(`📤 تم إرسال الأمر: ${command}`);
            return true;
        } catch (error) {
            console.error('❌ خطأ في الإرسال:', error);
            this.notifyError(error);
            return false;
        }
    }

    /**
     * ابدأ محاولة إعادة الاتصال التلقائي
     */
    startAutoReconnect(interval = 5000) {
        if (this.reconnectInterval) return;

        this.reconnectInterval = setInterval(async () => {
            if (!this.isConnected) {
                console.log('🔄 محاولة إعادة الاتصال...');
                await this.connect();
            }
        }, interval);

        console.log(`✅ إعادة اتصال تلقائي كل ${interval / 1000} ثواني`);
    }

    /**
     * توقف إعادة الاتصال التلقائي
     */
    stopAutoReconnect() {
        if (this.reconnectInterval) {
            clearInterval(this.reconnectInterval);
            this.reconnectInterval = null;
            console.log('⏹️  توقفت إعادة الاتصال التلقائي');
        }
    }

    /**
     * قطع الاتصال
     */
    async disconnect() {
        try {
            this.stopAutoReconnect();
            
            if (this.reader) {
                await this.reader.cancel();
                this.reader = null;
            }

            if (this.port) {
                await this.port.close();
                this.port = null;
            }

            this.isConnected = false;
            this.notifyConnectionChange(false);
            console.log('✅ تم قطع الاتصال');
            return true;
        } catch (error) {
            console.error('❌ خطأ في قطع الاتصال:', error);
            this.notifyError(error);
            return false;
        }
    }

    /**
     * حصول على آخر بيانات مستقبلة
     */
    getLatestData() {
        return this.dataQueue.length > 0 
            ? this.dataQueue[this.dataQueue.length - 1] 
            : null;
    }

    /**
     * حصول على سجل البيانات
     */
    getDataHistory(limit = 100) {
        return this.dataQueue.slice(-limit);
    }

    /**
     * مسح السجل
     */
    clearHistory() {
        this.dataQueue = [];
    }

    /**
     * إخطار بتغيير حالة الاتصال
     */
    notifyConnectionChange(isConnected) {
        if (this.onConnectionChange) {
            this.onConnectionChange(isConnected);
        }
    }

    /**
     * إخطار بالخطأ
     */
    notifyError(error) {
        if (this.onError) {
            this.onError(error);
        }
    }

    /**
     * حصول على حالة الاتصال
     */
    getStatus() {
        return {
            connected: this.isConnected,
            dataReceived: this.dataQueue.length,
            latestData: this.getLatestData(),
            lastDataTime: new Date().toISOString()
        };
    }
}

/**
 * Web Bluetooth API Manager (للأجهزة المتقدمة)
 */
class WebBluetoothManager {
    constructor() {
        this.device = null;
        this.characteristic = null;
        this.onDataReceived = null;
    }

    /**
     * ابحث واتصل بجهاز Bluetooth
     */
    async connect() {
        try {
            if (!navigator.bluetooth) {
                throw new Error('Web Bluetooth API غير مدعومة');
            }

            // البحث عن جهاز HC-05
            this.device = await navigator.bluetooth.requestDevice({
                filters: [
                    { name: 'HC-05' },
                    { name: 'HC05' },
                    { name: 'Bluetooth HC-05' }
                ],
                optionalServices: ['00001101-0000-1000-8000-00805f9b34fb'] // Serial Port Service
            });

            console.log(`✅ تم تحديد الجهاز: ${this.device.name}`);

            const gatt = await this.device.gatt.connect();
            console.log('✅ تم الاتصال بـ GATT');

            // احصل على الخدمة والخصائص
            const service = await gatt.getPrimaryService('00001101-0000-1000-8000-00805f9b34fb');
            this.characteristic = await service.getCharacteristic('00002a0d-0000-1000-8000-00805f9b34fb');

            // استمع للتغييرات
            await this.characteristic.startNotifications();
            this.characteristic.addEventListener('characteristicvaluechanged', 
                (e) => this.handleDataReceived(e));

            console.log('✅ تم الاتصال بـ Bluetooth بنجاح');
            return true;
        } catch (error) {
            console.error('❌ خطأ في الاتصال:', error);
            return false;
        }
    }

    /**
     * معالجة البيانات المستقبلة
     */
    handleDataReceived(event) {
        const value = event.target.value;
        const decoder = new TextDecoder();
        const data = decoder.decode(value);

        try {
            const json = JSON.parse(data);
            if (this.onDataReceived) {
                this.onDataReceived(json);
            }
        } catch (e) {
            console.log('📝 نص:', data);
        }
    }

    /**
     * قطع الاتصال
     */
    async disconnect() {
        if (this.device && this.device.gatt.connected) {
            await this.device.gatt.disconnect();
            console.log('✅ تم قطع الاتصال');
        }
    }
}

// ==================== تصدير ====================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BluetoothManager, WebBluetoothManager };
}
