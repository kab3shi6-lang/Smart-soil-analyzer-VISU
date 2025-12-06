// نظام إدارة اللغات المحسّن - Complete multilingual system
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
      'Manual Selection - Enter Soil Data Then Choose Plant': 'التحديد اليدوي - أدخل بيانات التربة ثم اختر النبات',
      'Temperature (°C)': 'درجة الحرارة (°C)',
      'Moisture (%)': 'الرطوبة (%)',
      'pH Level (0–14)': 'درجة الحموضة pH (0–14)',
      'Nitrogen (N)': 'النيتروجين (N)',
      'Phosphorus (P)': 'الفسفور (P)',
      'Potassium (K)': 'البوتاسيوم (K)',
      'Analyze Soil': 'تحليل التربة',
      'Use Example Values': 'استخدم قيم مثال',
      'Back': 'العودة',
      'Choose Plant from List': 'اختر النبات من القائمة',
      'Waiting for sensor data...': 'في انتظار بيانات المستشعر...',
      
      // Results
      'Analysis Results': 'نتائج التحليل',
      'Measured Soil Values': 'قيم التربة المقاسة',
      'Selected Plant': 'النبات المختار',
      'Soil Compatibility': 'توافق التربة',
      'Best Plants for This Soil': 'أفضل النباتات لهذه التربة',
      'Unsuitable Plants': 'النباتات غير المناسبة حالياً',
      'Soil Improvement Tips': 'نصائح تحسين التربة',
      'General Tips': 'نصائح عامة',
      'Soil Quality': 'جودة التربة',
      'Print': 'طباعة',
      'Share': 'مشاركة',
      
      // Status messages
      'Soil status: Excellent': 'حالة التربة: ممتازة',
      'plants are suitable': 'نبات(ات) مناسبة',
      'Soil status: Fair': 'حالة التربة: متوسطة',
      'Soil status: Poor': 'حالة التربة: ضعيفة',
      'Only': 'فقط',
      'Plants': 'نبات',
      'Professional & Smart': 'احترافي وذكي',
      
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
      'Please fill all fields with valid numbers': 'يرجى ملء جميع الحقول بأرقام صحيحة',
      'Please select a plant first': 'يرجى اختيار نبات أولاً',
      'No plants suitable now': 'لا توجد نباتات مناسبة حالياً. يرجى تحسين التربة.',
      'All plants look good': 'جميع النباتات مناسبة!',
      'No major issues': 'لا توجد مشاكل',
      'Tips:': 'نصائح:',
      'Soil is good overall': 'التربة في حالة جيدة. استمر في العناية المنتظمة.',
      'Search for a plant...': 'ابحث عن نبات...',
      'No plants found': 'لم نجد نباتات',
      'Try a different search term': 'جرّب كلمة بحث أخرى',
      'Please fill all soil fields first': 'يرجى ملء جميع حقول التربة أولاً',
      
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
      'Your guide to choosing the right plants for your soil': 'حليفك في اختيار النباتات المناسبة لتربتك',
      
      // Filters
      'All': 'الكل',
      'Vegetables': 'خضروات',
      'Fruits': 'فواكه',
      'Grains': 'حبوب',
      'Legumes': 'بقوليات',
      'Herbs': 'أعشاب',
      'Spices': 'توابل',
      'Flowers': 'زهور'
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
      'Manual Selection - Enter Soil Data Then Choose Plant': 'Manual Selection - Enter Soil Data Then Choose Plant',
      'Temperature (°C)': 'Temperature (°C)',
      'Moisture (%)': 'Moisture (%)',
      'pH Level (0–14)': 'pH Level (0–14)',
      'Nitrogen (N)': 'Nitrogen (N)',
      'Phosphorus (P)': 'Phosphorus (P)',
      'Potassium (K)': 'Potassium (K)',
      'Analyze Soil': 'Analyze Soil',
      'Use Example Values': 'Use Example Values',
      'Back': 'Back',
      'Choose Plant from List': 'Choose Plant from List',
      'Waiting for sensor data...': 'Waiting for sensor data...',
      
      // Results
      'Analysis Results': 'Analysis Results',
      'Measured Soil Values': 'Measured Soil Values',
      'Selected Plant': 'Selected Plant',
      'Soil Compatibility': 'Soil Compatibility',
      'Best Plants for This Soil': 'Best Plants for This Soil',
      'Unsuitable Plants': 'Unsuitable Plants',
      'Soil Improvement Tips': 'Soil Improvement Tips',
      'General Tips': 'General Tips',
      'Soil Quality': 'Soil Quality',
      'Print': 'Print',
      'Share': 'Share',
      
      // Status messages
      'Soil status: Excellent': 'Soil Status: Excellent',
      'plants are suitable': 'plants are suitable',
      'Soil status: Fair': 'Soil Status: Fair',
      'Soil status: Poor': 'Soil Status: Poor',
      'Only': 'Only',
      'Plants': 'Plants',
      'Professional & Smart': 'Professional & Smart',
      
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
      'Search for a plant...': 'Search for a plant...',
      'No plants found': 'No plants found',
      'Try a different search term': 'Try a different search term',
      'Please fill all soil fields first': 'Please fill all soil fields first',
      
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
      'Your guide to choosing the right plants for your soil': 'Your guide to choosing the right plants for your soil',
      
      // Filters
      'All': 'All',
      'Vegetables': 'Vegetables',
      'Fruits': 'Fruits',
      'Grains': 'Grains',
      'Legumes': 'Legumes',
      'Herbs': 'Herbs',
      'Spices': 'Spices',
      'Flowers': 'Flowers'
    },
    fr: {
      // Headers and Titles
      'Choose Analysis Method': 'Choisir la méthode d\'analyse',
      'How would you like to analyze your soil?': 'Comment voulez-vous analyser votre sol?',
      'Automatic Analysis': 'Analyse automatique',
      'Enter soil values and get plant recommendations': 'Entrez les valeurs du sol et obtenez des recommandations',
      'Manual Selection': 'Sélection manuelle',
      'Choose your favorite plant and check soil compatibility': 'Choisissez votre plante préférée et vérifiez la compatibilité',
      
      // Form Labels
      'Automatic Analysis - Enter Soil Data': 'Analyse automatique - Entrez les données du sol',
      'Manual Selection - Enter Soil Data Then Choose Plant': 'Sélection manuelle - Entrez les données puis choisissez',
      'Temperature (°C)': 'Température (°C)',
      'Moisture (%)': 'Humidité (%)',
      'pH Level (0–14)': 'Niveau pH (0–14)',
      'Nitrogen (N)': 'Azote (N)',
      'Phosphorus (P)': 'Phosphore (P)',
      'Potassium (K)': 'Potassium (K)',
      'Analyze Soil': 'Analyser le sol',
      'Use Example Values': 'Utiliser des valeurs exemples',
      'Back': 'Retour',
      'Choose Plant from List': 'Choisir une plante',
      'Waiting for sensor data...': 'En attente des données du capteur...',
      
      // Results
      'Analysis Results': 'Résultats d\'analyse',
      'Measured Soil Values': 'Valeurs du sol mesurées',
      'Selected Plant': 'Plante sélectionnée',
      'Soil Compatibility': 'Compatibilité du sol',
      'Best Plants for This Soil': 'Meilleures plantes pour ce sol',
      'Unsuitable Plants': 'Plantes non adaptées',
      'Soil Improvement Tips': 'Conseils d\'amélioration',
      'General Tips': 'Conseils généraux',
      'Soil Quality': 'Qualité du sol',
      'Print': 'Imprimer',
      'Share': 'Partager',
      
      // Status
      'Soil status: Excellent': 'État du sol: Excellent',
      'plants are suitable': 'plantes appropriées',
      'Soil status: Fair': 'État du sol: Moyen',
      'Soil status: Poor': 'État du sol: Faible',
      'Only': 'Seulement',
      'Plants': 'Plantes',
      'Professional & Smart': 'Professionnel et intelligent',
      
      // Messages
      'Please fill all fields with valid numbers': 'Veuillez remplir tous les champs',
      'Please select a plant first': 'Veuillez d\'abord sélectionner une plante',
      'No plants found': 'Aucune plante trouvée',
      'Search for a plant...': 'Rechercher une plante...',
      'Please fill all soil fields first': 'Veuillez d\'abord remplir tous les champs du sol',
      'Try a different search term': 'Essayez un autre terme de recherche',
      
      // Filters
      'All': 'Tout',
      'Vegetables': 'Légumes',
      'Fruits': 'Fruits',
      'Grains': 'Céréales',
      'Legumes': 'Légumineuses',
      'Herbs': 'Herbes',
      'Spices': 'Épices',
      'Flowers': 'Fleurs',
      
      'Smart Soil Analyzer': 'Analyseur de sol intelligent',
      'Your guide to choosing the right plants for your soil': 'Votre guide pour choisir les bonnes plantes'
    },
    es: {
      // Headers and Titles
      'Choose Analysis Method': 'Elegir método de análisis',
      'How would you like to analyze your soil?': '¿Cómo quieres analizar tu suelo?',
      'Automatic Analysis': 'Análisis automático',
      'Enter soil values and get plant recommendations': 'Ingresa valores del suelo y obtén recomendaciones',
      'Manual Selection': 'Selección manual',
      'Choose your favorite plant and check soil compatibility': 'Elige tu planta favorita y verifica compatibilidad',
      
      // Form Labels
      'Automatic Analysis - Enter Soil Data': 'Análisis automático - Ingresa datos del suelo',
      'Manual Selection - Enter Soil Data Then Choose Plant': 'Selección manual - Ingresa datos y elige planta',
      'Temperature (°C)': 'Temperatura (°C)',
      'Moisture (%)': 'Humedad (%)',
      'pH Level (0–14)': 'Nivel de pH (0–14)',
      'Nitrogen (N)': 'Nitrógeno (N)',
      'Phosphorus (P)': 'Fósforo (P)',
      'Potassium (K)': 'Potasio (K)',
      'Analyze Soil': 'Analizar suelo',
      'Use Example Values': 'Usar valores de ejemplo',
      'Back': 'Volver',
      'Choose Plant from List': 'Elegir planta de la lista',
      'Waiting for sensor data...': 'Esperando datos del sensor...',
      
      // Results
      'Analysis Results': 'Resultados del análisis',
      'Measured Soil Values': 'Valores del suelo medidos',
      'Selected Plant': 'Planta seleccionada',
      'Soil Compatibility': 'Compatibilidad del suelo',
      'Best Plants for This Soil': 'Mejores plantas para este suelo',
      'Unsuitable Plants': 'Plantas no adecuadas',
      'Soil Improvement Tips': 'Consejos de mejora',
      'General Tips': 'Consejos generales',
      'Soil Quality': 'Calidad del suelo',
      'Print': 'Imprimir',
      'Share': 'Compartir',
      
      // Status
      'Soil status: Excellent': 'Estado del suelo: Excelente',
      'plants are suitable': 'plantas adecuadas',
      'Soil status: Fair': 'Estado del suelo: Regular',
      'Soil status: Poor': 'Estado del suelo: Pobre',
      'Only': 'Solo',
      'Plants': 'Plantas',
      'Professional & Smart': 'Profesional e inteligente',
      
      // Messages
      'Please fill all fields with valid numbers': 'Complete todos los campos con números válidos',
      'Please select a plant first': 'Seleccione una planta primero',
      'No plants found': 'No se encontraron plantas',
      'Search for a plant...': 'Buscar una planta...',
      'Please fill all soil fields first': 'Complete todos los campos del suelo primero',
      'Try a different search term': 'Intente con otro término de búsqueda',
      
      // Filters
      'All': 'Todos',
      'Vegetables': 'Verduras',
      'Fruits': 'Frutas',
      'Grains': 'Granos',
      'Legumes': 'Legumbres',
      'Herbs': 'Hierbas',
      'Spices': 'Especias',
      'Flowers': 'Flores',
      
      'Smart Soil Analyzer': 'Analizador inteligente de suelos',
      'Your guide to choosing the right plants for your soil': 'Tu guía para elegir las plantas correctas'
    },
    de: {
      // Headers and Titles
      'Choose Analysis Method': 'Analysemethode wählen',
      'How would you like to analyze your soil?': 'Wie möchten Sie Ihren Boden analysieren?',
      'Automatic Analysis': 'Automatische Analyse',
      'Enter soil values and get plant recommendations': 'Geben Sie Bodenwerte ein und erhalten Sie Empfehlungen',
      'Manual Selection': 'Manuelle Auswahl',
      'Choose your favorite plant and check soil compatibility': 'Wählen Sie Ihre Pflanze und prüfen Sie die Kompatibilität',
      
      // Form Labels
      'Automatic Analysis - Enter Soil Data': 'Automatische Analyse - Bodendaten eingeben',
      'Manual Selection - Enter Soil Data Then Choose Plant': 'Manuelle Auswahl - Daten eingeben, dann Pflanze wählen',
      'Temperature (°C)': 'Temperatur (°C)',
      'Moisture (%)': 'Feuchtigkeit (%)',
      'pH Level (0–14)': 'pH-Wert (0–14)',
      'Nitrogen (N)': 'Stickstoff (N)',
      'Phosphorus (P)': 'Phosphor (P)',
      'Potassium (K)': 'Kalium (K)',
      'Analyze Soil': 'Boden analysieren',
      'Use Example Values': 'Beispielwerte verwenden',
      'Back': 'Zurück',
      'Choose Plant from List': 'Pflanze aus Liste wählen',
      'Waiting for sensor data...': 'Warte auf Sensordaten...',
      
      // Results
      'Analysis Results': 'Analyseergebnisse',
      'Measured Soil Values': 'Gemessene Bodenwerte',
      'Selected Plant': 'Ausgewählte Pflanze',
      'Soil Compatibility': 'Bodenkompatibilität',
      'Best Plants for This Soil': 'Beste Pflanzen für diesen Boden',
      'Unsuitable Plants': 'Ungeeignete Pflanzen',
      'Soil Improvement Tips': 'Verbesserungstipps',
      'General Tips': 'Allgemeine Tipps',
      'Soil Quality': 'Bodenqualität',
      'Print': 'Drucken',
      'Share': 'Teilen',
      
      // Status
      'Soil status: Excellent': 'Bodenzustand: Ausgezeichnet',
      'plants are suitable': 'geeignete Pflanzen',
      'Soil status: Fair': 'Bodenzustand: Mittel',
      'Soil status: Poor': 'Bodenzustand: Schlecht',
      'Only': 'Nur',
      'Plants': 'Pflanzen',
      'Professional & Smart': 'Professionell & Intelligent',
      
      // Messages
      'Please fill all fields with valid numbers': 'Bitte füllen Sie alle Felder aus',
      'Please select a plant first': 'Bitte wählen Sie zuerst eine Pflanze',
      'No plants found': 'Keine Pflanzen gefunden',
      'Search for a plant...': 'Nach einer Pflanze suchen...',
      'Please fill all soil fields first': 'Bitte füllen Sie zuerst alle Bodenfelder aus',
      'Try a different search term': 'Versuchen Sie einen anderen Suchbegriff',
      
      // Filters
      'All': 'Alle',
      'Vegetables': 'Gemüse',
      'Fruits': 'Früchte',
      'Grains': 'Getreide',
      'Legumes': 'Hülsenfrüchte',
      'Herbs': 'Kräuter',
      'Spices': 'Gewürze',
      'Flowers': 'Blumen',
      
      'Smart Soil Analyzer': 'Intelligenter Bodenanalysator',
      'Your guide to choosing the right plants for your soil': 'Ihr Leitfaden zur Auswahl der richtigen Pflanzen'
    },
    tr: {
      // Headers and Titles
      'Choose Analysis Method': 'Analiz Yöntemini Seçin',
      'How would you like to analyze your soil?': 'Toprağınızı nasıl analiz etmek istersiniz?',
      'Automatic Analysis': 'Otomatik Analiz',
      'Enter soil values and get plant recommendations': 'Toprak değerlerini girin ve bitki önerileri alın',
      'Manual Selection': 'Manuel Seçim',
      'Choose your favorite plant and check soil compatibility': 'Bitkinizi seçin ve uyumluluğu kontrol edin',
      
      // Form Labels
      'Automatic Analysis - Enter Soil Data': 'Otomatik Analiz - Toprak Verileri Girin',
      'Manual Selection - Enter Soil Data Then Choose Plant': 'Manuel Seçim - Veri Girin ve Bitki Seçin',
      'Temperature (°C)': 'Sıcaklık (°C)',
      'Moisture (%)': 'Nem (%)',
      'pH Level (0–14)': 'pH Seviyesi (0–14)',
      'Nitrogen (N)': 'Azot (N)',
      'Phosphorus (P)': 'Fosfor (P)',
      'Potassium (K)': 'Potasyum (K)',
      'Analyze Soil': 'Toprağı Analiz Et',
      'Use Example Values': 'Örnek Değerleri Kullan',
      'Back': 'Geri',
      'Choose Plant from List': 'Listeden Bitki Seçin',
      'Waiting for sensor data...': 'Sensör verileri bekleniyor...',
      
      // Results
      'Analysis Results': 'Analiz Sonuçları',
      'Measured Soil Values': 'Ölçülen Toprak Değerleri',
      'Selected Plant': 'Seçilen Bitki',
      'Soil Compatibility': 'Toprak Uyumluluğu',
      'Best Plants for This Soil': 'Bu Toprak İçin En İyi Bitkiler',
      'Unsuitable Plants': 'Uygun Olmayan Bitkiler',
      'Soil Improvement Tips': 'İyileştirme İpuçları',
      'General Tips': 'Genel İpuçları',
      'Soil Quality': 'Toprak Kalitesi',
      'Print': 'Yazdır',
      'Share': 'Paylaş',
      
      // Status
      'Soil status: Excellent': 'Toprak durumu: Mükemmel',
      'plants are suitable': 'uygun bitki',
      'Soil status: Fair': 'Toprak durumu: Orta',
      'Soil status: Poor': 'Toprak durumu: Zayıf',
      'Only': 'Sadece',
      'Plants': 'Bitki',
      'Professional & Smart': 'Profesyonel ve Akıllı',
      
      // Messages
      'Please fill all fields with valid numbers': 'Lütfen tüm alanları doldurun',
      'Please select a plant first': 'Lütfen önce bir bitki seçin',
      'No plants found': 'Bitki bulunamadı',
      'Search for a plant...': 'Bitki ara...',
      'Please fill all soil fields first': 'Lütfen önce tüm toprak alanlarını doldurun',
      'Try a different search term': 'Farklı bir arama terimi deneyin',
      
      // Filters
      'All': 'Tümü',
      'Vegetables': 'Sebzeler',
      'Fruits': 'Meyveler',
      'Grains': 'Tahıllar',
      'Legumes': 'Baklagiller',
      'Herbs': 'Otlar',
      'Spices': 'Baharatlar',
      'Flowers': 'Çiçekler',
      
      'Smart Soil Analyzer': 'Akıllı Toprak Analiz Cihazı',
      'Your guide to choosing the right plants for your soil': 'Doğru bitkileri seçme rehberiniz'
    },
    ur: {
      // Headers and Titles
      'Choose Analysis Method': 'تجزیہ کا طریقہ منتخب کریں',
      'How would you like to analyze your soil?': 'آپ اپنی مٹی کا تجزیہ کیسے کرنا چاہتے ہیں؟',
      'Automatic Analysis': 'خودکار تجزیہ',
      'Enter soil values and get plant recommendations': 'مٹی کی قدریں درج کریں اور سفارشات حاصل کریں',
      'Manual Selection': 'دستی انتخاب',
      'Choose your favorite plant and check soil compatibility': 'اپنا پسندیدہ پودا چنیں اور مطابقت چیک کریں',
      
      // Form Labels
      'Automatic Analysis - Enter Soil Data': 'خودکار تجزیہ - مٹی کا ڈیٹا درج کریں',
      'Manual Selection - Enter Soil Data Then Choose Plant': 'دستی انتخاب - ڈیٹا درج کریں پھر پودا چنیں',
      'Temperature (°C)': 'درجہ حرارت (°C)',
      'Moisture (%)': 'نمی (%)',
      'pH Level (0–14)': 'پی ایچ لیول (0–14)',
      'Nitrogen (N)': 'نائٹروجن (N)',
      'Phosphorus (P)': 'فاسفورس (P)',
      'Potassium (K)': 'پوٹاشیم (K)',
      'Analyze Soil': 'مٹی کا تجزیہ کریں',
      'Use Example Values': 'مثالی قدریں استعمال کریں',
      'Back': 'واپس',
      'Choose Plant from List': 'فہرست سے پودا چنیں',
      'Waiting for sensor data...': 'سینسر ڈیٹا کا انتظار...',
      
      // Results
      'Analysis Results': 'تجزیہ کے نتائج',
      'Measured Soil Values': 'ماپی گئی مٹی کی قدریں',
      'Selected Plant': 'منتخب پودا',
      'Soil Compatibility': 'مٹی کی مطابقت',
      'Best Plants for This Soil': 'اس مٹی کے لیے بہترین پودے',
      'Unsuitable Plants': 'نامناسب پودے',
      'Soil Improvement Tips': 'بہتری کے نکات',
      'General Tips': 'عمومی نکات',
      'Soil Quality': 'مٹی کی کوالٹی',
      'Print': 'پرنٹ',
      'Share': 'شیئر',
      
      // Status
      'Soil status: Excellent': 'مٹی کی حالت: بہترین',
      'plants are suitable': 'مناسب پودے',
      'Soil status: Fair': 'مٹی کی حالت: معتدل',
      'Soil status: Poor': 'مٹی کی حالت: کمزور',
      'Only': 'صرف',
      'Plants': 'پودے',
      'Professional & Smart': 'پیشہ ور اور ذہین',
      
      // Messages
      'Please fill all fields with valid numbers': 'براہ کرم تمام فیلڈز بھریں',
      'Please select a plant first': 'براہ کرم پہلے پودا منتخب کریں',
      'No plants found': 'کوئی پودے نہیں ملے',
      'Search for a plant...': 'پودا تلاش کریں...',
      'Please fill all soil fields first': 'براہ کرم پہلے تمام مٹی کے فیلڈز بھریں',
      'Try a different search term': 'دوسرا تلاش کا لفظ آزمائیں',
      
      // Filters
      'All': 'سب',
      'Vegetables': 'سبزیاں',
      'Fruits': 'پھل',
      'Grains': 'اناج',
      'Legumes': 'دالیں',
      'Herbs': 'جڑی بوٹیاں',
      'Spices': 'مصالحے',
      'Flowers': 'پھول',
      
      'Smart Soil Analyzer': 'سمارٹ مٹی کا تجزیہ کار',
      'Your guide to choosing the right plants for your soil': 'صحیح پودوں کے انتخاب کے لیے آپ کی رہنمائی'
    },
    hi: {
      // Headers and Titles
      'Choose Analysis Method': 'विश्लेषण विधि चुनें',
      'How would you like to analyze your soil?': 'आप अपनी मिट्टी का विश्लेषण कैसे करना चाहते हैं?',
      'Automatic Analysis': 'स्वचालित विश्लेषण',
      'Enter soil values and get plant recommendations': 'मिट्टी के मान दर्ज करें और सिफारिशें प्राप्त करें',
      'Manual Selection': 'मैन्युअल चयन',
      'Choose your favorite plant and check soil compatibility': 'अपना पसंदीदा पौधा चुनें और संगतता जांचें',
      
      // Form Labels
      'Automatic Analysis - Enter Soil Data': 'स्वचालित विश्लेषण - मिट्टी डेटा दर्ज करें',
      'Manual Selection - Enter Soil Data Then Choose Plant': 'मैन्युअल चयन - डेटा दर्ज करें फिर पौधा चुनें',
      'Temperature (°C)': 'तापमान (°C)',
      'Moisture (%)': 'नमी (%)',
      'pH Level (0–14)': 'पीएच स्तर (0–14)',
      'Nitrogen (N)': 'नाइट्रोजन (N)',
      'Phosphorus (P)': 'फास्फोरस (P)',
      'Potassium (K)': 'पोटेशियम (K)',
      'Analyze Soil': 'मिट्टी का विश्लेषण करें',
      'Use Example Values': 'उदाहरण मान का उपयोग करें',
      'Back': 'वापस',
      'Choose Plant from List': 'सूची से पौधा चुनें',
      'Waiting for sensor data...': 'सेंसर डेटा की प्रतीक्षा...',
      
      // Results
      'Analysis Results': 'विश्लेषण परिणाम',
      'Measured Soil Values': 'मापी गई मिट्टी के मान',
      'Selected Plant': 'चयनित पौधा',
      'Soil Compatibility': 'मिट्टी की संगतता',
      'Best Plants for This Soil': 'इस मिट्टी के लिए सर्वोत्तम पौधे',
      'Unsuitable Plants': 'अनुपयुक्त पौधे',
      'Soil Improvement Tips': 'सुधार के सुझाव',
      'General Tips': 'सामान्य सुझाव',
      'Soil Quality': 'मिट्टी की गुणवत्ता',
      'Print': 'प्रिंट',
      'Share': 'शेयर',
      
      // Status
      'Soil status: Excellent': 'मिट्टी की स्थिति: उत्कृष्ट',
      'plants are suitable': 'उपयुक्त पौधे',
      'Soil status: Fair': 'मिट्टी की स्थिति: मध्यम',
      'Soil status: Poor': 'मिट्टी की स्थिति: कमजोर',
      'Only': 'केवल',
      'Plants': 'पौधे',
      'Professional & Smart': 'पेशेवर और स्मार्ट',
      
      // Messages
      'Please fill all fields with valid numbers': 'कृपया सभी फ़ील्ड भरें',
      'Please select a plant first': 'कृपया पहले पौधा चुनें',
      'No plants found': 'कोई पौधे नहीं मिले',
      'Search for a plant...': 'पौधा खोजें...',
      'Please fill all soil fields first': 'कृपया पहले सभी मिट्टी फ़ील्ड भरें',
      'Try a different search term': 'कोई दूसरा खोज शब्द आज़माएं',
      
      // Filters
      'All': 'सभी',
      'Vegetables': 'सब्जियाँ',
      'Fruits': 'फल',
      'Grains': 'अनाज',
      'Legumes': 'दालें',
      'Herbs': 'जड़ी-बूटियाँ',
      'Spices': 'मसाले',
      'Flowers': 'फूल',
      
      'Smart Soil Analyzer': 'स्मार्ट मिट्टी विश्लेषक',
      'Your guide to choosing the right plants for your soil': 'सही पौधों को चुनने के लिए आपकी मार्गदर्शिका'
    },
    pt: {
      // Headers and Titles
      'Choose Analysis Method': 'Escolher método de análise',
      'How would you like to analyze your soil?': 'Como você gostaria de analisar seu solo?',
      'Automatic Analysis': 'Análise automática',
      'Enter soil values and get plant recommendations': 'Insira os valores do solo e obtenha recomendações',
      'Manual Selection': 'Seleção manual',
      'Choose your favorite plant and check soil compatibility': 'Escolha sua planta favorita e verifique a compatibilidade',
      
      // Form Labels
      'Automatic Analysis - Enter Soil Data': 'Análise automática - Insira dados do solo',
      'Manual Selection - Enter Soil Data Then Choose Plant': 'Seleção manual - Insira dados e escolha a planta',
      'Temperature (°C)': 'Temperatura (°C)',
      'Moisture (%)': 'Umidade (%)',
      'pH Level (0–14)': 'Nível de pH (0–14)',
      'Nitrogen (N)': 'Nitrogênio (N)',
      'Phosphorus (P)': 'Fósforo (P)',
      'Potassium (K)': 'Potássio (K)',
      'Analyze Soil': 'Analisar solo',
      'Use Example Values': 'Usar valores de exemplo',
      'Back': 'Voltar',
      'Choose Plant from List': 'Escolha da lista',
      'Waiting for sensor data...': 'Aguardando dados do sensor...',
      
      // Results
      'Analysis Results': 'Resultados da análise',
      'Measured Soil Values': 'Valores do solo medidos',
      'Selected Plant': 'Planta selecionada',
      'Soil Compatibility': 'Compatibilidade do solo',
      'Best Plants for This Soil': 'Melhores plantas para este solo',
      'Unsuitable Plants': 'Plantas inadequadas',
      'Soil Improvement Tips': 'Dicas de melhoria',
      'General Tips': 'Dicas gerais',
      'Soil Quality': 'Qualidade do solo',
      'Print': 'Imprimir',
      'Share': 'Compartilhar',
      
      // Status
      'Soil status: Excellent': 'Estado do solo: Excelente',
      'plants are suitable': 'plantas adequadas',
      'Soil status: Fair': 'Estado do solo: Regular',
      'Soil status: Poor': 'Estado do solo: Ruim',
      'Only': 'Apenas',
      'Plants': 'Plantas',
      'Professional & Smart': 'Profissional e Inteligente',
      
      // Messages
      'Please fill all fields with valid numbers': 'Por favor, preencha todos os campos',
      'Please select a plant first': 'Por favor, selecione uma planta primeiro',
      'No plants found': 'Nenhuma planta encontrada',
      'Search for a plant...': 'Buscar uma planta...',
      'Please fill all soil fields first': 'Por favor, preencha primeiro todos os campos do solo',
      'Try a different search term': 'Tente um termo de pesquisa diferente',
      
      // Filters
      'All': 'Todos',
      'Vegetables': 'Vegetais',
      'Fruits': 'Frutas',
      'Grains': 'Grãos',
      'Legumes': 'Leguminosas',
      'Herbs': 'Ervas',
      'Spices': 'Especiarias',
      'Flowers': 'Flores',
      
      'Smart Soil Analyzer': 'Analisador Inteligente de Solos',
      'Your guide to choosing the right plants for your soil': 'Seu guia para escolher as plantas certas'
    },
    zh: {
      // Headers and Titles
      'Choose Analysis Method': '选择分析方法',
      'How would you like to analyze your soil?': '您想如何分析土壤？',
      'Automatic Analysis': '自动分析',
      'Enter soil values and get plant recommendations': '输入土壤值并获取植物推荐',
      'Manual Selection': '手动选择',
      'Choose your favorite plant and check soil compatibility': '选择您喜欢的植物并检查兼容性',
      
      // Form Labels
      'Automatic Analysis - Enter Soil Data': '自动分析 - 输入土壤数据',
      'Manual Selection - Enter Soil Data Then Choose Plant': '手动选择 - 输入数据后选择植物',
      'Temperature (°C)': '温度 (°C)',
      'Moisture (%)': '湿度 (%)',
      'pH Level (0–14)': 'pH值 (0–14)',
      'Nitrogen (N)': '氮 (N)',
      'Phosphorus (P)': '磷 (P)',
      'Potassium (K)': '钾 (K)',
      'Analyze Soil': '分析土壤',
      'Use Example Values': '使用示例值',
      'Back': '返回',
      'Choose Plant from List': '从列表中选择植物',
      'Waiting for sensor data...': '等待传感器数据...',
      
      // Results
      'Analysis Results': '分析结果',
      'Measured Soil Values': '测量的土壤值',
      'Selected Plant': '选定的植物',
      'Soil Compatibility': '土壤兼容性',
      'Best Plants for This Soil': '适合此土壤的最佳植物',
      'Unsuitable Plants': '不适合的植物',
      'Soil Improvement Tips': '改良建议',
      'General Tips': '一般建议',
      'Soil Quality': '土壤质量',
      'Print': '打印',
      'Share': '分享',
      
      // Status
      'Soil status: Excellent': '土壤状况：优秀',
      'plants are suitable': '适合的植物',
      'Soil status: Fair': '土壤状况：一般',
      'Soil status: Poor': '土壤状况：较差',
      'Only': '仅',
      'Plants': '植物',
      'Professional & Smart': '专业智能',
      
      // Messages
      'Please fill all fields with valid numbers': '请填写所有字段',
      'Please select a plant first': '请先选择植物',
      'No plants found': '未找到植物',
      'Search for a plant...': '搜索植物...',
      'Please fill all soil fields first': '请先填写所有土壤字段',
      'Try a different search term': '尝试其他搜索词',
      
      // Filters
      'All': '全部',
      'Vegetables': '蔬菜',
      'Fruits': '水果',
      'Grains': '谷物',
      'Legumes': '豆类',
      'Herbs': '香草',
      'Spices': '香料',
      'Flowers': '花卉',
      
      'Smart Soil Analyzer': '智能土壤分析器',
      'Your guide to choosing the right plants for your soil': '选择合适植物的指南'
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
    // Arabic and Urdu are RTL, Hindi is LTR
    document.documentElement.dir = (lang === 'ar' || lang === 'ur') ? 'rtl' : 'ltr';
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
    const lang = this.currentLang;
    
    // تحديث جميع العناصر التي تحتوي على data-ar و data-en
    // Update ALL elements using translation keys from data-en attribute
    document.querySelectorAll('[data-ar][data-en]').forEach((el) => {
      const enKey = el.dataset.en;
      // Try to get translation from current language, fallback to English value
      const translatedText = this.translate(enKey);
      el.textContent = translatedText;
    });

    // تحديث العنوان
    const title = document.querySelector('title');
    if (title) {
      title.textContent = this.translate('Smart Soil Analyzer');
    }
    
    // إعادة تحميل قائمة النباتات عند تغيير اللغة
    // Re-render plant selector when language changes
    if (typeof renderPlantSelector === 'function') {
      renderPlantSelector();
    }
    
    // إعادة تحميل الفلاتر عند تغيير اللغة
    // Update filter buttons text
    this.updateFilterButtons();
  },
  
  updateFilterButtons() {
    // Use the translation system to get filter names in all languages
    const filterKeys = {
      'all': 'All',
      'vegetables': 'Vegetables',
      'fruits': 'Fruits',
      'grains': 'Grains',
      'legumes': 'Legumes',
      'herbs': 'Herbs',
      'spices': 'Spices',
      'flowers': 'Flowers'
    };
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
      const filter = btn.dataset.filter;
      if (filter && filterKeys[filter]) {
        btn.textContent = this.translate(filterKeys[filter]);
      }
    });
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
