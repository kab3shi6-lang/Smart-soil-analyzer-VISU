/**
 * اختبارات النظام البسيطة
 * System Tests - Smart Soil Analyzer v3.0
 */

class SystemTests {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }

  /**
   * تشغيل جميع الاختبارات
   */
  runAllTests() {
    console.log('🧪 بدء الاختبارات...\n');
    
    this.testPlantDatabase();
    this.testAIAnalyzer();
    this.testLanguageSystem();
    this.testDataValidation();
    this.testCompatibilityChecks();
    
    this.printSummary();
  }

  /**
   * اختبار قاعدة البيانات
   */
  testPlantDatabase() {
    console.log('📊 اختبار قاعدة البيانات النباتية...');
    
    // اختبار 1: هل تم إنشاء النباتات؟
    this.assert(
      plantsDB.plants.length > 1500,
      `عدد النباتات: ${plantsDB.plants.length}`,
      'إنشاء 2000+ نبات'
    );
    
    // اختبار 2: هل كل نبات له خصائص صحيحة؟
    const plant = plantsDB.plants[0];
    this.assert(
      plant.id !== undefined && plant.nameAr && plant.emoji,
      'النبات الأول له كل الخصائص المطلوبة',
      'خصائص النبات'
    );
    
    // اختبار 3: البحث يعمل بشكل صحيح
    const results = plantsDB.searchPlants('طماطم');
    this.assert(
      results.length > 0,
      `وجدنا ${results.length} نتيجة للبحث عن "طماطم"`,
      'وظيفة البحث'
    );
    
    // اختبار 4: التصنيف حسب الفئة
    const vegetables = plantsDB.getPlantsByCategory('vegetables');
    this.assert(
      vegetables.length > 0,
      `وجدنا ${vegetables.length} خضار`,
      'تصنيف النباتات'
    );
    
    console.log('');
  }

  /**
   * اختبار محرك الذكاء الاصطناعي
   */
  testAIAnalyzer() {
    console.log('🤖 اختبار محرك الذكاء الاصطناعي...');
    
    const plant = plantsDB.plants[0];
    const soilData = {
      temp: 22,
      moisture: 70,
      ph: 6.5,
      n: 50,
      p: 40,
      k: 45
    };
    
    // اختبار 1: حساب درجة التوافق
    const score = aiAnalyzer.calculateCompatibilityScore(plant, soilData);
    this.assert(
      score >= 0 && score <= 100,
      `درجة التوافق: ${score}%`,
      'حساب درجة التوافق'
    );
    
    // اختبار 2: التحليل الشامل
    const analysis = aiAnalyzer.analyze(plant, soilData);
    this.assert(
      analysis.score !== undefined && analysis.suitable !== undefined,
      `التحليل شامل: ${analysis.score}%`,
      'التحليل الشامل'
    );
    
    // اختبار 3: توليد الحلول
    const deficiencies = [{
      type: 'N',
      name: 'النيتروجين',
      current: 30,
      required: 50,
      deficit: 20
    }];
    
    const solutions = aiAnalyzer.generateSolutions(deficiencies);
    this.assert(
      solutions.length > 0 && solutions[0].amount > 0,
      `الحل الموصى به: ${solutions[0].solution} (${solutions[0].amount}g)`,
      'توليد الحلول'
    );
    
    // اختبار 4: حساب الكميات
    const amount = aiAnalyzer.calculateAmount(20, 46);
    this.assert(
      amount > 0,
      `المقدار المحسوب: ${amount}g/m²`,
      'حساب الكميات بالجرامات'
    );
    
    // اختبار 5: النصائح العشوائية
    const tips = aiAnalyzer.getRandomTips(3);
    this.assert(
      tips.length === 3,
      `حصلنا على ${tips.length} نصائح`,
      'النصائح الزراعية'
    );
    
    console.log('');
  }

  /**
   * اختبار نظام اللغات
   */
  testLanguageSystem() {
    console.log('🌍 اختبار نظام اللغات...');
    
    // اختبار 1: هل جميع اللغات موجودة؟
    const languages = ['ar', 'en', 'fr', 'es', 'de', 'zh', 'ja', 'hi', 'tr', 'pt'];
    const allPresent = languages.every(lang => translations[lang]);
    this.assert(
      allPresent,
      `جميع ${languages.length} لغات موجودة`,
      'توفر جميع اللغات'
    );
    
    // اختبار 2: هل العربية مدعومة؟
    this.assert(
      translations.ar['app-title'] !== undefined,
      `العربية: "${translations.ar['app-title']}"`,
      'دعم اللغة العربية'
    );
    
    // اختبار 3: هل الإنجليزية مدعومة؟
    this.assert(
      translations.en['app-title'] !== undefined,
      `الإنجليزية: "${translations.en['app-title']}"`,
      'دعم اللغة الإنجليزية'
    );
    
    console.log('');
  }

  /**
   * اختبار التحقق من البيانات
   */
  testDataValidation() {
    console.log('✅ اختبار التحقق من صحة البيانات...');
    
    const validData = {
      temp: 22,
      moisture: 70,
      ph: 6.5,
      n: 50,
      p: 40,
      k: 45
    };
    
    const invalidData = {
      temp: 'درجة',
      moisture: 'رطوبة',
      ph: 'pH',
      n: 'N',
      p: 'P',
      k: 'K'
    };
    
    // اختبار 1: البيانات الصحيحة
    this.assert(
      app.validateSoilData(validData),
      'البيانات الصحيحة تم التحقق منها',
      'التحقق من بيانات صحيحة'
    );
    
    // اختبار 2: البيانات الخاطئة
    this.assert(
      !app.validateSoilData(invalidData),
      'البيانات الخاطئة تم رفضها',
      'رفض بيانات خاطئة'
    );
    
    // اختبار 3: بيانات ناقصة
    const incompleteData = {
      temp: 22,
      moisture: 70
    };
    this.assert(
      !app.validateSoilData(incompleteData),
      'البيانات الناقصة تم رفضها',
      'رفض بيانات ناقصة'
    );
    
    console.log('');
  }

  /**
   * اختبار فحوصات التوافق
   */
  testCompatibilityChecks() {
    console.log('🌿 اختبار فحوصات التوافق...');
    
    const goodSoil = {
      temp: 22,
      moisture: 70,
      ph: 6.5,
      n: 50,
      p: 40,
      k: 45
    };
    
    const badSoil = {
      temp: 5,
      moisture: 20,
      ph: 4,
      n: 10,
      p: 10,
      k: 10
    };
    
    const plant = plantsDB.plants.find(p => p.nameAr === 'طماطم');
    
    if (plant) {
      // اختبار 1: التربة الجيدة
      const compatible = app.isPlantSuitable(plant, goodSoil);
      this.assert(
        compatible,
        'التربة الجيدة متوافقة مع الطماطم',
        'التحقق من التوافق الإيجابي'
      );
      
      // اختبار 2: التربة السيئة
      const incompatible = !app.isPlantSuitable(plant, badSoil);
      this.assert(
        incompatible,
        'التربة السيئة غير متوافقة',
        'التحقق من التوافق السلبي'
      );
    }
    
    console.log('');
  }

  /**
   * أداة المساعدة للتأكيد
   */
  assert(condition, message, testName) {
    if (condition) {
      this.passed++;
      console.log(`✅ ${testName}: ${message}`);
      this.results.push({ status: 'PASS', name: testName });
    } else {
      this.failed++;
      console.log(`❌ ${testName}: ${message}`);
      this.results.push({ status: 'FAIL', name: testName });
    }
  }

  /**
   * طباعة ملخص النتائج
   */
  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 ملخص النتائج');
    console.log('='.repeat(60));
    console.log(`✅ نجح: ${this.passed}`);
    console.log(`❌ فشل: ${this.failed}`);
    console.log(`📊 النسبة: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);
    
    if (this.failed === 0) {
      console.log('\n🎉 جميع الاختبارات نجحت!');
    } else {
      console.log(`\n⚠️ ${this.failed} اختبارات فشلت`);
    }
    console.log('='.repeat(60));
  }
}

// تشغيل الاختبارات
const tester = new SystemTests();

// استدعاء عند تحميل الصفحة
window.addEventListener('load', () => {
  // تأكد من تحميل جميع المكتبات أولاً
  if (typeof plantsDB !== 'undefined' && 
      typeof aiAnalyzer !== 'undefined' &&
      typeof app !== 'undefined') {
    console.log('🚀 النظام جاهز للاختبار\n');
    tester.runAllTests();
  } else {
    console.warn('⚠️ لم يتم تحميل جميع المكتبات');
  }
});

// دالة للاختبار اليدوي من Console
function runTests() {
  const testInstance = new SystemTests();
  testInstance.runAllTests();
}

console.log('💡 اكتب runTests() في Console لتشغيل الاختبارات يدوياً');
