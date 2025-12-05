// -------------------------------
// 🚀 Bluetooth Bridge WebSocket
// -------------------------------

let btSocket = null;
let isBtConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_BASE_DELAY = 5000;
const TARGET_PLANT_COUNT = 2050; // Target number of plants in database

/**
 * الاتصال بجسر البلوتوث (Node.js bridge.js)
 * يعمل عبر ws://localhost:3000
 */
function startBluetoothBridge() {
  try {
    btSocket = new WebSocket("ws://localhost:3000");

    btSocket.onopen = () => {
      console.log("🌐 Connected to Bluetooth Bridge");
      isBtConnected = true;
      reconnectAttempts = 0; // Reset reconnect counter on successful connection

      const box = document.getElementById("btDataBox");
      if (box) box.style.display = "block";
      
      // Update sensor status indicators
      updateSensorStatus('connected', 'متصل بالجسر | Connected to Bridge');
    };

    btSocket.onmessage = (event) => {
      const msg = event.data.trim();
      console.log("📥 Received from Arduino:", msg);

      const span = document.getElementById("btDataValue");
      if (span) span.textContent = msg;

      // Try to parse and update form fields with different formats
      let data = {};
      
      // JSON format from bridge or Arduino
      if (msg.startsWith('{')) {
        try {
          const jsonData = JSON.parse(msg);
          
          // Check if this is wrapped data from bridge (has 'type' and 'data' properties)
          if (jsonData.type && jsonData.data) {
            const sensorData = jsonData.data;
            data.temp = sensorData.TEMP || sensorData.temperature || sensorData.temp;
            data.moisture = sensorData.MOISTURE || sensorData.moisture;
            data.ph = sensorData.PH || sensorData.pH || sensorData.ph;
            data.n = sensorData.N || sensorData.nitrogen || sensorData.n;
            data.p = sensorData.P || sensorData.phosphorus || sensorData.p;
            data.k = sensorData.K || sensorData.potassium || sensorData.k;
          } else {
            // Direct JSON from Arduino
            data.temp = jsonData.temperature || jsonData.temp || jsonData.TEMP;
            data.moisture = jsonData.moisture || jsonData.MOISTURE;
            data.ph = jsonData.pH || jsonData.ph || jsonData.PH;
            data.n = jsonData.nitrogen || jsonData.n || jsonData.N;
            data.p = jsonData.phosphorus || jsonData.p || jsonData.P;
            data.k = jsonData.potassium || jsonData.k || jsonData.K;
          }
        } catch (e) {
          console.log('JSON parse error, trying other formats');
        }
      }
      // Key:Value format (TEMP:22.5,MOISTURE:65)
      else if (msg.includes(":")) {
        msg.split(",").forEach(pair => {
          const [k, v] = pair.split(":");
          if (k && v) {
            const key = k.trim().toLowerCase();
            const val = parseFloat(v);
            if (key === 'temp' || key === 'temperature') data.temp = val;
            else if (key === 'moisture') data.moisture = val;
            else if (key === 'ph') data.ph = val;
            else if (key === 'n' || key === 'nitrogen') data.n = val;
            else if (key === 'p' || key === 'phosphorus') data.p = val;
            else if (key === 'k' || key === 'potassium') data.k = val;
          }
        });
      }
      // Key=Value format (temp=22.5,moist=65)
      else if (msg.includes("=")) {
        msg.split(",").forEach(pair => {
          const [k, v] = pair.split("=");
          if (k && v) {
            const key = k.trim().toLowerCase();
            const val = parseFloat(v);
            if (key === 'temp' || key === 'temperature') data.temp = val;
            else if (key === 'moist' || key === 'moisture') data.moisture = val;
            else if (key === 'ph') data.ph = val;
            else if (key === 'n') data.n = val;
            else if (key === 'p') data.p = val;
            else if (key === 'k') data.k = val;
          }
        });
      }

      // Update both auto and manual form fields
      if (data.temp !== undefined && !isNaN(data.temp)) {
        const t1 = document.getElementById("temp");
        const t2 = document.getElementById("manualTemp");
        if (t1) t1.value = data.temp;
        if (t2) t2.value = data.temp;
      }
      if (data.moisture !== undefined && !isNaN(data.moisture)) {
        const m1 = document.getElementById("moisture");
        const m2 = document.getElementById("manualMoisture");
        if (m1) m1.value = data.moisture;
        if (m2) m2.value = data.moisture;
      }
      if (data.ph !== undefined && !isNaN(data.ph)) {
        const ph1 = document.getElementById("ph");
        const ph2 = document.getElementById("manualPh");
        if (ph1) ph1.value = data.ph;
        if (ph2) ph2.value = data.ph;
      }
      if (data.n !== undefined && !isNaN(data.n)) {
        const n1 = document.getElementById("n");
        const n2 = document.getElementById("manualN");
        if (n1) n1.value = data.n;
        if (n2) n2.value = data.n;
      }
      if (data.p !== undefined && !isNaN(data.p)) {
        const p1 = document.getElementById("p");
        const p2 = document.getElementById("manualP");
        if (p1) p1.value = data.p;
        if (p2) p2.value = data.p;
      }
      if (data.k !== undefined && !isNaN(data.k)) {
        const k1 = document.getElementById("k");
        const k2 = document.getElementById("manualK");
        if (k1) k1.value = data.k;
        if (k2) k2.value = data.k;
      }
      
      // Update sensor status to show data is being received
      const hasData = Object.keys(data).length > 0;
      if (hasData) {
        updateSensorStatus('receiving', 'جاري استقبال البيانات | Receiving data...');
        
        // Highlight form fields briefly
        highlightUpdatedFields();
        
        // Reset status after a delay
        setTimeout(() => {
          updateSensorStatus('connected', 'متصل - البيانات جاهزة | Connected - Data ready');
        }, 1000);
      }
      
      console.log("✅ Form fields updated with:", data);
    };

    btSocket.onerror = (err) => {
      console.warn("⚠ WebSocket Error:", err);
      updateSensorStatus('disconnected', 'خطأ في الاتصال | Connection error');
    };

    btSocket.onclose = () => {
      console.log("⚪ Bluetooth bridge disconnected");
      isBtConnected = false;
      updateSensorStatus('disconnected', 'غير متصل | Disconnected');
      
      // Implement exponential backoff with max retry limit
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        const delay = RECONNECT_BASE_DELAY * Math.pow(1.5, reconnectAttempts - 1);
        console.log(`🔄 Reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${Math.round(delay/1000)}s`);
        updateSensorStatus('connecting', `جاري إعادة الاتصال (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) | Reconnecting...`);
        setTimeout(startBluetoothBridge, delay);
      } else {
        console.log("⛔ Max reconnect attempts reached. Please refresh the page to try again.");
        updateSensorStatus('disconnected', 'فشل الاتصال - أعد تحميل الصفحة | Connection failed - Refresh page');
      }
    };

  } catch (e) {
    console.error("WebSocket exception:", e);
  }
}

/**
 * تحديث حالة المستشعر
 * Update sensor status indicator
 */
function updateSensorStatus(status, message) {
  const statusContainers = [
    document.getElementById('sensorStatusAuto'),
    document.getElementById('sensorStatusManual')
  ];
  
  statusContainers.forEach(container => {
    if (!container) return;
    
    const indicator = container.querySelector('.status-indicator');
    const text = container.querySelector('.status-text');
    
    if (indicator) {
      indicator.className = 'status-indicator ' + status;
    }
    
    if (text) {
      text.textContent = message;
    }
    
    // Update container class
    container.className = 'sensor-status ' + status;
  });
}

/**
 * تمييز الحقول المحدثة
 * Highlight updated form fields
 */
function highlightUpdatedFields() {
  const fieldIds = ['temp', 'moisture', 'ph', 'n', 'p', 'k', 
                    'manualTemp', 'manualMoisture', 'manualPh', 'manualN', 'manualP', 'manualK'];
  
  fieldIds.forEach(id => {
    const field = document.getElementById(id);
    if (field && field.value) {
      field.style.backgroundColor = '#dcfce7';
      field.style.borderColor = '#22c55e';
      field.style.transition = 'all 0.3s ease';
      
      setTimeout(() => {
        field.style.backgroundColor = '';
        field.style.borderColor = '';
      }, 1500);
    }
  });
}

// تشغيل الاتصال تلقائياً عند فتح الموقع
window.addEventListener("load", () => {
  startBluetoothBridge();
});

// قاعدة بيانات شاملة للنباتات مع 2000+ نبات
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

// دالة لإنشاء 2000+ نبات ديناميكياً بدون تكرار
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
    { arSuffix: " (مقاوم للحشرات)", enSuffix: " (Pest Resistant)" },
    { arSuffix: " (صنف ممتاز)", enSuffix: " (Premium)" },
    { arSuffix: " (مقاوم للبرودة)", enSuffix: " (Cold Resistant)" },
    { arSuffix: " (مقاوم للحرارة)", enSuffix: " (Heat Tolerant)" },
    { arSuffix: " (صنف استوائي)", enSuffix: " (Tropical)" },
  ];
  
  // توليد 2000+ نبات بدون تكرار
  const usedCombinations = new Set();
  
  // استراتيجية 1: مزج الأصناف مع النباتات الأساسية
  basePlantsData.forEach((base) => {
    varieties.forEach((variety) => {
      if (plants.length >= TARGET_PLANT_COUNT) return;
      
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
    // الخضروات
    { nameAr: "اليقطين", nameEn: "Pumpkin", icon: "🎃", category: "vegetables" },
    { nameAr: "القرع", nameEn: "Squash", icon: "🟨", category: "vegetables" },
    { nameAr: "الفلفل البوابيا", nameEn: "Bell Pepper", icon: "🫑", category: "vegetables" },
    { nameAr: "القرنبيط", nameEn: "Cauliflower", icon: "🥬", category: "vegetables" },
    { nameAr: "البطاطا الحلوة", nameEn: "Sweet Potato", icon: "🍠", category: "vegetables" },
    { nameAr: "الفجل الأبيض", nameEn: "White Radish", icon: "⚪", category: "vegetables" },
    { nameAr: "الكرفس", nameEn: "Celery", icon: "🥬", category: "vegetables" },
    { nameAr: "الخرشوف", nameEn: "Artichoke", icon: "🌿", category: "vegetables" },
    { nameAr: "الهليون", nameEn: "Asparagus", icon: "🌱", category: "vegetables" },
    { nameAr: "الراوند", nameEn: "Rhubarb", icon: "🌿", category: "vegetables" },
    { nameAr: "البامية", nameEn: "Okra", icon: "🟢", category: "vegetables" },
    { nameAr: "الخردل", nameEn: "Mustard Greens", icon: "🥬", category: "vegetables" },
    { nameAr: "السلق", nameEn: "Swiss Chard", icon: "🥬", category: "vegetables" },
    { nameAr: "اللوبيا", nameEn: "Cowpea", icon: "🟤", category: "vegetables" },
    
    // الفواكه
    { nameAr: "التمر", nameEn: "Date", icon: "🔗", category: "fruits" },
    { nameAr: "التوت", nameEn: "Mulberry", icon: "🫐", category: "fruits" },
    { nameAr: "الرمان", nameEn: "Pomegranate", icon: "🥭", category: "fruits" },
    { nameAr: "الجوافة", nameEn: "Guava", icon: "🥝", category: "fruits" },
    { nameAr: "جوز الهند", nameEn: "Coconut", icon: "🥥", category: "fruits" },
    { nameAr: "الأفوكادو", nameEn: "Avocado", icon: "🥑", category: "fruits" },
    { nameAr: "الكرز", nameEn: "Cherry", icon: "🍒", category: "fruits" },
    { nameAr: "الخوخ", nameEn: "Peach", icon: "🍑", category: "fruits" },
    { nameAr: "المشمش", nameEn: "Apricot", icon: "🍑", category: "fruits" },
    { nameAr: "البرقوق", nameEn: "Plum", icon: "🫐", category: "fruits" },
    { nameAr: "الكمثرى", nameEn: "Pear", icon: "🍐", category: "fruits" },
    { nameAr: "التين", nameEn: "Fig", icon: "🟣", category: "fruits" },
    { nameAr: "الباباي", nameEn: "Papaya", icon: "🥭", category: "fruits" },
    { nameAr: "الليتشي", nameEn: "Lychee", icon: "🔴", category: "fruits" },
    { nameAr: "الباشن فروت", nameEn: "Passion Fruit", icon: "🟡", category: "fruits" },
    { nameAr: "التوت البري", nameEn: "Blueberry", icon: "🫐", category: "fruits" },
    { nameAr: "توت العليق", nameEn: "Raspberry", icon: "🔴", category: "fruits" },
    { nameAr: "التوت الأسود", nameEn: "Blackberry", icon: "⚫", category: "fruits" },
    
    // الحبوب
    { nameAr: "الرز البري", nameEn: "Wild Rice", icon: "🍚", category: "grains" },
    { nameAr: "القمح الأسمر", nameEn: "Buckwheat", icon: "🌾", category: "grains" },
    { nameAr: "الشعير الأسود", nameEn: "Black Barley", icon: "🌾", category: "grains" },
    { nameAr: "الذرة السوداء", nameEn: "Black Corn", icon: "🌽", category: "grains" },
    { nameAr: "الأرز البني", nameEn: "Brown Rice", icon: "🍚", category: "grains" },
    { nameAr: "الشوفان البري", nameEn: "Wild Oats", icon: "🌾", category: "grains" },
    { nameAr: "الكينوا", nameEn: "Quinoa", icon: "🌾", category: "grains" },
    { nameAr: "الأمارانث", nameEn: "Amaranth", icon: "🌾", category: "grains" },
    { nameAr: "الحنطة السوداء", nameEn: "Bulgur", icon: "🌾", category: "grains" },
    { nameAr: "الفريك", nameEn: "Freekeh", icon: "🌾", category: "grains" },
    
    // البقوليات
    { nameAr: "العدس الأحمر", nameEn: "Red Lentils", icon: "🟤", category: "legumes" },
    { nameAr: "العدس الأسود", nameEn: "Black Lentils", icon: "⚫", category: "legumes" },
    { nameAr: "الفول السوداني", nameEn: "Peanut", icon: "🥜", category: "legumes" },
    { nameAr: "الحمص الأسود", nameEn: "Black Chickpea", icon: "🟤", category: "legumes" },
    { nameAr: "الفول المدمس", nameEn: "Fava Beans", icon: "🫘", category: "legumes" },
    { nameAr: "الترمس", nameEn: "Lupini Beans", icon: "🟡", category: "legumes" },
    { nameAr: "الفاصوليا السوداء", nameEn: "Black Beans", icon: "⚫", category: "legumes" },
    { nameAr: "الفاصوليا البيضاء", nameEn: "White Beans", icon: "⚪", category: "legumes" },
    { nameAr: "الفاصوليا الحمراء", nameEn: "Red Kidney Beans", icon: "🔴", category: "legumes" },
    
    // الأعشاب
    { nameAr: "الشمر البري", nameEn: "Wild Fennel", icon: "🌿", category: "herbs" },
    { nameAr: "عرق السوس", nameEn: "Licorice", icon: "🌿", category: "herbs" },
    { nameAr: "البابونج", nameEn: "Chamomile", icon: "🌼", category: "herbs" },
    { nameAr: "اللافندر", nameEn: "Lavender", icon: "💜", category: "herbs" },
    { nameAr: "المريمية", nameEn: "Sage", icon: "🌿", category: "herbs" },
    { nameAr: "الأوريجانو", nameEn: "Oregano", icon: "🌿", category: "herbs" },
    { nameAr: "الكزبرة", nameEn: "Coriander", icon: "🌿", category: "herbs" },
    { nameAr: "الطرخون", nameEn: "Tarragon", icon: "🌿", category: "herbs" },
    { nameAr: "البردقوش", nameEn: "Marjoram", icon: "🌿", category: "herbs" },
    { nameAr: "الكراوية", nameEn: "Caraway", icon: "🌿", category: "herbs" },
    { nameAr: "اليانسون", nameEn: "Anise", icon: "🌿", category: "herbs" },
    { nameAr: "الحلبة", nameEn: "Fenugreek", icon: "🌿", category: "herbs" },
    
    // التوابل
    { nameAr: "الحبة السوداء", nameEn: "Black Seed", icon: "⚫", category: "spices" },
    { nameAr: "السمسم", nameEn: "Sesame", icon: "🤎", category: "spices" },
    { nameAr: "بذور الكتان", nameEn: "Flax Seeds", icon: "🟤", category: "spices" },
    { nameAr: "الزعفران", nameEn: "Saffron", icon: "🟡", category: "spices" },
    { nameAr: "القرنفل", nameEn: "Cloves", icon: "🟤", category: "spices" },
    { nameAr: "الهيل", nameEn: "Cardamom", icon: "🟢", category: "spices" },
    { nameAr: "جوزة الطيب", nameEn: "Nutmeg", icon: "🟤", category: "spices" },
    { nameAr: "الكمون", nameEn: "Cumin", icon: "🟤", category: "spices" },
    { nameAr: "الكركم", nameEn: "Turmeric", icon: "🟠", category: "spices" },
    { nameAr: "الفانيليا", nameEn: "Vanilla", icon: "🟤", category: "spices" },
    
    // الزهور
    { nameAr: "الشمس (عباد الشمس)", nameEn: "Sunflower", icon: "🌻", category: "flowers" },
    { nameAr: "الزهور", nameEn: "Flowers", icon: "🌸", category: "flowers" },
    { nameAr: "الورود", nameEn: "Roses", icon: "🌹", category: "flowers" },
    { nameAr: "الكركديه", nameEn: "Hibiscus", icon: "🌺", category: "flowers" },
    { nameAr: "الأقحوان", nameEn: "Marigold", icon: "🌼", category: "flowers" },
    { nameAr: "الياسمين", nameEn: "Jasmine", icon: "⚪", category: "flowers" },
    { nameAr: "الأوركيد", nameEn: "Orchid", icon: "💜", category: "flowers" },
    { nameAr: "الزنبق", nameEn: "Lily", icon: "🌸", category: "flowers" },
    { nameAr: "التيوليب", nameEn: "Tulip", icon: "🌷", category: "flowers" },
    { nameAr: "النرجس", nameEn: "Daffodil", icon: "🌼", category: "flowers" },
    { nameAr: "البنفسج", nameEn: "Violet", icon: "💜", category: "flowers" },
    { nameAr: "الجاردينيا", nameEn: "Gardenia", icon: "⚪", category: "flowers" },
  ];
  
  // إضافة النباتات الإضافية
  additionalPlants.forEach((plant) => {
    if (plants.length >= TARGET_PLANT_COUNT) return;
    
    plants.push(createPlantObject(id++, plant.nameAr, plant.nameEn, plant.icon, plant.category));
    
    // إضافة أصناف للنباتات الإضافية
    varieties.forEach((variety) => {
      if (plants.length >= TARGET_PLANT_COUNT) return;
      
      const nameAr = plant.nameAr + variety.arSuffix;
      const nameEn = plant.nameEn + variety.enSuffix;
      
      plants.push(createPlantObject(id++, nameAr, nameEn, plant.icon, plant.category));
    });
  });
  
  // استراتيجية 3: إضافة نباتات عشوائية متنوعة
  const randomVariations = ["(مستورد)", "(محلي)", "(بري)", "(مستزرع)", "(قديم)", "(جديد)", "(ذهبي)", "(فضي)", "(أحمر)", "(أخضر)", "(أصفر)", "(متميز)"];
  const randomCategories = ["vegetables", "fruits", "grains", "legumes", "herbs", "spices", "flowers"];
  
  while (plants.length < TARGET_PLANT_COUNT) {
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
  
  // تحليل ذكي من AI للوضع التلقائي (مع التحقق من توفر aiAnalyzer)
  if (typeof aiAnalyzer !== 'undefined' && aiAnalyzer && plants.length > 0) {
    try {
      // استخدام أول نبات مناسب أو أول نبات في القائمة للتحليل العام
      const referenceP = suitable.length > 0 ? suitable[0].plant : plants[0];
      if (referenceP) {
        const aiAnalysis = aiAnalyzer.analyzeAndRecommend(reading, referenceP);
        const soilQuality = aiAnalyzer.assessSoilQuality(reading, referenceP);
        const implementationPlan = aiAnalyzer.calculateImplementationPlan(aiAnalysis, i18n.currentLang);
        
        renderAutoAIRecommendations(aiAnalysis, soilQuality, implementationPlan);
      }
    } catch (aiError) {
      console.warn('AI Analyzer error in auto mode:', aiError);
    }
  }

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
  
  // تحليل ذكي من AI (مع التحقق من توفر aiAnalyzer)
  if (typeof aiAnalyzer !== 'undefined' && aiAnalyzer) {
    try {
      const aiAnalysis = aiAnalyzer.analyzeAndRecommend(reading, appState.selectedPlant);
      const soilQuality = aiAnalyzer.assessSoilQuality(reading, appState.selectedPlant);
      const implementationPlan = aiAnalyzer.calculateImplementationPlan(aiAnalysis, i18n.currentLang);
      
      renderAdvancedRecommendations(aiAnalysis, soilQuality, implementationPlan);
    } catch (aiError) {
      console.warn('AI Analyzer error:', aiError);
    }
  }
  
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
        // Check if manual soil form has values
        const manualTemp = document.getElementById("manualTemp")?.value;
        const manualMoisture = document.getElementById("manualMoisture")?.value;
        const manualPh = document.getElementById("manualPh")?.value;
        const manualN = document.getElementById("manualN")?.value;
        const manualP = document.getElementById("manualP")?.value;
        const manualK = document.getElementById("manualK")?.value;
        
        if (!manualTemp || !manualMoisture || !manualPh || !manualN || !manualP || !manualK) {
          const lang = i18n.currentLang;
          alert(lang === 'ar' ? '❌ يرجى ملء جميع حقول التربة أولاً' : '❌ Please fill all soil fields first');
          return;
        }
        
        appState.selectedPlant = plant;
        appState.soilData = {
          temp: parseFloat(manualTemp),
          moisture: parseFloat(manualMoisture),
          ph: parseFloat(manualPh),
          n: parseFloat(manualN),
          p: parseFloat(manualP),
          k: parseFloat(manualK)
        };
        
        // Analyze the selected plant with the soil data
        analyzeManualMode();
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
  const plant = result.plant;
  const reading = appState.soilData;

  // Main suitability status with visual appeal - MORE PROMINENT
  const suitabilityHtml = result.suitable 
    ? `
      <div class="suitability-status suitable">
        <div class="status-icon">✅</div>
        <div class="status-content">
          <h4>${lang === 'ar' ? '🎉 التربة مناسبة تماماً!' : '🎉 Soil is Perfect!'}</h4>
          <p>${lang === 'ar' ? `تربتك مثالية لزراعة ${plant.nameAr}. يمكنك البدء بالزراعة فوراً!` : `Your soil is ideal for growing ${plant.nameEn}. You can start planting immediately!`}</p>
        </div>
      </div>
    `
    : `
      <div class="suitability-status unsuitable">
        <div class="status-icon">❌</div>
        <div class="status-content">
          <h4>${lang === 'ar' ? '⚠️ التربة غير مناسبة حالياً' : '⚠️ Soil is NOT Currently Suitable'}</h4>
          <p>${lang === 'ar' ? `التربة ليست مناسبة لـ ${plant.nameAr} حالياً. اقرأ التوصيات أدناه لمعرفة كيف تجعلها مناسبة باستخدام الأسمدة الطبيعية.` : `Soil is not suitable for ${plant.nameEn} currently. Read the recommendations below to learn how to make it suitable using natural fertilizers.`}</p>
        </div>
      </div>
    `;
  
  compatibility.innerHTML = suitabilityHtml;

  // Show plant requirements vs current values - ALWAYS SHOW
  const comparisonHtml = `
    <div class="soil-comparison">
      <h4>${lang === 'ar' ? '📊 مقارنة قيم التربة مع متطلبات النبات:' : '📊 Soil Values vs Plant Requirements:'}</h4>
      <div class="comparison-grid">
        <div class="comparison-item ${reading.temp >= plant.tempMin && reading.temp <= plant.tempMax ? 'good' : 'bad'}">
          <span class="comp-label">${lang === 'ar' ? 'درجة الحرارة' : 'Temperature'}</span>
          <span class="comp-values">
            <span class="current">${lang === 'ar' ? 'الحالي:' : 'Current:'} ${reading.temp}°C</span>
            <span class="required">${lang === 'ar' ? 'المطلوب:' : 'Required:'} ${plant.tempMin}-${plant.tempMax}°C</span>
          </span>
          <span class="comp-status">${reading.temp >= plant.tempMin && reading.temp <= plant.tempMax ? '✓' : '✗'}</span>
        </div>
        <div class="comparison-item ${reading.moisture >= plant.moistureMin && reading.moisture <= plant.moistureMax ? 'good' : 'bad'}">
          <span class="comp-label">${lang === 'ar' ? 'الرطوبة' : 'Moisture'}</span>
          <span class="comp-values">
            <span class="current">${lang === 'ar' ? 'الحالي:' : 'Current:'} ${reading.moisture}%</span>
            <span class="required">${lang === 'ar' ? 'المطلوب:' : 'Required:'} ${plant.moistureMin}-${plant.moistureMax}%</span>
          </span>
          <span class="comp-status">${reading.moisture >= plant.moistureMin && reading.moisture <= plant.moistureMax ? '✓' : '✗'}</span>
        </div>
        <div class="comparison-item ${reading.ph >= plant.phMin && reading.ph <= plant.phMax ? 'good' : 'bad'}">
          <span class="comp-label">${lang === 'ar' ? 'الحموضة (pH)' : 'pH Level'}</span>
          <span class="comp-values">
            <span class="current">${lang === 'ar' ? 'الحالي:' : 'Current:'} ${reading.ph}</span>
            <span class="required">${lang === 'ar' ? 'المطلوب:' : 'Required:'} ${plant.phMin}-${plant.phMax}</span>
          </span>
          <span class="comp-status">${reading.ph >= plant.phMin && reading.ph <= plant.phMax ? '✓' : '✗'}</span>
        </div>
        <div class="comparison-item ${reading.n >= plant.nMin ? 'good' : 'bad'}">
          <span class="comp-label">${lang === 'ar' ? 'النيتروجين (N)' : 'Nitrogen (N)'}</span>
          <span class="comp-values">
            <span class="current">${lang === 'ar' ? 'الحالي:' : 'Current:'} ${reading.n}</span>
            <span class="required">${lang === 'ar' ? 'المطلوب:' : 'Required:'} ${plant.nMin}+</span>
          </span>
          <span class="comp-status">${reading.n >= plant.nMin ? '✓' : '✗'}</span>
        </div>
        <div class="comparison-item ${reading.p >= plant.pMin ? 'good' : 'bad'}">
          <span class="comp-label">${lang === 'ar' ? 'الفسفور (P)' : 'Phosphorus (P)'}</span>
          <span class="comp-values">
            <span class="current">${lang === 'ar' ? 'الحالي:' : 'Current:'} ${reading.p}</span>
            <span class="required">${lang === 'ar' ? 'المطلوب:' : 'Required:'} ${plant.pMin}+</span>
          </span>
          <span class="comp-status">${reading.p >= plant.pMin ? '✓' : '✗'}</span>
        </div>
        <div class="comparison-item ${reading.k >= plant.kMin ? 'good' : 'bad'}">
          <span class="comp-label">${lang === 'ar' ? 'البوتاسيوم (K)' : 'Potassium (K)'}</span>
          <span class="comp-values">
            <span class="current">${lang === 'ar' ? 'الحالي:' : 'Current:'} ${reading.k}</span>
            <span class="required">${lang === 'ar' ? 'المطلوب:' : 'Required:'} ${plant.kMin}+</span>
          </span>
          <span class="comp-status">${reading.k >= plant.kMin ? '✓' : '✗'}</span>
        </div>
      </div>
    </div>
  `;
  compatibility.innerHTML += comparisonHtml;

  // Show issues if any
  if (result.issues.length > 0) {
    const issuesSection = document.createElement("div");
    issuesSection.className = "issues-section";
    issuesSection.innerHTML = `<h4>${lang === 'ar' ? '❌ المشاكل المكتشفة:' : '❌ Detected Issues:'}</h4>`;
    
    result.issues.forEach((issue) => {
      const issueEl = document.createElement("div");
      issueEl.className = "issue-item";
      issueEl.innerHTML = `<span class="issue-icon">⚠️</span> ${issue}`;
      issuesSection.appendChild(issueEl);
    });
    compatibility.appendChild(issuesSection);
  }

  // Add DIRECT natural fertilizer recommendations for unsuitable soil (without AI dependency)
  if (!result.suitable) {
    const fertilizerSection = document.createElement("div");
    fertilizerSection.className = "natural-fertilizers-direct";
    
    let fertilizerHtml = `
      <h4>${lang === 'ar' ? '🌿 كيف تجعل التربة مناسبة باستخدام الأسمدة الطبيعية:' : '🌿 How to Make Soil Suitable Using Natural Fertilizers:'}</h4>
    `;
    
    // Nitrogen deficiency
    if (reading.n < plant.nMin) {
      const deficit = plant.nMin - reading.n;
      fertilizerHtml += `
        <div class="fertilizer-recommendation">
          <h5>${lang === 'ar' ? '🌱 لزيادة النيتروجين (نقص: ' + deficit.toFixed(0) + ' وحدة)' : '🌱 To Increase Nitrogen (Deficit: ' + deficit.toFixed(0) + ' units)'}</h5>
          <div class="fertilizer-options">
            <div class="fertilizer-option best">
              <span class="option-badge">${lang === 'ar' ? '⭐ الأفضل' : '⭐ Best'}</span>
              <strong>${lang === 'ar' ? 'سماد الدجاج العضوي' : 'Organic Chicken Manure'}</strong>
              <p class="amount">${lang === 'ar' ? '📦 الكمية:' : '📦 Amount:'} <span>${Math.round(deficit * 15)} ${lang === 'ar' ? 'جرام لكل متر مربع' : 'grams per sq meter'}</span></p>
              <p class="application">${lang === 'ar' ? '📝 التطبيق: يُضاف للتربة ويُخلط قبل الزراعة بأسبوع' : '📝 Application: Mix into soil one week before planting'}</p>
            </div>
            <div class="fertilizer-option">
              <span class="option-badge secondary">${lang === 'ar' ? 'بديل' : 'Alternative'}</span>
              <strong>${lang === 'ar' ? 'سماد البقر المتحلل' : 'Aged Cow Manure'}</strong>
              <p class="amount">${lang === 'ar' ? '📦 الكمية:' : '📦 Amount:'} <span>${Math.round(deficit * 25)} ${lang === 'ar' ? 'جرام لكل متر مربع' : 'grams per sq meter'}</span></p>
              <p class="application">${lang === 'ar' ? '📝 التطبيق: يُدفن بعمق 10-15 سم' : '📝 Application: Bury 10-15 cm deep'}</p>
            </div>
            <div class="fertilizer-option">
              <span class="option-badge secondary">${lang === 'ar' ? 'اقتصادي' : 'Budget'}</span>
              <strong>${lang === 'ar' ? 'بقايا القهوة المطحونة' : 'Coffee Grounds'}</strong>
              <p class="amount">${lang === 'ar' ? '📦 الكمية:' : '📦 Amount:'} <span>${Math.round(deficit * 10)} ${lang === 'ar' ? 'جرام لكل متر مربع' : 'grams per sq meter'}</span></p>
              <p class="application">${lang === 'ar' ? '📝 التطبيق: يُخلط مع ماء الري' : '📝 Application: Mix with watering'}</p>
            </div>
          </div>
        </div>
      `;
    }
    
    // Phosphorus deficiency
    if (reading.p < plant.pMin) {
      const deficit = plant.pMin - reading.p;
      fertilizerHtml += `
        <div class="fertilizer-recommendation">
          <h5>${lang === 'ar' ? '🌻 لزيادة الفسفور (نقص: ' + deficit.toFixed(0) + ' وحدة)' : '🌻 To Increase Phosphorus (Deficit: ' + deficit.toFixed(0) + ' units)'}</h5>
          <div class="fertilizer-options">
            <div class="fertilizer-option best">
              <span class="option-badge">${lang === 'ar' ? '⭐ الأفضل' : '⭐ Best'}</span>
              <strong>${lang === 'ar' ? 'دقيق العظام الناعم' : 'Fine Bone Meal'}</strong>
              <p class="amount">${lang === 'ar' ? '📦 الكمية:' : '📦 Amount:'} <span>${Math.round(deficit * 8)} ${lang === 'ar' ? 'جرام لكل متر مربع' : 'grams per sq meter'}</span></p>
              <p class="application">${lang === 'ar' ? '📝 التطبيق: يُرش ويُقلب مع التربة السطحية' : '📝 Application: Spread and mix with topsoil'}</p>
            </div>
            <div class="fertilizer-option">
              <span class="option-badge secondary">${lang === 'ar' ? 'بديل' : 'Alternative'}</span>
              <strong>${lang === 'ar' ? 'رماد الخشب' : 'Wood Ash'}</strong>
              <p class="amount">${lang === 'ar' ? '📦 الكمية:' : '📦 Amount:'} <span>${Math.round(deficit * 12)} ${lang === 'ar' ? 'جرام لكل متر مربع' : 'grams per sq meter'}</span></p>
              <p class="application">${lang === 'ar' ? '📝 التطبيق: يُنشر بالتساوي على سطح التربة' : '📝 Application: Spread evenly on soil surface'}</p>
            </div>
          </div>
        </div>
      `;
    }
    
    // Potassium deficiency
    if (reading.k < plant.kMin) {
      const deficit = plant.kMin - reading.k;
      fertilizerHtml += `
        <div class="fertilizer-recommendation">
          <h5>${lang === 'ar' ? '💪 لزيادة البوتاسيوم (نقص: ' + deficit.toFixed(0) + ' وحدة)' : '💪 To Increase Potassium (Deficit: ' + deficit.toFixed(0) + ' units)'}</h5>
          <div class="fertilizer-options">
            <div class="fertilizer-option best">
              <span class="option-badge">${lang === 'ar' ? '⭐ الأفضل' : '⭐ Best'}</span>
              <strong>${lang === 'ar' ? 'رماد الخشب عالي الجودة' : 'High-Quality Wood Ash'}</strong>
              <p class="amount">${lang === 'ar' ? '📦 الكمية:' : '📦 Amount:'} <span>${Math.round(deficit * 10)} ${lang === 'ar' ? 'جرام لكل متر مربع' : 'grams per sq meter'}</span></p>
              <p class="application">${lang === 'ar' ? '📝 التطبيق: يُنشر بانتظام على التربة' : '📝 Application: Spread regularly on soil'}</p>
            </div>
            <div class="fertilizer-option">
              <span class="option-badge secondary">${lang === 'ar' ? 'بديل صديق للبيئة' : 'Eco-friendly'}</span>
              <strong>${lang === 'ar' ? 'قشور الموز المجففة والمطحونة' : 'Dried & Ground Banana Peels'}</strong>
              <p class="amount">${lang === 'ar' ? '📦 الكمية:' : '📦 Amount:'} <span>${Math.round(deficit * 5)} ${lang === 'ar' ? 'جرام لكل متر مربع' : 'grams per sq meter'}</span></p>
              <p class="application">${lang === 'ar' ? '📝 التطبيق: يُضاف مع السماد العضوي' : '📝 Application: Add with organic fertilizer'}</p>
            </div>
          </div>
        </div>
      `;
    }
    
    // pH adjustment
    if (reading.ph < plant.phMin) {
      fertilizerHtml += `
        <div class="fertilizer-recommendation">
          <h5>${lang === 'ar' ? '🔬 لرفع درجة الحموضة (التربة حمضية جداً)' : '🔬 To Raise pH (Soil is Too Acidic)'}</h5>
          <div class="fertilizer-options">
            <div class="fertilizer-option best">
              <span class="option-badge">${lang === 'ar' ? '⭐ الأفضل' : '⭐ Best'}</span>
              <strong>${lang === 'ar' ? 'الجير الزراعي' : 'Agricultural Lime'}</strong>
              <p class="amount">${lang === 'ar' ? '📦 الكمية:' : '📦 Amount:'} <span>100-200 ${lang === 'ar' ? 'جرام لكل متر مربع' : 'grams per sq meter'}</span></p>
              <p class="application">${lang === 'ar' ? '📝 التطبيق: يُرش ويُخلط مع التربة، ثم يُسقى' : '📝 Application: Spread, mix with soil, then water'}</p>
            </div>
          </div>
        </div>
      `;
    } else if (reading.ph > plant.phMax) {
      fertilizerHtml += `
        <div class="fertilizer-recommendation">
          <h5>${lang === 'ar' ? '🔬 لخفض درجة الحموضة (التربة قلوية جداً)' : '🔬 To Lower pH (Soil is Too Alkaline)'}</h5>
          <div class="fertilizer-options">
            <div class="fertilizer-option best">
              <span class="option-badge">${lang === 'ar' ? '⭐ الأفضل' : '⭐ Best'}</span>
              <strong>${lang === 'ar' ? 'الكبريت الزراعي أو السماد العضوي الحمضي' : 'Agricultural Sulfur or Acidic Organic Matter'}</strong>
              <p class="amount">${lang === 'ar' ? '📦 الكمية:' : '📦 Amount:'} <span>50-100 ${lang === 'ar' ? 'جرام لكل متر مربع' : 'grams per sq meter'}</span></p>
              <p class="application">${lang === 'ar' ? '📝 التطبيق: يُضاف تدريجياً مع مراقبة pH' : '📝 Application: Add gradually while monitoring pH'}</p>
            </div>
          </div>
        </div>
      `;
    }
    
    // Summary action plan
    fertilizerHtml += `
      <div class="action-summary">
        <h5>${lang === 'ar' ? '📋 ملخص خطة العمل:' : '📋 Action Plan Summary:'}</h5>
        <ol>
          <li>${lang === 'ar' ? 'اجمع المواد الطبيعية الموصى بها أعلاه' : 'Gather the recommended natural materials above'}</li>
          <li>${lang === 'ar' ? 'أضف الأسمدة الطبيعية للتربة قبل الزراعة بـ 7-14 يوم' : 'Add natural fertilizers to soil 7-14 days before planting'}</li>
          <li>${lang === 'ar' ? 'اسقِ التربة جيداً بعد إضافة الأسمدة' : 'Water soil well after adding fertilizers'}</li>
          <li>${lang === 'ar' ? 'أعد قياس التربة بعد أسبوعين للتأكد من التحسن' : 'Re-measure soil after 2 weeks to confirm improvement'}</li>
        </ol>
        <p class="estimated-time">⏱️ ${lang === 'ar' ? 'الوقت المتوقع للتحسن: 14-21 يوم' : 'Expected improvement time: 14-21 days'}</p>
      </div>
    `;
    
    fertilizerSection.innerHTML = fertilizerHtml;
    compatibility.appendChild(fertilizerSection);
  } else {
    // Show tips for maintaining good soil
    const maintainSection = document.createElement("div");
    maintainSection.className = "maintain-tips";
    maintainSection.innerHTML = `
      <h4>${lang === 'ar' ? '✨ نصائح للحفاظ على جودة التربة:' : '✨ Tips to Maintain Soil Quality:'}</h4>
      <ul>
        <li>${lang === 'ar' ? 'استمر في الري المنتظم حسب احتياجات النبات' : 'Continue regular watering according to plant needs'}</li>
        <li>${lang === 'ar' ? 'أضف السماد العضوي كل 3-4 أشهر' : 'Add organic compost every 3-4 months'}</li>
        <li>${lang === 'ar' ? 'راقب مستوى العناصر الغذائية بشكل دوري' : 'Monitor nutrient levels periodically'}</li>
        <li>${lang === 'ar' ? 'حافظ على تهوية التربة بالتقليب الخفيف' : 'Maintain soil aeration with light tilling'}</li>
      </ul>
    `;
    compatibility.appendChild(maintainSection);
  }

  // Show quick tips
  if (result.tips.length > 0) {
    const tipsSection = document.createElement("div");
    tipsSection.className = "quick-tips-section";
    tipsSection.innerHTML = `<h4>${lang === 'ar' ? '💡 نصائح إضافية:' : '💡 Additional Tips:'}</h4>`;
    
    result.tips.forEach((tip) => {
      const tipEl = document.createElement("div");
      tipEl.className = "tip-item";
      tipEl.innerHTML = `<span class="tip-icon">💡</span> ${tip}`;
      tipsSection.appendChild(tipEl);
    });
    compatibility.appendChild(tipsSection);
  }
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
    // البحث عن قسم موجود وإزالته إن وجد
    let advancedSection = resultsContainer.querySelector('.ai-recommendations-section');
    if (advancedSection) {
      advancedSection.remove();
    }
    
    // إنشاء القسم الجديد وإضافته
    const div = document.createElement('div');
    div.innerHTML = advancedRecommendationsHtml;
    // التحقق من وجود العنصر قبل الإضافة
    if (div.firstElementChild) {
      resultsContainer.appendChild(div.firstElementChild);
    }
  }
}

/**
 * 🤖 عرض التوصيات الذكية للوضع التلقائي
 * Render AI recommendations for auto mode
 */
function renderAutoAIRecommendations(analysis, soilQuality, implementationPlan) {
  const lang = i18n.currentLang;
  
  // إنشاء قسم التوصيات الذكية للوضع التلقائي
  let autoAIHtml = `
    <div class="ai-recommendations-section auto-ai">
      <div class="ai-header">
        <h3>🤖 ${lang === 'ar' ? 'تحليل التربة بالذكاء الاصطناعي' : 'AI Soil Analysis'}</h3>
        <span class="urgency-badge urgency-${analysis.urgencyLevel}">
          ${lang === 'ar' ? 
            (analysis.urgencyLevel === 'critical' ? '🔴 حالة حرجة' : 
             analysis.urgencyLevel === 'high' ? '🟠 يحتاج اهتمام' :
             analysis.urgencyLevel === 'medium' ? '🟡 جيد' : '🟢 ممتاز') :
            (analysis.urgencyLevel === 'critical' ? '🔴 Critical' : 
             analysis.urgencyLevel === 'high' ? '🟠 Needs Attention' :
             analysis.urgencyLevel === 'medium' ? '🟡 Good' : '🟢 Excellent')}
        </span>
      </div>

      <!-- تقييم جودة التربة -->
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
          <h4>${lang === 'ar' ? '⚠️ نقاط تحتاج تحسين:' : '⚠️ Areas for Improvement:'}</h4>
          <div class="deficiencies-list">
            ${analysis.deficiencies.map(def => `
              <div class="deficiency-item">
                <div class="deficiency-header">
                  <span class="deficiency-element">
                    ${def.element === 'nitrogen' ? (lang === 'ar' ? '🌱 النيتروجين' : '🌱 Nitrogen') : 
                      def.element === 'phosphorus' ? (lang === 'ar' ? '🌻 الفسفور' : '🌻 Phosphorus') : 
                      (lang === 'ar' ? '💪 البوتاسيوم' : '💪 Potassium')}
                  </span>
                  <span class="deficiency-level">
                    ${lang === 'ar' ? 'النقص:' : 'Deficit:'} 
                    <strong>${def.deficit.toFixed(1)}</strong>
                  </span>
                </div>
                <p class="deficiency-impact">${def.impact}</p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : `
        <div class="deficiencies-section good-status">
          <p>✅ ${lang === 'ar' ? 'التربة متوازنة جيداً!' : 'Soil is well balanced!'}</p>
        </div>
      `}

      <!-- توصيات AI للتحسين -->
      ${analysis.recommendations.length > 0 ? `
        <div class="specific-recommendations">
          <h4>${lang === 'ar' ? '💡 توصيات AI لتحسين التربة:' : '💡 AI Recommendations for Soil Improvement:'}</h4>
          ${analysis.recommendations.map((rec, idx) => `
            <div class="recommendation-card compact">
              <div class="rec-header">
                <h5>
                  ${rec.element === 'nitrogen' ? (lang === 'ar' ? '🌱 تعزيز النيتروجين' : '🌱 Boost Nitrogen') : 
                    rec.element === 'phosphorus' ? (lang === 'ar' ? '🌻 زيادة الفسفور' : '🌻 Increase Phosphorus') : 
                    (lang === 'ar' ? '💪 تقوية البوتاسيوم' : '💪 Boost Potassium')}
                </h5>
                <span class="cost-badge cost-${rec.costLevel}">
                  ${lang === 'ar' ? 
                    (rec.costLevel === 'high' ? '💰 تكلفة عالية' : rec.costLevel === 'medium' ? '💰 تكلفة متوسطة' : '💰 تكلفة منخفضة') :
                    (rec.costLevel === 'high' ? '💰 High Cost' : rec.costLevel === 'medium' ? '💰 Medium Cost' : '💰 Low Cost')}
                </span>
              </div>
              
              <!-- أفضل مادة موصى بها -->
              ${rec.materials.length > 0 ? `
                <div class="top-material">
                  <strong>${lang === 'ar' ? '⭐ أفضل خيار:' : '⭐ Best Option:'}</strong>
                  <span class="material-name">${lang === 'ar' ? rec.materials[0].nameAr : rec.materials[0].nameEn}</span>
                  <span class="material-amount">(${Math.round(rec.materials[0].recommendedGrams)} ${lang === 'ar' ? 'جرام' : 'grams'})</span>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- ملخص خطة التنفيذ -->
      <div class="implementation-summary">
        <div class="summary-item">
          <span class="summary-icon">⏱️</span>
          <span class="summary-label">${lang === 'ar' ? 'الوقت المتوقع:' : 'Expected Time:'}</span>
          <span class="summary-value">${implementationPlan.totalDays} ${lang === 'ar' ? 'يوم' : 'days'}</span>
        </div>
        <div class="summary-item">
          <span class="summary-icon">💰</span>
          <span class="summary-label">${lang === 'ar' ? 'التكلفة:' : 'Cost:'}</span>
          <span class="summary-value">${implementationPlan.estimatedCost}</span>
        </div>
      </div>
    </div>
  `;

  // إضافة قسم AI للوضع التلقائي
  const autoContainer = document.getElementById("autoResultContainer");
  if (autoContainer) {
    // البحث عن قسم موجود وإزالته إن وجد
    let autoAISection = autoContainer.querySelector('.ai-recommendations-section');
    if (autoAISection) {
      autoAISection.remove();
    }
    
    // إنشاء القسم الجديد
    const div = document.createElement('div');
    div.innerHTML = autoAIHtml;
    // التحقق من وجود العنصر قبل الإضافة
    if (div.firstElementChild) {
      // إضافة قبل قائمة النباتات
      const suitableList = autoContainer.querySelector('#suitableList');
      if (suitableList && suitableList.parentNode) {
        suitableList.parentNode.insertBefore(div.firstElementChild, suitableList);
      } else {
        autoContainer.appendChild(div.firstElementChild);
      }
    }
  }
}
