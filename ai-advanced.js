/**
 * محرك التحليل الذكي المتقدم
 * AI Advanced Analyzer - 2000+ Plants Support
 */

class AIAnalyzer {
  constructor() {
    // قاعدة بيانات المواد الطبيعية والكيميائية
    this.materials = {
      nitrogen: [
        { name: { ar: 'السماد العضوي', en: 'Organic Manure' }, n: 3, days: 7, cost: 50 },
        { name: { ar: 'سماد دجاج', en: 'Chicken Manure' }, n: 5, days: 5, cost: 100 },
        { name: { ar: 'نترات الكالسيوم', en: 'Calcium Nitrate' }, n: 15.5, days: 2, cost: 200 },
        { name: { ar: 'يوريا', en: 'Urea' }, n: 46, days: 1, cost: 150 },
        { name: { ar: 'نفايات النباتات', en: 'Plant Waste' }, n: 2.5, days: 10, cost: 20 }
      ],
      phosphorus: [
        { name: { ar: 'السوبر فوسفات', en: 'Superphosphate' }, p: 16, days: 7, cost: 80 },
        { name: { ar: 'فوسفات صخري', en: 'Rock Phosphate' }, p: 13, days: 14, cost: 60 },
        { name: { ar: 'عظام مطحونة', en: 'Bone Meal' }, p: 10, days: 21, cost: 70 },
        { name: { ar: 'سماد السمك', en: 'Fish Emulsion' }, p: 5, days: 3, cost: 120 }
      ],
      potassium: [
        { name: { ar: 'كبريتات البوتاسيوم', en: 'Potassium Sulfate' }, k: 50, days: 5, cost: 150 },
        { name: { ar: 'كلوريد البوتاسيوم', en: 'Potassium Chloride' }, k: 60, days: 3, cost: 120 },
        { name: { ar: 'الرماد', en: 'Wood Ash' }, k: 8, days: 7, cost: 30 },
        { name: { ar: 'سماد الطحالب', en: 'Seaweed' }, k: 12, days: 10, cost: 90 }
      ]
    };

    // نصائح زراعية
    this.tips = [
      { ar: 'سقي التربة في الصباح الباكر أفضل من المساء لتقليل الأمراض الفطرية', en: 'Water early morning to prevent fungal diseases' },
      { ar: 'دوّر المحاصيل سنوياً لتحسين صحة التربة', en: 'Rotate crops annually for soil health' },
      { ar: 'أضف السماد العضوي مرة كل موسم لتحسين خصوبة التربة', en: 'Add compost seasonally to improve soil fertility' },
      { ar: 'استخدم المهاد (Mulch) لتقليل التبخر والحشائش الضارة', en: 'Use mulch to reduce evaporation and weeds' },
      { ar: 'تجنب الإفراط في الري حتى لا تعفن الجذور', en: 'Avoid overwatering to prevent root rot' },
      { ar: 'استخدم السماد الأخضر (محاصيل فترة الراحة) لتحسين النيتروجين', en: 'Use green manure crops to improve nitrogen' },
      { ar: 'قم بفحص التربة سنوياً لمراقبة مستويات العناصر الغذائية', en: 'Test soil annually to monitor nutrient levels' },
      { ar: 'استخدم نظام الري بالتنقيط لتوفير المياه', en: 'Use drip irrigation to save water' },
      { ar: 'قلل استخدام المبيدات الكيماوية واستخدم البدائل الطبيعية', en: 'Use organic pest control methods' },
      { ar: 'نمّ النباتات المصاحبة لتحسين الإنتاجية والحماية من الآفات', en: 'Plant companion crops for natural pest control' }
    ];
  }

  /**
   * تحليل توافق النبات مع التربة
   */
  analyze(plant, soilData) {
    const score = this.calculateCompatibilityScore(plant, soilData);
    const deficiencies = this.identifyDeficiencies(plant, soilData);
    const solutions = this.generateSolutions(deficiencies);

    return {
      score: Math.round(score),
      deficiencies: solutions,
      suitable: score >= 70,
      details: {
        tempMatch: this.checkRange(soilData.temp, plant.tempMin, plant.tempMax),
        moistureMatch: this.checkRange(soilData.moisture, plant.moistureMin, plant.moistureMax),
        phMatch: this.checkRange(soilData.ph, plant.phMin, plant.phMax),
        nMatch: soilData.n >= plant.nMin,
        pMatch: soilData.p >= plant.pMin,
        kMatch: soilData.k >= plant.kMin
      }
    };
  }

  /**
   * حساب درجة التوافق (0-100)
   */
  calculateCompatibilityScore(plant, soilData) {
    let score = 100;

    // تقييم درجة الحرارة
    const tempDiff = this.calculateDeviation(
      soilData.temp,
      plant.tempMin,
      plant.tempMax
    );
    score -= Math.min(tempDiff * 5, 20);

    // تقييم الرطوبة
    const moistureDiff = this.calculateDeviation(
      soilData.moisture,
      plant.moistureMin,
      plant.moistureMax
    );
    score -= Math.min(moistureDiff * 3, 20);

    // تقييم pH
    const phDiff = Math.abs(
      soilData.ph - ((plant.phMin + plant.phMax) / 2)
    );
    score -= Math.min(phDiff * 10, 20);

    // تقييم النيتروجين
    if (soilData.n < plant.nMin) {
      const deficit = ((plant.nMin - soilData.n) / plant.nMin) * 100;
      score -= Math.min(deficit / 5, 15);
    }

    // تقييم الفسفور
    if (soilData.p < plant.pMin) {
      const deficit = ((plant.pMin - soilData.p) / plant.pMin) * 100;
      score -= Math.min(deficit / 5, 15);
    }

    // تقييم البوتاسيوم
    if (soilData.k < plant.kMin) {
      const deficit = ((plant.kMin - soilData.k) / plant.kMin) * 100;
      score -= Math.min(deficit / 5, 15);
    }

    return Math.max(0, score);
  }

  /**
   * تحديد النقائص الغذائية
   */
  identifyDeficiencies(plant, soilData) {
    const deficiencies = [];

    // النيتروجين
    if (soilData.n < plant.nMin) {
      deficiencies.push({
        type: 'N',
        name: 'النيتروجين',
        current: soilData.n,
        required: plant.nMin,
        deficit: plant.nMin - soilData.n
      });
    }

    // الفسفور
    if (soilData.p < plant.pMin) {
      deficiencies.push({
        type: 'P',
        name: 'الفسفور',
        current: soilData.p,
        required: plant.pMin,
        deficit: plant.pMin - soilData.p
      });
    }

    // البوتاسيوم
    if (soilData.k < plant.kMin) {
      deficiencies.push({
        type: 'K',
        name: 'البوتاسيوم',
        current: soilData.k,
        required: plant.kMin,
        deficit: plant.kMin - soilData.k
      });
    }

    return deficiencies;
  }

  /**
   * توليد الحلول والمقترحات
   */
  generateSolutions(deficiencies) {
    return deficiencies.map(def => {
      const typeKey = def.type === 'N' ? 'nitrogen' : def.type === 'P' ? 'phosphorus' : 'potassium';
      const materials = this.materials[typeKey];

      // اختر أفضل 3 مواد بناءً على السرعة والفعالية
      const bestMaterials = materials.slice().sort((a, b) => b[def.type.toLowerCase()] - a[def.type.toLowerCase()]).slice(0, 3);

      return {
        name: def.name,
        current: def.current,
        required: def.required,
        deficit: def.deficit.toFixed(2),
        description: this.generateDescription(def),
        solution: bestMaterials[0].name.ar,
        amount: this.calculateAmount(def.deficit, bestMaterials[0][def.type.toLowerCase()]),
        days: bestMaterials[0].days,
        alternatives: bestMaterials.slice(1).map(m => ({
          name: m.name.ar,
          amount: this.calculateAmount(def.deficit, m[def.type.toLowerCase()]),
          days: m.days
        }))
      };
    });
  }

  /**
   * حساب المقدار المطلوب بالجرامات
   */
  calculateAmount(deficit, nutrientPercentage) {
    // حساب المقدار لكل متر مربع
    // الصيغة: المقدار = (النقص / نسبة العنصر) × 1000
    const amountPerM2 = (deficit / nutrientPercentage) * 1000;
    return Math.round(amountPerM2);
  }

  /**
   * توليد وصف المشكلة
   */
  generateDescription(def) {
    const descriptions = {
      N: {
        ar: `النيتروجين ناقص: المستوى الحالي ${def.current} ppm، المطلوب ${def.required} ppm`,
        en: `Nitrogen deficit: Current ${def.current} ppm, Required ${def.required} ppm`
      },
      P: {
        ar: `الفسفور ناقص: المستوى الحالي ${def.current} ppm، المطلوب ${def.required} ppm`,
        en: `Phosphorus deficit: Current ${def.current} ppm, Required ${def.required} ppm`
      },
      K: {
        ar: `البوتاسيوم ناقص: المستوى الحالي ${def.current} ppm، المطلوب ${def.required} ppm`,
        en: `Potassium deficit: Current ${def.current} ppm, Required ${def.required} ppm`
      }
    };

    return descriptions[def.type].ar;
  }

  /**
   * حساب الانحراف عن النطاق المثالي
   */
  calculateDeviation(current, min, max) {
    const ideal = (min + max) / 2;
    if (current < min) return min - current;
    if (current > max) return current - max;
    return 0;
  }

  /**
   * التحقق من النطاق
   */
  checkRange(value, min, max) {
    return value >= min && value <= max;
  }

  /**
   * الحصول على نصائح عشوائية
   */
  getRandomTips(count = 3) {
    const shuffled = this.tips.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * توصيات متقدمة للاختيار اليدوي
   */
  getRecommendationsForPlant(plant, soilData) {
    const analysis = this.analyze(plant, soilData);
    
    const recommendations = {
      plant: plant,
      analysis: analysis,
      tips: [],
      waterSchedule: this.generateWaterSchedule(plant),
      fertilizingSchedule: this.generateFertilizingSchedule(plant, soilData),
      harvestDate: plant.harvestDays ? `${plant.harvestDays} يوم من الزراعة` : 'غير محدد'
    };

    // إضافة نصائح مخصصة
    if (analysis.deficiencies.length > 0) {
      recommendations.tips.push('تحتاج إلى تحسين التربة قبل الزراعة');
    } else {
      recommendations.tips.push('التربة جاهزة للزراعة فوراً!');
    }

    return recommendations;
  }

  /**
   * جدول الري
   */
  generateWaterSchedule(plant) {
    const moistureLevel = plant.moistureMin || 60;
    return {
      frequency: moistureLevel > 70 ? 'يومي' : moistureLevel > 50 ? 'يوم ونصف' : 'كل يومين',
      amount: moistureLevel > 70 ? 'وفير' : 'معتدل',
      bestTime: 'الصباح الباكر'
    };
  }

  /**
   * جدول التسميد
   */
  generateFertilizingSchedule(plant, soilData) {
    return {
      frequency: 'كل أسبوعين',
      duration: '3 أشهر من الزراعة',
      type: 'سماد متوازن NPK',
      notes: 'قلل التسميد بعد الإزهار'
    };
  }

  /**
   * اختيار أفضل النباتات للتربة الحالية
   */
  getBestPlantsForSoil(soilData, plants, limit = 10) {
    return plants
      .map(plant => ({
        plant: plant,
        score: this.calculateCompatibilityScore(plant, soilData)
      }))
      .filter(item => item.score >= 60)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.plant);
  }

  /**
   * تقرير شامل عن حالة التربة
   */
  generateSoilReport(soilData) {
    let report = {
      temperature: this.evaluateTemperature(soilData.temp),
      moisture: this.evaluateMoisture(soilData.moisture),
      ph: this.evaluatePH(soilData.ph),
      nitrogen: this.evaluateNutrient(soilData.n, 'N'),
      phosphorus: this.evaluateNutrient(soilData.p, 'P'),
      potassium: this.evaluateNutrient(soilData.k, 'K'),
      overallHealth: this.calculateSoilHealth(soilData)
    };

    return report;
  }

  /**
   * تقييم درجة الحرارة
   */
  evaluateTemperature(temp) {
    if (temp < 10) return { status: 'بارد جداً', ar: 'غير مناسب للمعظم' };
    if (temp < 15) return { status: 'بارد', ar: 'محدود' };
    if (temp < 30) return { status: 'مثالي', ar: 'مناسب' };
    if (temp < 35) return { status: 'دافئ', ar: 'محدود' };
    return { status: 'حار جداً', ar: 'غير مناسب' };
  }

  /**
   * تقييم الرطوبة
   */
  evaluateMoisture(moisture) {
    if (moisture < 30) return { status: 'جاف جداً', ar: 'يحتاج ري فوري' };
    if (moisture < 50) return { status: 'جاف', ar: 'يحتاج ري' };
    if (moisture < 75) return { status: 'مثالي', ar: 'جيد جداً' };
    return { status: 'رطب جداً', ar: 'احذر من تعفن الجذور' };
  }

  /**
   * تقييم الرقم الهيدروجيني
   */
  evaluatePH(ph) {
    if (ph < 6) return { status: 'حمضي جداً', ar: 'أضف كلس' };
    if (ph < 6.5) return { status: 'حمضي قليلاً', ar: 'جيد لبعض النبات' };
    if (ph < 7.5) return { status: 'محايد', ar: 'مثالي' };
    if (ph < 8) return { status: 'قلوي قليلاً', ar: 'جيد لبعض النبات' };
    return { status: 'قلوي جداً', ar: 'أضف حمض' };
  }

  /**
   * تقييم العنصر الغذائي
   */
  evaluateNutrient(value, type) {
    const thresholds = {
      N: { low: 30, high: 100 },
      P: { low: 20, high: 70 },
      K: { low: 25, high: 80 }
    };

    const threshold = thresholds[type];
    if (value < threshold.low) return { status: 'ناقص', ar: 'يحتاج تسميد عاجل' };
    if (value < threshold.low * 1.5) return { status: 'منخفض', ar: 'يحتاج تسميد' };
    if (value > threshold.high) return { status: 'مرتفع جداً', ar: 'احذر من الحرق' };
    return { status: 'مثالي', ar: 'جيد جداً' };
  }

  /**
   * حساب صحة التربة العامة (0-100)
   */
  calculateSoilHealth(soilData) {
    let health = 100;

    // درجة الحرارة
    if (soilData.temp < 10 || soilData.temp > 35) health -= 15;
    else if (soilData.temp < 15 || soilData.temp > 30) health -= 10;

    // الرطوبة
    if (soilData.moisture < 30 || soilData.moisture > 85) health -= 15;
    else if (soilData.moisture < 45 || soilData.moisture > 80) health -= 10;

    // pH
    if (soilData.ph < 5 || soilData.ph > 8.5) health -= 20;
    else if (soilData.ph < 5.5 || soilData.ph > 8) health -= 10;

    // العناصر الغذائية
    if (soilData.n < 30) health -= 15;
    if (soilData.p < 20) health -= 10;
    if (soilData.k < 25) health -= 10;

    return Math.max(0, health);
  }
}

// إنشاء المحلل العام
const aiAnalyzer = new AIAnalyzer();
