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

// بيانات النباتات الأساسية مع ترجمات لـ 10 لغات
const basePlantsData = [
  { nameAr: "الطماطم", nameEn: "Tomato", nameFr: "Tomate", nameEs: "Tomate", nameDe: "Tomate", nameTr: "Domates", nameUr: "ٹماٹر", nameHi: "टमाटर", namePt: "Tomate", nameZh: "番茄", icon: "🍅", category: "vegetables" },
  { nameAr: "البطاطس", nameEn: "Potato", nameFr: "Pomme de terre", nameEs: "Patata", nameDe: "Kartoffel", nameTr: "Patates", nameUr: "آلو", nameHi: "आलू", namePt: "Batata", nameZh: "土豆", icon: "🥔", category: "vegetables" },
  { nameAr: "القمح", nameEn: "Wheat", nameFr: "Blé", nameEs: "Trigo", nameDe: "Weizen", nameTr: "Buğday", nameUr: "گندم", nameHi: "गेहूं", namePt: "Trigo", nameZh: "小麦", icon: "🌾", category: "grains" },
  { nameAr: "الفاصوليا", nameEn: "Beans", nameFr: "Haricots", nameEs: "Judías", nameDe: "Bohnen", nameTr: "Fasulye", nameUr: "پھلیاں", nameHi: "सेम", namePt: "Feijão", nameZh: "豆子", icon: "🫘", category: "legumes" },
  { nameAr: "الجزر", nameEn: "Carrot", nameFr: "Carotte", nameEs: "Zanahoria", nameDe: "Karotte", nameTr: "Havuç", nameUr: "گاجر", nameHi: "गाजर", namePt: "Cenoura", nameZh: "胡萝卜", icon: "🥕", category: "vegetables" },
  { nameAr: "الخس", nameEn: "Lettuce", nameFr: "Laitue", nameEs: "Lechuga", nameDe: "Salat", nameTr: "Marul", nameUr: "سلاد پتی", nameHi: "सलाद", namePt: "Alface", nameZh: "生菜", icon: "🥬", category: "vegetables" },
  { nameAr: "الفلفل الحار", nameEn: "Chili Pepper", nameFr: "Piment", nameEs: "Chile", nameDe: "Chilischote", nameTr: "Acı Biber", nameUr: "مرچ", nameHi: "मिर्च", namePt: "Pimenta", nameZh: "辣椒", icon: "🌶️", category: "vegetables" },
  { nameAr: "السبانخ", nameEn: "Spinach", nameFr: "Épinards", nameEs: "Espinacas", nameDe: "Spinat", nameTr: "Ispanak", nameUr: "پالک", nameHi: "पालक", namePt: "Espinafre", nameZh: "菠菜", icon: "🌿", category: "vegetables" },
  { nameAr: "البصل", nameEn: "Onion", nameFr: "Oignon", nameEs: "Cebolla", nameDe: "Zwiebel", nameTr: "Soğan", nameUr: "پیاز", nameHi: "प्याज", namePt: "Cebola", nameZh: "洋葱", icon: "🧅", category: "vegetables" },
  { nameAr: "الخيار", nameEn: "Cucumber", nameFr: "Concombre", nameEs: "Pepino", nameDe: "Gurke", nameTr: "Salatalık", nameUr: "کھیرا", nameHi: "खीरा", namePt: "Pepino", nameZh: "黄瓜", icon: "🥒", category: "vegetables" },
  { nameAr: "الذرة", nameEn: "Corn", nameFr: "Maïs", nameEs: "Maíz", nameDe: "Mais", nameTr: "Mısır", nameUr: "مکئی", nameHi: "मक्का", namePt: "Milho", nameZh: "玉米", icon: "🌽", category: "grains" },
  { nameAr: "الفراولة", nameEn: "Strawberry", nameFr: "Fraise", nameEs: "Fresa", nameDe: "Erdbeere", nameTr: "Çilek", nameUr: "سٹرابیری", nameHi: "स्ट्रॉबेरी", namePt: "Morango", nameZh: "草莓", icon: "🍓", category: "fruits" },
  { nameAr: "التفاح", nameEn: "Apple", nameFr: "Pomme", nameEs: "Manzana", nameDe: "Apfel", nameTr: "Elma", nameUr: "سیب", nameHi: "सेब", namePt: "Maçã", nameZh: "苹果", icon: "🍎", category: "fruits" },
  { nameAr: "البرتقال", nameEn: "Orange", nameFr: "Orange", nameEs: "Naranja", nameDe: "Orange", nameTr: "Portakal", nameUr: "مالٹا", nameHi: "संतरा", namePt: "Laranja", nameZh: "橙子", icon: "🍊", category: "fruits" },
  { nameAr: "الليمون", nameEn: "Lemon", nameFr: "Citron", nameEs: "Limón", nameDe: "Zitrone", nameTr: "Limon", nameUr: "لیموں", nameHi: "नींबू", namePt: "Limão", nameZh: "柠檬", icon: "🍋", category: "fruits" },
  { nameAr: "الموز", nameEn: "Banana", nameFr: "Banane", nameEs: "Plátano", nameDe: "Banane", nameTr: "Muz", nameUr: "کیلا", nameHi: "केला", namePt: "Banana", nameZh: "香蕉", icon: "🍌", category: "fruits" },
  { nameAr: "العنب", nameEn: "Grape", nameFr: "Raisin", nameEs: "Uva", nameDe: "Traube", nameTr: "Üzüm", nameUr: "انگور", nameHi: "अंगूर", namePt: "Uva", nameZh: "葡萄", icon: "🍇", category: "fruits" },
  { nameAr: "الشمام", nameEn: "Melon", nameFr: "Melon", nameEs: "Melón", nameDe: "Melone", nameTr: "Kavun", nameUr: "خربوزہ", nameHi: "खरबूजा", namePt: "Melão", nameZh: "甜瓜", icon: "🍈", category: "fruits" },
  { nameAr: "الكيوي", nameEn: "Kiwi", nameFr: "Kiwi", nameEs: "Kiwi", nameDe: "Kiwi", nameTr: "Kivi", nameUr: "کیوی", nameHi: "कीवी", namePt: "Kiwi", nameZh: "猕猴桃", icon: "🥝", category: "fruits" },
  { nameAr: "الكرنب", nameEn: "Cabbage", nameFr: "Chou", nameEs: "Repollo", nameDe: "Kohl", nameTr: "Lahana", nameUr: "بند گوبھی", nameHi: "पत्ता गोभी", namePt: "Repolho", nameZh: "卷心菜", icon: "🥬", category: "vegetables" },
  { nameAr: "البروكلي", nameEn: "Broccoli", nameFr: "Brocoli", nameEs: "Brócoli", nameDe: "Brokkoli", nameTr: "Brokoli", nameUr: "بروکولی", nameHi: "ब्रोकोली", namePt: "Brócolis", nameZh: "西兰花", icon: "🥦", category: "vegetables" },
  { nameAr: "الملفوف", nameEn: "Cauliflower", nameFr: "Chou-fleur", nameEs: "Coliflor", nameDe: "Blumenkohl", nameTr: "Karnabahar", nameUr: "پھول گوبھی", nameHi: "फूलगोभी", namePt: "Couve-flor", nameZh: "花椰菜", icon: "🌸", category: "vegetables" },
  { nameAr: "اللفت", nameEn: "Turnip", nameFr: "Navet", nameEs: "Nabo", nameDe: "Rübe", nameTr: "Şalgam", nameUr: "شلجم", nameHi: "शलगम", namePt: "Nabo", nameZh: "萝卜", icon: "🌾", category: "vegetables" },
  { nameAr: "الجنجل", nameEn: "Parsnip", nameFr: "Panais", nameEs: "Chirivía", nameDe: "Pastinake", nameTr: "Yabani havuç", nameUr: "شقاقل", nameHi: "शकरकंद", namePt: "Pastinaga", nameZh: "欧防风", icon: "🥕", category: "vegetables" },
  { nameAr: "الفجل", nameEn: "Radish", nameFr: "Radis", nameEs: "Rábano", nameDe: "Rettich", nameTr: "Turp", nameUr: "مولی", nameHi: "मूली", namePt: "Rabanete", nameZh: "萝卜", icon: "🔴", category: "vegetables" },
  { nameAr: "الثوم", nameEn: "Garlic", nameFr: "Ail", nameEs: "Ajo", nameDe: "Knoblauch", nameTr: "Sarımsak", nameUr: "لہسن", nameHi: "लहसुन", namePt: "Alho", nameZh: "大蒜", icon: "🧄", category: "vegetables" },
  { nameAr: "الكراث", nameEn: "Leek", nameFr: "Poireau", nameEs: "Puerro", nameDe: "Lauch", nameTr: "Pırasa", nameUr: "لیک", nameHi: "लीक", namePt: "Alho-poró", nameZh: "韭葱", icon: "🌱", category: "vegetables" },
  { nameAr: "البازلاء", nameEn: "Peas", nameFr: "Petits pois", nameEs: "Guisantes", nameDe: "Erbsen", nameTr: "Bezelye", nameUr: "مٹر", nameHi: "मटर", namePt: "Ervilhas", nameZh: "豌豆", icon: "💚", category: "legumes" },
  { nameAr: "العدس", nameEn: "Lentils", nameFr: "Lentilles", nameEs: "Lentejas", nameDe: "Linsen", nameTr: "Mercimek", nameUr: "دال", nameHi: "दाल", namePt: "Lentilhas", nameZh: "扁豆", icon: "🟤", category: "legumes" },
  { nameAr: "الحمص", nameEn: "Chickpeas", nameFr: "Pois chiches", nameEs: "Garbanzos", nameDe: "Kichererbsen", nameTr: "Nohut", nameUr: "چنے", nameHi: "छोले", namePt: "Grão-de-bico", nameZh: "鹰嘴豆", icon: "🟡", category: "legumes" },
  { nameAr: "الشوفان", nameEn: "Oats", nameFr: "Avoine", nameEs: "Avena", nameDe: "Hafer", nameTr: "Yulaf", nameUr: "جئی", nameHi: "जई", namePt: "Aveia", nameZh: "燕麦", icon: "🌾", category: "grains" },
  { nameAr: "الشعير", nameEn: "Barley", nameFr: "Orge", nameEs: "Cebada", nameDe: "Gerste", nameTr: "Arpa", nameUr: "جو", nameHi: "जौ", namePt: "Cevada", nameZh: "大麦", icon: "🌾", category: "grains" },
  { nameAr: "الأرز", nameEn: "Rice", nameFr: "Riz", nameEs: "Arroz", nameDe: "Reis", nameTr: "Pirinç", nameUr: "چاول", nameHi: "चावल", namePt: "Arroz", nameZh: "大米", icon: "🍚", category: "grains" },
  { nameAr: "الذرة الحلوة", nameEn: "Sweet Corn", nameFr: "Maïs doux", nameEs: "Maíz dulce", nameDe: "Süßmais", nameTr: "Tatlı mısır", nameUr: "میٹھی مکئی", nameHi: "मीठी मक्का", namePt: "Milho doce", nameZh: "甜玉米", icon: "🌽", category: "vegetables" },
  { nameAr: "الكوسا", nameEn: "Zucchini", nameFr: "Courgette", nameEs: "Calabacín", nameDe: "Zucchini", nameTr: "Kabak", nameUr: "کدو", nameHi: "तुरई", namePt: "Abobrinha", nameZh: "西葫芦", icon: "🟢", category: "vegetables" },
  { nameAr: "الباذنجان", nameEn: "Eggplant", nameFr: "Aubergine", nameEs: "Berenjena", nameDe: "Aubergine", nameTr: "Patlıcan", nameUr: "بینگن", nameHi: "बैंगन", namePt: "Berinjela", nameZh: "茄子", icon: "🍆", category: "vegetables" },
  { nameAr: "الفلفل الحلو", nameEn: "Bell Pepper", nameFr: "Poivron", nameEs: "Pimiento", nameDe: "Paprika", nameTr: "Dolma biber", nameUr: "شملہ مرچ", nameHi: "शिमला मिर्च", namePt: "Pimentão", nameZh: "甜椒", icon: "🔴", category: "vegetables" },
  { nameAr: "البندورة الكرزية", nameEn: "Cherry Tomato", nameFr: "Tomate cerise", nameEs: "Tomate cherry", nameDe: "Kirschtomate", nameTr: "Kiraz domates", nameUr: "چیری ٹماٹر", nameHi: "चेरी टमाटर", namePt: "Tomate cereja", nameZh: "樱桃番茄", icon: "🍅", category: "vegetables" },
  { nameAr: "الشمر", nameEn: "Fennel", nameFr: "Fenouil", nameEs: "Hinojo", nameDe: "Fenchel", nameTr: "Rezene", nameUr: "سونف", nameHi: "सौंफ", namePt: "Funcho", nameZh: "茴香", icon: "🌿", category: "vegetables" },
  { nameAr: "الشبت", nameEn: "Dill", nameFr: "Aneth", nameEs: "Eneldo", nameDe: "Dill", nameTr: "Dereotu", nameUr: "سویا", nameHi: "सोया", namePt: "Endro", nameZh: "莳萝", icon: "🌿", category: "herbs" },
  { nameAr: "البقدونس", nameEn: "Parsley", nameFr: "Persil", nameEs: "Perejil", nameDe: "Petersilie", nameTr: "Maydanoz", nameUr: "اجمود", nameHi: "अजमोद", namePt: "Salsa", nameZh: "欧芹", icon: "🌿", category: "herbs" },
  { nameAr: "الريحان", nameEn: "Basil", nameFr: "Basilic", nameEs: "Albahaca", nameDe: "Basilikum", nameTr: "Fesleğen", nameUr: "تلسی", nameHi: "तुलसी", namePt: "Manjericão", nameZh: "罗勒", icon: "🌿", category: "herbs" },
  { nameAr: "الزعتر", nameEn: "Thyme", nameFr: "Thym", nameEs: "Tomillo", nameDe: "Thymian", nameTr: "Kekik", nameUr: "آجوائن", nameHi: "अजवायन", namePt: "Tomilho", nameZh: "百里香", icon: "🌿", category: "herbs" },
  { nameAr: "الروزماري", nameEn: "Rosemary", nameFr: "Romarin", nameEs: "Romero", nameDe: "Rosmarin", nameTr: "Biberiye", nameUr: "روزمیری", nameHi: "रोजमैरी", namePt: "Alecrim", nameZh: "迷迭香", icon: "🌿", category: "herbs" },
  { nameAr: "النعناع", nameEn: "Mint", nameFr: "Menthe", nameEs: "Menta", nameDe: "Minze", nameTr: "Nane", nameUr: "پودینہ", nameHi: "पुदीना", namePt: "Hortelã", nameZh: "薄荷", icon: "🌿", category: "herbs" },
  { nameAr: "الزنجبيل", nameEn: "Ginger", nameFr: "Gingembre", nameEs: "Jengibre", nameDe: "Ingwer", nameTr: "Zencefil", nameUr: "ادرک", nameHi: "अदरक", namePt: "Gengibre", nameZh: "生姜", icon: "🟤", category: "vegetables" },
  { nameAr: "الكركم", nameEn: "Turmeric", nameFr: "Curcuma", nameEs: "Cúrcuma", nameDe: "Kurkuma", nameTr: "Zerdeçal", nameUr: "ہلدی", nameHi: "हल्दी", namePt: "Cúrcuma", nameZh: "姜黄", icon: "🟠", category: "vegetables" },
  { nameAr: "الفلفل الأسود", nameEn: "Black Pepper", nameFr: "Poivre noir", nameEs: "Pimienta negra", nameDe: "Schwarzer Pfeffer", nameTr: "Karabiber", nameUr: "کالی مرچ", nameHi: "काली मिर्च", namePt: "Pimenta preta", nameZh: "黑胡椒", icon: "⚫", category: "spices" },
];

// دالة لإنشاء 2000+ نبات ديناميكياً بدون تكرار
function generateLargePlantsDatabase() {
  plants = [];
  const icons = ["🍅", "🥔", "🌾", "🫘", "🥕", "🥬", "🌶️", "🌿", "🧅", "🥒", "🌽", "🍓", "🍎", "🍊", "🍋", "🍌", "🍇"];
  let id = 1;
  
  // إضافة النباتات الأساسية أولاً - مع جميع الترجمات
  basePlantsData.forEach((base, index) => {
    plants.push(createPlantObjectMultilingual(id++, base, null));
  });
  
  // إضافة نباتات مشتقة بإضافة أصناف مختلفة (بدون تكرار) - مع ترجمات لـ 10 لغات
  const varieties = [
    { ar: " (صنف محسّن)", en: " (Improved Variety)", fr: " (Variété améliorée)", es: " (Variedad mejorada)", de: " (Verbesserte Sorte)", tr: " (Geliştirilmiş Çeşit)", ur: " (بہتر قسم)", hi: " (उन्नत किस्म)", pt: " (Variedade melhorada)", zh: " (改良品种)" },
    { ar: " (عضوي)", en: " (Organic)", fr: " (Bio)", es: " (Orgánico)", de: " (Bio)", tr: " (Organik)", ur: " (نامیاتی)", hi: " (जैविक)", pt: " (Orgânico)", zh: " (有机)" },
    { ar: " (هجين)", en: " (Hybrid)", fr: " (Hybride)", es: " (Híbrido)", de: " (Hybrid)", tr: " (Hibrit)", ur: " (ہائبرڈ)", hi: " (संकर)", pt: " (Híbrido)", zh: " (杂交)" },
    { ar: " (مبكر النضج)", en: " (Early Maturity)", fr: " (Maturité précoce)", es: " (Madurez temprana)", de: " (Frühe Reife)", tr: " (Erken Olgunluk)", ur: " (جلد پکنے والا)", hi: " (जल्दी पकने वाला)", pt: " (Maturação precoce)", zh: " (早熟)" },
    { ar: " (متأخر النضج)", en: " (Late Maturity)", fr: " (Maturité tardive)", es: " (Madurez tardía)", de: " (Späte Reife)", tr: " (Geç Olgunluk)", ur: " (دیر سے پکنے والا)", hi: " (देर से पकने वाला)", pt: " (Maturação tardia)", zh: " (晚熟)" },
    { ar: " (قزم)", en: " (Dwarf)", fr: " (Nain)", es: " (Enano)", de: " (Zwerg)", tr: " (Cüce)", ur: " (بونا)", hi: " (बौना)", pt: " (Anão)", zh: " (矮生)" },
    { ar: " (طويل الساق)", en: " (Tall)", fr: " (Grand)", es: " (Alto)", de: " (Groß)", tr: " (Uzun)", ur: " (لمبا)", hi: " (लंबा)", pt: " (Alto)", zh: " (高杆)" },
    { ar: " (مقاوم للجفاف)", en: " (Drought Resistant)", fr: " (Résistant à la sécheresse)", es: " (Resistente a la sequía)", de: " (Trockenheitsresistent)", tr: " (Kuraklığa Dayanıklı)", ur: " (خشک سالی مزاحم)", hi: " (सूखा प्रतिरोधी)", pt: " (Resistente à seca)", zh: " (抗旱)" },
    { ar: " (مقاوم للأمراض)", en: " (Disease Resistant)", fr: " (Résistant aux maladies)", es: " (Resistente a enfermedades)", de: " (Krankheitsresistent)", tr: " (Hastalığa Dayanıklı)", ur: " (بیماری مزاحم)", hi: " (रोग प्रतिरोधी)", pt: " (Resistente a doenças)", zh: " (抗病)" },
    { ar: " (محسّن الجودة)", en: " (Quality Enhanced)", fr: " (Qualité améliorée)", es: " (Calidad mejorada)", de: " (Qualitätsverbessert)", tr: " (Kalite Artırılmış)", ur: " (معیار میں بہتری)", hi: " (गुणवत्ता में सुधार)", pt: " (Qualidade aprimorada)", zh: " (品质改良)" },
    { ar: " (عالي الإنتاج)", en: " (High Yield)", fr: " (Rendement élevé)", es: " (Alto rendimiento)", de: " (Hoher Ertrag)", tr: " (Yüksek Verimli)", ur: " (زیادہ پیداوار)", hi: " (उच्च उपज)", pt: " (Alto rendimento)", zh: " (高产)" },
    { ar: " (محسّن النكهة)", en: " (Flavor Enhanced)", fr: " (Saveur améliorée)", es: " (Sabor mejorado)", de: " (Geschmackverbessert)", tr: " (Lezzet Artırılmış)", ur: " (ذائقہ بہتر)", hi: " (स्वाद में सुधार)", pt: " (Sabor aprimorado)", zh: " (风味改良)" },
    { ar: " (مبكر جداً)", en: " (Very Early)", fr: " (Très précoce)", es: " (Muy temprano)", de: " (Sehr früh)", tr: " (Çok Erken)", ur: " (بہت جلد)", hi: " (बहुत जल्दी)", pt: " (Muito precoce)", zh: " (特早)" },
    { ar: " (متوسط المدة)", en: " (Mid Season)", fr: " (Mi-saison)", es: " (Media temporada)", de: " (Mitte Saison)", tr: " (Orta Sezon)", ur: " (درمیانی موسم)", hi: " (मध्य मौसम)", pt: " (Meia estação)", zh: " (中季)" },
    { ar: " (محسّن اللون)", en: " (Color Enhanced)", fr: " (Couleur améliorée)", es: " (Color mejorado)", de: " (Farbverbessert)", tr: " (Renk Artırılmış)", ur: " (رنگ بہتر)", hi: " (रंग में सुधार)", pt: " (Cor aprimorada)", zh: " (色泽改良)" },
    { ar: " (مقاوم للحشرات)", en: " (Pest Resistant)", fr: " (Résistant aux insectes)", es: " (Resistente a plagas)", de: " (Schädlingsresistent)", tr: " (Zararlılara Dayanıklı)", ur: " (کیڑوں مزاحم)", hi: " (कीट प्रतिरोधी)", pt: " (Resistente a pragas)", zh: " (抗虫)" },
    { ar: " (صنف ممتاز)", en: " (Premium)", fr: " (Premium)", es: " (Premium)", de: " (Premium)", tr: " (Premium)", ur: " (پریمیم)", hi: " (प्रीमियम)", pt: " (Premium)", zh: " (优质)" },
    { ar: " (مقاوم للبرودة)", en: " (Cold Resistant)", fr: " (Résistant au froid)", es: " (Resistente al frío)", de: " (Kälteresistent)", tr: " (Soğuğa Dayanıklı)", ur: " (سردی مزاحم)", hi: " (ठंड प्रतिरोधी)", pt: " (Resistente ao frio)", zh: " (耐寒)" },
    { ar: " (مقاوم للحرارة)", en: " (Heat Tolerant)", fr: " (Tolérant à la chaleur)", es: " (Tolerante al calor)", de: " (Hitzetolerant)", tr: " (Sıcağa Dayanıklı)", ur: " (گرمی مزاحم)", hi: " (गर्मी सहनशील)", pt: " (Tolerante ao calor)", zh: " (耐热)" },
    { ar: " (صنف استوائي)", en: " (Tropical)", fr: " (Tropical)", es: " (Tropical)", de: " (Tropisch)", tr: " (Tropikal)", ur: " (اشنکٹبندیی)", hi: " (उष्णकटिबंधीय)", pt: " (Tropical)", zh: " (热带)" },
  ];
  
  // توليد 2000+ نبات بدون تكرار
  const usedCombinations = new Set();
  
  // استراتيجية 1: مزج الأصناف مع النباتات الأساسية
  basePlantsData.forEach((base) => {
    varieties.forEach((variety) => {
      if (plants.length >= TARGET_PLANT_COUNT) return;
      
      const combination = `${base.nameAr}|${variety.ar}`;
      if (!usedCombinations.has(combination)) {
        usedCombinations.add(combination);
        
        const plantObj = createPlantObjectMultilingual(id++, base, variety);
        plants.push(plantObj);
      }
    });
  });
  
  // استراتيجية 2: إضافة نباتات إضافية حقيقية إذا لزم الأمر - مع جميع الترجمات
  const additionalPlants = [
    // الخضروات
    { nameAr: "اليقطين", nameEn: "Pumpkin", nameFr: "Citrouille", nameEs: "Calabaza", nameDe: "Kürbis", nameTr: "Balkabağı", nameUr: "کدو", nameHi: "कद्दू", namePt: "Abóbora", nameZh: "南瓜", icon: "🎃", category: "vegetables" },
    { nameAr: "القرع", nameEn: "Squash", nameFr: "Courge", nameEs: "Calabacín", nameDe: "Kürbis", nameTr: "Kabak", nameUr: "کدو", nameHi: "पेठा", namePt: "Abóbora", nameZh: "南瓜", icon: "🟨", category: "vegetables" },
    { nameAr: "البطاطا الحلوة", nameEn: "Sweet Potato", nameFr: "Patate douce", nameEs: "Batata", nameDe: "Süßkartoffel", nameTr: "Tatlı patates", nameUr: "شکرقندی", nameHi: "शकरकंद", namePt: "Batata-doce", nameZh: "红薯", icon: "🍠", category: "vegetables" },
    { nameAr: "الكرفس", nameEn: "Celery", nameFr: "Céleri", nameEs: "Apio", nameDe: "Sellerie", nameTr: "Kereviz", nameUr: "اجوائن", nameHi: "अजवाइन", namePt: "Aipo", nameZh: "芹菜", icon: "🥬", category: "vegetables" },
    { nameAr: "الخرشوف", nameEn: "Artichoke", nameFr: "Artichaut", nameEs: "Alcachofa", nameDe: "Artischocke", nameTr: "Enginar", nameUr: "ہاتھی چک", nameHi: "आटिचोक", namePt: "Alcachofra", nameZh: "洋蓟", icon: "🌿", category: "vegetables" },
    { nameAr: "الهليون", nameEn: "Asparagus", nameFr: "Asperge", nameEs: "Espárrago", nameDe: "Spargel", nameTr: "Kuşkonmaz", nameUr: "اسپیراگس", nameHi: "शतावरी", namePt: "Aspargo", nameZh: "芦笋", icon: "🌱", category: "vegetables" },
    { nameAr: "البامية", nameEn: "Okra", nameFr: "Gombo", nameEs: "Okra", nameDe: "Okra", nameTr: "Bamya", nameUr: "بھنڈی", nameHi: "भिंडी", namePt: "Quiabo", nameZh: "秋葵", icon: "🟢", category: "vegetables" },
    { nameAr: "السلق", nameEn: "Swiss Chard", nameFr: "Blette", nameEs: "Acelga", nameDe: "Mangold", nameTr: "Pazı", nameUr: "چکندر کا ساگ", nameHi: "चुकंदर का साग", namePt: "Acelga", nameZh: "瑞士甜菜", icon: "🥬", category: "vegetables" },
    
    // الفواكه
    { nameAr: "التمر", nameEn: "Date", nameFr: "Datte", nameEs: "Dátil", nameDe: "Dattel", nameTr: "Hurma", nameUr: "کھجور", nameHi: "खजूर", namePt: "Tâmara", nameZh: "枣", icon: "🔗", category: "fruits" },
    { nameAr: "الرمان", nameEn: "Pomegranate", nameFr: "Grenade", nameEs: "Granada", nameDe: "Granatapfel", nameTr: "Nar", nameUr: "انار", nameHi: "अनार", namePt: "Romã", nameZh: "石榴", icon: "🥭", category: "fruits" },
    { nameAr: "الجوافة", nameEn: "Guava", nameFr: "Goyave", nameEs: "Guayaba", nameDe: "Guave", nameTr: "Guava", nameUr: "امرود", nameHi: "अमरूद", namePt: "Goiaba", nameZh: "番石榴", icon: "🥝", category: "fruits" },
    { nameAr: "الأفوكادو", nameEn: "Avocado", nameFr: "Avocat", nameEs: "Aguacate", nameDe: "Avocado", nameTr: "Avokado", nameUr: "ایوکاڈو", nameHi: "एवोकाडो", namePt: "Abacate", nameZh: "牛油果", icon: "🥑", category: "fruits" },
    { nameAr: "الكرز", nameEn: "Cherry", nameFr: "Cerise", nameEs: "Cereza", nameDe: "Kirsche", nameTr: "Kiraz", nameUr: "چیری", nameHi: "चेरी", namePt: "Cereja", nameZh: "樱桃", icon: "🍒", category: "fruits" },
    { nameAr: "الخوخ", nameEn: "Peach", nameFr: "Pêche", nameEs: "Melocotón", nameDe: "Pfirsich", nameTr: "Şeftali", nameUr: "آڑو", nameHi: "आड़ू", namePt: "Pêssego", nameZh: "桃子", icon: "🍑", category: "fruits" },
    { nameAr: "المشمش", nameEn: "Apricot", nameFr: "Abricot", nameEs: "Albaricoque", nameDe: "Aprikose", nameTr: "Kayısı", nameUr: "خوبانی", nameHi: "खुबानी", namePt: "Damasco", nameZh: "杏", icon: "🍑", category: "fruits" },
    { nameAr: "الكمثرى", nameEn: "Pear", nameFr: "Poire", nameEs: "Pera", nameDe: "Birne", nameTr: "Armut", nameUr: "ناشپاتی", nameHi: "नाशपाती", namePt: "Pêra", nameZh: "梨", icon: "🍐", category: "fruits" },
    { nameAr: "التين", nameEn: "Fig", nameFr: "Figue", nameEs: "Higo", nameDe: "Feige", nameTr: "İncir", nameUr: "انجیر", nameHi: "अंजीर", namePt: "Figo", nameZh: "无花果", icon: "🟣", category: "fruits" },
    
    // الحبوب
    { nameAr: "الكينوا", nameEn: "Quinoa", nameFr: "Quinoa", nameEs: "Quinoa", nameDe: "Quinoa", nameTr: "Kinoa", nameUr: "کوینوا", nameHi: "क्विनोआ", namePt: "Quinoa", nameZh: "藜麦", icon: "🌾", category: "grains" },
    { nameAr: "الأرز البني", nameEn: "Brown Rice", nameFr: "Riz brun", nameEs: "Arroz integral", nameDe: "Brauner Reis", nameTr: "Esmer pirinç", nameUr: "بھورے چاول", nameHi: "ब्राउन राइस", namePt: "Arroz integral", nameZh: "糙米", icon: "🍚", category: "grains" },
    
    // البقوليات
    { nameAr: "العدس الأحمر", nameEn: "Red Lentils", nameFr: "Lentilles rouges", nameEs: "Lentejas rojas", nameDe: "Rote Linsen", nameTr: "Kırmızı mercimek", nameUr: "لال دال", nameHi: "लाल मसूर", namePt: "Lentilhas vermelhas", nameZh: "红扁豆", icon: "🟤", category: "legumes" },
    { nameAr: "الفول السوداني", nameEn: "Peanut", nameFr: "Cacahuète", nameEs: "Cacahuete", nameDe: "Erdnuss", nameTr: "Fıstık", nameUr: "مونگ پھلی", nameHi: "मूंगफली", namePt: "Amendoim", nameZh: "花生", icon: "🥜", category: "legumes" },
    { nameAr: "الفول المدمس", nameEn: "Fava Beans", nameFr: "Fèves", nameEs: "Habas", nameDe: "Saubohnen", nameTr: "Bakla", nameUr: "باقلہ", nameHi: "बाकला", namePt: "Favas", nameZh: "蚕豆", icon: "🫘", category: "legumes" },
    
    // الأعشاب
    { nameAr: "البابونج", nameEn: "Chamomile", nameFr: "Camomille", nameEs: "Manzanilla", nameDe: "Kamille", nameTr: "Papatya", nameUr: "بابونہ", nameHi: "कैमोमाइल", namePt: "Camomila", nameZh: "洋甘菊", icon: "🌼", category: "herbs" },
    { nameAr: "اللافندر", nameEn: "Lavender", nameFr: "Lavande", nameEs: "Lavanda", nameDe: "Lavendel", nameTr: "Lavanta", nameUr: "لیوینڈر", nameHi: "लैवेंडर", namePt: "Lavanda", nameZh: "薰衣草", icon: "💜", category: "herbs" },
    { nameAr: "المريمية", nameEn: "Sage", nameFr: "Sauge", nameEs: "Salvia", nameDe: "Salbei", nameTr: "Adaçayı", nameUr: "سالویا", nameHi: "सेज", namePt: "Sálvia", nameZh: "鼠尾草", icon: "🌿", category: "herbs" },
    { nameAr: "الكزبرة", nameEn: "Coriander", nameFr: "Coriandre", nameEs: "Cilantro", nameDe: "Koriander", nameTr: "Kişniş", nameUr: "دھنیا", nameHi: "धनिया", namePt: "Coentro", nameZh: "香菜", icon: "🌿", category: "herbs" },
    { nameAr: "الحلبة", nameEn: "Fenugreek", nameFr: "Fenugrec", nameEs: "Fenogreco", nameDe: "Bockshornklee", nameTr: "Çemen", nameUr: "میتھی", nameHi: "मेथी", namePt: "Feno-grego", nameZh: "胡芦巴", icon: "🌿", category: "herbs" },
    
    // التوابل
    { nameAr: "السمسم", nameEn: "Sesame", nameFr: "Sésame", nameEs: "Sésamo", nameDe: "Sesam", nameTr: "Susam", nameUr: "تل", nameHi: "तिल", namePt: "Gergelim", nameZh: "芝麻", icon: "🤎", category: "spices" },
    { nameAr: "الزعفران", nameEn: "Saffron", nameFr: "Safran", nameEs: "Azafrán", nameDe: "Safran", nameTr: "Safran", nameUr: "زعفران", nameHi: "केसर", namePt: "Açafrão", nameZh: "藏红花", icon: "🟡", category: "spices" },
    { nameAr: "الكمون", nameEn: "Cumin", nameFr: "Cumin", nameEs: "Comino", nameDe: "Kreuzkümmel", nameTr: "Kimyon", nameUr: "زیرہ", nameHi: "जीरा", namePt: "Cominho", nameZh: "孜然", icon: "🟤", category: "spices" },
    
    // الزهور
    { nameAr: "عباد الشمس", nameEn: "Sunflower", nameFr: "Tournesol", nameEs: "Girasol", nameDe: "Sonnenblume", nameTr: "Ayçiçeği", nameUr: "سورج مکھی", nameHi: "सूरजमुखी", namePt: "Girassol", nameZh: "向日葵", icon: "🌻", category: "flowers" },
    { nameAr: "الورد", nameEn: "Rose", nameFr: "Rose", nameEs: "Rosa", nameDe: "Rose", nameTr: "Gül", nameUr: "گلاب", nameHi: "गुलाब", namePt: "Rosa", nameZh: "玫瑰", icon: "🌹", category: "flowers" },
    { nameAr: "الياسمين", nameEn: "Jasmine", nameFr: "Jasmin", nameEs: "Jazmín", nameDe: "Jasmin", nameTr: "Yasemin", nameUr: "چمیلی", nameHi: "चमेली", namePt: "Jasmim", nameZh: "茉莉花", icon: "⚪", category: "flowers" },
    { nameAr: "التيوليب", nameEn: "Tulip", nameFr: "Tulipe", nameEs: "Tulipán", nameDe: "Tulpe", nameTr: "Lale", nameUr: "ٹیولپ", nameHi: "ट्यूलिप", namePt: "Tulipa", nameZh: "郁金香", icon: "🌷", category: "flowers" },
  ];
  
  // إضافة النباتات الإضافية
  additionalPlants.forEach((plant) => {
    if (plants.length >= TARGET_PLANT_COUNT) return;
    
    plants.push(createPlantObjectMultilingual(id++, plant, null));
    
    // إضافة أصناف للنباتات الإضافية
    varieties.forEach((variety) => {
      if (plants.length >= TARGET_PLANT_COUNT) return;
      
      plants.push(createPlantObjectMultilingual(id++, plant, variety));
    });
  });
  
  // استراتيجية 3: إضافة نباتات عشوائية متنوعة مع دعم متعدد اللغات
  const randomVariations = [
    { ar: " (مستورد)", en: " (Imported)", fr: " (Importé)", es: " (Importado)", de: " (Importiert)", tr: " (İthal)", ur: " (درآمدی)", hi: " (आयातित)", pt: " (Importado)", zh: " (进口)" },
    { ar: " (محلي)", en: " (Local)", fr: " (Local)", es: " (Local)", de: " (Lokal)", tr: " (Yerel)", ur: " (مقامی)", hi: " (स्थानीय)", pt: " (Local)", zh: " (本地)" },
    { ar: " (بري)", en: " (Wild)", fr: " (Sauvage)", es: " (Silvestre)", de: " (Wild)", tr: " (Yabani)", ur: " (جنگلی)", hi: " (जंगली)", pt: " (Selvagem)", zh: " (野生)" },
    { ar: " (مزروع)", en: " (Cultivated)", fr: " (Cultivé)", es: " (Cultivado)", de: " (Kultiviert)", tr: " (Kültür)", ur: " (کاشت شدہ)", hi: " (खेती)", pt: " (Cultivado)", zh: " (栽培)" },
    { ar: " (ذهبي)", en: " (Golden)", fr: " (Doré)", es: " (Dorado)", de: " (Golden)", tr: " (Altın)", ur: " (سنہری)", hi: " (सुनहरा)", pt: " (Dourado)", zh: " (金色)" },
    { ar: " (أحمر)", en: " (Red)", fr: " (Rouge)", es: " (Rojo)", de: " (Rot)", tr: " (Kırmızı)", ur: " (سرخ)", hi: " (लाल)", pt: " (Vermelho)", zh: " (红色)" },
    { ar: " (أخضر)", en: " (Green)", fr: " (Vert)", es: " (Verde)", de: " (Grün)", tr: " (Yeşil)", ur: " (سبز)", hi: " (हरा)", pt: " (Verde)", zh: " (绿色)" },
  ];
  
  while (plants.length < TARGET_PLANT_COUNT) {
    const randomBase = basePlantsData[Math.floor(Math.random() * basePlantsData.length)];
    const randomVariation = randomVariations[Math.floor(Math.random() * randomVariations.length)];
    
    // تجنب التكرار
    const nameAr = randomBase.nameAr + randomVariation.ar;
    const isDuplicate = plants.some(p => p.nameAr === nameAr);
    if (!isDuplicate) {
      plants.push(createPlantObjectMultilingual(id++, randomBase, randomVariation));
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

// دالة لإنشاء كائن نبات متعدد اللغات (للأصناف المشتقة)
function createPlantObjectMultilingual(id, base, variety) {
  const category = base.category;
  
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
    // أسماء بجميع اللغات العشر
    nameAr: base.nameAr + (variety ? variety.ar : ''),
    nameEn: base.nameEn + (variety ? variety.en : ''),
    nameFr: (base.nameFr || base.nameEn) + (variety ? variety.fr : ''),
    nameEs: (base.nameEs || base.nameEn) + (variety ? variety.es : ''),
    nameDe: (base.nameDe || base.nameEn) + (variety ? variety.de : ''),
    nameTr: (base.nameTr || base.nameEn) + (variety ? variety.tr : ''),
    nameUr: (base.nameUr || base.nameAr) + (variety ? variety.ur : ''),
    nameHi: (base.nameHi || base.nameEn) + (variety ? variety.hi : ''),
    namePt: (base.namePt || base.nameEn) + (variety ? variety.pt : ''),
    nameZh: (base.nameZh || base.nameEn) + (variety ? variety.zh : ''),
    icon: base.icon,
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
    difficulty: ['سهل', 'متوسط', 'صعب'][Math.floor(Math.random() * 3)],
    wateringFreq: ['كل يومين', 'يومياً', 'كل 3 أيام'][Math.floor(Math.random() * 3)],
    harvestTime: 60 + Math.floor(Math.random() * 120)
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
  const lang = i18n.currentLang;
  // Support all 10 languages
  if (lang === 'ar') return plant.nameAr;
  if (lang === 'en') return plant.nameEn;
  if (lang === 'fr') return plant.nameFr || plant.nameEn;
  if (lang === 'es') return plant.nameEs || plant.nameEn;
  if (lang === 'de') return plant.nameDe || plant.nameEn;
  if (lang === 'tr') return plant.nameTr || plant.nameEn;
  if (lang === 'ur') return plant.nameUr || plant.nameAr;
  if (lang === 'hi') return plant.nameHi || plant.nameEn;
  if (lang === 'pt') return plant.namePt || plant.nameEn;
  if (lang === 'zh') return plant.nameZh || plant.nameEn;
  return plant.nameEn;
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
  renderStatusBox(suitable.length, unsuitable.length);
  renderGeneralTips(Array.from(generalIssues));
  
  // الوضع التلقائي يعرض فقط النباتات المناسبة بدون توصيات إصلاح التربة
  // AI recommendations removed from auto mode - shows only suitable plants

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

  // إنشاء حاوية البحث - use translate() for all strings
  const searchContainer = document.createElement("div");
  searchContainer.className = "plant-search-container";
  searchContainer.innerHTML = `
    <div class="search-box">
      <input 
        type="text" 
        id="plantSearchInput" 
        class="plant-search-input"
        placeholder="${i18n.translate('Search for a plant...')}"
      />
      <span class="search-icon">🔍</span>
    </div>
    <div class="search-filters">
      <button class="filter-btn active" data-filter="all">${i18n.translate('All')}</button>
      <button class="filter-btn" data-filter="vegetables">${i18n.translate('Vegetables')}</button>
      <button class="filter-btn" data-filter="fruits">${i18n.translate('Fruits')}</button>
      <button class="filter-btn" data-filter="grains">${i18n.translate('Grains')}</button>
      <button class="filter-btn" data-filter="legumes">${i18n.translate('Legumes')}</button>
      <button class="filter-btn" data-filter="herbs">${i18n.translate('Herbs')}</button>
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
          <p style="font-size: 1.2rem;">🔍 ${i18n.translate('No plants found')}</p>
          <p style="font-size: 0.9rem;">${i18n.translate('Try a different search term')}</p>
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
        <span class="plant-category">${i18n.translate(plant.category.charAt(0).toUpperCase() + plant.category.slice(1))}</span>
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
          alert(i18n.translate('Please fill all soil fields first'));
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

// ===================================================
// 🤖 AI Assistant for Soil Problems
// ===================================================

/**
 * AI Problem Solver - Knowledge Base
 * قاعدة معارف AI لحل مشاكل التربة
 */
const aiProblemSolver = {
  problems: {
    yellow_leaves: {
      nameAr: 'أوراق صفراء',
      nameEn: 'Yellow leaves',
      causeAr: 'نقص النيتروجين في التربة - النيتروجين ضروري لإنتاج الكلوروفيل',
      causeEn: 'Nitrogen deficiency - Nitrogen is essential for chlorophyll production',
      solutions: [
        {
          nameAr: 'سماد الدجاج',
          nameEn: 'Chicken manure',
          amountAr: '300-500 جرام لكل متر مربع',
          amountEn: '300-500 grams per square meter',
          applicationAr: 'يُخلط مع التربة ويُسقى جيداً',
          applicationEn: 'Mix with soil and water well',
          priority: 1
        },
        {
          nameAr: 'سماد البقر',
          nameEn: 'Cow manure',
          amountAr: '500-800 جرام لكل متر مربع',
          amountEn: '500-800 grams per square meter',
          applicationAr: 'يُضاف للتربة قبل الزراعة بأسبوع',
          applicationEn: 'Add to soil a week before planting',
          priority: 2
        },
        {
          nameAr: 'بقايا القهوة',
          nameEn: 'Coffee grounds',
          amountAr: '200-300 جرام لكل متر مربع',
          amountEn: '200-300 grams per square meter',
          applicationAr: 'يُرش على سطح التربة ويُخلط خفيفاً',
          applicationEn: 'Spread on soil surface and mix lightly',
          priority: 3
        }
      ],
      stepsAr: [
        'أزل الأوراق الصفراء التالفة',
        'أضف السماد العضوي الموصى به',
        'اسقِ التربة جيداً',
        'كرر كل أسبوعين حتى تتحسن الأوراق'
      ],
      stepsEn: [
        'Remove damaged yellow leaves',
        'Add recommended organic fertilizer',
        'Water soil thoroughly',
        'Repeat every 2 weeks until leaves improve'
      ],
      timelineAr: '7-14 يوم للتحسن الملحوظ',
      timelineEn: '7-14 days for noticeable improvement'
    },
    slow_growth: {
      nameAr: 'نمو بطيء',
      nameEn: 'Slow growth',
      causeAr: 'نقص الفسفور - الفسفور ضروري لنمو الجذور والطاقة',
      causeEn: 'Phosphorus deficiency - Phosphorus is essential for root development and energy',
      solutions: [
        {
          nameAr: 'دقيق العظام',
          nameEn: 'Bone meal',
          amountAr: '200-400 جرام لكل متر مربع',
          amountEn: '200-400 grams per square meter',
          applicationAr: 'يُخلط مع التربة حول منطقة الجذور',
          applicationEn: 'Mix with soil around root zone',
          priority: 1
        },
        {
          nameAr: 'سماد السمك',
          nameEn: 'Fish meal',
          amountAr: '150-250 جرام لكل متر مربع',
          amountEn: '150-250 grams per square meter',
          applicationAr: 'يُضاف للتربة ويُغطى بطبقة رقيقة',
          applicationEn: 'Add to soil and cover with thin layer',
          priority: 2
        },
        {
          nameAr: 'قشر البيض المطحون',
          nameEn: 'Crushed eggshells',
          amountAr: '100-200 جرام لكل متر مربع',
          amountEn: '100-200 grams per square meter',
          applicationAr: 'يُطحن ناعماً ويُخلط مع التربة',
          applicationEn: 'Grind finely and mix with soil',
          priority: 3
        }
      ],
      stepsAr: [
        'تأكد من عدم وجود مشاكل في الري',
        'أضف مصدر الفسفور الطبيعي',
        'خفف التربة حول الجذور',
        'راقب النمو لمدة 2-3 أسابيع'
      ],
      stepsEn: [
        'Ensure no watering issues',
        'Add natural phosphorus source',
        'Loosen soil around roots',
        'Monitor growth for 2-3 weeks'
      ],
      timelineAr: '14-21 يوم للتحسن',
      timelineEn: '14-21 days for improvement'
    },
    weak_plants: {
      nameAr: 'نباتات ضعيفة',
      nameEn: 'Weak plants',
      causeAr: 'نقص البوتاسيوم - البوتاسيوم يقوي جدران الخلايا ويزيد مقاومة الأمراض',
      causeEn: 'Potassium deficiency - Potassium strengthens cell walls and disease resistance',
      solutions: [
        {
          nameAr: 'رماد الخشب',
          nameEn: 'Wood ash',
          amountAr: '150-250 جرام لكل متر مربع',
          amountEn: '150-250 grams per square meter',
          applicationAr: 'يُرش على التربة ويُخلط خفيفاً مع الري',
          applicationEn: 'Spread on soil and mix lightly with watering',
          priority: 1
        },
        {
          nameAr: 'قشور الموز المجففة',
          nameEn: 'Dried banana peels',
          amountAr: '200-300 جرام لكل متر مربع',
          amountEn: '200-300 grams per square meter',
          applicationAr: 'تُجفف وتُقطع ثم تُدفن في التربة',
          applicationEn: 'Dry, chop, and bury in soil',
          priority: 2
        },
        {
          nameAr: 'الكمبوست',
          nameEn: 'Compost',
          amountAr: '500-1000 جرام لكل متر مربع',
          amountEn: '500-1000 grams per square meter',
          applicationAr: 'يُخلط مع التربة جيداً',
          applicationEn: 'Mix thoroughly with soil',
          priority: 3
        }
      ],
      stepsAr: [
        'ادعم النباتات الضعيفة بأعواد',
        'أضف مصدر البوتاسيوم الطبيعي',
        'تجنب الإفراط في الري',
        'تأكد من التهوية الجيدة'
      ],
      stepsEn: [
        'Support weak plants with stakes',
        'Add natural potassium source',
        'Avoid overwatering',
        'Ensure good ventilation'
      ],
      timelineAr: '14-21 يوم لتقوية النبات',
      timelineEn: '14-21 days to strengthen plants'
    },
    no_fruits: {
      nameAr: 'لا تثمر',
      nameEn: 'No fruiting',
      causeAr: 'نقص الفسفور والبوتاسيوم معاً - هذان العنصران ضروريان للإزهار والإثمار',
      causeEn: 'Combined phosphorus and potassium deficiency - Both essential for flowering and fruiting',
      solutions: [
        {
          nameAr: 'دقيق العظام + رماد الخشب',
          nameEn: 'Bone meal + Wood ash',
          amountAr: '200 جرام عظام + 100 جرام رماد لكل متر',
          amountEn: '200g bone meal + 100g ash per square meter',
          applicationAr: 'يُخلطان معاً ويُضافان للتربة',
          applicationEn: 'Mix together and add to soil',
          priority: 1
        },
        {
          nameAr: 'سماد عضوي مخمر',
          nameEn: 'Fermented organic fertilizer',
          amountAr: '400-600 جرام لكل متر مربع',
          amountEn: '400-600 grams per square meter',
          applicationAr: 'يُضاف أسبوعياً خلال فترة الإزهار',
          applicationEn: 'Add weekly during flowering period',
          priority: 2
        }
      ],
      stepsAr: [
        'تأكد من أن النبات في عمر الإثمار',
        'أضف السماد المركب الموصى به',
        'تأكد من التلقيح (للنباتات التي تحتاجه)',
        'وفر إضاءة كافية (6-8 ساعات يومياً)'
      ],
      stepsEn: [
        'Ensure plant is at fruiting age',
        'Add recommended compound fertilizer',
        'Ensure pollination (for plants that need it)',
        'Provide adequate light (6-8 hours daily)'
      ],
      timelineAr: '21-30 يوم لبدء الإثمار',
      timelineEn: '21-30 days to start fruiting'
    },
    wilting: {
      nameAr: 'ذبول النبات',
      nameEn: 'Wilting',
      causeAr: 'مشكلة في الري أو تلف الجذور - قد يكون الري الزائد أو الناقص',
      causeEn: 'Watering issue or root damage - Could be over or under watering',
      solutions: [
        {
          nameAr: 'تنظيم الري',
          nameEn: 'Regulate watering',
          amountAr: 'حسب حاجة النبات',
          amountEn: 'According to plant needs',
          applicationAr: 'اختبر رطوبة التربة قبل كل ري',
          applicationEn: 'Test soil moisture before each watering',
          priority: 1
        },
        {
          nameAr: 'تحسين التصريف',
          nameEn: 'Improve drainage',
          amountAr: 'إضافة رمل أو بيرلايت',
          amountEn: 'Add sand or perlite',
          applicationAr: 'يُخلط 20% رمل مع التربة',
          applicationEn: 'Mix 20% sand with soil',
          priority: 2
        },
        {
          nameAr: 'الكمبوست',
          nameEn: 'Compost',
          amountAr: '500 جرام لكل متر مربع',
          amountEn: '500 grams per square meter',
          applicationAr: 'يُحسن بنية التربة واحتفاظها بالماء',
          applicationEn: 'Improves soil structure and water retention',
          priority: 3
        }
      ],
      stepsAr: [
        'افحص التربة - هل هي جافة جداً أم رطبة جداً؟',
        'إذا جافة: اسقِ ببطء وعمق',
        'إذا رطبة جداً: توقف عن الري وحسّن التصريف',
        'انقل النبات للظل مؤقتاً'
      ],
      stepsEn: [
        'Check soil - is it too dry or too wet?',
        'If dry: water slowly and deeply',
        'If too wet: stop watering and improve drainage',
        'Move plant to shade temporarily'
      ],
      timelineAr: '3-7 أيام للتعافي',
      timelineEn: '3-7 days for recovery'
    },
    acidic_soil: {
      nameAr: 'تربة حمضية',
      nameEn: 'Acidic soil',
      causeAr: 'انخفاض pH التربة تحت 6.0 - يؤثر على امتصاص العناصر الغذائية',
      causeEn: 'Soil pH below 6.0 - Affects nutrient absorption',
      solutions: [
        {
          nameAr: 'الجير الزراعي',
          nameEn: 'Agricultural lime',
          amountAr: '100-200 جرام لكل متر مربع',
          amountEn: '100-200 grams per square meter',
          applicationAr: 'يُرش على التربة ويُخلط جيداً ثم يُسقى',
          applicationEn: 'Spread on soil, mix well, then water',
          priority: 1
        },
        {
          nameAr: 'رماد الخشب',
          nameEn: 'Wood ash',
          amountAr: '150-250 جرام لكل متر مربع',
          amountEn: '150-250 grams per square meter',
          applicationAr: 'يُرش ويُخلط مع التربة',
          applicationEn: 'Spread and mix with soil',
          priority: 2
        },
        {
          nameAr: 'قشر البيض المطحون',
          nameEn: 'Crushed eggshells',
          amountAr: '100-150 جرام لكل متر مربع',
          amountEn: '100-150 grams per square meter',
          applicationAr: 'يُطحن ناعماً جداً ويُخلط مع التربة',
          applicationEn: 'Grind very finely and mix with soil',
          priority: 3
        }
      ],
      stepsAr: [
        'قس pH التربة الحالي',
        'أضف المادة القلوية تدريجياً',
        'انتظر أسبوعين وأعد القياس',
        'كرر إذا لزم الأمر'
      ],
      stepsEn: [
        'Measure current soil pH',
        'Add alkaline material gradually',
        'Wait 2 weeks and re-measure',
        'Repeat if necessary'
      ],
      timelineAr: '14-28 يوم لتعديل pH',
      timelineEn: '14-28 days to adjust pH'
    },
    alkaline_soil: {
      nameAr: 'تربة قلوية',
      nameEn: 'Alkaline soil',
      causeAr: 'ارتفاع pH التربة فوق 7.5 - يمنع امتصاص الحديد والمنغنيز',
      causeEn: 'Soil pH above 7.5 - Prevents iron and manganese absorption',
      solutions: [
        {
          nameAr: 'الكبريت الزراعي',
          nameEn: 'Agricultural sulfur',
          amountAr: '50-100 جرام لكل متر مربع',
          amountEn: '50-100 grams per square meter',
          applicationAr: 'يُضاف تدريجياً مع مراقبة pH',
          applicationEn: 'Add gradually while monitoring pH',
          priority: 1
        },
        {
          nameAr: 'الخث (البيتموس)',
          nameEn: 'Peat moss',
          amountAr: '1-2 كيلو لكل متر مربع',
          amountEn: '1-2 kg per square meter',
          applicationAr: 'يُخلط مع التربة جيداً',
          applicationEn: 'Mix thoroughly with soil',
          priority: 2
        },
        {
          nameAr: 'إبر الصنوبر',
          nameEn: 'Pine needles',
          amountAr: 'طبقة 5 سم',
          amountEn: '5 cm layer',
          applicationAr: 'تُفرش كغطاء للتربة',
          applicationEn: 'Spread as soil mulch',
          priority: 3
        }
      ],
      stepsAr: [
        'قس pH التربة الحالي',
        'أضف المادة الحمضية بحذر',
        'راقب النباتات لعلامات التحسن',
        'أعد القياس بعد 3 أسابيع'
      ],
      stepsEn: [
        'Measure current soil pH',
        'Add acidic material carefully',
        'Monitor plants for improvement signs',
        'Re-measure after 3 weeks'
      ],
      timelineAr: '21-35 يوم لتعديل pH',
      timelineEn: '21-35 days to adjust pH'
    },
    poor_drainage: {
      nameAr: 'تصريف سيء',
      nameEn: 'Poor drainage',
      causeAr: 'التربة مضغوطة أو طينية - تحتفظ بالماء الزائد وتخنق الجذور',
      causeEn: 'Compacted or clay soil - Retains excess water and suffocates roots',
      solutions: [
        {
          nameAr: 'الرمل الخشن',
          nameEn: 'Coarse sand',
          amountAr: '2-3 كيلو لكل متر مربع',
          amountEn: '2-3 kg per square meter',
          applicationAr: 'يُخلط مع التربة بعمق 20 سم',
          applicationEn: 'Mix with soil to 20 cm depth',
          priority: 1
        },
        {
          nameAr: 'البيرلايت',
          nameEn: 'Perlite',
          amountAr: '1-2 كيلو لكل متر مربع',
          amountEn: '1-2 kg per square meter',
          applicationAr: 'يُخلط مع التربة',
          applicationEn: 'Mix with soil',
          priority: 2
        },
        {
          nameAr: 'الكمبوست الناضج',
          nameEn: 'Mature compost',
          amountAr: '3-5 كيلو لكل متر مربع',
          amountEn: '3-5 kg per square meter',
          applicationAr: 'يُحسن بنية التربة ويزيد المسامية',
          applicationEn: 'Improves soil structure and porosity',
          priority: 3
        }
      ],
      stepsAr: [
        'ارفع الأحواض أو أنشئ أخاديد تصريف',
        'أضف مواد تحسين التصريف',
        'تجنب الري الزائد',
        'فكر في استخدام أحواض مرتفعة'
      ],
      stepsEn: [
        'Raise beds or create drainage channels',
        'Add drainage improvement materials',
        'Avoid overwatering',
        'Consider using raised beds'
      ],
      timelineAr: 'فوري بعد التعديل',
      timelineEn: 'Immediate after modification'
    }
  },

  /**
   * تحليل مشكلة التربة وتقديم الحل
   */
  analyzeProblem: function(problemKey, customDescription = '') {
    const lang = i18n.currentLang;
    const problem = this.problems[problemKey];
    
    if (!problem) {
      // تحليل الوصف المخصص
      return this.analyzeCustomProblem(customDescription);
    }
    
    return {
      problem: lang === 'ar' ? problem.nameAr : problem.nameEn,
      cause: lang === 'ar' ? problem.causeAr : problem.causeEn,
      solutions: problem.solutions.map(s => ({
        name: lang === 'ar' ? s.nameAr : s.nameEn,
        amount: lang === 'ar' ? s.amountAr : s.amountEn,
        application: lang === 'ar' ? s.applicationAr : s.applicationEn,
        priority: s.priority
      })),
      steps: lang === 'ar' ? problem.stepsAr : problem.stepsEn,
      timeline: lang === 'ar' ? problem.timelineAr : problem.timelineEn
    };
  },

  /**
   * تحليل مشكلة مخصصة بناءً على الوصف
   */
  analyzeCustomProblem: function(description) {
    const lang = i18n.currentLang;
    const desc = description.toLowerCase();
    
    // البحث عن كلمات مفتاحية
    const keywords = {
      yellow_leaves: ['صفر', 'أصفر', 'yellow', 'yellowing', 'chlorosis'],
      slow_growth: ['بطيء', 'نمو', 'slow', 'growth', 'stunted'],
      weak_plants: ['ضعيف', 'هش', 'weak', 'fragile', 'thin'],
      no_fruits: ['ثمر', 'إثمار', 'زهر', 'fruit', 'flower', 'bloom'],
      wilting: ['ذبول', 'ذابل', 'wilt', 'drooping', 'limp'],
      acidic_soil: ['حمضي', 'حموض', 'acid', 'ph low'],
      alkaline_soil: ['قلوي', 'قاعدي', 'alkaline', 'basic', 'ph high'],
      poor_drainage: ['تصريف', 'ماء', 'غرق', 'drainage', 'waterlogged', 'soggy']
    };
    
    for (const [key, words] of Object.entries(keywords)) {
      for (const word of words) {
        if (desc.includes(word)) {
          return this.analyzeProblem(key, description);
        }
      }
    }
    
    // إذا لم يتم التعرف على المشكلة
    return {
      problem: lang === 'ar' ? 'مشكلة غير محددة' : 'Unidentified problem',
      cause: lang === 'ar' 
        ? 'لم نتمكن من تحديد المشكلة بدقة. يرجى اختيار مشكلة من القائمة أو وصف المشكلة بشكل أوضح.'
        : 'Could not identify the problem precisely. Please select a problem from the list or describe it more clearly.',
      solutions: [
        {
          name: lang === 'ar' ? 'فحص شامل للتربة' : 'Complete soil test',
          amount: lang === 'ar' ? 'قياس pH, N, P, K' : 'Measure pH, N, P, K',
          application: lang === 'ar' ? 'استخدم أداة قياس التربة' : 'Use soil testing kit',
          priority: 1
        },
        {
          name: lang === 'ar' ? 'الكمبوست العضوي' : 'Organic compost',
          amount: lang === 'ar' ? '500 جرام لكل متر مربع' : '500 grams per square meter',
          application: lang === 'ar' ? 'حل عام يحسن معظم مشاكل التربة' : 'General solution that improves most soil issues',
          priority: 2
        }
      ],
      steps: lang === 'ar' 
        ? ['قم بفحص التربة', 'حدد المشكلة بدقة', 'اتبع التوصيات المحددة']
        : ['Test the soil', 'Identify the exact problem', 'Follow specific recommendations'],
      timeline: lang === 'ar' ? 'يعتمد على نوع المشكلة' : 'Depends on problem type'
    };
  }
};

/**
 * Initialize AI Assistant Modal
 */
let aiAssistantInitialized = false;

function initAIAssistant() {
  // Prevent double initialization
  if (aiAssistantInitialized) return;
  
  const fabBtn = document.getElementById('aiAssistantBtn');
  const modal = document.getElementById('aiAssistantModal');
  const closeBtn = document.getElementById('closeAiModal');
  const solveBtn = document.getElementById('aiSolveBtn');
  const problemInput = document.getElementById('aiProblemInput');
  const quickProblemBtns = document.querySelectorAll('.quick-problem-btn');
  const solutionArea = document.getElementById('aiSolutionArea');
  
  // Check all required elements exist
  if (!fabBtn || !modal || !closeBtn || !solveBtn || !problemInput) return;
  
  aiAssistantInitialized = true;
  
  // Open modal
  fabBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });
  
  // Close modal
  closeBtn.addEventListener('click', closeAIModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAIModal();
  });
  
  function closeAIModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
  
  // Quick problem buttons
  let selectedProblem = null;
  quickProblemBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      quickProblemBtns.forEach(b => b.classList.remove('active'));
      // Add to clicked
      btn.classList.add('active');
      selectedProblem = btn.dataset.problem;
      
      // Update textarea with problem name
      const lang = i18n.currentLang;
      const problemData = aiProblemSolver.problems[selectedProblem];
      if (problemData && problemInput) {
        problemInput.value = lang === 'ar' ? problemData.nameAr : problemData.nameEn;
      }
    });
  });
  
  // Solve button
  solveBtn.addEventListener('click', () => {
    const customDesc = problemInput.value.trim();
    
    if (!selectedProblem && !customDesc) {
      // Show inline validation message instead of alert
      showValidationMessage(problemInput, i18n.currentLang === 'ar' 
        ? 'يرجى اختيار مشكلة أو كتابة وصف لها'
        : 'Please select a problem or describe it');
      return;
    }
    
    // Analyze and show solution
    const result = selectedProblem 
      ? aiProblemSolver.analyzeProblem(selectedProblem, customDesc)
      : aiProblemSolver.analyzeCustomProblem(customDesc);
    
    renderAISolution(result);
  });
  
  // Update placeholders based on language
  updateAIAssistantLanguage();
}

/**
 * Update AI Assistant language
 */
function updateAIAssistantLanguage() {
  const lang = i18n.currentLang;
  const problemInput = document.getElementById('aiProblemInput');
  
  if (problemInput) {
    problemInput.placeholder = lang === 'ar' 
      ? 'اكتب مشكلتك هنا...'
      : 'Describe your problem here...';
  }
  
  // Update quick problem buttons
  const quickBtns = document.querySelectorAll('.quick-problem-btn');
  quickBtns.forEach(btn => {
    const problem = btn.dataset.problem;
    const problemData = aiProblemSolver.problems[problem];
    if (problemData) {
      btn.textContent = lang === 'ar' ? problemData.nameAr : problemData.nameEn;
    }
  });
}

/**
 * Render AI Solution
 */
function renderAISolution(result) {
  const lang = i18n.currentLang;
  const solutionArea = document.getElementById('aiSolutionArea');
  
  if (!solutionArea) return;
  
  solutionArea.classList.remove('hidden');
  
  solutionArea.innerHTML = `
    <div class="ai-solution-header">
      <h4>🤖 ${lang === 'ar' ? 'تحليل AI' : 'AI Analysis'}</h4>
    </div>
    
    <div class="ai-problem-identified">
      <h5>⚠️ ${lang === 'ar' ? 'المشكلة:' : 'Problem:'} ${result.problem}</h5>
      <p>${result.cause}</p>
    </div>
    
    <div class="ai-solution-recommendations">
      <h5>💡 ${lang === 'ar' ? 'الحلول الموصى بها:' : 'Recommended Solutions:'}</h5>
      ${result.solutions.map(sol => `
        <div class="ai-recommendation-card">
          <div class="ai-rec-header">
            <span class="ai-rec-name">${sol.name}</span>
            <span class="ai-rec-priority ${sol.priority === 1 ? '' : 'secondary'}">
              ${sol.priority === 1 
                ? (lang === 'ar' ? '⭐ الأفضل' : '⭐ Best')
                : (lang === 'ar' ? 'بديل' : 'Alternative')}
            </span>
          </div>
          <div class="ai-rec-details">
            <p><strong>📦 ${lang === 'ar' ? 'الكمية:' : 'Amount:'}</strong> <span class="ai-rec-amount">${sol.amount}</span></p>
            <p><strong>📝 ${lang === 'ar' ? 'التطبيق:' : 'Application:'}</strong> ${sol.application}</p>
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="ai-application-steps">
      <h5>📋 ${lang === 'ar' ? 'خطوات التنفيذ:' : 'Implementation Steps:'}</h5>
      <ol>
        ${result.steps.map(step => `<li>${step}</li>`).join('')}
      </ol>
    </div>
    
    <div class="ai-expected-results">
      <h5>⏱️ ${lang === 'ar' ? 'الوقت المتوقع للتحسن:' : 'Expected Improvement Time:'}</h5>
      <p>${result.timeline}</p>
    </div>
  `;
  
  // Scroll to solution
  solutionArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Show inline validation message
 */
function showValidationMessage(element, message) {
  // Remove any existing validation message
  const existingMsg = element.parentElement.querySelector('.validation-message');
  if (existingMsg) existingMsg.remove();
  
  // Create and insert validation message
  const msgEl = document.createElement('div');
  msgEl.className = 'validation-message';
  msgEl.style.cssText = 'color: #ef4444; font-size: 0.9rem; margin-top: 8px; padding: 8px 12px; background: #fef2f2; border-radius: 8px; border-left: 3px solid #ef4444;';
  msgEl.textContent = message;
  element.parentElement.appendChild(msgEl);
  
  // Focus on the element
  element.focus();
  
  // Remove after 3 seconds
  setTimeout(() => {
    if (msgEl.parentElement) msgEl.remove();
  }, 3000);
}

// Initialize AI Assistant when DOM is ready
document.addEventListener('DOMContentLoaded', initAIAssistant);
