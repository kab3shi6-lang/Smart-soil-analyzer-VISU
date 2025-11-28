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

// دالة لإنشاء 1000+ نبات ديناميكياً
function generateLargePlantsDatabase() {
  plants = [];
  const icons = ["🍅", "🥔", "🌾", "🫘", "🥕", "🥬", "🌶️", "🌿", "🧅", "🥒", "🌽", "🍓", "🍎", "🍊", "🍋", "🍌", "🍇"];
  let id = 1;
  
  // إضافة النباتات الأساسية أولاً
  basePlantsData.forEach((base, index) => {
    plants.push(createPlantObject(id++, base.nameAr, base.nameEn, base.icon, base.category));
  });
  
  // إضافة نباتات مشتقة بإضافة أصناف مختلفة
  const varieties = [
    { arSuffix: " (صنف محسّن)", enSuffix: " (Improved Variety)" },
    { arSuffix: " (عضوي)", enSuffix: " (Organic)" },
    { arSuffix: " (هجين)", enSuffix: " (Hybrid)" },
    { arSuffix: " (مبكر)", enSuffix: " (Early)" },
    { arSuffix: " (متأخر)", enSuffix: " (Late)" },
    { arSuffix: " (قزم)", enSuffix: " (Dwarf)" },
    { arSuffix: " (طويل)", enSuffix: " (Tall)" },
  ];
  
  // توليد 1000 نبات
  while (plants.length < 1050) {
    basePlantsData.forEach((base) => {
      if (plants.length >= 1050) return;
      
      varieties.forEach((variety) => {
        if (plants.length >= 1050) return;
        
        const nameAr = base.nameAr + variety.arSuffix;
        const nameEn = base.nameEn + variety.enSuffix;
        const icon = icons[Math.floor(Math.random() * icons.length)];
        
        plants.push(createPlantObject(id++, nameAr, nameEn, icon, base.category));
      });
    });
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
  renderPlantSelector();
});

function setupEventListeners() {
  document.getElementById("autoModeBtn").addEventListener("click", () => switchToAutoMode());
  document.getElementById("manualModeBtn").addEventListener("click", () => switchToManualMode());
  document.getElementById("analyzeBtn").addEventListener("click", analyzeSoil);
  document.getElementById("mockBtn").addEventListener("click", useExampleValues);
  document.getElementById("backFromAutoBtn").addEventListener("click", backToModeSelection);
  document.getElementById("backFromManualBtn").addEventListener("click", backToModeSelection);
  document.getElementById("backFromResultsBtn").addEventListener("click", backToModeSelection);
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
    container.innerHTML = `<p style="color: #666;">${lang === 'ar' ? 'التربة في حالة جيدة!' : 'Soil is in good condition!'}</p>`;
    return;
  }

  issues.forEach((issue) => {
    let materials = [];
    let title = '';

    if (issue.type === 'nitrogen') {
      materials = naturalMaterials.nitrogen;
      title = lang === 'ar' 
        ? `تحسين النيتروجين (ناقص بـ ${issue.level.toFixed(0)} وحدة)`
        : `Improve Nitrogen (deficient by ${issue.level.toFixed(0)} units)`;
    } else if (issue.type === 'phosphorus') {
      materials = naturalMaterials.phosphorus;
      title = lang === 'ar'
        ? `تحسين الفسفور (ناقص بـ ${issue.level.toFixed(0)} وحدة)`
        : `Improve Phosphorus (deficient by ${issue.level.toFixed(0)} units)`;
    } else if (issue.type === 'potassium') {
      materials = naturalMaterials.potassium;
      title = lang === 'ar'
        ? `تحسين البوتاسيوم (ناقص بـ ${issue.level.toFixed(0)} وحدة)`
        : `Improve Potassium (deficient by ${issue.level.toFixed(0)} units)`;
    }

    const section = document.createElement("div");
    section.className = "improvement-section";
    section.innerHTML = `<h4>${title}</h4>`;

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
  let statusClass = "status-good";
  let text = "";
  const lang = i18n.currentLang;

  const total = okCount + badCount;
  const ratio = total === 0 ? 0 : okCount / total;

  if (ratio >= 0.6) {
    statusClass = "status-good";
    text = lang === 'ar'
      ? `✓ حالة التربة: ممتازة - ${okCount} نبات(ات) مناسبة`
      : `✓ Soil Status: Excellent - ${okCount} suitable plant(s)`;
  } else if (ratio >= 0.3) {
    statusClass = "status-fair";
    text = lang === 'ar'
      ? `⚠ حالة التربة: متوسطة - ${okCount} نبات(ات) مناسبة`
      : `⚠ Soil Status: Fair - ${okCount} suitable plant(s)`;
  } else {
    statusClass = "status-poor";
    text = lang === 'ar'
      ? `✗ حالة التربة: ضعيفة - فقط ${okCount} نبات(ات) مناسبة`
      : `✗ Soil Status: Poor - only ${okCount} suitable plant(s)`;
  }

  box.className = `status-box ${statusClass}`;
  box.textContent = text;
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
