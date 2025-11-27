// Simple plant database
const plants = [
  {
    id: "tomato",
    name: "Tomato",
    icon: "??",
    tempMin: 18,
    tempMax: 30,
    moistureMin: 50,
    moistureMax: 80,
    phMin: 5.5,
    phMax: 7.5,
    nMin: 60,
    pMin: 60,
    kMin: 60
  },
  {
    id: "potato",
    name: "Potato",
    icon: "??",
    tempMin: 15,
    tempMax: 24,
    moistureMin: 60,
    moistureMax: 80,
    phMin: 5.0,
    phMax: 6.5,
    nMin: 60,
    pMin: 60,
    kMin: 80
  },
  {
    id: "wheat",
    name: "Wheat",
    icon: "??",
    tempMin: 10,
    tempMax: 25,
    moistureMin: 40,
    moistureMax: 70,
    phMin: 6.0,
    phMax: 7.5,
    nMin: 80,
    pMin: 60,
    kMin: 60
  },
  {
    id: "beans",
    name: "Beans",
    icon: "??",
    tempMin: 16,
    tempMax: 27,
    moistureMin: 50,
    moistureMax: 80,
    phMin: 6.0,
    phMax: 7.5,
    nMin: 40,
    pMin: 60,
    kMin: 60
  },
  {
    id: "strawberry",
    name: "Strawberry",
    icon: "??",
    tempMin: 13,
    tempMax: 24,
    moistureMin: 60,
    moistureMax: 80,
    phMin: 5.5,
    phMax: 6.5,
    nMin: 60,
    pMin: 80,
    kMin: 60
  },
  {
    id: "maize",
    name: "Maize",
    icon: "??",
    tempMin: 18,
    tempMax: 32,
    moistureMin: 50,
    moistureMax: 70,
    phMin: 5.5,
    phMax: 7.5,
    nMin: 90,
    pMin: 60,
    kMin: 80
  },
  {
    id: "rice",
    name: "Rice",
    icon: "??",
    tempMin: 20,
    tempMax: 35,
    moistureMin: 70,
    moistureMax: 90,
    phMin: 5.5,
    phMax: 7.0,
    nMin: 100,
    pMin: 60,
    kMin: 80
  },
  {
    id: "lettuce",
    name: "Lettuce",
    icon: "??",
    tempMin: 10,
    tempMax: 20,
    moistureMin: 60,
    moistureMax: 80,
    phMin: 6.0,
    phMax: 7.0,
    nMin: 50,
    pMin: 50,
    kMin: 50
  },
  {
    id: "chili",
    name: "Chili Pepper",
    icon: "???",
    tempMin: 18,
    tempMax: 30,
    moistureMin: 60,
    moistureMax: 80,
    phMin: 6.0,
    phMax: 7.0,
    nMin: 80,
    pMin: 60,
    kMin: 70
  },
  {
    id: "cabbage",
    name: "Cabbage",
    icon: "??",
    tempMin: 13,
    tempMax: 24,
    moistureMin: 60,
    moistureMax: 80,
    phMin: 6.0,
    phMax: 7.5,
    nMin: 80,
    pMin: 60,
    kMin: 70
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const mockBtn = document.getElementById("mockBtn");

  analyzeBtn.addEventListener("click", analyzeSoil);
  mockBtn.addEventListener("click", useExampleValues);
});

function useExampleValues() {
  document.getElementById("temp").value = 26;
  document.getElementById("moisture").value = 65;
  document.getElementById("ph").value = 6.5;
  document.getElementById("n").value = 80;
  document.getElementById("p").value = 70;
  document.getElementById("k").value = 90;
}

function analyzeSoil() {
  const temp = parseFloat(document.getElementById("temp").value);
  const moisture = parseFloat(document.getElementById("moisture").value);
  const ph = parseFloat(document.getElementById("ph").value);
  const n = parseFloat(document.getElementById("n").value);
  const p = parseFloat(document.getElementById("p").value);
  const k = parseFloat(document.getElementById("k").value);

  if (
    [temp, moisture, ph, n, p, k].some((v) => Number.isNaN(v))
  ) {
    alert("Please fill all fields with valid numbers.");
    return;
  }

  const reading = { temp, moisture, ph, n, p, k };

  // Build "measured values" UI
  renderValues(reading);

  // Analyze each plant
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

  renderPlants(suitable, unsuitable);
  renderTips(Array.from(generalIssues));
  renderStatusBox(suitable.length, unsuitable.length);

  document.getElementById("resultsSection").classList.remove("hidden");
}

function checkPlantSuitability(plant, r) {
  const issues = [];
  const tips = new Set();
  const generalTips = new Set();

  if (r.temp < plant.tempMin) {
    issues.push(`Temperature too low (needs = ${plant.tempMin}°C).`);
    tips.add("Plant later in a warmer season.");
  } else if (r.temp > plant.tempMax) {
    issues.push(`Temperature too high (max ${plant.tempMax}°C).`);
    tips.add("Provide shade or water during the hottest hours.");
  }

  if (r.moisture < plant.moistureMin) {
    issues.push(`Moisture too low (needs = ${plant.moistureMin}%).`);
    tips.add("Increase irrigation and use mulch to keep soil moist.");
    generalTips.add("Overall moisture is low. Consider more regular watering.");
  } else if (r.moisture > plant.moistureMax) {
    issues.push(`Moisture too high (max ${plant.moistureMax}%).`);
    tips.add("Improve drainage and reduce irrigation.");
    generalTips.add("Soil may be waterlogged. Improve drainage.");
  }

  if (r.ph < plant.phMin) {
    issues.push(`pH too low (needs = ${plant.phMin.toFixed(1)}).`);
    tips.add("To raise pH, add agricultural lime slowly and re-test.");
    generalTips.add("Soil is acidic. Check pH regularly and adjust with lime.");
  } else if (r.ph > plant.phMax) {
    issues.push(`pH too high (max ${plant.phMax.toFixed(1)}).`);
    tips.add("To lower pH, add compost or elemental sulfur carefully.");
    generalTips.add("Soil is alkaline. Add organic matter to lower pH.");
  }

  if (r.n < plant.nMin) {
    issues.push("Nitrogen (N) is too low for this plant.");
    tips.add("Use nitrogen-rich fertilizer or composted manure.");
    generalTips.add("Overall nitrogen is low. Add N fertilizer.");
  }
  if (r.p < plant.pMin) {
    issues.push("Phosphorus (P) is too low for this plant.");
    tips.add("Use phosphorus fertilizer like bone meal.");
    generalTips.add("Overall phosphorus is low. Add P fertilizer.");
  }
  if (r.k < plant.kMin) {
    issues.push("Potassium (K) is too low for this plant.");
    tips.add("Use potassium fertilizer such as potash.");
    generalTips.add("Overall potassium is low. Add K fertilizer.");
  }

  const suitable = issues.length === 0;

  if (suitable) {
    tips.add("Conditions look good. Maintain regular care and watering.");
  }

  return {
    plant,
    suitable,
    issues,
    tips: Array.from(tips),
    generalTips: Array.from(generalTips)
  };
}

/* ----- Rendering helpers ----- */

function renderValues(r) {
  const grid = document.getElementById("valuesGrid");
  grid.innerHTML = "";

  const entries = [
    ["Temperature", `${r.temp.toFixed(1)} °C`],
    ["Moisture", `${r.moisture.toFixed(1)} %`],
    ["pH", r.ph.toFixed(1)],
    ["Nitrogen (N)", r.n.toFixed(1)],
    ["Phosphorus (P)", r.p.toFixed(1)],
    ["Potassium (K)", r.k.toFixed(1)]
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

function renderPlants(suitable, unsuitable) {
  const suitableList = document.getElementById("suitableList");
  const unsuitableList = document.getElementById("unsuitableList");

  suitableList.innerHTML = "";
  unsuitableList.innerHTML = "";

  if (suitable.length === 0) {
    suitableList.innerHTML =
      '<p>No plant in the database is fully suitable. Try improving the soil.</p>';
  } else {
    suitable.forEach((res) => {
      suitableList.appendChild(createPlantCard(res, true));
    });
  }

  if (unsuitable.length === 0) {
    unsuitableList.innerHTML = "<p>All plants in the database look OK!</p>";
  } else {
    unsuitable.forEach((res) => {
      unsuitableList.appendChild(createPlantCard(res, false));
    });
  }
}

function createPlantCard(result, isGood) {
  const card = document.createElement("div");
  card.className = "plant-card";

  const issuesText =
    result.issues.length === 0
      ? "No major issues."
      : result.issues.map((i) => `• ${i}`).join("<br>");

  const tipsText =
    result.tips.length === 0
      ? ""
      : "<br><strong>Tips:</strong><br>" +
        result.tips.map((t) => `• ${t}`).join("<br>");

  card.innerHTML = `
    <div class="plant-header">
      <div>
        <span>${result.plant.icon}</span>
        <span class="plant-name"> ${result.plant.name}</span>
      </div>
      <span class="plant-tag ${isGood ? "" : "bad"}">
        ${isGood ? "Suitable" : "Not suitable"}
      </span>
    </div>
    <div class="plant-issues">
      ${issuesText}${tipsText}
    </div>
  `;

  return card;
}

function renderTips(tips) {
  const list = document.getElementById("tipsList");
  list.innerHTML = "";
  if (tips.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Soil looks good overall. Maintain regular care.";
    list.appendChild(li);
    return;
  }
  tips.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    list.appendChild(li);
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
    text = `Soil status: Good – ${okCount} plants are suitable.`;
  } else if (ratio >= 0.3) {
    statusClass = "status-fair";
    text = `Soil status: Fair – some plants are suitable (${okCount}).`;
  } else {
    statusClass = "status-poor";
    text = `Soil status: Poor – only ${okCount} plant(s) are suitable now.`;
  }

  box.className = `status-box ${statusClass}`;
  box.textContent = text;
}
