// قاعدة بيانات شاملة للنباتات
const plants = [
  {
    id: "tomato",
    name: "الطماطم",
    icon: "🍅",
    tempMin: 18,
    tempMax: 30,
    moistureMin: 50,
    moistureMax: 80,
    phMin: 5.5,
    phMax: 7.5,
    nMin: 60,
    pMin: 60,
    kMin: 60,
    caMin: 40,
    mgMin: 30
  },
  {
    id: "potato",
    name: "البطاطس",
    icon: "🥔",
    tempMin: 15,
    tempMax: 24,
    moistureMin: 60,
    moistureMax: 80,
    phMin: 5.0,
    phMax: 6.5,
    nMin: 60,
    pMin: 60,
    kMin: 80,
    caMin: 35,
    mgMin: 25
  },
  {
    id: "wheat",
    name: "القمح",
    icon: "🌾",
    tempMin: 10,
    tempMax: 25,
    moistureMin: 40,
    moistureMax: 70,
    phMin: 6.0,
    phMax: 7.5,
    nMin: 80,
    pMin: 60,
    kMin: 60,
    caMin: 40,
    mgMin: 30
  },
  {
    id: "beans",
    name: "الفاصوليا",
    icon: "🫘",
    tempMin: 16,
    tempMax: 27,
    moistureMin: 50,
    moistureMax: 80,
    phMin: 6.0,
    phMax: 7.5,
    nMin: 40,
    pMin: 60,
    kMin: 60,
    caMin: 35,
    mgMin: 28
  },
  {
    id: "carrot",
    name: "الجزر",
    icon: "🥕",
    tempMin: 10,
    tempMax: 24,
    moistureMin: 50,
    moistureMax: 75,
    phMin: 5.8,
    phMax: 7.0,
    nMin: 50,
    pMin: 50,
    kMin: 70,
    caMin: 35,
    mgMin: 25
  },
  {
    id: "lettuce",
    name: "الخس",
    icon: "🥬",
    tempMin: 10,
    tempMax: 20,
    moistureMin: 60,
    moistureMax: 80,
    phMin: 6.0,
    phMax: 7.0,
    nMin: 50,
    pMin: 50,
    kMin: 50,
    caMin: 30,
    mgMin: 20
  },
  {
    id: "chili",
    name: "الفلفل الحار",
    icon: "🌶️",
    tempMin: 18,
    tempMax: 30,
    moistureMin: 60,
    moistureMax: 80,
    phMin: 6.0,
    phMax: 7.0,
    nMin: 80,
    pMin: 60,
    kMin: 70,
    caMin: 40,
    mgMin: 30
  },
  {
    id: "spinach",
    name: "السبانخ",
    icon: "🌿",
    tempMin: 10,
    tempMax: 20,
    moistureMin: 60,
    moistureMax: 80,
    phMin: 6.5,
    phMax: 7.5,
    nMin: 70,
    pMin: 50,
    kMin: 60,
    caMin: 40,
    mgMin: 30
  },
  {
    id: "onion",
    name: "البصل",
    icon: "🧅",
    tempMin: 15,
    tempMax: 25,
    moistureMin: 50,
    moistureMax: 70,
    phMin: 6.0,
    phMax: 7.5,
    nMin: 60,
    pMin: 50,
    kMin: 80,
    caMin: 35,
    mgMin: 25
  },
  {
    id: "cucumber",
    name: "الخيار",
    icon: "🥒",
    tempMin: 20,
    tempMax: 32,
    moistureMin: 70,
    moistureMax: 85,
    phMin: 5.5,
    phMax: 7.0,
    nMin: 70,
    pMin: 50,
    kMin: 70,
    caMin: 30,
    mgMin: 25
  },
  {
    id: "corn",
    name: "الذرة",
    icon: "🌽",
    tempMin: 18,
    tempMax: 32,
    moistureMin: 50,
    moistureMax: 70,
    phMin: 5.5,
    phMax: 7.5,
    nMin: 90,
    pMin: 60,
    kMin: 80,
    caMin: 40,
    mgMin: 30
  },
  {
    id: "strawberry",
    name: "الفراولة",
    icon: "🍓",
    tempMin: 13,
    tempMax: 24,
    moistureMin: 60,
    moistureMax: 80,
    phMin: 5.5,
    phMax: 6.5,
    nMin: 60,
    pMin: 80,
    kMin: 60,
    caMin: 35,
    mgMin: 25
  },
  {
    id: "apple",
    name: "التفاح",
    icon: "🍎",
    tempMin: 7,
    tempMax: 24,
    moistureMin: 50,
    moistureMax: 75,
    phMin: 6.0,
    phMax: 7.5,
    nMin: 50,
    pMin: 40,
    kMin: 60,
    caMin: 45,
    mgMin: 30
  }
];

// قاعدة بيانات المواد الطبيعية للتحسين
const naturalMaterials = {
  nitrogen: [
    { name: "سماد الدجاج", amount: "1-2 كيلو لكل 10 متر مربع", description: "غني جداً بالنيتروجين" },
    { name: "سماد البقر", amount: "2-3 كيلو لكل 10 متر مربع", description: "مصدر جيد للنيتروجين والمادة العضوية" },
    { name: "نبات البرسيم", amount: "نم محاصيل البرسيم بالتناوب", description: "يثبت النيتروجين من الهواء" },
    { name: "قشريات مطحونة", amount: "500 غرام لكل متر مربع", description: "غنية بالنيتروجين الطبيعي" }
  ],
  phosphorus: [
    { name: "دقيق العظام", amount: "500-1000 غرام لكل 10 متر مربع", description: "مصدر ممتاز للفسفور" },
    { name: "رماد الخشب", amount: "1 كيلو لكل 10 متر مربع", description: "يحتوي على فسفور وبوتاسيوم" },
    { name: "صخر الفسفات الطبيعي", amount: "2 كيلو لكل 10 متر مربع", description: "مصدر طبيعي مباشر للفسفور" }
  ],
  potassium: [
    { name: "رماد الخشب", amount: "1 كيلو لكل 10 متر مربع", description: "غني بالبوتاسيوم والعناصر الأخرى" },
    { name: "دبس السكر المخفف", amount: "1 لتر في 10 لتر ماء", description: "يحتوي على بوتاسيوم وسكريات" },
    { name: "قشور الموز", amount: "جفف وطحن - 300 غرام لكل 10 متر مربع", description: "مصدر طبيعي غني للبوتاسيوم" }
  ],
  calcium: [
    { name: "قشرة البيض المطحونة", amount: "500 غرام لكل 10 متر مربع", description: "مصدر ممتاز للكالسيوم" },
    { name: "الجير الزراعي", amount: "1-2 كيلو لكل 10 متر مربع", description: "يرفع درجة الحموضة ويضيف كالسيوم" },
    { name: "الطباشير المطحون", amount: "1 كيلو لكل 10 متر مربع", description: "مصدر طبيعي للكالسيوم" }
  ],
  magnesium: [
    { name: "ملح إبسوم (كبريتات الماغنيسيوم)", amount: "15 غرام لكل متر مربع", description: "مصدر سريع الامتصاص" },
    { name: "دولوميت (جير ماغنيسي)", amount: "1-2 كيلو لكل 10 متر مربع", description: "يوفر كالسيوم وماغنيسيوم معاً" },
    { name: "أوراق السبانخ المحترقة", amount: "500 غرام لكل 10 متر مربع", description: "غنية بالماغنيسيوم" }
  ],
  acidity: [
    { name: "الجير الزراعي", amount: "1-2 كيلو لكل 10 متر مربع", description: "يرفع درجة الحموضة" },
    { name: "رماد الخشب", amount: "1 كيلو لكل 10 متر مربع", description: "يرفع الحموضة قليلاً" }
  ],
  alkalinity: [
    { name: "كبريتة العناصر (الكبريت الزراعي)", amount: "500-1000 غرام لكل 10 متر مربع", description: "يخفض درجة الحموضة تدريجياً" },
    { name: "السماد العضوي", amount: "2-3 كيلو لكل 10 متر مربع", description: "يخفض الحموضة مع وقت" },
    { name: "تفل القهوة أو الشاي", amount: "1 كيلو لكل 10 متر مربع", description: "حمضية طفيفة وتحسين التربة" }
  ],
  moisture: [
    { name: "المادة العضوية (السماد)", amount: "2-3 كيلو لكل 10 متر مربع", description: "تحسن احتفاظ الرطوبة" },
    { name: "الكومبوست", amount: "2-3 كيلو لكل 10 متر مربع", description: "تحسن التهوية والرطوبة" },
    { name: "نشارة الخشب", amount: "1 كيلو لكل 10 متر مربع", description: "طبقة عازلة تحافظ على الرطوبة" }
  ]
};

// حالة التطبيق
let appState = {
  mode: null, // 'auto' أو 'manual'
  soilData: null,
  selectedPlant: null
};

// تهيئة التطبيق
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  renderPlantSelector();
});

function setupEventListeners() {
  // أزرار تبديل الوضع
  document.getElementById("autoModeBtn").addEventListener("click", () => switchToAutoMode());
  document.getElementById("manualModeBtn").addEventListener("click", () => switchToManualMode());
  
  // أزرار التحليل
  document.getElementById("analyzeBtn").addEventListener("click", analyzeSoil);
  document.getElementById("mockBtn").addEventListener("click", useExampleValues);
  
  // أزرار العودة
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
    alert("يرجى ملء جميع الحقول برقام صحيحة");
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
    alert("يرجى اختيار نبات أولاً");
    return;
  }

  const reading = appState.soilData;
  const result = checkPlantSuitability(appState.selectedPlant, reading);

  renderValues(reading);
  renderManualResults(result);
  renderImprovementTips(reading);
  renderStatusBox(result.suitable ? 1 : 0, result.suitable ? 0 : 1);

  document.getElementById("selectedPlantName").textContent = appState.selectedPlant.name;
  document.getElementById("autoResultContainer").classList.add("hidden");
  document.getElementById("manualResultContainer").classList.remove("hidden");
  hideAllScreens();
  document.getElementById("resultsSection").classList.remove("hidden");
}

function renderPlantSelector() {
  const selector = document.getElementById("plantsSelector");
  selector.innerHTML = '';

  plants.forEach((plant) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "plant-btn";
    btn.innerHTML = `<span style="font-size: 2rem;">${plant.icon}</span><span>${plant.name}</span>`;
    btn.addEventListener("click", () => {
      appState.selectedPlant = plant;
      // فتح شاشة إدخال البيانات
      hideAllScreens();
      document.getElementById("autoModeScreen").classList.remove("hidden");
    });
    selector.appendChild(btn);
  });
}

function checkPlantSuitability(plant, r) {
  const issues = [];
  const tips = new Set();
  const generalTips = new Set();

  if (r.temp < plant.tempMin) {
    issues.push(`درجة الحرارة منخفضة جداً (الحد الأدنى: ${plant.tempMin}°C)`);
    tips.add("زراعة النبات في فصل أكثر دفئاً أو استخدام بيت زجاجي.");
    generalTips.add("درجة الحرارة منخفضة جداً");
  } else if (r.temp > plant.tempMax) {
    issues.push(`درجة الحرارة مرتفعة جداً (الحد الأقصى: ${plant.tempMax}°C)`);
    tips.add("توفير الظل والرطوبة للنبات أثناء ذروة الحرارة.");
    generalTips.add("درجة الحرارة مرتفعة جداً");
  }

  if (r.moisture < plant.moistureMin) {
    issues.push(`الرطوبة منخفضة جداً (الحد الأدنى: ${plant.moistureMin}%)`);
    tips.add("زيادة الري والعناية بالنبات وإضافة طبقة من النشارة.");
    generalTips.add("الرطوبة منخفضة جداً - زد الري");
  } else if (r.moisture > plant.moistureMax) {
    issues.push(`الرطوبة مرتفعة جداً (الحد الأقصى: ${plant.moistureMax}%)`);
    tips.add("تحسين تصريف التربة وتقليل الري.");
    generalTips.add("الرطوبة مرتفعة جداً - قلل الري وحسّن التصريف");
  }

  if (r.ph < plant.phMin) {
    issues.push(`التربة حمضية جداً (الحد الأدنى: ${plant.phMin.toFixed(1)})`);
    tips.add("إضافة الجير الزراعي لرفع درجة الحموضة.");
    generalTips.add("التربة حمضية جداً");
  } else if (r.ph > plant.phMax) {
    issues.push(`التربة قلوية جداً (الحد الأقصى: ${plant.phMax.toFixed(1)})`);
    tips.add("إضافة الكبريت الزراعي أو السماد العضوي لخفض الحموضة.");
    generalTips.add("التربة قلوية جداً");
  }

  if (r.n < plant.nMin) {
    issues.push("النيتروجين ناقص - سيؤثر على نمو الأوراق");
    tips.add("استخدام سماد عضوي غني بالنيتروجين.");
    generalTips.add("النيتروجين منخفض");
  }
  if (r.p < plant.pMin) {
    issues.push("الفسفور ناقص - سيؤثر على جودة الثمار");
    tips.add("استخدام دقيق العظام أو سماد فسفوري.");
    generalTips.add("الفسفور منخفض");
  }
  if (r.k < plant.kMin) {
    issues.push("البوتاسيوم ناقص - سيؤثر على قوة النبات");
    tips.add("استخدام رماد الخشب أو قشور الموز المطحونة.");
    generalTips.add("البوتاسيوم منخفض");
  }

  const suitable = issues.length === 0;

  if (suitable) {
    tips.add("التربة مناسبة تماماً - حافظ على العناية المنتظمة.");
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

  const entries = [
    ["درجة الحرارة", `${r.temp.toFixed(1)} °C`],
    ["الرطوبة", `${r.moisture.toFixed(1)} %`],
    ["درجة الحموضة", r.ph.toFixed(1)],
    ["النيتروجين (N)", r.n.toFixed(1)],
    ["الفسفور (P)", r.p.toFixed(1)],
    ["البوتاسيوم (K)", r.k.toFixed(1)]
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

  suitableList.innerHTML = "";
  unsuitableList.innerHTML = "";

  if (suitable.length === 0) {
    suitableList.innerHTML =
      '<p style="color: #666;">لا توجد نباتات مناسبة حالياً. يرجى تحسين التربة.</p>';
  } else {
    suitable.forEach((res) => {
      suitableList.appendChild(createPlantCard(res, true));
    });
  }

  if (unsuitable.length === 0) {
    unsuitableList.innerHTML = "<p style='color: #666;'>جميع النباتات مناسبة!</p>";
  } else {
    unsuitable.forEach((res) => {
      unsuitableList.appendChild(createPlantCard(res, false));
    });
  }
}

function renderManualResults(result) {
  const compatibility = document.getElementById("plantCompatibility");
  compatibility.innerHTML = "";

  if (result.suitable) {
    compatibility.innerHTML = '<div class="status-box status-good" style="margin-bottom: 15px;">✓ التربة مناسبة تماماً لهذا النبات!</div>';
  } else {
    compatibility.innerHTML = '<div class="status-box status-poor" style="margin-bottom: 15px;">✗ التربة غير مناسبة للنبات</div>';
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

  const issuesText =
    result.issues.length === 0
      ? "لا توجد مشاكل"
      : result.issues.map((i) => `• ${i}`).join("<br>");

  const tipsText =
    result.tips.length === 0
      ? ""
      : "<br><strong>نصائح:</strong><br>" +
        result.tips.map((t) => `• ${t}`).join("<br>");

  card.innerHTML = `
    <div class="plant-header">
      <div>
        <span style="font-size: 1.5rem;">${result.plant.icon}</span>
        <span class="plant-name"> ${result.plant.name}</span>
      </div>
      <span class="plant-tag ${isGood ? "" : "bad"}">
        ${isGood ? "✓ مناسبة" : "✗ غير مناسبة"}
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

  const issues = [];

  // تحديد المشاكل
  if (reading.n < 60) issues.push({ type: 'nitrogen', level: 60 - reading.n });
  if (reading.p < 60) issues.push({ type: 'phosphorus', level: 60 - reading.p });
  if (reading.k < 60) issues.push({ type: 'potassium', level: 60 - reading.k });
  if (reading.ph < 6.0) issues.push({ type: 'acidity' });
  if (reading.ph > 7.0) issues.push({ type: 'alkalinity' });
  if (reading.moisture < 50) issues.push({ type: 'moisture' });

  if (issues.length === 0) {
    container.innerHTML = '<p style="color: #666;">التربة في حالة جيدة!</p>';
    return;
  }

  issues.forEach((issue) => {
    let materials = [];
    let title = '';

    if (issue.type === 'nitrogen') {
      materials = naturalMaterials.nitrogen;
      title = `تحسين النيتروجين (ناقص بـ ${issue.level.toFixed(0)} وحدة)`;
    } else if (issue.type === 'phosphorus') {
      materials = naturalMaterials.phosphorus;
      title = `تحسين الفسفور (ناقص بـ ${issue.level.toFixed(0)} وحدة)`;
    } else if (issue.type === 'potassium') {
      materials = naturalMaterials.potassium;
      title = `تحسين البوتاسيوم (ناقص بـ ${issue.level.toFixed(0)} وحدة)`;
    } else if (issue.type === 'acidity') {
      materials = naturalMaterials.acidity;
      title = 'تقليل حموضة التربة';
    } else if (issue.type === 'alkalinity') {
      materials = naturalMaterials.alkalinity;
      title = 'تقليل قلوية التربة';
    } else if (issue.type === 'moisture') {
      materials = naturalMaterials.moisture;
      title = 'تحسين احتفاظ التربة بالرطوبة';
    }

    const section = document.createElement("div");
    section.className = "improvement-section";
    section.innerHTML = `<h4>${title}</h4>`;

    materials.forEach((material) => {
      const item = document.createElement("div");
      item.className = "material-item";
      item.innerHTML = `
        <strong>${material.name}</strong>
        <p style="font-size: 0.9rem; color: #666; margin: 5px 0;">${material.description}</p>
        <p style="font-size: 0.85rem; color: #059669;"><strong>الكمية الموصى بها:</strong> ${material.amount}</p>
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

  const total = okCount + badCount;
  const ratio = total === 0 ? 0 : okCount / total;

  if (ratio >= 0.6) {
    statusClass = "status-good";
    text = `✓ حالة التربة: ممتازة - ${okCount} نبات(ات) مناسبة`;
  } else if (ratio >= 0.3) {
    statusClass = "status-fair";
    text = `⚠ حالة التربة: متوسطة - ${okCount} نبات(ات) مناسبة`;
  } else {
    statusClass = "status-poor";
    text = `✗ حالة التربة: ضعيفة - فقط ${okCount} نبات(ات) مناسبة`;
  }

  box.className = `status-box ${statusClass}`;
  box.textContent = text;
}

function renderGeneralTips(tips) {
  const list = document.getElementById("tipsList");
  list.innerHTML = "";
  if (tips.length === 0) {
    const li = document.createElement("li");
    li.textContent = "التربة في حالة جيدة. استمر في العناية المنتظمة.";
    list.appendChild(li);
    return;
  }
  tips.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    list.appendChild(li);
  });
}
