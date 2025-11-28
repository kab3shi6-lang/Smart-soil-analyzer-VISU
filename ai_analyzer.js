/**
 * 🤖 نظام AI الذكي لتحليل التربة والتوصيات
 * Smart AI System for Soil Analysis and Recommendations
 */

class AIAnalyzer {
  constructor() {
    this.deficiencyThresholds = {
      nitrogen: 60,
      phosphorus: 60,
      potassium: 60
    };

    // قاعدة بيانات المواد الطبيعية الشاملة
    this.naturalMaterialsDB = {
      nitrogen: [
        {
          nameAr: "سماد الدجاج العضوي",
          nameEn: "Organic Chicken Manure",
          npkRatio: { n: 3.0, p: 2.0, k: 1.0 },
          gramsPer100sqm: 1000,
          applicationAr: "يتم إضافته مباشرة أو تخميره",
          applicationEn: "Add directly or compost first",
          benefits: ["nitrogen", "calcium", "magnesium"],
          daysToEffect: 7,
          costEffective: true,
          descAr: "الخيار الأول والأكثر فعالية",
          descEn: "First choice and most effective"
        },
        {
          nameAr: "سماد البقر المتحلل",
          nameEn: "Aged Cow Manure",
          npkRatio: { n: 1.5, p: 1.0, k: 0.8 },
          gramsPer100sqm: 2000,
          applicationAr: "يتم دفنه بعمق 10-15 سم",
          applicationEn: "Bury 10-15 cm deep",
          benefits: ["nitrogen", "organic_matter", "microbes"],
          daysToEffect: 14,
          costEffective: true,
          descAr: "مصدر مستقر طويل الأجل",
          descEn: "Stable long-term source"
        },
        {
          nameAr: "السماد الحيواني المخمر",
          nameEn: "Fermented Animal Compost",
          npkRatio: { n: 2.5, p: 1.5, k: 1.2 },
          gramsPer100sqm: 800,
          applicationAr: "يتم رشه على سطح التربة",
          applicationEn: "Scatter on soil surface",
          benefits: ["nitrogen", "probiotics", "humus"],
          daysToEffect: 5,
          costEffective: false,
          descAr: "الخيار السريع والفعال",
          descEn: "Quick and powerful option"
        },
        {
          nameAr: "بقايا القهوة المطحونة",
          nameEn: "Coffee Grounds",
          npkRatio: { n: 2.0, p: 0.3, k: 0.3 },
          gramsPer100sqm: 500,
          applicationAr: "مع الري مباشرة",
          applicationEn: "Mix with watering",
          benefits: ["nitrogen", "acid", "drainage"],
          daysToEffect: 3,
          costEffective: true,
          descAr: "خيار اقتصادي جداً",
          descEn: "Very budget-friendly"
        },
        {
          nameAr: "حرير الذرة المحروق",
          nameEn: "Burnt Corn Silk",
          npkRatio: { n: 1.8, p: 0.5, k: 2.0 },
          gramsPer100sqm: 300,
          applicationAr: "رش مباشر على الأوراق",
          applicationEn: "Direct spray on leaves",
          benefits: ["nitrogen", "potassium", "trace_elements"],
          daysToEffect: 2,
          costEffective: true,
          descAr: "تأثير سريع جداً",
          descEn: "Very fast effect"
        },
        {
          nameAr: "أوراق النبات المتحللة",
          nameEn: "Decomposed Plant Leaves",
          npkRatio: { n: 1.0, p: 0.5, k: 0.5 },
          gramsPer100sqm: 1500,
          applicationAr: "دفن سطحي مع التربة",
          applicationEn: "Shallow burial with soil",
          benefits: ["nitrogen", "organic_matter", "microbes"],
          daysToEffect: 21,
          costEffective: true,
          descAr: "مصدر مستدام وطبيعي",
          descEn: "Sustainable natural source"
        }
      ],

      phosphorus: [
        {
          nameAr: "دقيق العظام الناعم",
          nameEn: "Fine Bone Meal",
          npkRatio: { n: 0.5, p: 13.0, k: 0.0 },
          gramsPer100sqm: 500,
          applicationAr: "رش وتقليب خفيف",
          applicationEn: "Spray and mix lightly",
          benefits: ["phosphorus", "calcium", "slow_release"],
          daysToEffect: 14,
          costEffective: false,
          descAr: "الخيار الأفضل للفسفور",
          descEn: "Best phosphorus option"
        },
        {
          nameAr: "رماد الخشب النقي",
          nameEn: "Pure Wood Ash",
          npkRatio: { n: 0.0, p: 1.5, k: 4.0 },
          gramsPer100sqm: 800,
          applicationAr: "نشر متساوي على السطح",
          applicationEn: "Even spread on surface",
          benefits: ["phosphorus", "potassium", "calcium", "pH_balance"],
          daysToEffect: 10,
          costEffective: true,
          descAr: "مفيد متعدد الفوائد",
          descEn: "Multi-benefit option"
        },
        {
          nameAr: "رماد الأوراق المحترقة",
          nameEn: "Burnt Leaf Ash",
          npkRatio: { n: 0.2, p: 0.8, k: 2.5 },
          gramsPer100sqm: 600,
          applicationAr: "مع ماء الري",
          applicationEn: "With irrigation water",
          benefits: ["phosphorus", "potassium", "trace_elements"],
          daysToEffect: 8,
          costEffective: true,
          descAr: "خيار اقتصادي آمن",
          descEn: "Safe budget option"
        },
        {
          nameAr: "السماد السمكي المركز",
          nameEn: "Fish Meal Concentrate",
          npkRatio: { n: 5.0, p: 3.0, k: 0.0 },
          gramsPer100sqm: 300,
          applicationAr: "قبل الري بساعة",
          applicationEn: "One hour before watering",
          benefits: ["phosphorus", "nitrogen", "amino_acids"],
          daysToEffect: 5,
          costEffective: false,
          descAr: "خيار قوي سريع",
          descEn: "Strong fast option"
        },
        {
          nameAr: "الفوسفات الصخري",
          nameEn: "Rock Phosphate",
          npkRatio: { n: 0.0, p: 3.0, k: 0.0 },
          gramsPer100sqm: 800,
          applicationAr: "دفن عميق مع التربة",
          applicationEn: "Deep burial with soil",
          benefits: ["phosphorus", "slow_release", "long_lasting"],
          daysToEffect: 30,
          costEffective: true,
          descAr: "خيار طويل الأمد",
          descEn: "Long-term option"
        }
      ],

      potassium: [
        {
          nameAr: "رماد الخشب عالي الجودة",
          nameEn: "High-Quality Wood Ash",
          npkRatio: { n: 0.0, p: 1.5, k: 9.0 },
          gramsPer100sqm: 600,
          applicationAr: "نشر منتظم على التربة",
          applicationEn: "Regular spread on soil",
          benefits: ["potassium", "calcium", "pH_balance"],
          daysToEffect: 7,
          costEffective: true,
          descAr: "الخيار الأول والأرخص",
          descEn: "First and cheapest choice"
        },
        {
          nameAr: "قشور الموز المطحونة",
          nameEn: "Dried Banana Peel Powder",
          npkRatio: { n: 0.3, p: 0.2, k: 12.0 },
          gramsPer100sqm: 300,
          applicationAr: "مع سماد عضوي",
          applicationEn: "With organic fertilizer",
          benefits: ["potassium", "magnesium", "nutrients"],
          daysToEffect: 5,
          costEffective: true,
          descAr: "خيار صديق للبيئة",
          descEn: "Eco-friendly option"
        },
        {
          nameAr: "رماد قشور جوز الهند",
          nameEn: "Coconut Husk Ash",
          npkRatio: { n: 0.1, p: 0.2, k: 11.0 },
          gramsPer100sqm: 400,
          applicationAr: "خلط مع التربة السطحية",
          applicationEn: "Mix with top soil",
          benefits: ["potassium", "fiber", "water_retention"],
          daysToEffect: 10,
          costEffective: true,
          descAr: "خيار متقدم مستدام",
          descEn: "Advanced sustainable choice"
        },
        {
          nameAr: "السماد الحيواني الغني",
          nameEn: "Rich Animal Manure",
          npkRatio: { n: 2.0, p: 1.5, k: 2.5 },
          gramsPer100sqm: 1000,
          applicationAr: "دفن سطحي",
          applicationEn: "Shallow burial",
          benefits: ["potassium", "nitrogen", "organic_matter"],
          daysToEffect: 14,
          costEffective: true,
          descAr: "خيار متوازن شامل",
          descEn: "Balanced comprehensive option"
        },
        {
          nameAr: "أوراق السرخس المتحللة",
          nameEn: "Decomposed Fern Leaves",
          npkRatio: { n: 0.5, p: 0.3, k: 3.0 },
          gramsPer100sqm: 800,
          applicationAr: "تغطية سطحية",
          applicationEn: "Surface coverage",
          benefits: ["potassium", "organic_matter", "minerals"],
          daysToEffect: 21,
          costEffective: true,
          descAr: "خيار طبيعي بطيء",
          descEn: "Natural slow option"
        },
        {
          nameAr: "الرماد من حرق القش",
          nameEn: "Straw Ash",
          npkRatio: { n: 0.1, p: 0.5, k: 8.0 },
          gramsPer100sqm: 700,
          applicationAr: "رش خفيف ومنتظم",
          applicationEn: "Light and regular spray",
          benefits: ["potassium", "silica", "minerals"],
          daysToEffect: 9,
          costEffective: true,
          descAr: "خيار متاح بسهولة",
          descEn: "Easily available option"
        }
      ]
    };
  }

  /**
   * تحليل ذكي للنقائص وتقديم توصيات محددة
   * Intelligent analysis of deficiencies with specific recommendations
   */
  analyzeAndRecommend(currentReadings, plant) {
    const lang = i18n.currentLang;
    const analysis = {
      deficiencies: [],
      recommendations: [],
      totalGramsNeeded: {},
      plantSpecificAdvice: "",
      urgencyLevel: "normal",
      appliedMaterials: []
    };

    // حساب النقائص لكل عنصر
    const nitrogenDeficit = Math.max(0, plant.nMin - currentReadings.n);
    const phosphorusDeficit = Math.max(0, plant.pMin - currentReadings.p);
    const potassiumDeficit = Math.max(0, plant.kMin - currentReadings.k);

    // تحديد مستوى الاستعجالية
    const totalDeficit = nitrogenDeficit + phosphorusDeficit + potassiumDeficit;
    if (totalDeficit > 60) analysis.urgencyLevel = "critical";
    else if (totalDeficit > 30) analysis.urgencyLevel = "high";
    else if (totalDeficit > 10) analysis.urgencyLevel = "medium";

    // تحليل النيتروجين
    if (nitrogenDeficit > 0) {
      analysis.deficiencies.push({
        element: "nitrogen",
        current: currentReadings.n,
        required: plant.nMin,
        deficit: nitrogenDeficit,
        impact: lang === 'ar' 
          ? "نقص النيتروجين يؤثر على نمو الأوراق والسيقان"
          : "Nitrogen deficiency affects leaf and stem growth"
      });

      const recommendation = this.getSmartRecommendation(
        "nitrogen", 
        nitrogenDeficit, 
        plant,
        lang
      );
      analysis.recommendations.push(recommendation);
      analysis.totalGramsNeeded.nitrogen = recommendation.gramsNeeded;
      analysis.appliedMaterials.push(...recommendation.materials);
    }

    // تحليل الفسفور
    if (phosphorusDeficit > 0) {
      analysis.deficiencies.push({
        element: "phosphorus",
        current: currentReadings.p,
        required: plant.pMin,
        deficit: phosphorusDeficit,
        impact: lang === 'ar'
          ? "نقص الفسفور يؤثر على جودة الثمار والجذور"
          : "Phosphorus deficiency affects fruit quality and roots"
      });

      const recommendation = this.getSmartRecommendation(
        "phosphorus",
        phosphorusDeficit,
        plant,
        lang
      );
      analysis.recommendations.push(recommendation);
      analysis.totalGramsNeeded.phosphorus = recommendation.gramsNeeded;
      analysis.appliedMaterials.push(...recommendation.materials);
    }

    // تحليل البوتاسيوم
    if (potassiumDeficit > 0) {
      analysis.deficiencies.push({
        element: "potassium",
        current: currentReadings.k,
        required: plant.kMin,
        deficit: potassiumDeficit,
        impact: lang === 'ar'
          ? "نقص البوتاسيوم يؤثر على قوة النبات ومقاومة الأمراض"
          : "Potassium deficiency affects plant strength and disease resistance"
      });

      const recommendation = this.getSmartRecommendation(
        "potassium",
        potassiumDeficit,
        plant,
        lang
      );
      analysis.recommendations.push(recommendation);
      analysis.totalGramsNeeded.potassium = recommendation.gramsNeeded;
      analysis.appliedMaterials.push(...recommendation.materials);
    }

    // نصيحة متخصصة حسب نوع النبات
    analysis.plantSpecificAdvice = this.getPlantSpecificAdvice(plant, analysis, lang);

    return analysis;
  }

  /**
   * الحصول على توصية ذكية حسب مستوى النقص
   * Get smart recommendation based on deficiency level
   */
  getSmartRecommendation(element, deficit, plant, lang) {
    const materials = this.naturalMaterialsDB[element];
    const recommendation = {
      element,
      deficit,
      materials: [],
      gramsNeeded: 0,
      applicationSchedule: [],
      costLevel: "budget"
    };

    if (!materials || materials.length === 0) return recommendation;

    // اختيار المواد المناسبة حسب درجة النقص
    let selectedMaterials = [];

    if (deficit <= 10) {
      // نقص بسيط - اختر الخيار الأرخص والأسرع
      selectedMaterials = materials.filter(m => m.costEffective && m.daysToEffect <= 7);
      recommendation.costLevel = "budget";
    } else if (deficit <= 30) {
      // نقص متوسط - اختر الخيار المتوازن
      selectedMaterials = materials.filter(m => m.daysToEffect <= 14);
      recommendation.costLevel = "medium";
    } else {
      // نقص كبير - اختر الخيار الأقوى
      selectedMaterials = materials;
      recommendation.costLevel = "high";
    }

    // ترتيب المواد حسب الفعالية
    selectedMaterials.sort((a, b) => (b.npkRatio[element] || 0) - (a.npkRatio[element] || 0));

    // اختيار أفضل 2-3 خيارات
    const topMaterials = selectedMaterials.slice(0, deficit > 30 ? 3 : 2);

    // حساب كمية المواد المطلوبة
    topMaterials.forEach(material => {
      const gramsForDeficit = (material.gramsPer100sqm / 100) * deficit * 2; // ضريب الأمان
      recommendation.materials.push({
        ...material,
        calculatedGrams: Math.round(gramsForDeficit),
        recommendedGrams: Math.round(gramsForDeficit * 0.8), // نسبة آمنة
        priority: topMaterials.indexOf(material) + 1
      });
      recommendation.gramsNeeded += Math.round(gramsForDeficit * 0.8);
    });

    // جدول التطبيق
    if (deficit > 30) {
      recommendation.applicationSchedule = [
        { day: 0, desc: lang === 'ar' ? "التطبيق الأول - 50%" : "First application - 50%", percent: 50 },
        { day: 7, desc: lang === 'ar' ? "التطبيق الثاني - 30%" : "Second application - 30%", percent: 30 },
        { day: 14, desc: lang === 'ar' ? "التطبيق الثالث - 20%" : "Third application - 20%", percent: 20 }
      ];
    } else if (deficit > 10) {
      recommendation.applicationSchedule = [
        { day: 0, desc: lang === 'ar' ? "التطبيق الأول - 60%" : "First application - 60%", percent: 60 },
        { day: 7, desc: lang === 'ar' ? "التطبيق الثاني - 40%" : "Second application - 40%", percent: 40 }
      ];
    } else {
      recommendation.applicationSchedule = [
        { day: 0, desc: lang === 'ar' ? "التطبيق الكامل" : "Full application", percent: 100 }
      ];
    }

    return recommendation;
  }

  /**
   * نصيحة متخصصة حسب نوع النبات
   * Plant-specific advice
   */
  getPlantSpecificAdvice(plant, analysis, lang) {
    const plantName = lang === 'ar' ? plant.nameAr : plant.nameEn;
    let advice = "";

    // نصائح خاصة لكل فئة
    if (plant.category === 'vegetables') {
      advice = lang === 'ar'
        ? `🥬 للخضروات: تحتاج إلى توازن جيد. ${analysis.deficiencies.length === 0 ? 'التربة جاهزة للزراعة!' : 'استخدم المواد الموصى بها قبل الزراعة بـ 7 أيام.'}`
        : `🥬 For vegetables: Need good balance. ${analysis.deficiencies.length === 0 ? 'Soil is ready to plant!' : 'Use recommended materials 7 days before planting.'}`;
    } else if (plant.category === 'fruits') {
      advice = lang === 'ar'
        ? `🍎 للفواكه: ركز على الفسفور والبوتاسيوم لجودة أفضل. استخدم التطبيقات المتكررة خلال الموسم.`
        : `🍎 For fruits: Focus on phosphorus and potassium for better quality. Use repeated applications during season.`;
    } else if (plant.category === 'grains') {
      advice = lang === 'ar'
        ? `🌾 للحبوب: احتاجها إلى نيتروجين قوي في المراحل المبكرة. استخدم السماد العضوي المخمر.`
        : `🌾 For grains: Need strong nitrogen in early stages. Use aged organic fertilizer.`;
    } else if (plant.category === 'legumes') {
      advice = lang === 'ar'
        ? `🫘 للبقوليات: تثبت النيتروجين طبيعياً. ركز على الفسفور والبوتاسيوم فقط.`
        : `🫘 For legumes: Fix nitrogen naturally. Focus only on phosphorus and potassium.`;
    } else if (plant.category === 'herbs') {
      advice = lang === 'ar'
        ? `🌿 للأعشاب: تحتاج إلى تربة خفيفة غنية. استخدم السماد الخفيف والمخمر.`
        : `🌿 For herbs: Need light rich soil. Use light aged fertilizer.`;
    }

    return advice;
  }

  /**
   * تقييم جودة التربة الكلي
   * Overall soil quality assessment
   */
  assessSoilQuality(readings, plant) {
    let score = 100;
    let issues = [];
    const lang = i18n.currentLang;

    // فحص كل عنصر
    if (readings.n < plant.nMin) score -= 15;
    if (readings.p < plant.pMin) score -= 15;
    if (readings.k < plant.kMin) score -= 15;
    if (readings.ph < plant.phMin || readings.ph > plant.phMax) score -= 10;
    if (readings.moisture < plant.moistureMin || readings.moisture > plant.moistureMax) score -= 10;
    if (readings.temp < plant.tempMin || readings.temp > plant.tempMax) score -= 10;

    score = Math.max(0, score);

    let assessment = {
      score,
      status: "",
      recommendation: ""
    };

    if (score >= 80) {
      assessment.status = lang === 'ar' ? "🟢 ممتاز" : "🟢 Excellent";
      assessment.recommendation = lang === 'ar' 
        ? "التربة في حالة ممتازة - جاهزة للزراعة الفورية"
        : "Soil is in excellent condition - ready for immediate planting";
    } else if (score >= 60) {
      assessment.status = lang === 'ar' ? "🟡 جيد" : "🟡 Good";
      assessment.recommendation = lang === 'ar'
        ? "التربة جيدة - طبق التحسينات الموصى بها قبل الزراعة"
        : "Soil is good - apply recommended improvements before planting";
    } else if (score >= 40) {
      assessment.status = lang === 'ar' ? "🟠 متوسط" : "🟠 Fair";
      assessment.recommendation = lang === 'ar'
        ? "التربة تحتاج تحسينات - تابع الخطة المقترحة بدقة"
        : "Soil needs improvements - follow suggested plan carefully";
    } else {
      assessment.status = lang === 'ar' ? "🔴 ضعيف" : "🔴 Poor";
      assessment.recommendation = lang === 'ar'
        ? "التربة غير مناسبة - توصيات شاملة مطلوبة"
        : "Soil is unsuitable - comprehensive recommendations needed";
    }

    return assessment;
  }

  /**
   * حساب التكلفة والوقت المتوقع
   * Calculate expected cost and time
   */
  calculateImplementationPlan(analysis, lang) {
    let totalDays = 0;
    let estimatedCost = "متوسط"; // budget, medium, premium

    if (analysis.appliedMaterials.length === 0) {
      return { totalDays: 0, estimatedCost, materials: [] };
    }

    // حساب أطول فترة
    analysis.appliedMaterials.forEach(material => {
      totalDays = Math.max(totalDays, material.daysToEffect || 0);
    });

    // تقييم التكلفة
    const costLevels = analysis.recommendations.map(r => r.costLevel);
    if (costLevels.includes('high')) estimatedCost = lang === 'ar' ? "عالية" : "High";
    else if (costLevels.includes('medium')) estimatedCost = lang === 'ar' ? "متوسطة" : "Medium";
    else estimatedCost = lang === 'ar' ? "منخفضة جداً" : "Very Low";

    return {
      totalDays,
      estimatedCost,
      materials: analysis.appliedMaterials
    };
  }
}

// إنشاء مثيل عام من AI Analyzer
const aiAnalyzer = new AIAnalyzer();
