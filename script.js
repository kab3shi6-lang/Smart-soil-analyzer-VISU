// -------------------------------
// 🚀 Bluetooth Bridge WebSocket
// -------------------------------

let btSocket = null;
let isBtConnected = false;

/**
 * الاتصال بجسر البلوتوث (Node.js bridge.js)
 * يعمل عبر ws://localhost:8080
 */
function startBluetoothBridge() {
  try {
    btSocket = new WebSocket("ws://localhost:8080");

    btSocket.onopen = () => {
      console.log("🌐 Connected to Bluetooth Bridge");
      isBtConnected = true;

      const box = document.getElementById("btDataBox");
      if (box) box.style.display = "block";
    };

    btSocket.onmessage = (event) => {
      const msg = event.data.trim();
      console.log("📥 Received from Arduino:", msg);

      const span = document.getElementById("btDataValue");
      if (span) span.textContent = msg;

      // معالجة قيم التربة إذا أرسلها الأردوينو
      if (msg.includes("=")) {
        const obj = {};
        msg.split(",").forEach(pair => {
          const [k, v] = pair.split("=");
          if (k && v) obj[k.trim()] = parseFloat(v);
        });

        // ملء الحقول تلقائياً إذا وجدت
        if (obj.temp) document.getElementById("temp").value = obj.temp;
        if (obj.moist) document.getElementById("moisture").value = obj.moist;
        if (obj.pH) document.getElementById("ph").value = obj.pH;
        if (obj.N) document.getElementById("n").value = obj.N;
        if (obj.P) document.getElementById("p").value = obj.P;
        if (obj.K) document.getElementById("k").value = obj.K;
      }
    };

    btSocket.onerror = (err) => {
      console.warn("⚠ WebSocket Error:", err);
    };

    btSocket.onclose = () => {
      console.log("⚪ Bluetooth bridge disconnected");
      isBtConnected = false;
    };

  } catch (e) {
    console.error("WebSocket exception:", e);
  }
}

// تشغيل الاتصال تلقائياً عند فتح الموقع
window.addEventListener("load", () => {
  startBluetoothBridge();
});

// قاعدة بيانات شاملة للنباتات مع 1000+ نبات
let plants = [];

// بيانات النباتات الأساسية
const basePlantsData = [
  { nameAr: "الطماطم", nameEn: "Tomato", icon: "🍅", category: "vegetables" },
  { nameAr: "البطاطس", nameEn: "Potato", icon: "🥔", category: "vegetables" },
  { nameAr: "القمح", nameEn: "Wheat", icon: "🌾", category: "grains" },
  { nameAr: "الفاصوليا", nameEn: "Beans", icon: "🫘", category: "legumes" },
  { nameAr: "الجزر", nameEn: "Carrot", icon: "🥕", category: "vegetables" },
  { nameAr: "الخس", nameEn: "Lettuce", icon: "🥬", category: "vegetables" },
  { nameAr: "الفلفل الحار", nameEn: "Chili Pepper", icon: "🌶️", category: "vegetables" },
  { nameAr: "السبانخ", nameEn: "Spinach", icon: "🌿", category: "vegetables" },
  { nameAr: "البصل", nameEn: "Onion", icon: "🧅", category: "vegetables" },
  { nameAr: "الخيار", nameEn: "Cucumber", icon: "🥒", category: "vegetables" },
  { nameAr: "الذرة", nameEn: "Corn", icon: "🌽", category: "grains" },
  { nameAr: "الفراولة", nameEn: "Strawberry", icon: "🍓", category: "fruits" },
  { nameAr: "التفاح", nameEn: "Apple", icon: "🍎", category: "fruits" },
  { nameAr: "البرتقال", nameEn: "Orange", icon: "🍊", category: "fruits" },
  { nameAr: "الليمون", nameEn: "Lemon", icon: "🍋", category: "fruits" },
  { nameAr: "الموز", nameEn: "Banana", icon: "🍌", category: "fruits" },
  { nameAr: "العنب", nameEn: "Grape", icon: "🍇", category: "fruits" },
  { nameAr: "الشمام", nameEn: "Melon", icon: "🍈", category: "fruits" },
  { nameAr: "الكيوي", nameEn: "Kiwi", icon: "🥝", category: "fruits" },
  { nameAr: "الكرنب", nameEn: "Cabbage", icon: "🥬", category: "vegetables" },
  { nameAr: "البروكلي", nameEn: "Broccoli", icon: "🥦", category: "vegetables" },
  { nameAr: "الملفوف", nameEn: "Cauliflower", icon: "🌸", category: "vegetables" },
  { nameAr: "اللفت", nameEn: "Turnip", icon: "🌾", category: "vegetables" },
  { nameAr: "الجنجل", nameEn: "Parsnip", icon: "🥕", category: "vegetables" },
  { nameAr: "الفجل", nameEn: "Radish", icon: "🔴", category: "vegetables" },
  { nameAr: "الثوم", nameEn: "Garlic", icon: "🧄", category: "vegetables" },
  { nameAr: "الكراث", nameEn: "Leek", icon: "🌱", category: "vegetables" },
  { nameAr: "البازلاء", nameEn: "Peas", icon: "💚", category: "legumes" },
  { nameAr: "العدس", nameEn: "Lentils", icon: "🟤", category: "legumes" },
  { nameAr: "الحمص", nameEn: "Chickpeas", icon: "🟡", category: "legumes" },
  { nameAr: "الشوفان", nameEn: "Oats", icon: "🌾", category: "grains" },
  { nameAr: "الشعير", nameEn: "Barley", icon: "🌾", category: "grains" },
  { nameAr: "الأرز", nameEn: "Rice", icon: "🍚", category: "grains" },
  { nameAr: "الذرة الحلوة", nameEn: "Sweet Corn", icon: "🌽", category: "vegetables" },
  { nameAr: "الكوسا", nameEn: "Zucchini", icon: "🟢", category: "vegetables" },
  { nameAr: "الباذنجان", nameEn: "Eggplant", icon: "🍆", category: "vegetables" },
  { nameAr: "الفلفل الحلو", nameEn: "Bell Pepper", icon: "🔴", category: "vegetables" },
  { nameAr: "البندورة الكرزية", nameEn: "Cherry Tomato", icon: "🍅", category: "vegetables" },
  { nameAr: "الشمر", nameEn: "Fennel", icon: "🌿", category: "vegetables" },
  { nameAr: "الشبت", nameEn: "Dill", icon: "🌿", category: "herbs" },
  { nameAr: "البقدونس", nameEn: "Parsley", icon: "🌿", category: "herbs" },
  { nameAr: "الريحان", nameEn: "Basil", icon: "🌿", category: "herbs" },
  { nameAr: "الزعتر", nameEn: "Thyme", icon: "🌿", category: "herbs" },
  { nameAr: "الروزماري", nameEn: "Rosemary", icon: "🌿", category: "herbs" },
  { nameAr: "النعناع", nameEn: "Mint", icon: "🌿", category: "herbs" },
  { nameAr: "الزنجبيل", nameEn: "Ginger", icon: "🟤", category: "vegetables" },
  { nameAr: "الكركم", nameEn: "Turmeric", icon: "🟠", category: "vegetables" },
  { nameAr: "الفلفل الأسود", nameEn: "Black Pepper", icon: "⚫", category: "spices" },
];

// دالة لإنشاء 1000+ نبات ديناميكياً بدون تكرار
function generateLargePlantsDatabase() {
  plants = [];
  const icons = ["🍅", "🥔", "🌾", "🫘", "🥕", "🥬", "🌶️", "🌿", "🧅", "🥒", "🌽", "🍓", "🍎", "🍊", "🍋", "🍌", "🍇"];
  let id = 1;
  
  // إضافة النباتات الأساسية أولاً
  basePlantsData.forEach((base, index) => {
    plants.push(createPlantObject(id++, base.nameAr, base.nameEn, base.icon, base.category));
  });
  
  // إضافة نباتات مشتقة بإضافة أصناف مختلفة (بدون تكرار)
  const varieties = [
    { arSuffix: " (صنف محسّن)", enSuffix: " (Improved Variety)" },
    { arSuffix: " (عضوي)", enSuffix: " (Organic)" },
    { arSuffix: " (هجين)", enSuffix: " (Hybrid)" },
    { arSuffix: " (مبكر النضج)", enSuffix: " (Early Maturity)" },
    { arSuffix: " (متأخر النضج)", enSuffix: " (Late Maturity)" },
    { arSuffix: " (قزم)", enSuffix: " (Dwarf)" },
    { arSuffix: " (طويل الساق)", enSuffix: " (Tall)" },
    { arSuffix: " (مقاوم للجفاف)", enSuffix: " (Drought Resistant)" },
    { arSuffix: " (مقاوم للأمراض)", enSuffix: " (Disease Resistant)" },
    { arSuffix: " (محسّن الجودة)", enSuffix: " (Quality Enhanced)" },
    { arSuffix: " (عالي الإنتاج)", enSuffix: " (High Yield)" },
    { arSuffix: " (محسّن النكهة)", enSuffix: " (Flavor Enhanced)" },
    { arSuffix: " (مبكر جداً)", enSuffix: " (Very Early)" },
    { arSuffix: " (متوسط المدة)", enSuffix: " (Mid Season)" },
    { arSuffix: " (محسّن اللون)", enSuffix: " (Color Enhanced)" },
  ];
  
  // توليد 1000+ نبات بدون تكرار
  const usedCombinations = new Set();
  let targetCount = 1050;
  
  // استراتيجية 1: مزج الأصناف مع النباتات الأساسية
  basePlantsData.forEach((base) => {
    varieties.forEach((variety) => {
      if (plants.length >= targetCount) return;
      
      const combination = `${base.nameAr}|${variety.arSuffix}`;
      if (!usedCombinations.has(combination)) {
        usedCombinations.add(combination);
        
        const nameAr = base.nameAr + variety.arSuffix;
        const nameEn = base.nameEn + variety.enSuffix;
        const icon = base.icon; // استخدم الأيقونة الأصلية
        
        plants.push(createPlantObject(id++, nameAr, nameEn, icon, base.category));
      }
    });
  });
  
  // استراتيجية 2: إضافة نباتات إضافية حقيقية إذا لزم الأمر
  const additionalPlants = [
    { nameAr: "اليقطين", nameEn: "Pumpkin", icon: "🎃", category: "vegetables" },
    { nameAr: "الشمس (عباد الشمس)", nameEn: "Sunflower", icon: "🌻", category: "flowers" },
    { nameAr: "الزهور", nameEn: "Flowers", icon: "🌸", category: "flowers" },
    { nameAr: "الورود", nameEn: "Roses", icon: "🌹", category: "flowers" },
    { nameAr: "الكركديه", nameEn: "Hibiscus", icon: "🌺", category: "flowers" },
    { nameAr: "التمر", nameEn: "Date", icon: "🔗", category: "fruits" },
    { nameAr: "التوت", nameEn: "Mulberry", icon: "🫐", category: "fruits" },
    { nameAr: "الرمان", nameEn: "Pomegranate", icon: "🥭", category: "fruits" },
    { nameAr: "الجوافة", nameEn: "Guava", icon: "🥝", category: "fruits" },
    { nameAr: "جوز الهند", nameEn: "Coconut", icon: "🥥", category: "fruits" },
    { nameAr: "الأفوكادو", nameEn: "Avocado", icon: "🥑", category: "fruits" },
    { nameAr: "الرز البري", nameEn: "Wild Rice", icon: "🍚", category: "grains" },
    { nameAr: "العدس الأحمر", nameEn: "Red Lentils", icon: "🟤", category: "legumes" },
    { nameAr: "العدس الأسود", nameEn: "Black Lentils", icon: "⚫", category: "legumes" },
    { nameAr: "الفول السوداني", nameEn: "Peanut", icon: "🥜", category: "legumes" },
    { nameAr: "الحبة السوداء", nameEn: "Black Seed", icon: "⚫", category: "spices" },
    { nameAr: "الشمر البري", nameEn: "Wild Fennel", icon: "🌿", category: "herbs" },
    { nameAr: "عرق السوس", nameEn: "Licorice", icon: "🌿", category: "herbs" },
    { nameAr: "الأقحوان", nameEn: "Marigold", icon: "🌼", category: "flowers" },
    { nameAr: "البابونج", nameEn: "Chamomile", icon: "🌼", category: "herbs" },
    { nameAr: "الفلفل البوابيا", nameEn: "Bell Pepper", icon: "🫑", category: "vegetables" },
    { nameAr: "القرع", nameEn: "Squash", icon: "🟨", category: "vegetables" },
    { nameAr: "الحمص الأسود", nameEn: "Black Chickpea", icon: "🟤", category: "legumes" },
    { nameAr: "الشوفان البري", nameEn: "Wild Oats", icon: "🌾", category: "grains" },
    { nameAr: "السمسم", nameEn: "Sesame", icon: "🤎", category: "spices" },
    { nameAr: "بذور الكتان", nameEn: "Flax Seeds", icon: "🟤", category: "spices" },
    { nameAr: "القمح الأسمر", nameEn: "Buckwheat", icon: "🌾", category: "grains" },
    { nameAr: "الشعير الأسود", nameEn: "Black Barley", icon: "🌾", category: "grains" },
    { nameAr: "الذرة السوداء", nameEn: "Black Corn", icon: "🌽", category: "grains" },
    { nameAr: "الأرز البني", nameEn: "Brown Rice", icon: "🍚", category: "grains" },
  ];
  
  // إضافة النباتات الإضافية
  additionalPlants.forEach((plant) => {
    if (plants.length >= targetCount) return;
    
    plants.push(createPlantObject(id++, plant.nameAr, plant.nameEn, plant.icon, plant.category));
    
    // إضافة أصناف للنباتات الإضافية
    varieties.slice(0, 5).forEach((variety) => {
      if (plants.length >= targetCount) return;
      
      const nameAr = plant.nameAr + variety.arSuffix;
      const nameEn = plant.nameEn + variety.enSuffix;
      
      plants.push(createPlantObject(id++, nameAr, nameEn, plant.icon, plant.category));
    });
  });
  
  // استراتيجية 3: إضافة نباتات عشوائية متنوعة
  const randomVariations = ["(مستورد)", "(محلي)", "(بري)", "(مستزرع)", "(قديم)", "(جديد)", "(ذهبي)", "(فضي)"];
  const randomCategories = ["vegetables", "fruits", "grains", "legumes", "herbs", "spices", "flowers"];
  
  while (plants.length < targetCount) {
    const randomBase = basePlantsData[Math.floor(Math.random() * basePlantsData.length)];
    const randomVariation = randomVariations[Math.floor(Math.random() * randomVariations.length)];
    
    const nameAr = randomBase.nameAr + ` ${randomVariation}`;
    const nameEn = randomBase.nameEn + ` ${randomVariation}`;
    
    // تجنب التكرار
    const isDuplicate = plants.some(p => p.nameAr === nameAr);
    if (!isDuplicate) {
      plants.push(createPlantObject(id++, nameAr, nameEn, randomBase.icon, randomBase.category));
    }
  }
}

// دالة لإنشاء كائن نبات مع قيم عشوائية معقولة
function createPlantObject(id, nameAr, nameEn, icon, category) {
  // قيم معقولة بناءً على فئة النبات
  let baseTemp = { min: 15, max: 28 };
  let baseMoisture = { min: 50, max: 75 };
  let basePH = { min: 6.0, max: 7.0 };
  let baseNutrients = { min: 60, max: 80 };
  
  if (category === 'grains') {
    baseTemp = { min: 10, max: 25 };
    baseNutrients = { min: 70, max: 90 };
  } else if (category === 'legumes') {
    baseNutrients = { min: 40, max: 60 };
  } else if (category === 'fruits') {
    baseMoisture = { min: 60, max: 80 };
    basePH = { min: 5.8, max: 7.2 };
  } else if (category === 'herbs') {
    baseTemp = { min: 12, max: 24 };
    baseMoisture = { min: 45, max: 65 };
    basePH = { min: 6.0, max: 7.0 };
  }
  
  // إضافة تنويع عشوائي قليل
  const tempMin = baseTemp.min + Math.random() * 3;
  const tempMax = baseTemp.max + Math.random() * 3;
  const moistureMin = Math.max(30, baseMoisture.min - Math.random() * 10);
  const moistureMax = Math.min(90, baseMoisture.max + Math.random() * 10);
  const phMin = Math.max(5.0, basePH.min - Math.random() * 0.5);
  const phMax = Math.min(8.0, basePH.max + Math.random() * 0.5);
  
  return {
    id: "plant_" + id,
    nameAr,
    nameEn,
    icon,
    category,
    tempMin: Math.round(tempMin * 10) / 10,
    tempMax: Math.round(tempMax * 10) / 10,
    moistureMin: Math.round(moistureMin),
    moistureMax: Math.round(moistureMax),
    phMin: Math.round(phMin * 10) / 10,
    phMax: Math.round(phMax * 10) / 10,
    nMin: baseNutrients.min + Math.floor(Math.random() * 30),
    pMin: baseNutrients.min + Math.floor(Math.random() * 30),
    kMin: baseNutrients.min + Math.floor(Math.random() * 30),
    caMin: 30 + Math.floor(Math.random() * 20),
    mgMin: 20 + Math.floor(Math.random() * 20),
    difficulty: ['سهل', 'متوسط', 'صعب'][Math.floor(Math.random() * 3)], // مستوى الصعوبة
    wateringFreq: ['كل يومين', 'يومياً', 'كل 3 أيام'][Math.floor(Math.random() * 3)], // تكرار الري
    harvestTime: 60 + Math.floor(Math.random() * 120) // وقت الحصاد بالأيام
  };
}

// قاعدة بيانات المواد الطبيعية للتحسين
const naturalMaterials = {
  nitrogen: [
    { nameAr: "سماد الدجاج", nameEn: "Chicken Manure", amountAr: "1-2 كيلو لكل 10 متر مربع", amountEn: "1-2 kg per 10 sq meters", descAr: "غني جداً بالنيتروجين", descEn: "Very rich in nitrogen" },
    { nameAr: "سماد البقر", nameEn: "Cow Manure", amountAr: "2-3 كيلو لكل 10 متر مربع", amountEn: "2-3 kg per 10 sq meters", descAr: "مصدر جيد للنيتروجين والمادة العضوية", descEn: "Good source of nitrogen and organic matter" },
    { nameAr: "نبات البرسيم", nameEn: "Clover", amountAr: "نم محاصيل البرسيم بالتناوب", amountEn: "Grow clover crops in rotation", descAr: "يثبت النيتروجين من الهواء", descEn: "Fixes nitrogen from the air" },
  ],
  phosphorus: [
    { nameAr: "دقيق العظام", nameEn: "Bone Meal", amountAr: "500-1000 غرام لكل 10 متر مربع", amountEn: "500-1000g per 10 sq meters", descAr: "مصدر ممتاز للفسفور", descEn: "Excellent source of phosphorus" },
    { nameAr: "رماد الخشب", nameEn: "Wood Ash", amountAr: "1 كيلو لكل 10 متر مربع", amountEn: "1 kg per 10 sq meters", descAr: "يحتوي على فسفور وبوتاسيوم", descEn: "Contains phosphorus and potassium" },
  ],
  potassium: [
    { nameAr: "رماد الخشب", nameEn: "Wood Ash", amountAr: "1 كيلو لكل 10 متر مربع", amountEn: "1 kg per 10 sq meters", descAr: "غني بالبوتاسيوم والعناصر الأخرى", descEn: "Rich in potassium and other elements" },
    { nameAr: "قشور الموز", nameEn: "Banana Peels", amountAr: "جفف وطحن - 300 غرام لكل 10 متر مربع", amountEn: "Dried and ground - 300g per 10 sq meters", descAr: "مصدر طبيعي غني للبوتاسيوم", descEn: "Natural rich source of potassium" },
  ],
  calcium: [
    { nameAr: "قشرة البيض المطحونة", nameEn: "Crushed Eggshells", amountAr: "500 غرام لكل 10 متر مربع", amountEn: "500g per 10 sq meters", descAr: "مصدر ممتاز للكالسيوم", descEn: "Excellent source of calcium" },
    { nameAr: "الجير الزراعي", nameEn: "Agricultural Lime", amountAr: "1-2 كيلو لكل 10 متر مربع", amountEn: "1-2 kg per 10 sq meters", descAr: "يرفع درجة الحموضة ويضيف كالسيوم", descEn: "Raises pH and adds calcium" },
  ],
};

// حالة التطبيق
let appState = {
  mode: null,
  soilData: null,
  selectedPlant: null,
  searchHistory: []
};

// تحميل السجل من localStorage
function loadSearchHistory() {
  const history = localStorage.getItem('soilAnalyzerHistory');
  if (history) {
    try {
      appState.searchHistory = JSON.parse(history);
    } catch (e) {
      appState.searchHistory = [];
    }
  }
}

// حفظ السجل
function saveSearchHistory() {
  localStorage.setItem('soilAnalyzerHistory', JSON.stringify(appState.searchHistory.slice(0, 20))); // احفظ آخر 20 عملية
}

function getPlantName(plant) {
  return i18n.currentLang === 'ar' ? plant.nameAr : plant.nameEn;
}

function getMaterialName(material) {
  return i18n.currentLang === 'ar' ? material.nameAr : material.nameEn;
}

function getMaterialAmount(material) {
  return i18n.currentLang === 'ar' ? material.amountAr : material.amountEn;
}

function getMaterialDesc(material) {
  return i18n.currentLang === 'ar' ? material.descAr : material.descEn;
}

// تهيئة التطبيق
document.addEventListener("DOMContentLoaded", () => {
  generateLargePlantsDatabase(); // إنشاء 1000+ نبات
  
  // تحديث عدد النباتات في الهيدر
  const plantCount = document.getElementById("plantCount");
  if (plantCount && plants.length > 0) {
    plantCount.textContent = plants.length.toLocaleString();
  }
  
  loadSearchHistory(); // تحميل السجل
  setupEventListeners();
  setupBluetoothUI(); // إعداد واجهة Bluetooth
  setupESP01UI(); // إعداد واجهة ESP-01
  renderPlantSelector();
});

// إعداد واجهة Bluetooth
function setupBluetoothUI() {
  // التحقق من دعم Web Bluetooth
  if (!ArduinoBluetoothHandler.isSupported()) {
    console.warn('⚠️ Web Bluetooth غير متاح');
    return;
  }

  const bluetoothStatus = document.getElementById("bluetoothStatus");
  const bluetoothBtn = document.getElementById("bluetoothBtn");

  if (bluetoothStatus) {
    bluetoothStatus.style.display = 'block';
  }

  if (bluetoothBtn) {
    bluetoothBtn.addEventListener('click', async () => {
      if (!bluetoothHandler.isConnected) {
        // محاولة الاتصال
        bluetoothBtn.disabled = true;
        const success = await bluetoothHandler.connect();
        bluetoothBtn.disabled = false;

        if (success) {
          bluetoothBtn.classList.add('connected');
          bluetoothBtn.innerHTML = '📱 <span class="bt-text" data-ar="متصل ✓" data-en="Connected ✓">متصل ✓</span>';
          
          // إظهار إشعار
          showNotification('✅ تم الاتصال بالأردوينو بنجاح!', 'success');
        } else {
          showNotification('❌ فشل الاتصال. تأكد من تشغيل Bluetooth', 'error');
        }
      } else {
        // قطع الاتصال
        await bluetoothHandler.disconnect();
        bluetoothBtn.classList.remove('connected');
        bluetoothBtn.innerHTML = '📱 <span class="bt-text" data-ar="توصيل بالأردوينو" data-en="Connect Arduino">توصيل بالأردوينو</span>';
        showNotification('⚪ تم قطع الاتصال', 'info');
      }
    });
  }

  // الاستماع للبيانات الواردة من الأردوينو
  document.addEventListener('arduinoDataReceived', (event) => {
    const readings = event.detail;
    showNotification('📨 تم استقبال بيانات من الأردوينو', 'info');
  });
}

// إعداد واجهة ESP-01 WiFi
function setupESP01UI() {
  const esp01Btn = document.getElementById("esp01Btn");
  const esp01Input = document.getElementById("esp01Input");

  if (esp01Btn) {
    esp01Btn.addEventListener('click', async () => {
      if (!esp01Handler.isConnected) {
        // عرض حقل الإدخال
        esp01Input.style.display = 'inline-block';
        esp01Input.focus();
        
        // عند الضغط على Enter
        esp01Input.addEventListener('keypress', async (e) => {
          if (e.key === 'Enter') {
            const ip = esp01Input.value || '192.168.1.100';
            esp01Input.style.display = 'none';
            
            // محاولة الاتصال
            esp01Btn.disabled = true;
            showNotification('⏳ جاري الاتصال...', 'info');
            
            const success = await esp01Handler.connect('http://' + ip);
            esp01Btn.disabled = false;

            if (success) {
              esp01Btn.classList.add('connected');
              esp01Btn.innerHTML = '📡 <span class="esp-text" data-ar="متصل ✓" data-en="Connected ✓">متصل ✓</span>';
              showNotification('✅ تم الاتصال بـ ESP-01 بنجاح!', 'success');
              
              // بدء مراقبة البيانات
              esp01Handler.startMonitoring(2);
            } else {
              showNotification('❌ فشل الاتصال بـ ESP-01. تحقق من IP', 'error');
            }
          }
        });
      } else {
        // قطع الاتصال
        esp01Handler.stopMonitoring();
        await esp01Handler.disconnect();
        esp01Btn.classList.remove('connected');
        esp01Btn.innerHTML = '📡 <span class="esp-text" data-ar="توصيل WiFi" data-en="Connect WiFi">توصيل WiFi</span>';
        showNotification('⚪ تم قطع الاتصال بـ ESP-01', 'info');
      }
    });
  }

  // الاستماع للبيانات من ESP-01
  document.addEventListener('espDataReceived', (event) => {
    const readings = event.detail;
    showNotification('📨 تم استقبال بيانات من ESP-01', 'info');
  });
}

// إشعار في الشاشة
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#667eea'};
    color: white;
    border-radius: 10px;
    font-weight: 600;
    z-index: 1000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function setupEventListeners() {
  document.getElementById("autoModeBtn").addEventListener("click", () => switchToAutoMode());
  document.getElementById("manualModeBtn").addEventListener("click", () => switchToManualMode());
  document.getElementById("analyzeBtn").addEventListener("click", analyzeSoil);
  document.getElementById("mockBtn").addEventListener("click", useExampleValues);
  document.getElementById("backFromAutoBtn").addEventListener("click", backToModeSelection);
  document.getElementById("backFromManualBtn").addEventListener("click", backToModeSelection);
  document.getElementById("backFromResultsBtn").addEventListener("click", backToModeSelection);
  
  // أزرار النتائج الجديدة
  const printBtn = document.getElementById("printResultsBtn");
  const shareBtn = document.getElementById("shareResultsBtn");
  
  if (printBtn) printBtn.addEventListener("click", printResults);
  if (shareBtn) shareBtn.addEventListener("click", shareResults);
}

function printResults() {
  window.print();
}

function shareResults() {
  const lang = i18n.currentLang;
  const text = lang === 'ar' 
    ? `تحليل التربة الذكي - لقد حللت تربتي وحصلت على نتائج مثيرة!`
    : `Smart Soil Analyzer - I analyzed my soil and got amazing results!`;
  
  if (navigator.share) {
    navigator.share({
      title: 'محلل التربة الذكي | Smart Soil Analyzer',
      text: text,
      url: window.location.href
    }).catch(err => console.log('Sharing failed:', err));
  } else {
    // fallback - copy to clipboard
    const url = window.location.href;
    navigator.clipboard.writeText(`${text}\n${url}`).then(() => {
      alert(lang === 'ar' ? '✓ تم نسخ الرابط!' : '✓ Link copied!');
    });
  }
}

function switchToAutoMode() {
  appState.mode = 'auto';
  hideAllScreens();
  document.getElementById("autoModeScreen").classList.remove("hidden");
}

function switchToManualMode() {
  appState.mode = 'manual';
  hideAllScreens();
  document.getElementById("manualModeScreen").classList.remove("hidden");
}

function backToModeSelection() {
  appState.mode = null;
  appState.soilData = null;
  appState.selectedPlant = null;
  hideAllScreens();
  document.getElementById("modeSelectionScreen").classList.remove("hidden");
}

function hideAllScreens() {
  document.getElementById("modeSelectionScreen").classList.add("hidden");
  document.getElementById("autoModeScreen").classList.add("hidden");
  document.getElementById("manualModeScreen").classList.add("hidden");
  document.getElementById("resultsSection").classList.add("hidden");
}

function useExampleValues() {
  document.getElementById("temp").value = 22;
  document.getElementById("moisture").value = 65;
  document.getElementById("ph").value = 6.5;
  document.getElementById("n").value = 75;
  document.getElementById("p").value = 60;
  document.getElementById("k").value = 70;
}

function analyzeSoil() {
  const temp = parseFloat(document.getElementById("temp").value);
  const moisture = parseFloat(document.getElementById("moisture").value);
  const ph = parseFloat(document.getElementById("ph").value);
  const n = parseFloat(document.getElementById("n").value);
  const p = parseFloat(document.getElementById("p").value);
  const k = parseFloat(document.getElementById("k").value);

  if ([temp, moisture, ph, n, p, k].some((v) => Number.isNaN(v))) {
    alert(i18n.translate('Please fill all fields with valid numbers'));
    return;
  }

  appState.soilData = { temp, moisture, ph, n, p, k };

  if (appState.mode === 'auto') {
    analyzeAutoMode();
  } else if (appState.mode === 'manual') {
    analyzeManualMode();
  }
}

function analyzeAutoMode() {
  const reading = appState.soilData;
  
  // إضافة إلى السجل
  appState.searchHistory.unshift({
    timestamp: new Date().toLocaleString(),
    data: { ...reading },
    resultsCount: plants.length
  });
  saveSearchHistory();

  renderValues(reading);

  const suitable = [];
  const unsuitable = [];
  const generalIssues = new Set();

  plants.forEach((plant) => {
    const result = checkPlantSuitability(plant, reading);
    if (result.suitable) {
      suitable.push(result);
    } else {
      unsuitable.push(result);
    }
    result.generalTips.forEach((t) => generalIssues.add(t));
  });

  renderAutoResults(suitable, unsuitable);
  renderImprovementTips(reading);
  renderStatusBox(suitable.length, unsuitable.length);
  renderGeneralTips(Array.from(generalIssues));

  document.getElementById("manualResultContainer").classList.add("hidden");
  document.getElementById("autoResultContainer").classList.remove("hidden");
  hideAllScreens();
  document.getElementById("resultsSection").classList.remove("hidden");
}

function analyzeManualMode() {
  if (!appState.selectedPlant) {
    alert(i18n.translate('Please select a plant first'));
    return;
  }

  const reading = appState.soilData;
  const result = checkPlantSuitability(appState.selectedPlant, reading);

  renderValues(reading);
  renderManualResults(result);
  renderImprovementTips(reading);
  
  // تحليل ذكي من AI
  const aiAnalysis = aiAnalyzer.analyzeAndRecommend(reading, appState.selectedPlant);
  const soilQuality = aiAnalyzer.assessSoilQuality(reading, appState.selectedPlant);
  const implementationPlan = aiAnalyzer.calculateImplementationPlan(aiAnalysis, i18n.currentLang);
  
  renderAdvancedRecommendations(aiAnalysis, soilQuality, implementationPlan);
  
  renderStatusBox(result.suitable ? 1 : 0, result.suitable ? 0 : 1);

  document.getElementById("selectedPlantName").textContent = getPlantName(appState.selectedPlant);
  document.getElementById("autoResultContainer").classList.add("hidden");
  document.getElementById("manualResultContainer").classList.remove("hidden");
  hideAllScreens();
  document.getElementById("resultsSection").classList.remove("hidden");
}

function renderPlantSelector() {
  const selector = document.getElementById("plantsSelector");
  selector.innerHTML = '';
  
  const lang = i18n.currentLang;

  // إنشاء حاوية البحث
  const searchContainer = document.createElement("div");
  searchContainer.className = "plant-search-container";
  searchContainer.innerHTML = `
    <div class="search-box">
      <input 
        type="text" 
        id="plantSearchInput" 
        class="plant-search-input"
        placeholder="${lang === 'ar' ? 'ابحث عن نبات...' : 'Search for a plant...'}"
      />
      <span class="search-icon">🔍</span>
    </div>
    <div class="search-filters">
      <button class="filter-btn active" data-filter="all">${lang === 'ar' ? 'الكل' : 'All'}</button>
      <button class="filter-btn" data-filter="vegetables">${lang === 'ar' ? 'خضروات' : 'Vegetables'}</button>
      <button class="filter-btn" data-filter="fruits">${lang === 'ar' ? 'فواكه' : 'Fruits'}</button>
      <button class="filter-btn" data-filter="grains">${lang === 'ar' ? 'حبوب' : 'Grains'}</button>
      <button class="filter-btn" data-filter="legumes">${lang === 'ar' ? 'بقوليات' : 'Legumes'}</button>
      <button class="filter-btn" data-filter="herbs">${lang === 'ar' ? 'أعشاب' : 'Herbs'}</button>
    </div>
  `;
  selector.appendChild(searchContainer);

  // حاوية النباتات
  const plantsContainer = document.createElement("div");
  plantsContainer.id = "plantsContainer";
  plantsContainer.className = "plants-grid";
  selector.appendChild(plantsContainer);

  // متغيرات البحث
  let currentFilter = 'all';
  let searchQuery = '';

  // دالة لتصفية وعرض النباتات
  function displayFilteredPlants() {
    plantsContainer.innerHTML = '';

    let filtered = plants.filter(plant => {
      const matchesFilter = currentFilter === 'all' || plant.category === currentFilter;
      const matchesSearch = searchQuery === '' || 
        plant.nameAr.includes(searchQuery) || 
        plant.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      plantsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 30px; color: #666;">
          <p style="font-size: 1.2rem;">🔍 ${lang === 'ar' ? 'لم نجد نباتات' : 'No plants found'}</p>
          <p style="font-size: 0.9rem;">${lang === 'ar' ? 'جرّب كلمة بحث أخرى' : 'Try a different search term'}</p>
        </div>
      `;
      return;
    }

    filtered.forEach((plant) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "plant-btn enhanced";
      btn.innerHTML = `
        <span class="plant-icon">${plant.icon}</span>
        <span class="plant-name">${getPlantName(plant)}</span>
        <span class="plant-category">${plant.category}</span>
      `;
      btn.addEventListener("click", () => {
        appState.selectedPlant = plant;
        hideAllScreens();
        document.getElementById("autoModeScreen").classList.remove("hidden");
      });
      plantsContainer.appendChild(btn);
    });
  }

  // حدث البحث
  const searchInput = document.getElementById("plantSearchInput");
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    displayFilteredPlants();
  });

  // أحداث الفلاتر
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      currentFilter = e.target.dataset.filter;
      displayFilteredPlants();
    });
  });

  // عرض النباتات الأولية
  displayFilteredPlants();
}

function checkPlantSuitability(plant, r) {
  const issues = [];
  const tips = new Set();
  const generalTips = new Set();
  const lang = i18n.currentLang;

  if (r.temp < plant.tempMin) {
    const msg = lang === 'ar' 
      ? `درجة الحرارة منخفضة جداً (الحد الأدنى: ${plant.tempMin}°C)`
      : `Temperature too low (min: ${plant.tempMin}°C)`;
    issues.push(msg);
    const tip = lang === 'ar' 
      ? "زراعة النبات في فصل أكثر دفئاً أو استخدام بيت زجاجي."
      : "Plant in a warmer season or use a greenhouse.";
    tips.add(tip);
    generalTips.add(lang === 'ar' ? "درجة الحرارة منخفضة جداً" : "Temperature too low");
  } else if (r.temp > plant.tempMax) {
    const msg = lang === 'ar'
      ? `درجة الحرارة مرتفعة جداً (الحد الأقصى: ${plant.tempMax}°C)`
      : `Temperature too high (max: ${plant.tempMax}°C)`;
    issues.push(msg);
    const tip = lang === 'ar'
      ? "توفير الظل والرطوبة للنبات أثناء ذروة الحرارة."
      : "Provide shade and moisture during peak heat.";
    tips.add(tip);
    generalTips.add(lang === 'ar' ? "درجة الحرارة مرتفعة جداً" : "Temperature too high");
  }

  if (r.moisture < plant.moistureMin) {
    const msg = lang === 'ar'
      ? `الرطوبة منخفضة جداً (الحد الأدنى: ${plant.moistureMin}%)`
      : `Moisture too low (min: ${plant.moistureMin}%)`;
    issues.push(msg);
    const tip = lang === 'ar'
      ? "زيادة الري والعناية بالنبات وإضافة طبقة من النشارة."
      : "Increase watering and add mulch.";
    tips.add(tip);
    generalTips.add(lang === 'ar' ? "الرطوبة منخفضة جداً - زد الري" : "Moisture too low - increase watering");
  } else if (r.moisture > plant.moistureMax) {
    const msg = lang === 'ar'
      ? `الرطوبة مرتفعة جداً (الحد الأقصى: ${plant.moistureMax}%)`
      : `Moisture too high (max: ${plant.moistureMax}%)`;
    issues.push(msg);
    const tip = lang === 'ar'
      ? "تحسين تصريف التربة وتقليل الري."
      : "Improve drainage and reduce watering.";
    tips.add(tip);
    generalTips.add(lang === 'ar' ? "الرطوبة مرتفعة جداً - قلل الري وحسّن التصريف" : "Moisture too high - reduce watering and improve drainage");
  }

  if (r.ph < plant.phMin) {
    const msg = lang === 'ar'
      ? `التربة حمضية جداً (الحد الأدنى: ${plant.phMin.toFixed(1)})`
      : `pH too low (min: ${plant.phMin.toFixed(1)})`;
    issues.push(msg);
    const tip = lang === 'ar'
      ? "إضافة الجير الزراعي لرفع درجة الحموضة."
      : "Add agricultural lime to raise pH.";
    tips.add(tip);
    generalTips.add(lang === 'ar' ? "التربة حمضية جداً" : "Soil is too acidic");
  } else if (r.ph > plant.phMax) {
    const msg = lang === 'ar'
      ? `التربة قلوية جداً (الحد الأقصى: ${plant.phMax.toFixed(1)})`
      : `pH too high (max: ${plant.phMax.toFixed(1)})`;
    issues.push(msg);
    const tip = lang === 'ar'
      ? "إضافة الكبريت الزراعي أو السماد العضوي لخفض الحموضة."
      : "Add sulfur or organic matter to lower pH.";
    tips.add(tip);
    generalTips.add(lang === 'ar' ? "التربة قلوية جداً" : "Soil is too alkaline");
  }

  if (r.n < plant.nMin) {
    const msg = lang === 'ar'
      ? "النيتروجين ناقص - سيؤثر على نمو الأوراق"
      : "Nitrogen is too low - affects leaf growth";
    issues.push(msg);
    const tip = lang === 'ar'
      ? "استخدام سماد عضوي غني بالنيتروجين."
      : "Use nitrogen-rich organic fertilizer.";
    tips.add(tip);
    generalTips.add(lang === 'ar' ? "النيتروجين منخفض" : "Nitrogen is low");
  }

  if (r.p < plant.pMin) {
    const msg = lang === 'ar'
      ? "الفسفور ناقص - سيؤثر على جودة الثمار"
      : "Phosphorus is too low - affects fruit quality";
    issues.push(msg);
    const tip = lang === 'ar'
      ? "استخدام دقيق العظام أو سماد فسفوري."
      : "Use bone meal or phosphorus fertilizer.";
    tips.add(tip);
    generalTips.add(lang === 'ar' ? "الفسفور منخفض" : "Phosphorus is low");
  }

  if (r.k < plant.kMin) {
    const msg = lang === 'ar'
      ? "البوتاسيوم ناقص - سيؤثر على قوة النبات"
      : "Potassium is too low - affects plant strength";
    issues.push(msg);
    const tip = lang === 'ar'
      ? "استخدام رماد الخشب أو قشور الموز المطحونة."
      : "Use wood ash or ground banana peels.";
    tips.add(tip);
    generalTips.add(lang === 'ar' ? "البوتاسيوم منخفض" : "Potassium is low");
  }

  const suitable = issues.length === 0;

  if (suitable) {
    const tip = lang === 'ar'
      ? "التربة مناسبة تماماً - حافظ على العناية المنتظمة."
      : "Soil is perfect - maintain regular care.";
    tips.add(tip);
  }

  return {
    plant,
    suitable,
    issues,
    tips: Array.from(tips),
    generalTips: Array.from(generalTips)
  };
}

function renderValues(r) {
  const grid = document.getElementById("valuesGrid");
  grid.innerHTML = "";
  const lang = i18n.currentLang;

  const entries = [
    [lang === 'ar' ? "درجة الحرارة" : "Temperature", `${r.temp.toFixed(1)} °C`],
    [lang === 'ar' ? "الرطوبة" : "Moisture", `${r.moisture.toFixed(1)} %`],
    [lang === 'ar' ? "درجة الحموضة" : "pH", r.ph.toFixed(1)],
    [lang === 'ar' ? "النيتروجين (N)" : "Nitrogen (N)", r.n.toFixed(1)],
    [lang === 'ar' ? "الفسفور (P)" : "Phosphorus (P)", r.p.toFixed(1)],
    [lang === 'ar' ? "البوتاسيوم (K)" : "Potassium (K)", r.k.toFixed(1)]
  ];

  entries.forEach(([label, value]) => {
    const card = document.createElement("div");
    card.className = "value-card";
    card.innerHTML = `
      <div class="value-label">${label}</div>
      <div class="value-number">${value}</div>
    `;
    grid.appendChild(card);
  });
}

function renderAutoResults(suitable, unsuitable) {
  const suitableList = document.getElementById("suitableList");
  const unsuitableList = document.getElementById("unsuitableList");
  const lang = i18n.currentLang;

  suitableList.innerHTML = "";
  unsuitableList.innerHTML = "";

  // عنوان مع عدد النتائج
  const suitableHeader = document.createElement("div");
  suitableHeader.style.marginBottom = "15px";
  suitableHeader.innerHTML = `<h3 style="color: #2f9e44; margin: 0 0 15px 0;">✓ ${lang === 'ar' ? `النباتات المناسبة (${suitable.length})` : `Suitable Plants (${suitable.length})`}</h3>`;
  suitableList.appendChild(suitableHeader);

  if (suitable.length === 0) {
    suitableList.innerHTML += `<p style="color: #666; font-style: italic;">${lang === 'ar' ? 'لا توجد نباتات مناسبة حالياً. يرجى تحسين التربة.' : 'No suitable plants found. Please improve the soil.'}</p>`;
  } else {
    suitable.slice(0, 20).forEach((res) => {
      suitableList.appendChild(createPlantCard(res, true));
    });
    if (suitable.length > 20) {
      const moreMsg = document.createElement("p");
      moreMsg.style.marginTop = "15px";
      moreMsg.style.color = "#999";
      moreMsg.textContent = lang === 'ar' 
        ? `... و${suitable.length - 20} نبات آخر` 
        : `... and ${suitable.length - 20} more plants`;
      suitableList.appendChild(moreMsg);
    }
  }

  const unsuitableHeader = document.createElement("div");
  unsuitableHeader.style.marginBottom = "15px";
  unsuitableHeader.style.marginTop = "25px";
  unsuitableHeader.innerHTML = `<h3 style="color: #991b1b; margin: 0 0 15px 0;">✗ ${lang === 'ar' ? `النباتات غير المناسبة (${unsuitable.length})` : `Unsuitable Plants (${unsuitable.length})`}</h3>`;
  unsuitableList.appendChild(unsuitableHeader);

  if (unsuitable.length === 0) {
    unsuitableList.innerHTML += `<p style='color: #666; font-style: italic;'>${lang === 'ar' ? 'جميع النباتات مناسبة!' : 'All plants are suitable!'}</p>`;
  } else {
    unsuitable.slice(0, 20).forEach((res) => {
      unsuitableList.appendChild(createPlantCard(res, false));
    });
    if (unsuitable.length > 20) {
      const moreMsg = document.createElement("p");
      moreMsg.style.marginTop = "15px";
      moreMsg.style.color = "#999";
      moreMsg.textContent = lang === 'ar'
        ? `... و${unsuitable.length - 20} نبات آخر`
        : `... and ${unsuitable.length - 20} more plants`;
      unsuitableList.appendChild(moreMsg);
    }
  }
}

function renderManualResults(result) {
  const compatibility = document.getElementById("plantCompatibility");
  compatibility.innerHTML = "";
  const lang = i18n.currentLang;

  if (result.suitable) {
    compatibility.innerHTML = `<div class="status-box status-good" style="margin-bottom: 15px;">✓ ${lang === 'ar' ? 'التربة مناسبة تماماً لهذا النبات!' : 'Soil is perfect for this plant!'}</div>`;
  } else {
    compatibility.innerHTML = `<div class="status-box status-poor" style="margin-bottom: 15px;">✗ ${lang === 'ar' ? 'التربة غير مناسبة للنبات' : 'Soil is not suitable for this plant'}</div>`;
  }

  result.issues.forEach((issue) => {
    const issueEl = document.createElement("div");
    issueEl.className = "issue-item";
    issueEl.innerHTML = `<span style="color: #dc2626;">✗</span> ${issue}`;
    compatibility.appendChild(issueEl);
  });

  result.tips.forEach((tip) => {
    const tipEl = document.createElement("div");
    tipEl.className = "tip-item";
    tipEl.innerHTML = `<span style="color: #059669;">💡</span> ${tip}`;
    compatibility.appendChild(tipEl);
  });
}

function createPlantCard(result, isGood) {
  const card = document.createElement("div");
  card.className = "plant-card";
  const lang = i18n.currentLang;

  const issuesText =
    result.issues.length === 0
      ? (lang === 'ar' ? "لا توجد مشاكل" : "No issues")
      : result.issues.map((i) => `• ${i}`).join("<br>");

  const tipsText =
    result.tips.length === 0
      ? ""
      : `<br><strong>${lang === 'ar' ? 'نصائح:' : 'Tips:'}</strong><br>` +
        result.tips.map((t) => `• ${t}`).join("<br>");

  const statusTag = isGood
    ? (lang === 'ar' ? "✓ مناسبة" : "✓ Suitable")
    : (lang === 'ar' ? "✗ غير مناسبة" : "✗ Not suitable");

  card.innerHTML = `
    <div class="plant-header">
      <div>
        <span style="font-size: 1.5rem;">${result.plant.icon}</span>
        <span class="plant-name"> ${getPlantName(result.plant)}</span>
      </div>
      <span class="plant-tag ${isGood ? "" : "bad"}">
        ${statusTag}
      </span>
    </div>
    <div class="plant-issues">
      ${issuesText}${tipsText}
    </div>
  `;

  return card;
}

function renderImprovementTips(reading) {
  const container = document.getElementById("improvementTips");
  container.innerHTML = "";
  const lang = i18n.currentLang;

  const issues = [];

  if (reading.n < 60) issues.push({ type: 'nitrogen', level: 60 - reading.n });
  if (reading.p < 60) issues.push({ type: 'phosphorus', level: 60 - reading.p });
  if (reading.k < 60) issues.push({ type: 'potassium', level: 60 - reading.k });

  if (issues.length === 0) {
    const goodMsg = document.createElement("div");
    goodMsg.style.padding = "15px";
    goodMsg.style.background = "linear-gradient(135deg, #dcfce7, #bbf7d0)";
    goodMsg.style.borderRadius = "10px";
    goodMsg.style.color = "#166534";
    goodMsg.style.fontWeight = "600";
    goodMsg.innerHTML = `<span style="font-size: 1.3rem; margin-right: 8px;">✓</span>${lang === 'ar' ? 'التربة في حالة ممتازة! لا توجد نقائص واضحة.' : 'Soil is in excellent condition! No major deficiencies.'}`;
    container.appendChild(goodMsg);
    return;
  }

  const title = document.createElement("h4");
  title.style.marginBottom = "15px";
  title.style.color = "#2f9e44";
  title.textContent = lang === 'ar' ? '💡 الحلول الموصى بها:' : '💡 Recommended Solutions:';
  container.appendChild(title);

  issues.forEach((issue) => {
    let materials = [];
    let title = '';
    let urgency = '';

    if (issue.type === 'nitrogen') {
      materials = naturalMaterials.nitrogen;
      title = lang === 'ar' 
        ? `🌱 تحسين النيتروجين`
        : `🌱 Boost Nitrogen`;
      urgency = issue.level > 30 ? '🔴 عاجل' : '🟡 متوسط';
    } else if (issue.type === 'phosphorus') {
      materials = naturalMaterials.phosphorus;
      title = lang === 'ar'
        ? `🌻 تحسين الفسفور`
        : `🌻 Boost Phosphorus`;
      urgency = issue.level > 30 ? '🔴 عاجل' : '🟡 متوسط';
    } else if (issue.type === 'potassium') {
      materials = naturalMaterials.potassium;
      title = lang === 'ar'
        ? `💪 تحسين البوتاسيوم`
        : `💪 Boost Potassium`;
      urgency = issue.level > 30 ? '🔴 عاجل' : '🟡 متوسط';
    }

    const section = document.createElement("div");
    section.className = "improvement-section";
    section.innerHTML = `<h4>${title} <span style="font-size: 0.9rem; margin-right: 8px;">${urgency}</span></h4>`;

    materials.forEach((material) => {
      const item = document.createElement("div");
      item.className = "material-item";
      item.innerHTML = `
        <strong>${getMaterialName(material)}</strong>
        <p style="font-size: 0.9rem; color: #666; margin: 5px 0;">${getMaterialDesc(material)}</p>
        <p style="font-size: 0.85rem; color: #059669;"><strong>${lang === 'ar' ? 'الكمية الموصى بها:' : 'Recommended amount:'}</strong> ${getMaterialAmount(material)}</p>
      `;
      section.appendChild(item);
    });

    container.appendChild(section);
  });
}

function renderStatusBox(okCount, badCount) {
  const box = document.getElementById("statusBox");
  const qualityBar = document.getElementById("qualityBar");
  let statusClass = "status-good";
  let text = "";
  const lang = i18n.currentLang;

  const total = okCount + badCount;
  const ratio = total === 0 ? 0 : okCount / total;
  const percentage = Math.round(ratio * 100);

  if (ratio >= 0.7) {
    statusClass = "status-good";
    text = lang === 'ar'
      ? `✓ حالة التربة: ممتازة جداً (${percentage}%) - ${okCount} نبات(ات) مناسبة`
      : `✓ Soil Status: Excellent (${percentage}%) - ${okCount} suitable plant(s)`;
  } else if (ratio >= 0.5) {
    statusClass = "status-good";
    text = lang === 'ar'
      ? `✓ حالة التربة: جيدة جداً (${percentage}%) - ${okCount} نبات(ات) مناسبة`
      : `✓ Soil Status: Very Good (${percentage}%) - ${okCount} suitable plant(s)`;
  } else if (ratio >= 0.3) {
    statusClass = "status-fair";
    text = lang === 'ar'
      ? `⚠ حالة التربة: متوسطة (${percentage}%) - ${okCount} نبات(ات) مناسبة`
      : `⚠ Soil Status: Fair (${percentage}%) - ${okCount} suitable plant(s)`;
  } else {
    statusClass = "status-poor";
    text = lang === 'ar'
      ? `✗ حالة التربة: ضعيفة (${percentage}%) - فقط ${okCount} نبات(ات) مناسبة`
      : `✗ Soil Status: Poor (${percentage}%) - only ${okCount} suitable plant(s)`;
  }

  box.className = `status-box ${statusClass}`;
  box.textContent = text;
  
  // تحديث شريط الجودة
  if (qualityBar) {
    qualityBar.style.width = percentage + '%';
  }
}

function renderGeneralTips(tips) {
  const list = document.getElementById("tipsList");
  list.innerHTML = "";
  const lang = i18n.currentLang;
  
  if (tips.length === 0) {
    const li = document.createElement("li");
    li.textContent = lang === 'ar'
      ? "التربة في حالة جيدة. استمر في العناية المنتظمة."
      : "Soil is in good condition. Continue with regular care.";
    list.appendChild(li);
    return;
  }
  
  tips.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    list.appendChild(li);
  });
}

/**
 * 🤖 عرض التوصيات الذكية المتقدمة من AI
 * Render advanced AI-powered recommendations
 */
function renderAdvancedRecommendations(analysis, soilQuality, implementationPlan) {
  const lang = i18n.currentLang;
  
  // إنشاء قسم التوصيات الذكية
  let advancedRecommendationsHtml = `
    <div class="ai-recommendations-section">
      <div class="ai-header">
        <h3>🤖 ${lang === 'ar' ? 'تحليل ذكي من AI' : 'AI Smart Analysis'}</h3>
        <span class="urgency-badge urgency-${analysis.urgencyLevel}">
          ${lang === 'ar' ? 
            (analysis.urgencyLevel === 'critical' ? '🔴 عاجل جداً' : 
             analysis.urgencyLevel === 'high' ? '🟠 عاجل' :
             analysis.urgencyLevel === 'medium' ? '🟡 متوسط' : '🟢 عادي') :
            (analysis.urgencyLevel === 'critical' ? '🔴 Critical' : 
             analysis.urgencyLevel === 'high' ? '🟠 High' :
             analysis.urgencyLevel === 'medium' ? '🟡 Medium' : '🟢 Normal')}
        </span>
      </div>

      <!-- جودة التربة الكلية -->
      <div class="soil-quality-assessment">
        <div class="quality-score">
          <span class="score-number">${soilQuality.score}%</span>
          <div class="score-bar">
            <div class="score-fill" style="width: ${soilQuality.score}%; background: ${
              soilQuality.score >= 80 ? '#22c55e' :
              soilQuality.score >= 60 ? '#eab308' :
              soilQuality.score >= 40 ? '#f97316' : '#ef4444'
            };"></div>
          </div>
          <p class="score-status">${soilQuality.status}</p>
        </div>
        <p class="score-recommendation">${soilQuality.recommendation}</p>
      </div>

      <!-- النقائص المكتشفة -->
      ${analysis.deficiencies.length > 0 ? `
        <div class="deficiencies-section">
          <h4>${lang === 'ar' ? '⚠️ النقائص المكتشفة:' : '⚠️ Detected Deficiencies:'}</h4>
          <div class="deficiencies-list">
            ${analysis.deficiencies.map(def => `
              <div class="deficiency-item">
                <div class="deficiency-header">
                  <span class="deficiency-element">
                    ${def.element === 'nitrogen' ? '🌱 النيتروجين' : 
                      def.element === 'phosphorus' ? '🌻 الفسفور' : '💪 البوتاسيوم'}
                  </span>
                  <span class="deficiency-level">
                    ${lang === 'ar' ? 'النقص:' : 'Deficit:'} 
                    <strong>${def.deficit.toFixed(1)}</strong>
                  </span>
                </div>
                <div class="deficiency-values">
                  <span>${lang === 'ar' ? 'الحالي:' : 'Current:'} <strong>${def.current.toFixed(1)}</strong></span>
                  <span>${lang === 'ar' ? 'المطلوب:' : 'Required:'} <strong>${def.required.toFixed(1)}</strong></span>
                </div>
                <p class="deficiency-impact">${def.impact}</p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : `
        <div class="deficiencies-section good-status">
          <p>✅ ${lang === 'ar' ? 'جميع العناصر متوازنة بشكل ممتاز!' : 'All elements are perfectly balanced!'}</p>
        </div>
      `}

      <!-- التوصيات المحددة -->
      ${analysis.recommendations.length > 0 ? `
        <div class="specific-recommendations">
          <h4>${lang === 'ar' ? '💡 الحلول الموصى بها:' : '💡 Recommended Solutions:'}</h4>
          ${analysis.recommendations.map((rec, idx) => `
            <div class="recommendation-card">
              <div class="rec-header">
                <h5>
                  ${rec.element === 'nitrogen' ? '🌱 زيادة النيتروجين' : 
                    rec.element === 'phosphorus' ? '🌻 تحسين الفسفور' : '💪 تقوية البوتاسيوم'}
                </h5>
                <span class="cost-badge cost-${rec.costLevel}">
                  ${lang === 'ar' ? 
                    (rec.costLevel === 'high' ? '💰 مرتفع' : rec.costLevel === 'medium' ? '💰 متوسط' : '💰 منخفض') :
                    (rec.costLevel === 'high' ? '💰 High' : rec.costLevel === 'medium' ? '💰 Medium' : '💰 Low')}
                </span>
              </div>

              <!-- المواد الطبيعية المقترحة -->
              <div class="materials-section">
                <h6>${lang === 'ar' ? 'المواد الطبيعية المقترحة:' : 'Suggested Natural Materials:'}</h6>
                <div class="materials-list">
                  ${rec.materials.map((mat, mIdx) => `
                    <div class="material-option priority-${mat.priority}">
                      <div class="material-title">
                        <span class="priority-badge">
                          ${lang === 'ar' ? 'الخيار' : 'Option'} ${mat.priority}
                        </span>
                        <strong>${mat.nameAr || mat.nameEn}</strong>
                      </div>
                      <div class="material-details">
                        <p><strong>${lang === 'ar' ? '📦 الكمية:' : '📦 Quantity:'}</strong> 
                          <span class="amount-badge">${Math.round(mat.recommendedGrams)} جرام</span>
                        </p>
                        <p><strong>${lang === 'ar' ? '📝 التطبيق:' : '📝 Application:'}</strong> ${mat.applicationAr || mat.applicationEn}</p>
                        <p><strong>${lang === 'ar' ? '⏱️ التأثير:' : '⏱️ Effect Time:'}</strong> ${mat.daysToEffect || 0} أيام</p>
                        <p class="material-benefits">
                          ${lang === 'ar' ? '✨ الفوائد:' : '✨ Benefits:'} 
                          ${mat.benefits ? mat.benefits.join(', ') : ''}
                        </p>
                      </div>
                    </div>
                  `).join('')}
                </div>

                <!-- جدول التطبيق الموصى به -->
                ${rec.applicationSchedule && rec.applicationSchedule.length > 0 ? `
                  <div class="application-schedule">
                    <h6>${lang === 'ar' ? '📅 جدول التطبيق:' : '📅 Application Schedule:'}</h6>
                    <div class="schedule-grid">
                      ${rec.applicationSchedule.map((schedule, sIdx) => `
                        <div class="schedule-item">
                          <div class="schedule-day">اليوم ${schedule.day}</div>
                          <div class="schedule-desc">${schedule.desc}</div>
                          <div class="schedule-percent">${schedule.percent}%</div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>

              <!-- الكمية الإجمالية المطلوبة -->
              <div class="total-amount">
                <strong>${lang === 'ar' ? '📊 الكمية الإجمالية المطلوبة:' : '📊 Total Amount Needed:'}</strong>
                <span class="total-grams">${rec.gramsNeeded} جرام</span>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- خطة التنفيذ الزمنية -->
      <div class="implementation-plan">
        <h4>${lang === 'ar' ? '⏳ خطة التنفيذ:' : '⏳ Implementation Plan:'}</h4>
        <div class="plan-details">
          <p>
            <strong>${lang === 'ar' ? '⏱️ المدة المتوقعة:' : '⏱️ Expected Duration:'}</strong> 
            ${implementationPlan.totalDays} ${lang === 'ar' ? 'يوم' : 'days'}
          </p>
          <p>
            <strong>${lang === 'ar' ? '💰 التكلفة المتوقعة:' : '💰 Estimated Cost:'}</strong> 
            ${implementationPlan.estimatedCost}
          </p>
        </div>
      </div>

      <!-- نصيحة متخصصة حسب نوع النبات -->
      <div class="plant-specific-advice">
        <p>${analysis.plantSpecificAdvice}</p>
      </div>
    </div>
  `;

  // إضافة قسم التوصيات الذكية إلى صفحة النتائج
  const resultsContainer = document.getElementById("manualResultContainer");
  if (resultsContainer) {
    // البحث عن قسم موجود أو إنشاء واحد جديد
    let advancedSection = resultsContainer.querySelector('.ai-recommendations-section');
    if (!advancedSection) {
      const div = document.createElement('div');
      div.innerHTML = advancedRecommendationsHtml;
      resultsContainer.appendChild(div.firstElementChild);
    } else {
      advancedSection.innerHTML = advancedRecommendationsHtml;
    }
  }
}
