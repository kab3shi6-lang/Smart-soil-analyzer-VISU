// ============================================================
// 🌱 Smart Soil Analyzer - Complete App Logic
// ============================================================

// Plant database with 10 plants
const plants = [
  {
    id: 1,
    name: '🍅 الطماطم',
    nameEn: 'Tomato',
    tempMin: 20, tempMax: 28,
    moistureMin: 60, moistureMax: 80,
    phMin: 6.0, phMax: 7.0,
    nMin: 60, pMin: 40, kMin: 50
  },
  {
    id: 2,
    name: '🥒 الخيار',
    nameEn: 'Cucumber',
    tempMin: 22, tempMax: 30,
    moistureMin: 65, moistureMax: 85,
    phMin: 6.5, phMax: 7.5,
    nMin: 55, pMin: 35, kMin: 45
  },
  {
    id: 3,
    name: '🥬 الخس',
    nameEn: 'Lettuce',
    tempMin: 15, tempMax: 25,
    moistureMin: 70, moistureMax: 90,
    phMin: 6.0, phMax: 7.5,
    nMin: 50, pMin: 30, kMin: 40
  },
  {
    id: 4,
    name: '🥕 الجزر',
    nameEn: 'Carrot',
    tempMin: 16, tempMax: 26,
    moistureMin: 65, moistureMax: 80,
    phMin: 6.0, phMax: 6.8,
    nMin: 45, pMin: 35, kMin: 50
  },
  {
    id: 5,
    name: '🍌 الموز',
    nameEn: 'Banana',
    tempMin: 24, tempMax: 35,
    moistureMin: 70, moistureMax: 85,
    phMin: 5.5, phMax: 7.0,
    nMin: 70, pMin: 45, kMin: 80
  },
  {
    id: 6,
    name: '🍓 الفراولة',
    nameEn: 'Strawberry',
    tempMin: 15, tempMax: 25,
    moistureMin: 60, moistureMax: 75,
    phMin: 5.5, phMax: 6.8,
    nMin: 40, pMin: 50, kMin: 45
  },
  {
    id: 7,
    name: '🌽 الذرة',
    nameEn: 'Corn',
    tempMin: 18, tempMax: 28,
    moistureMin: 55, moistureMax: 75,
    phMin: 6.0, phMax: 7.5,
    nMin: 80, pMin: 40, kMin: 50
  },
  {
    id: 8,
    name: '🌿 الزعتر',
    nameEn: 'Thyme',
    tempMin: 15, tempMax: 25,
    moistureMin: 40, moistureMax: 60,
    phMin: 6.5, phMax: 7.5,
    nMin: 30, pMin: 25, kMin: 35
  },
  {
    id: 9,
    name: '🌿 النعناع',
    nameEn: 'Mint',
    tempMin: 15, tempMax: 27,
    moistureMin: 60, moistureMax: 80,
    phMin: 6.0, phMax: 7.5,
    nMin: 45, pMin: 30, kMin: 40
  },
  {
    id: 10,
    name: '🍆 الباذنجان',
    nameEn: 'Eggplant',
    tempMin: 22, tempMax: 30,
    moistureMin: 60, moistureMax: 75,
    phMin: 5.5, phMax: 7.0,
    nMin: 65, pMin: 45, kMin: 55
  }
];

// Natural solutions database
const solutions = {
  nitrogen: [
    { name: 'سماد الدجاج العضوي', nameEn: 'Chicken Manure', grams: 1000, days: 7 },
    { name: 'بقايا القهوة', nameEn: 'Coffee Grounds', grams: 500, days: 3 },
    { name: 'السماد المخمر', nameEn: 'Fermented Compost', grams: 800, days: 5 }
  ],
  phosphorus: [
    { name: 'دقيق العظام', nameEn: 'Bone Meal', grams: 500, days: 14 },
    { name: 'رماد الخشب', nameEn: 'Wood Ash', grams: 800, days: 10 },
    { name: 'السماد السمكي', nameEn: 'Fish Meal', grams: 300, days: 5 }
  ],
  potassium: [
    { name: 'رماد الخشب', nameEn: 'Wood Ash', grams: 600, days: 7 },
    { name: 'قشور الموز', nameEn: 'Banana Peels', grams: 300, days: 5 },
    { name: 'أوراق السرخس', nameEn: 'Fern Leaves', grams: 800, days: 21 }
  ]
};

let currentPlant = null;
let currentSoilData = null;

// ============================================================
// DOM POPULATION ON LOAD
// ============================================================

window.addEventListener('DOMContentLoaded', function() {
  console.log('✅ DOM Loaded - Initializing app...');
  populatePlantSelector();
  setupEventListeners();
});

function populatePlantSelector() {
  console.log('🌱 Populating plant selector with', plants.length, 'plants');
  const selector = document.getElementById('plantsSelector');
  
  if (!selector) {
    console.error('❌ ERROR: #plantsSelector not found!');
    return;
  }
  
  selector.innerHTML = '';
  
  plants.forEach(plant => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'plant-btn';
    btn.innerHTML = `
      <span class="plant-icon">${plant.name.split(' ')[0]}</span>
      <span class="plant-name">${plant.name}</span>
      <span class="plant-details">T: ${plant.tempMin}°-${plant.tempMax}° | pH: ${plant.phMin}-${plant.phMax}</span>
    `;
    btn.onclick = function(e) {
      e.preventDefault();
      selectPlant(plant);
    };
    selector.appendChild(btn);
  });
  
  console.log('✅ Plant selector populated');
}

function setupEventListeners() {
  console.log('🔗 Setting up event listeners...');
  
  // Mode selection buttons
  document.getElementById('autoModeBtn').addEventListener('click', switchToAutoMode);
  document.getElementById('manualModeBtn').addEventListener('click', switchToManualMode);
  
  // Back buttons
  document.getElementById('backFromAutoBtn').addEventListener('click', backToMode);
  document.getElementById('backFromManualBtn').addEventListener('click', backToMode);
  
  // Analyze buttons
  document.getElementById('analyzeBtn').addEventListener('click', analyzeAutoMode);
  document.getElementById('mockBtn').addEventListener('click', fillExampleValues);
  
  console.log('✅ Event listeners set up');
}

// ============================================================
// MODE SWITCHING
// ============================================================

function switchToAutoMode(e) {
  e.preventDefault();
  console.log('➡️ Switching to AUTO mode');
  hideAllScreens();
  document.getElementById('modeSelectionScreen').classList.remove('hidden');
  document.getElementById('autoModeScreen').classList.remove('hidden');
}

function switchToManualMode(e) {
  e.preventDefault();
  console.log('➡️ Switching to MANUAL mode');
  hideAllScreens();
  document.getElementById('modeSelectionScreen').classList.remove('hidden');
  document.getElementById('manualModeScreen').classList.remove('hidden');
}

function backToMode(e) {
  e.preventDefault();
  console.log('⬅️ Back to mode selection');
  hideAllScreens();
  document.getElementById('modeSelectionScreen').classList.remove('hidden');
}

function hideAllScreens() {
  document.getElementById('modeSelectionScreen').classList.add('hidden');
  document.getElementById('autoModeScreen').classList.add('hidden');
  document.getElementById('manualModeScreen').classList.add('hidden');
  document.getElementById('resultsSection').classList.add('hidden');
}

// ============================================================
// PLANT SELECTION (MANUAL MODE)
// ============================================================

function selectPlant(plant) {
  console.log('🌱 Plant selected:', plant.name);
  currentPlant = plant;
  
  // Get soil data from manual form
  const temp = parseFloat(document.getElementById('manualTemp').value);
  const moisture = parseFloat(document.getElementById('manualMoisture').value);
  const ph = parseFloat(document.getElementById('manualPh').value);
  const n = parseFloat(document.getElementById('manualN').value);
  const p = parseFloat(document.getElementById('manualP').value);
  const k = parseFloat(document.getElementById('manualK').value);
  
  // Validate
  if (isNaN(temp) || isNaN(moisture) || isNaN(ph) || isNaN(n) || isNaN(p) || isNaN(k)) {
    alert('❌ يرجى ملء جميع حقول التربة أولاً');
    return;
  }
  
  const soilData = { temp, moisture, ph, n, p, k };
  
  console.log('📊 Soil data:', soilData);
  
  // Analyze compatibility
  analyzeManualMode(plant, soilData);
}

// ============================================================
// AUTO MODE ANALYSIS
// ============================================================

function analyzeAutoMode(e) {
  e.preventDefault();
  console.log('📊 Starting AUTO mode analysis...');
  
  // Get form values
  const temp = parseFloat(document.getElementById('temp').value);
  const moisture = parseFloat(document.getElementById('moisture').value);
  const ph = parseFloat(document.getElementById('ph').value);
  const n = parseFloat(document.getElementById('n').value);
  const p = parseFloat(document.getElementById('p').value);
  const k = parseFloat(document.getElementById('k').value);
  
  // Validate
  if (isNaN(temp) || isNaN(moisture) || isNaN(ph) || isNaN(n) || isNaN(p) || isNaN(k)) {
    alert('❌ يرجى ملء جميع الحقول برقام صحيحة');
    return;
  }
  
  currentSoilData = { temp, moisture, ph, n, p, k };
  
  // Find suitable plants
  const suitable = [];
  const unsuitable = [];
  
  plants.forEach(plant => {
    if (checkPlantCompatibility(plant, currentSoilData)) {
      suitable.push(plant);
    } else {
      unsuitable.push(plant);
    }
  });
  
  console.log('✅ Suitable plants:', suitable.length);
  console.log('❌ Unsuitable plants:', unsuitable.length);
  
  displayAutoResults(suitable, unsuitable, currentSoilData);
}

function fillExampleValues(e) {
  e.preventDefault();
  console.log('📋 Filling example values...');
  
  document.getElementById('temp').value = '22.5';
  document.getElementById('moisture').value = '70';
  document.getElementById('ph').value = '6.5';
  document.getElementById('n').value = '50';
  document.getElementById('p').value = '40';
  document.getElementById('k').value = '45';
}

// ============================================================
// MANUAL MODE ANALYSIS
// ============================================================

function analyzeManualMode(plant, soilData) {
  console.log('🌱 MANUAL mode: Analyzing plant vs soil...');
  console.log('Plant:', plant.name);
  console.log('Soil:', soilData);
  
  currentPlant = plant;
  currentSoilData = soilData;
  
  const compatibility = checkPlantCompatibility(plant, soilData);
  console.log('🔄 Compatibility:', compatibility);
  
  // Analyze AI - find deficiencies
  const analysis = analyzeAI(plant, soilData);
  console.log('🤖 AI Analysis:', analysis);
  
  // Display results
  displayManualResults(plant, soilData, analysis);
}

// ============================================================
// PLANT COMPATIBILITY CHECK
// ============================================================

function checkPlantCompatibility(plant, soilData) {
  const checks = {
    temp: soilData.temp >= plant.tempMin && soilData.temp <= plant.tempMax,
    moisture: soilData.moisture >= plant.moistureMin && soilData.moisture <= plant.moistureMax,
    ph: soilData.ph >= plant.phMin && soilData.ph <= plant.phMax,
    n: soilData.n >= plant.nMin,
    p: soilData.p >= plant.pMin,
    k: soilData.k >= plant.kMin
  };
  
  console.log('🔍 Compatibility checks:', checks);
  
  return Object.values(checks).every(v => v === true);
}

// ============================================================
// AI ANALYSIS - FIND DEFICIENCIES & SOLUTIONS
// ============================================================

function analyzeAI(plant, soilData) {
  console.log('🤖 AI Analyzer starting...');
  
  const analysis = {
    deficiencies: [],
    solutions: [],
    totalScore: 100,
    quality: 'ممتازة'
  };
  
  // Check Nitrogen
  if (soilData.n < plant.nMin) {
    const deficit = plant.nMin - soilData.n;
    analysis.deficiencies.push({
      type: 'nitrogen',
      current: soilData.n,
      required: plant.nMin,
      deficit: deficit,
      description: 'نقص النيتروجين - يؤثر على نمو الأوراق والسيقان'
    });
    analysis.solutions.push(...getSolutions('nitrogen', deficit));
    analysis.totalScore -= (deficit * 2);
  }
  
  // Check Phosphorus
  if (soilData.p < plant.pMin) {
    const deficit = plant.pMin - soilData.p;
    analysis.deficiencies.push({
      type: 'phosphorus',
      current: soilData.p,
      required: plant.pMin,
      deficit: deficit,
      description: 'نقص الفسفور - يؤثر على جودة الثمار والجذور'
    });
    analysis.solutions.push(...getSolutions('phosphorus', deficit));
    analysis.totalScore -= (deficit * 2);
  }
  
  // Check Potassium
  if (soilData.k < plant.kMin) {
    const deficit = plant.kMin - soilData.k;
    analysis.deficiencies.push({
      type: 'potassium',
      current: soilData.k,
      required: plant.kMin,
      deficit: deficit,
      description: 'نقص البوتاسيوم - يؤثر على قوة النبات ومقاومة الأمراض'
    });
    analysis.solutions.push(...getSolutions('potassium', deficit));
    analysis.totalScore -= (deficit * 2);
  }
  
  // Set quality level
  if (analysis.totalScore >= 80) analysis.quality = '✅ ممتازة';
  else if (analysis.totalScore >= 60) analysis.quality = '🟡 جيدة';
  else if (analysis.totalScore >= 40) analysis.quality = '🟠 متوسطة';
  else analysis.quality = '🔴 ضعيفة';
  
  console.log('✅ AI Analysis complete:', analysis);
  return analysis;
}

function getSolutions(nutrient, deficit) {
  if (!solutions[nutrient]) return [];
  
  return solutions[nutrient].map(sol => {
    // Calculate grams needed based on deficit
    const calculatedGrams = Math.round(sol.grams * (deficit / 50));
    
    return {
      nutrient: nutrient,
      name: sol.name,
      nameEn: sol.nameEn,
      grams: calculatedGrams,
      days: sol.days,
      urgency: deficit > 30 ? 'عاجل' : deficit > 15 ? 'متوسط' : 'عادي'
    };
  });
}

// ============================================================
// DISPLAY RESULTS
// ============================================================

function displayAutoResults(suitable, unsuitable, soilData) {
  console.log('📈 Displaying AUTO mode results...');
  
  hideAllScreens();
  document.getElementById('resultsSection').classList.remove('hidden');
  
  // Display soil quality
  const qualityScore = Math.min(100, Math.max(0, (soilData.n + soilData.p + soilData.k) / 3));
  document.getElementById('qualityBar').style.width = qualityScore + '%';
  
  // Display values grid
  const valuesGrid = document.getElementById('valuesGrid');
  valuesGrid.innerHTML = `
    <div class="value-item">
      <span class="value-label">🌡️ درجة الحرارة</span>
      <span class="value-number">${soilData.temp}°C</span>
    </div>
    <div class="value-item">
      <span class="value-label">💧 الرطوبة</span>
      <span class="value-number">${soilData.moisture}%</span>
    </div>
    <div class="value-item">
      <span class="value-label">⚗️ pH</span>
      <span class="value-number">${soilData.ph}</span>
    </div>
    <div class="value-item">
      <span class="value-label">🌱 النيتروجين</span>
      <span class="value-number">${soilData.n}</span>
    </div>
    <div class="value-item">
      <span class="value-label">🌻 الفسفور</span>
      <span class="value-number">${soilData.p}</span>
    </div>
    <div class="value-item">
      <span class="value-label">💪 البوتاسيوم</span>
      <span class="value-number">${soilData.k}</span>
    </div>
  `;
  
  // Display suitable plants
  const autoContainer = document.getElementById('autoResultContainer');
  let html = `
    <h3>🌿 النباتات المناسبة (${suitable.length})</h3>
    <div class="plants-grid">
  `;
  
  suitable.forEach(plant => {
    html += `
      <div class="plant-card suitable">
        <span class="plant-emoji">${plant.name.split(' ')[0]}</span>
        <span class="plant-title">${plant.name}</span>
        <span class="plant-status">✅ مناسبة</span>
      </div>
    `;
  });
  
  html += `</div>`;
  
  // Display unsuitable plants
  if (unsuitable.length > 0) {
    html += `
      <h3>❌ النباتات غير المناسبة (${unsuitable.length})</h3>
      <div class="plants-grid">
    `;
    
    unsuitable.forEach(plant => {
      html += `
        <div class="plant-card unsuitable">
          <span class="plant-emoji">${plant.name.split(' ')[0]}</span>
          <span class="plant-title">${plant.name}</span>
          <span class="plant-status">❌ غير مناسبة</span>
        </div>
      `;
    });
    
    html += `</div>`;
  }
  
  autoContainer.innerHTML = html;
  console.log('✅ AUTO results displayed');
}

function displayManualResults(plant, soilData, analysis) {
  console.log('📈 Displaying MANUAL mode results...');
  
  hideAllScreens();
  document.getElementById('resultsSection').classList.remove('hidden');
  document.getElementById('manualResultContainer').classList.remove('hidden');
  document.getElementById('autoResultContainer').classList.add('hidden');
  
  // Display plant name
  document.getElementById('selectedPlantName').textContent = plant.name;
  
  // Display soil quality
  const qualityScore = Math.min(100, Math.max(0, analysis.totalScore));
  document.getElementById('qualityBar').style.width = qualityScore + '%';
  
  // Display values
  const valuesGrid = document.getElementById('valuesGrid');
  valuesGrid.innerHTML = `
    <div class="value-item">
      <span class="value-label">🌡️ درجة الحرارة</span>
      <span class="value-number">${soilData.temp}°C</span>
      <span class="value-range">(مطلوب: ${plant.tempMin}°-${plant.tempMax}°)</span>
    </div>
    <div class="value-item">
      <span class="value-label">💧 الرطوبة</span>
      <span class="value-number">${soilData.moisture}%</span>
      <span class="value-range">(مطلوب: ${plant.moistureMin}%-${plant.moistureMax}%)</span>
    </div>
    <div class="value-item">
      <span class="value-label">⚗️ pH</span>
      <span class="value-number">${soilData.ph}</span>
      <span class="value-range">(مطلوب: ${plant.phMin}-${plant.phMax})</span>
    </div>
    <div class="value-item">
      <span class="value-label">🌱 النيتروجين</span>
      <span class="value-number">${soilData.n}</span>
      <span class="value-range">(مطلوب: ${plant.nMin}+)</span>
    </div>
    <div class="value-item">
      <span class="value-label">🌻 الفسفور</span>
      <span class="value-number">${soilData.p}</span>
      <span class="value-range">(مطلوب: ${plant.pMin}+)</span>
    </div>
    <div class="value-item">
      <span class="value-label">💪 البوتاسيوم</span>
      <span class="value-number">${soilData.k}</span>
      <span class="value-range">(مطلوب: ${plant.kMin}+)</span>
    </div>
  `;
  
  // Display compatibility status
  const compatibility = checkPlantCompatibility(plant, soilData);
  const statusContainer = document.getElementById('statusBox');
  
  if (compatibility) {
    statusContainer.innerHTML = `
      <div class="status-good">
        ✅ <strong>التربة مناسبة تماماً للنبات!</strong>
        <p>جميع المتطلبات متوافقة - يمكنك البدء بالزراعة الآن</p>
      </div>
    `;
  } else {
    statusContainer.innerHTML = `
      <div class="status-warning">
        ⚠️ <strong>التربة تحتاج لتحسينات</strong>
        <p>يوجد نقائص في المغذيات - اتبع التوصيات أدناه</p>
      </div>
    `;
  }
  
  // Display deficiencies and solutions
  const manualContainer = document.getElementById('manualResultContainer');
  let html = `<h3 data-ar="النقائص المكتشفة" data-en="Deficiencies Found">النقائص المكتشفة</h3>`;
  
  if (analysis.deficiencies.length === 0) {
    html += `<p class="no-issues">✅ لا توجد نقائص - التربة في حالة ممتازة!</p>`;
  } else {
    html += `<div class="deficiencies-list">`;
    
    analysis.deficiencies.forEach(def => {
      html += `
        <div class="deficiency-card">
          <h4>${def.description}</h4>
          <p>الحالي: <strong>${def.current}</strong> | المطلوب: <strong>${def.required}</strong> | النقص: <strong>${def.deficit}</strong></p>
        </div>
      `;
    });
    
    html += `</div>`;
    
    // Display solutions
    html += `<h3 data-ar="الحلول الطبيعية الموصى بها" data-en="Recommended Natural Solutions">الحلول الطبيعية الموصى بها</h3>`;
    html += `<div class="solutions-grid">`;
    
    analysis.solutions.forEach(sol => {
      html += `
        <div class="solution-card">
          <h4>${sol.name}</h4>
          <p><strong>📦 الكمية:</strong> ${sol.grams} جرام</p>
          <p><strong>⏱️ التأثير:</strong> ${sol.days} أيام</p>
          <p><strong>🚨 الاستعجالية:</strong> ${sol.urgency}</p>
        </div>
      `;
    });
    
    html += `</div>`;
  }
  
  // Add quality assessment
  html += `
    <div class="quality-assessment">
      <h3>📊 تقييم التربة الشامل</h3>
      <p><strong>جودة التربة:</strong> ${analysis.quality}</p>
      <p><strong>النسبة:</strong> ${Math.round(analysis.totalScore)}%</p>
    </div>
  `;
  
  manualContainer.innerHTML = html;
  console.log('✅ MANUAL results displayed');
}

console.log('🚀 App.js loaded successfully');
