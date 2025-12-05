/**
 * تطبيق التربة الذكي المتقدم
 * Smart Soil App - Advanced Version with 2000+ Plants
 */

// ============================================
// إعدادات عامة
// ============================================
const APP_CONFIG = {
  bridgeUrl: 'http://localhost:3000',
  wsUrl: 'ws://localhost:3000',
  updateInterval: 2000,
  maxPlants: 100,
  defaultLanguage: 'ar'
};

// ============================================
// إدارة اللغات
// ============================================
const translations = {
  ar: {
    'app-title': 'محلل التربة الذكي',
    'select-mode': 'اختر طريقة التحليل',
    'auto-mode': 'التحليل التلقائي',
    'manual-mode': 'اختيار يدوي',
    'sensor-data': 'بيانات الحساسات',
    'soil-values': 'أدخل قيم التربة',
    'temperature': 'درجة الحرارة',
    'moisture': 'الرطوبة',
    'ph': 'الرقم الهيدروجيني',
    'nitrogen': 'النيتروجين',
    'phosphorus': 'الفسفور',
    'potassium': 'البوتاسيوم',
    'analyze': 'تحليل',
    'back': 'رجوع',
    'no-data': 'لا توجد بيانات',
    'loading': 'جاري التحميل...',
    'error': 'حدث خطأ',
    'success': 'نجح التحليل'
  },
  en: {
    'app-title': 'Smart Soil Analyzer',
    'select-mode': 'Choose analysis method',
    'auto-mode': 'Automatic Analysis',
    'manual-mode': 'Manual Selection',
    'sensor-data': 'Sensor Data',
    'soil-values': 'Enter soil values',
    'temperature': 'Temperature',
    'moisture': 'Moisture',
    'ph': 'pH Level',
    'nitrogen': 'Nitrogen',
    'phosphorus': 'Phosphorus',
    'potassium': 'Potassium',
    'analyze': 'Analyze',
    'back': 'Back',
    'no-data': 'No data',
    'loading': 'Loading...',
    'error': 'Error occurred',
    'success': 'Analysis successful'
  }
};

class SmartSoilApp {
  constructor() {
    this.currentLanguage = 'ar';
    this.bridgeConnected = false;
    this.sensorData = null;
    this.selectedPlant = null;
    this.init();
  }

  init() {
    this.setupListeners();
    this.loadLanguage();
  }

  setupListeners() {
    // استماع لتغيير اللغة
    document.addEventListener('languageChange', (e) => {
      this.currentLanguage = e.detail;
      this.updateUI();
    });

    // استماع لبيانات الحساسات
    document.addEventListener('sensorUpdate', (e) => {
      this.sensorData = e.detail;
      this.displaySensorData();
    });

    // استماع لحالة الاتصال
    document.addEventListener('bridgeStatus', (e) => {
      this.bridgeConnected = e.detail;
    });
  }

  loadLanguage(lang = 'ar') {
    this.currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.updateUI();
  }

  updateUI() {
    // تحديث جميع النصوص
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
  }

  t(key) {
    return translations[this.currentLanguage]?.[key] || key;
  }

  /**
   * التحليل التلقائي
   */
  analyzeAutomatic(soilData) {
    if (!this.validateSoilData(soilData)) {
      return { error: 'بيانات غير صحيحة' };
    }

    // اختر النباتات المناسبة
    const suitable = plantsDB.plants.filter(p => this.isPlantSuitable(p, soilData));
    
    // ترتيب حسب درجة التوافق
    const ranked = suitable
      .map(p => ({
        plant: p,
        score: aiAnalyzer.calculateCompatibilityScore(p, soilData)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    return {
      success: true,
      soilData: soilData,
      plants: ranked.map(r => r.plant),
      count: ranked.length,
      message: `تم العثور على ${ranked.length} نبات مناسب`
    };
  }

  /**
   * التحليل اليدوي
   */
  analyzeManual(plant, soilData) {
    if (!this.validateSoilData(soilData)) {
      return { error: 'بيانات غير صحيحة' };
    }

    const analysis = aiAnalyzer.analyze(plant, soilData);
    const compatible = this.isPlantSuitable(plant, soilData);

    return {
      success: true,
      plant: plant,
      soilData: soilData,
      analysis: analysis,
      compatible: compatible,
      recommendations: this.generateRecommendations(plant, soilData, analysis)
    };
  }

  /**
   * التحقق من توافق النبات
   */
  isPlantSuitable(plant, soilData) {
    return soilData.temp >= plant.tempMin && soilData.temp <= plant.tempMax &&
           soilData.moisture >= plant.moistureMin && soilData.moisture <= plant.moistureMax &&
           soilData.ph >= plant.phMin && soilData.ph <= plant.phMax &&
           soilData.n >= plant.nMin && soilData.p >= plant.pMin && soilData.k >= plant.kMin;
  }

  /**
   * التحقق من صحة البيانات
   */
  validateSoilData(data) {
    return data && 
           typeof data.temp === 'number' && !isNaN(data.temp) &&
           typeof data.moisture === 'number' && !isNaN(data.moisture) &&
           typeof data.ph === 'number' && !isNaN(data.ph) &&
           typeof data.n === 'number' && !isNaN(data.n) &&
           typeof data.p === 'number' && !isNaN(data.p) &&
           typeof data.k === 'number' && !isNaN(data.k);
  }

  /**
   * توليد التوصيات
   */
  generateRecommendations(plant, soilData, analysis) {
    const tips = aiAnalyzer.getRandomTips(3);
    const waterSchedule = aiAnalyzer.generateWaterSchedule(plant);
    const fertilizeSchedule = aiAnalyzer.generateFertilizingSchedule(plant, soilData);

    return {
      tips: tips,
      waterSchedule: waterSchedule,
      fertilizeSchedule: fertilizeSchedule,
      deficiencies: analysis.deficiencies,
      harvestDate: `${plant.harvestDays} يوم من الزراعة`
    };
  }

  /**
   * الحصول على نباتات مناسبة للبحث
   */
  searchPlants(query) {
    return plantsDB.searchPlants(query);
  }

  /**
   * عرض بيانات الحساسات
   */
  displaySensorData() {
    if (!this.sensorData) return;

    const event = new CustomEvent('sensorDataDisplayed', {
      detail: {
        timestamp: new Date(),
        data: this.sensorData
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * حفظ الإعدادات
   */
  saveSettings(settings) {
    localStorage.setItem('soilAppSettings', JSON.stringify(settings));
  }

  /**
   * تحميل الإعدادات
   */
  loadSettings() {
    const saved = localStorage.getItem('soilAppSettings');
    return saved ? JSON.parse(saved) : {};
  }

  /**
   * تصدير التقرير
   */
  exportReport(data) {
    const report = {
      timestamp: new Date().toISOString(),
      language: this.currentLanguage,
      ...data
    };

    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${Date.now()}.json`;
    a.click();
  }
}

// ============================================
// إدارة الجسر والاتصالات
// ============================================
class BridgeManager {
  constructor() {
    this.connected = false;
    this.ws = null;
    this.retryCount = 0;
    this.maxRetries = 5;
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(APP_CONFIG.wsUrl);

        this.ws.onopen = () => {
          this.connected = true;
          this.retryCount = 0;
          this.broadcastStatus(true);
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          this.connected = false;
          this.broadcastStatus(false);
          reject(error);
        };

        this.ws.onclose = () => {
          this.connected = false;
          this.broadcastStatus(false);
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  handleMessage(data) {
    try {
      const parsed = JSON.parse(data);
      
      // معالجة بيانات الحساسات
      if (parsed.type === 'sensor_data') {
        document.dispatchEvent(new CustomEvent('sensorUpdate', {
          detail: parsed.data
        }));
      }

      // معالجة حالة الاتصال
      if (parsed.type === 'status') {
        this.broadcastStatus(parsed.connected);
      }
    } catch (e) {
      console.error('خطأ في معالجة البيانات:', e);
    }
  }

  send(command, data) {
    if (!this.connected) {
      console.warn('جسر البلوتوث غير متصل');
      return false;
    }

    try {
      this.ws.send(JSON.stringify({ command, data }));
      return true;
    } catch (e) {
      console.error('خطأ في إرسال البيانات:', e);
      return false;
    }
  }

  attemptReconnect() {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => this.connect().catch(() => {}), 2000 * this.retryCount);
    }
  }

  broadcastStatus(connected) {
    document.dispatchEvent(new CustomEvent('bridgeStatus', {
      detail: connected
    }));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.connected = false;
      this.broadcastStatus(false);
    }
  }
}

// ============================================
// التطبيق الرئيسي
// ============================================
const app = new SmartSoilApp();
const bridge = new BridgeManager();

// الاتصال بالجسر عند التحميل
window.addEventListener('load', () => {
  bridge.connect().catch(() => {
    console.warn('فشل الاتصال بالجسر - وضع غير متصل');
  });
});

// تنظيف عند الإغلاق
window.addEventListener('beforeunload', () => {
  bridge.disconnect();
});
