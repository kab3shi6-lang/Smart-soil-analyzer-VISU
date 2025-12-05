// ============================================================
// 🌱 تطبيق محلل التربة الذكي - مع دعم الجسر
// Smart Soil Analyzer App - With Bridge Support
// ============================================================

// استيراد قاعدة البيانات
const { generatePlants } = typeof require !== 'undefined' ? require('./plants-database.js') : { generatePlants: () => [] };

// إعدادات عامة
let plants = [];
let currentPlant = null;
let currentSoilData = null;
let bridgeConnected = false;
let autoRefreshInterval = null;

// ============================================================
// 🌐 إعدادات الاتصال بالجسر
// ============================================================

const BRIDGE_CONFIG = {
  host: 'localhost',
  port: 3000,
  basePath: 'http://localhost:3000/api'
};

let bridgeConnection = {
  ws: null,
  isConnected: false,
  lastUpdate: null,
  errorCount: 0
};

// ============================================================
// 🔌 الاتصال بجسر Bluetooth
// ============================================================

async function connectToBridge() {
  console.log('🔌 محاولة الاتصال بالجسر...');

  try {
    const response = await fetch(`${BRIDGE_CONFIG.basePath}/status`);
    const status = await response.json();

    if (response.ok) {
      console.log('✅ متصل بـ REST API:', status);
      bridgeConnected = true;
      connectWebSocket();
      startAutoRefresh();
      updateBridgeStatus();
    }
  } catch (error) {
    console.warn('⚠️ لا يمكن الاتصال بالجسر:', error.message);
    bridgeConnected = false;
    updateBridgeStatus();
  }
}

function connectWebSocket() {
  try {
    const wsUrl = `ws://localhost:3000`;
    console.log('🔌 محاولة الاتصال بـ WebSocket:', wsUrl);

    bridgeConnection.ws = new WebSocket(wsUrl);

    bridgeConnection.ws.onopen = () => {
      console.log('✅ تم الاتصال بـ WebSocket');
      bridgeConnection.isConnected = true;
      updateBridgeStatus();
    };

    bridgeConnection.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('📨 بيانات من الجسر:', message);

        if (message.type === 'data') {
          currentSoilData = message.data;
          updateFormWithBridgeData(message.data);
          bridgeConnection.lastUpdate = new Date();
        }
      } catch (e) {
        console.error('❌ خطأ في معالجة رسالة WebSocket:', e);
      }
    };

    bridgeConnection.ws.onerror = (error) => {
      console.error('❌ خطأ في WebSocket:', error);
      bridgeConnection.isConnected = false;
    };

    bridgeConnection.ws.onclose = () => {
      console.log('⚠️ تم قطع الاتصال بـ WebSocket');
      bridgeConnection.isConnected = false;
    };
  } catch (error) {
    console.error('❌ خطأ في إنشاء WebSocket:', error);
  }
}

function startAutoRefresh() {
  if (autoRefreshInterval) clearInterval(autoRefreshInterval);

  autoRefreshInterval = setInterval(async () => {
    try {
      const response = await fetch(`${BRIDGE_CONFIG.basePath}/data`);
      if (response.ok) {
        const data = await response.json();
        currentSoilData = data;
        updateFormWithBridgeData(data);
        bridgeConnection.lastUpdate = new Date();
        bridgeConnection.errorCount = 0;
      }
    } catch (error) {
      bridgeConnection.errorCount++;
      console.warn(`⚠️ خطأ في الاستقبال (${bridgeConnection.errorCount}):`, error.message);
    }
  }, 2000);
}

// ============================================================
// 📝 تحديث النموذج ببيانات الجسر
// ============================================================

function updateFormWithBridgeData(data) {
  const fieldMap = {
    TEMP: 'manualTemp',
    MOISTURE: 'manualMoisture',
    PH: 'manualPh',
    N: 'manualN',
    P: 'manualP',
    K: 'manualK'
  };

  Object.keys(fieldMap).forEach(key => {
    const fieldId = fieldMap[key];
    const field = document.getElementById(fieldId);

    if (field && data[key] !== undefined) {
      field.value = parseFloat(data[key]).toFixed(1);
      field.style.background = '#c6f6d5';
      field.classList.add('updated');

      setTimeout(() => {
        field.style.background = '';
        field.classList.remove('updated');
      }, 1000);
    }
  });

  console.log('✅ تم تحديث النموذج ببيانات الجسر');
}

function updateBridgeStatus() {
  const statusBtn = document.getElementById('bridgeConnectBtn');
  const statusText = document.getElementById('bridgeStatus');

  if (statusBtn) {
    if (bridgeConnected) {
      statusBtn.classList.add('connected');
      statusBtn.innerHTML = '🟢 جسر Bluetooth متصل';
      if (statusText) statusText.textContent = '✅ متصل';
    } else {
      statusBtn.classList.remove('connected');
      statusBtn.innerHTML = '🔴 جسر Bluetooth غير متصل';
      if (statusText) statusText.textContent = '❌ غير متصل';
    }
  }
}

// ============================================================
// 🌱 تحميل قاعدة البيانات
// ============================================================

window.addEventListener('DOMContentLoaded', function() {
  console.log('✅ DOM Loaded - Initializing...');
  
  // تحميل النباتات
  try {
    if (typeof generatePlants === 'function') {
      plants = generatePlants();
    } else {
      plants = getDefaultPlants();
    }
  } catch (e) {
    console.warn('⚠️ خطأ في تحميل قاعدة البيانات:', e);
    plants = getDefaultPlants();
  }

  console.log(`🌱 تم تحميل ${plants.length} نبات`);

  populatePlantSelector();
  setupEventListeners();
  connectToBridge();
});

// ============================================================
// 🌿 النباتات الافتراضية
// ============================================================

function getDefaultPlants() {
  return [
    { id: 1, name: '🍅 الطماطم', nameAr: 'الطماطم', nameEn: 'Tomato', emoji: '🍅', tempMin: 20, tempMax: 28, moistureMin: 60, moistureMax: 80, phMin: 6.0, phMax: 7.0, nMin: 60, pMin: 40, kMin: 50 },
    { id: 2, name: '🥒 الخيار', nameAr: 'الخيار', nameEn: 'Cucumber', emoji: '🥒', tempMin: 22, tempMax: 30, moistureMin: 65, moistureMax: 85, phMin: 6.5, phMax: 7.5, nMin: 55, pMin: 35, kMin: 45 },
    { id: 3, name: '🥬 الخس', nameAr: 'الخس', nameEn: 'Lettuce', emoji: '🥬', tempMin: 15, tempMax: 25, moistureMin: 70, moistureMax: 90, phMin: 6.0, phMax: 7.5, nMin: 50, pMin: 30, kMin: 40 },
    { id: 4, name: '🌶️ الفلفل', nameAr: 'الفلفل', nameEn: 'Pepper', emoji: '🌶️', tempMin: 21, tempMax: 29, moistureMin: 65, moistureMax: 75, phMin: 6.0, phMax: 7.5, nMin: 65, pMin: 35, kMin: 50 },
    { id: 5, name: '🥕 الجزر', nameAr: 'الجزر', nameEn: 'Carrot', emoji: '🥕', tempMin: 15, tempMax: 24, moistureMin: 60, moistureMax: 80, phMin: 6.0, phMax: 6.8, nMin: 40, pMin: 30, kMin: 35 }
  ];
}

// ============================================================
// 📋 ملء قائمة النباتات
// ============================================================

function populatePlantSelector() {
  console.log('🌱 ملء قائمة النباتات...');
  const selector = document.getElementById('plantsSelector');

  if (!selector) {
    console.error('❌ #plantsSelector غير موجود');
    return;
  }

  selector.innerHTML = '';

  // حقل البحث
  const searchContainer = document.createElement('div');
  searchContainer.style.gridColumn = '1 / -1';
  searchContainer.style.marginBottom = '15px';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'plantSearch';
  searchInput.placeholder = 'ابحث عن نبات...';
  searchInput.style.width = '100%';
  searchInput.style.padding = '10px';
  searchInput.style.borderRadius = '8px';
  searchInput.style.border = '2px solid #667eea';
  searchInput.style.fontSize = '14px';

  searchContainer.appendChild(searchInput);
  selector.appendChild(searchContainer);

  // إضافة النباتات
  plants.forEach(plant => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'plant-btn';
    btn.setAttribute('data-plant-id', plant.id);
    btn.setAttribute('data-plant-name', plant.nameAr.toLowerCase());
    btn.innerHTML = `
      <span class="plant-icon">${plant.emoji}</span>
      <span class="plant-name">${plant.nameAr}</span>
      <span class="plant-details">T: ${plant.tempMin}°-${plant.tempMax}°</span>
    `;
    btn.onclick = (e) => {
      e.preventDefault();
      selectPlant(plant);
    };
    selector.appendChild(btn);
  });

  // حدث البحث
  searchInput.addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const plantBtns = selector.querySelectorAll('[data-plant-id]');

    plantBtns.forEach(btn => {
      const plantName = btn.getAttribute('data-plant-name');
      btn.style.display = plantName.includes(searchTerm) ? 'flex' : 'none';
    });
  });

  console.log(`✅ تم إضافة ${plants.length} نبات`);
}

// ============================================================
// 🎯 اختيار النبات
// ============================================================

function selectPlant(plant) {
  console.log('🌱 تم اختيار النبات:', plant.nameAr);
  currentPlant = plant;

  const temp = parseFloat(document.getElementById('manualTemp').value);
  const moisture = parseFloat(document.getElementById('manualMoisture').value);
  const ph = parseFloat(document.getElementById('manualPh').value);
  const n = parseFloat(document.getElementById('manualN').value);
  const p = parseFloat(document.getElementById('manualP').value);
  const k = parseFloat(document.getElementById('manualK').value);

  if (isNaN(temp) || isNaN(moisture) || isNaN(ph) || isNaN(n) || isNaN(p) || isNaN(k)) {
    alert('❌ يرجى ملء جميع حقول التربة أولاً');
    return;
  }

  currentSoilData = { temp, moisture, ph, n, p, k };
  analyzeManualMode(plant, currentSoilData);
}

// ============================================================
// 🧪 وضع التحليل التلقائي
// ============================================================

function switchToAutoMode(e) {
  if (e) e.preventDefault();
  hideAllScreens();
  document.getElementById('autoModeScreen')?.classList.remove('hidden');
}

function analyzeAutoMode(e) {
  if (e) e.preventDefault();
  
  const temp = parseFloat(document.getElementById('temp').value);
  const moisture = parseFloat(document.getElementById('moisture').value);
  const ph = parseFloat(document.getElementById('ph').value);
  const n = parseFloat(document.getElementById('n').value);
  const p = parseFloat(document.getElementById('p').value);
  const k = parseFloat(document.getElementById('k').value);

  if (isNaN(temp) || isNaN(moisture) || isNaN(ph) || isNaN(n) || isNaN(p) || isNaN(k)) {
    alert('❌ يرجى ملء جميع الحقول');
    return;
  }

  const soilData = { temp, moisture, ph, n, p, k };
  const suitable = plants.filter(plant => checkCompatibility(plant, soilData));
  const unsuitable = plants.filter(plant => !checkCompatibility(plant, soilData));

  displayAutoResults(suitable, unsuitable, soilData);
}

// ============================================================
// 🌿 الوضع اليدوي
// ============================================================

function switchToManualMode(e) {
  if (e) e.preventDefault();
  hideAllScreens();
  document.getElementById('manualModeScreen')?.classList.remove('hidden');
}

function analyzeManualMode(plant, soilData) {
  console.log('🔄 تحليل يدوي:', plant.nameAr);

  const compatibility = checkCompatibility(plant, soilData);
  const analysis = analyzeAI(plant, soilData);

  displayManualResults(plant, soilData, analysis);
}

// ============================================================
// ✅ فحص التوافق
// ============================================================

function checkCompatibility(plant, soilData) {
  return soilData.temp >= plant.tempMin && soilData.temp <= plant.tempMax &&
         soilData.moisture >= plant.moistureMin && soilData.moisture <= plant.moistureMax &&
         soilData.ph >= plant.phMin && soilData.ph <= plant.phMax &&
         soilData.n >= plant.nMin &&
         soilData.p >= plant.pMin &&
         soilData.k >= plant.kMin;
}

// ============================================================
// 🤖 تحليل ذكي
// ============================================================

function analyzeAI(plant, soilData) {
  const analysis = {
    deficiencies: [],
    solutions: [],
    totalScore: 100,
    quality: 'ممتازة'
  };

  // فحص النيتروجين
  if (soilData.n < plant.nMin) {
    const deficit = plant.nMin - soilData.n;
    analysis.deficiencies.push({
      type: 'nitrogen',
      deficit: deficit,
      description: 'نقص النيتروجين - يؤثر على نمو الأوراق'
    });
    analysis.solutions.push(...getSolutions('nitrogen', deficit));
    analysis.totalScore -= deficit * 2;
  }

  // فحص الفسفور
  if (soilData.p < plant.pMin) {
    const deficit = plant.pMin - soilData.p;
    analysis.deficiencies.push({
      type: 'phosphorus',
      deficit: deficit,
      description: 'نقص الفسفور - يؤثر على الثمار'
    });
    analysis.solutions.push(...getSolutions('phosphorus', deficit));
    analysis.totalScore -= deficit * 2;
  }

  // فحص البوتاسيوم
  if (soilData.k < plant.kMin) {
    const deficit = plant.kMin - soilData.k;
    analysis.deficiencies.push({
      type: 'potassium',
      deficit: deficit,
      description: 'نقص البوتاسيوم - يؤثر على القوة'
    });
    analysis.solutions.push(...getSolutions('potassium', deficit));
    analysis.totalScore -= deficit * 2;
  }

  // تحديد الجودة
  if (analysis.totalScore >= 80) analysis.quality = '✅ ممتازة';
  else if (analysis.totalScore >= 60) analysis.quality = '🟡 جيدة';
  else if (analysis.totalScore >= 40) analysis.quality = '🟠 متوسطة';
  else analysis.quality = '🔴 ضعيفة';

  return analysis;
}

function getSolutions(nutrient, deficit) {
  const solutions = {
    nitrogen: [
      { name: 'سماد الدجاج', grams: 1200, days: 7 },
      { name: 'بقايا القهوة', grams: 500, days: 3 },
      { name: 'السماد المخمر', grams: 800, days: 5 }
    ],
    phosphorus: [
      { name: 'دقيق العظام', grams: 500, days: 14 },
      { name: 'رماد الخشب', grams: 800, days: 10 },
      { name: 'السماد السمكي', grams: 300, days: 5 }
    ],
    potassium: [
      { name: 'رماد الخشب', grams: 600, days: 7 },
      { name: 'قشور الموز', grams: 300, days: 5 },
      { name: 'أوراق السرخس', grams: 800, days: 21 }
    ]
  };

  return solutions[nutrient]?.map(sol => ({
    ...sol,
    calculatedGrams: Math.round(sol.grams * (deficit / 50))
  })) || [];
}

// ============================================================
// 📊 عرض النتائج
// ============================================================

function displayAutoResults(suitable, unsuitable, soilData) {
  console.log('📈 عرض النتائج التلقائية');
  hideAllScreens();
  document.getElementById('resultsSection')?.classList.remove('hidden');

  const quality = Math.min(100, (soilData.n + soilData.p + soilData.k) / 3);
  const bar = document.getElementById('qualityBar');
  if (bar) bar.style.width = quality + '%';

  let html = `<h3>🌿 النباتات المناسبة (${suitable.length})</h3><div class="plants-grid">`;
  suitable.forEach(p => {
    html += `<div class="plant-card suitable"><span class="plant-emoji">${p.emoji}</span><span class="plant-title">${p.nameAr}</span></div>`;
  });
  html += `</div>`;

  if (unsuitable.length > 0) {
    html += `<h3>❌ النباتات غير المناسبة (${unsuitable.length})</h3><div class="plants-grid">`;
    unsuitable.forEach(p => {
      html += `<div class="plant-card unsuitable"><span class="plant-emoji">${p.emoji}</span><span class="plant-title">${p.nameAr}</span></div>`;
    });
    html += `</div>`;
  }

  const container = document.getElementById('autoResultContainer');
  if (container) container.innerHTML = html;
}

function displayManualResults(plant, soilData, analysis) {
  console.log('📈 عرض النتائج اليدوية');
  hideAllScreens();
  document.getElementById('resultsSection')?.classList.remove('hidden');

  const quality = Math.max(0, analysis.totalScore);
  const bar = document.getElementById('qualityBar');
  if (bar) bar.style.width = quality + '%';

  let html = `<h3>النقائص المكتشفة</h3>`;
  if (analysis.deficiencies.length === 0) {
    html += `<p class="no-issues">✅ لا توجد نقائص!</p>`;
  } else {
    html += `<div class="deficiencies-list">`;
    analysis.deficiencies.forEach(def => {
      html += `<div class="deficiency-card"><h4>${def.description}</h4></div>`;
    });
    html += `</div><h3>💡 الحلول الطبيعية</h3><div class="solutions-grid">`;
    analysis.solutions.forEach(sol => {
      html += `<div class="solution-card"><h4>${sol.name}</h4><p>📦 ${sol.calculatedGrams}g</p><p>⏱️ ${sol.days} أيام</p></div>`;
    });
    html += `</div>`;
  }

  const container = document.getElementById('manualResultContainer');
  if (container) container.innerHTML = html;
}

// ============================================================
// 🎛️ واجهة المستخدم
// ============================================================

function hideAllScreens() {
  document.getElementById('modeSelectionScreen')?.classList.add('hidden');
  document.getElementById('autoModeScreen')?.classList.add('hidden');
  document.getElementById('manualModeScreen')?.classList.add('hidden');
  document.getElementById('resultsSection')?.classList.add('hidden');
}

function setupEventListeners() {
  document.getElementById('autoModeBtn')?.addEventListener('click', switchToAutoMode);
  document.getElementById('manualModeBtn')?.addEventListener('click', switchToManualMode);
  document.getElementById('backFromAutoBtn')?.addEventListener('click', () => {
    hideAllScreens();
    document.getElementById('modeSelectionScreen')?.classList.remove('hidden');
  });
  document.getElementById('backFromManualBtn')?.addEventListener('click', () => {
    hideAllScreens();
    document.getElementById('modeSelectionScreen')?.classList.remove('hidden');
  });
  document.getElementById('analyzeBtn')?.addEventListener('click', analyzeAutoMode);
  document.getElementById('mockBtn')?.addEventListener('click', () => {
    document.getElementById('temp').value = '22';
    document.getElementById('moisture').value = '70';
    document.getElementById('ph').value = '6.5';
    document.getElementById('n').value = '50';
    document.getElementById('p').value = '40';
    document.getElementById('k').value = '45';
  });
  document.getElementById('bridgeConnectBtn')?.addEventListener('click', connectToBridge);
}

console.log('🚀 App.js loaded successfully');
