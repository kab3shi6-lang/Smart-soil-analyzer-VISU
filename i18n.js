// نظام إدارة اللغات
const i18n = {
  currentLang: 'ar',
  supportedLanguages: ['ar', 'en', 'fr', 'es', 'de', 'tr', 'ur', 'hi', 'pt', 'zh'],
  
  translations: {
    ar: {
      // Headers and Titles
      'Choose Analysis Method': 'اختر طريقة التحليل',
      'How would you like to analyze your soil?': 'كيف تريد تحليل التربة؟',
      'Automatic Analysis': 'التحليل التلقائي',
      'Enter soil values and get plant recommendations': 'أدخل قيم التربة وسنقترح عليك النباتات المناسبة',
      'Manual Selection': 'التحديد اليدوي',
      'Choose your favorite plant and check soil compatibility': 'اختر النبات المفضل لديك وسنتحقق من مدى توافق التربة',
      
      // Form Labels
      'Automatic Analysis - Enter Soil Data': 'التحليل التلقائي - أدخل بيانات التربة',
      'Temperature (°C)': 'درجة الحرارة (°C)',
      'Moisture (%)': 'الرطوبة (%)',
      'pH Level (0–14)': 'درجة الحموضة pH (0–14)',
      'Nitrogen (N)': 'النيتروجين (N)',
      'Phosphorus (P)': 'الفسفور (P)',
      'Potassium (K)': 'البوتاسيوم (K)',
      'Analyze Soil': 'تحليل التربة',
      'Use Example Values': 'استخدم قيم مثال',
      'Back': 'العودة',
      
      // Results
      'Analysis Results': 'نتائج التحليل',
      'Measured Soil Values': 'قيم التربة المقاسة',
      'Selected Plant': 'النبات المختار',
      'Soil Compatibility': 'توافق التربة',
      'Best Plants for This Soil': 'أفضل النباتات لهذه التربة',
      'Unsuitable Plants': 'النباتات غير المناسبة حالياً',
      'Soil Improvement Tips': 'نصائح تحسين التربة',
      'General Tips': 'نصائح عامة',
      
      // Status messages
      'Soil status: Excellent': 'حالة التربة: ممتازة',
      'plants are suitable': 'نبات(ات) مناسبة',
      'Soil status: Fair': 'حالة التربة: متوسطة',
      'Soil status: Poor': 'حالة التربة: ضعيفة',
      'Only': 'فقط',
      
      // Plant names
      'Tomato': 'الطماطم',
      'Potato': 'البطاطس',
      'Wheat': 'القمح',
      'Beans': 'الفاصوليا',
      'Carrot': 'الجزر',
      'Lettuce': 'الخس',
      'Chili Pepper': 'الفلفل الحار',
      'Spinach': 'السبانخ',
      'Onion': 'البصل',
      'Cucumber': 'الخيار',
      'Corn': 'الذرة',
      'Strawberry': 'الفراولة',
      'Apple': 'التفاح',
      
      // Status tags
      'Suitable': 'مناسبة',
      'Not suitable': 'غير مناسبة',
      
      // Messages
      'Please fill all fields with valid numbers': 'يرجى ملء جميع الحقول برقام صحيحة',
      'Please select a plant first': 'يرجى اختيار نبات أولاً',
      'No plants suitable now': 'لا توجد نباتات مناسبة حالياً. يرجى تحسين التربة.',
      'All plants look good': 'جميع النباتات مناسبة!',
      'No major issues': 'لا توجد مشاكل',
      'Tips:': 'نصائح:',
      'Soil is good overall': 'التربة في حالة جيدة. استمر في العناية المنتظمة.',
      
      // Issues and tips
      'Temperature too low': 'درجة الحرارة منخفضة جداً',
      'Temperature too high': 'درجة الحرارة مرتفعة جداً',
      'Moisture too low': 'الرطوبة منخفضة جداً',
      'Moisture too high': 'الرطوبة مرتفعة جداً',
      'pH too low': 'التربة حمضية جداً',
      'pH too high': 'التربة قلوية جداً',
      'Nitrogen is too low': 'النيتروجين ناقص - سيؤثر على نمو الأوراق',
      'Phosphorus is too low': 'الفسفور ناقص - سيؤثر على جودة الثمار',
      'Potassium is too low': 'البوتاسيوم ناقص - سيؤثر على قوة النبات',
      
      // Improvement materials
      'Chicken manure': 'سماد الدجاج',
      'Cow manure': 'سماد البقر',
      'Bone meal': 'دقيق العظام',
      'Wood ash': 'رماد الخشب',
      'Crushed eggshells': 'قشرة البيض المطحونة',
      'Agricultural lime': 'الجير الزراعي',
      'Recommended amount': 'الكمية الموصى بها',
      'Manual Selection - Choose Plant': 'التحديد اليدوي - اختر النبات',
      'Smart Soil Analyzer': 'محلل التربة الذكي',
      'Your guide to choosing the right plants for your soil': 'حليفك في اختيار النباتات المناسبة لتربتك'
    },
    en: {
      // Headers and Titles
      'Choose Analysis Method': 'Choose Analysis Method',
      'How would you like to analyze your soil?': 'How would you like to analyze your soil?',
      'Automatic Analysis': 'Automatic Analysis',
      'Enter soil values and get plant recommendations': 'Enter soil values and get plant recommendations',
      'Manual Selection': 'Manual Selection',
      'Choose your favorite plant and check soil compatibility': 'Choose your favorite plant and check soil compatibility',
      
      // Form Labels
      'Automatic Analysis - Enter Soil Data': 'Automatic Analysis - Enter Soil Data',
      'Temperature (°C)': 'Temperature (°C)',
      'Moisture (%)': 'Moisture (%)',
      'pH Level (0–14)': 'pH Level (0–14)',
      'Nitrogen (N)': 'Nitrogen (N)',
      'Phosphorus (P)': 'Phosphorus (P)',
      'Potassium (K)': 'Potassium (K)',
      'Analyze Soil': 'Analyze Soil',
      'Use Example Values': 'Use Example Values',
      'Back': 'Back',
      
      // Results
      'Analysis Results': 'Analysis Results',
      'Measured Soil Values': 'Measured Soil Values',
      'Selected Plant': 'Selected Plant',
      'Soil Compatibility': 'Soil Compatibility',
      'Best Plants for This Soil': 'Best Plants for This Soil',
      'Unsuitable Plants': 'Unsuitable Plants',
      'Soil Improvement Tips': 'Soil Improvement Tips',
      'General Tips': 'General Tips',
      
      // Status messages
      'Soil status: Excellent': 'Soil Status: Excellent',
      'plants are suitable': 'plants are suitable',
      'Soil status: Fair': 'Soil Status: Fair',
      'Soil status: Poor': 'Soil Status: Poor',
      'Only': 'Only',
      
      // Plant names
      'Tomato': 'Tomato',
      'Potato': 'Potato',
      'Wheat': 'Wheat',
      'Beans': 'Beans',
      'Carrot': 'Carrot',
      'Lettuce': 'Lettuce',
      'Chili Pepper': 'Chili Pepper',
      'Spinach': 'Spinach',
      'Onion': 'Onion',
      'Cucumber': 'Cucumber',
      'Corn': 'Corn',
      'Strawberry': 'Strawberry',
      'Apple': 'Apple',
      
      // Status tags
      'Suitable': 'Suitable',
      'Not suitable': 'Not suitable',
      
      // Messages
      'Please fill all fields with valid numbers': 'Please fill all fields with valid numbers',
      'Please select a plant first': 'Please select a plant first',
      'No plants suitable now': 'No plants suitable now. Please improve the soil.',
      'All plants look good': 'All plants look good!',
      'No major issues': 'No major issues',
      'Tips:': 'Tips:',
      'Soil is good overall': 'Soil looks good overall. Maintain regular care and watering.',
      
      // Issues and tips
      'Temperature too low': 'Temperature too low',
      'Temperature too high': 'Temperature too high',
      'Moisture too low': 'Moisture too low',
      'Moisture too high': 'Moisture too high',
      'pH too low': 'pH too low',
      'pH too high': 'pH too high',
      'Nitrogen is too low': 'Nitrogen is too low - affects leaf growth',
      'Phosphorus is too low': 'Phosphorus is too low - affects fruit quality',
      'Potassium is too low': 'Potassium is too low - affects plant strength',
      
      // Improvement materials
      'Chicken manure': 'Chicken manure',
      'Cow manure': 'Cow manure',
      'Bone meal': 'Bone meal',
      'Wood ash': 'Wood ash',
      'Crushed eggshells': 'Crushed eggshells',
      'Agricultural lime': 'Agricultural lime',
      'Recommended amount': 'Recommended amount',
      'Manual Selection - Choose Plant': 'Manual Selection - Choose Plant',
      'Smart Soil Analyzer': 'Smart Soil Analyzer',
      'Your guide to choosing the right plants for your soil': 'Your guide to choosing the right plants for your soil'
    },
    fr: {
      'Choose Analysis Method': 'Choisir la méthode d\'analyse',
      'Smart Soil Analyzer': 'Analyseur de sol intelligent',
    },
    es: {
      'Choose Analysis Method': 'Elegir método de análisis',
      'Smart Soil Analyzer': 'Analizador inteligente de suelos',
    },
    de: {
      'Choose Analysis Method': 'Analysemethode wählen',
      'Smart Soil Analyzer': 'Intelligenter Bodenanalysator',
    },
    tr: {
      'Choose Analysis Method': 'Analiz Yöntemini Seçin',
      'Smart Soil Analyzer': 'Akıllı Toprak Analiz Cihazı',
    },
    ur: {
      'Choose Analysis Method': 'تجزیہ کا طریقہ منتخب کریں',
      'Smart Soil Analyzer': 'سمارٹ مٹی کا تجزیہ کار',
    },
    hi: {
      'Choose Analysis Method': 'विश्लेषण विधि चुनें',
      'Smart Soil Analyzer': 'स्मार्ट मिट्टी विश्लेषक',
    },
    pt: {
      'Choose Analysis Method': 'Escolher método de análise',
      'Smart Soil Analyzer': 'Analisador Inteligente de Solos',
    },
    zh: {
      'Choose Analysis Method': '选择分析方法',
      'Smart Soil Analyzer': '智能土壤分析器',
    }
  },

  init() {
    const savedLang = localStorage.getItem('language') || 'ar';
    this.setLanguage(savedLang);
    this.setupToggleButton();
    this.setupLanguageMenu();
  },

  setLanguage(lang) {
    // التحقق من أن اللغة مدعومة
    if (!this.supportedLanguages.includes(lang)) {
      lang = 'ar';
    }
    
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' || lang === 'ur' || lang === 'hi' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('data-lang', lang);
    this.updateAllElements();
    this.updateLanguageButtonText();
  },

  toggle() {
    const nextLang = this.currentLang === 'ar' ? 'en' : 'ar';
    this.setLanguage(nextLang);
  },

  translate(key) {
    const translation = this.translations[this.currentLang];
    if (!translation) {
      return this.translations.en[key] || key;
    }
    return translation[key] || this.translations.en[key] || key;
  },

  setupToggleButton() {
    const toggleBtn = document.getElementById('langToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const menu = document.getElementById('languageMenu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      });
    }
  },

  setupLanguageMenu() {
    const options = document.querySelectorAll('.lang-option');
    options.forEach(option => {
      option.addEventListener('click', () => {
        const lang = option.getAttribute('data-lang');
        this.setLanguage(lang);
        document.getElementById('languageMenu').style.display = 'none';
      });
    });
  },

  updateLanguageButtonText() {
    const langNames = {
      'ar': { text: 'العربية', flag: '🇸🇦' },
      'en': { text: 'English', flag: '🇺🇸' },
      'fr': { text: 'Français', flag: '🇫🇷' },
      'es': { text: 'Español', flag: '🇪🇸' },
      'de': { text: 'Deutsch', flag: '🇩🇪' },
      'tr': { text: 'Türkçe', flag: '🇹🇷' },
      'ur': { text: 'اردو', flag: '🇵🇰' },
      'hi': { text: 'हिन्दी', flag: '🇮🇳' },
      'pt': { text: 'Português', flag: '🇧🇷' },
      'zh': { text: '中文', flag: '🇨🇳' }
    };
    
    const toggleBtn = document.getElementById('langToggle');
    if (toggleBtn) {
      const langText = toggleBtn.querySelector('.lang-text');
      if (langText) {
        langText.textContent = langNames[this.currentLang]?.text || 'English';
      }
    }
  },

  updateAllElements() {
    // تحديث جميع العناصر التي تحتوي على data-ar و data-en
    document.querySelectorAll('[data-ar][data-en]').forEach((el) => {
      const text = this.currentLang === 'ar' ? el.dataset.ar : el.dataset.en;
      el.textContent = text;
    });

    // تحديث العنوان
    const title = document.querySelector('title');
    if (title) {
      title.textContent = this.currentLang === 'ar' 
        ? title.dataset.ar 
        : title.dataset.en;
    }
  }
};

// إغلاق قائمة اللغات عند الضغط خارجها
document.addEventListener('click', (e) => {
  const menu = document.getElementById('languageMenu');
  const toggle = document.getElementById('langToggle');
  if (menu && toggle && !toggle.contains(e.target) && !menu.contains(e.target)) {
    menu.style.display = 'none';
  }
});

// Initialize i18n when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
  });
} else {
  i18n.init();
}
