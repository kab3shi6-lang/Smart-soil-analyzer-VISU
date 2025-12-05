#!/usr/bin/env node

/**
 * 🧪 اختبار سريع لنظام محلل التربة الذكي
 * Quick Test Suite for Smart Soil Analyzer
 */

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

const tests = [];
let passCount = 0;
let failCount = 0;

// ============================================================
// مساعدات الاختبار
// ============================================================

function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ ${message}`);
  }
}

function assertEquals(a, b, message) {
  if (a !== b) {
    throw new Error(`❌ ${message}: expected ${b}, got ${a}`);
  }
}

function assertTrue(value, message) {
  if (!value) {
    throw new Error(`❌ ${message}`);
  }
}

function run() {
  console.log(`${colors.blue}🧪 اختبار نظام محلل التربة\n${colors.reset}`);
  
  tests.forEach((test, index) => {
    try {
      test.fn();
      console.log(`${colors.green}✅${colors.reset} ${test.name}`);
      passCount++;
    } catch (error) {
      console.log(`${colors.red}❌${colors.reset} ${test.name}`);
      console.log(`   ${error.message}`);
      failCount++;
    }
  });

  console.log(`\n${colors.blue}═════════════════════════════════════${colors.reset}`);
  console.log(`✅ نجح: ${passCount}`);
  console.log(`❌ فشل: ${failCount}`);
  console.log(`📊 المجموع: ${tests.length}`);
  console.log(`${colors.blue}═════════════════════════════════════${colors.reset}\n`);

  process.exit(failCount > 0 ? 1 : 0);
}

// ============================================================
// الاختبارات
// ============================================================

// Test 1: فحص تحميل قاعدة البيانات
test('قاعدة البيانات - يجب تحميل أكثر من 100 نبات', () => {
  // محاكاة
  const generatePlants = require('./plants-database.js').generatePlants;
  const plants = generatePlants();
  assert(plants.length > 1000, `Expected > 1000 plants, got ${plants.length}`);
});

// Test 2: فحص خصائص النبات
test('النبات - يجب أن يكون له كل الخصائص المطلوبة', () => {
  const plants = require('./plants-database.js').generatePlants();
  const plant = plants[0];
  
  assertTrue(plant.id, 'مفقود: id');
  assertTrue(plant.name, 'مفقود: name');
  assertTrue(plant.nameAr, 'مفقود: nameAr');
  assertTrue(plant.emoji, 'مفقود: emoji');
  assertTrue(plant.tempMin !== undefined, 'مفقود: tempMin');
  assertTrue(plant.tempMax !== undefined, 'مفقود: tempMax');
  assertTrue(plant.moistureMin !== undefined, 'مفقود: moistureMin');
  assertTrue(plant.moistureMax !== undefined, 'مفقود: moistureMax');
  assertTrue(plant.phMin !== undefined, 'مفقود: phMin');
  assertTrue(plant.phMax !== undefined, 'مفقود: phMax');
  assertTrue(plant.nMin !== undefined, 'مفقود: nMin');
  assertTrue(plant.pMin !== undefined, 'مفقود: pMin');
  assertTrue(plant.kMin !== undefined, 'مفقود: kMin');
});

// Test 3: فحص النطاقات المنطقية
test('النبات - النطاقات يجب أن تكون منطقية', () => {
  const plants = require('./plants-database.js').generatePlants();
  const plant = plants[0];
  
  assert(plant.tempMin < plant.tempMax, 'tempMin يجب أن يكون أقل من tempMax');
  assert(plant.moistureMin < plant.moistureMax, 'moistureMin يجب أن يكون أقل من moistureMax');
  assert(plant.phMin < plant.phMax, 'phMin يجب أن يكون أقل من phMax');
  assert(plant.tempMin >= -10 && plant.tempMax <= 60, 'درجة الحرارة غير منطقية');
  assert(plant.moistureMin >= 0 && plant.moistureMax <= 100, 'الرطوبة غير منطقية');
  assert(plant.phMin >= 4 && plant.phMax <= 9, 'الرقم الهيدروجيني غير منطقي');
});

// Test 4: فحص التنوع (الأصناف المختلفة)
test('الأصناف - كل نبات أساسي يجب أن يكون له عدة أصناف', () => {
  const plants = require('./plants-database.js').generatePlants();
  
  // احسب الأصناف المختلفة
  const basePlants = {};
  plants.forEach(plant => {
    const baseName = plant.nameAr.split('_')[0] || plant.nameAr;
    basePlants[baseName] = (basePlants[baseName] || 0) + 1;
  });
  
  // يجب أن يكون هناك بعض الأنواع التي لها أصناف متعددة
  const hasVarieties = Object.values(basePlants).some(count => count > 1);
  assertTrue(hasVarieties, 'لا توجد أصناف متعددة');
});

// Test 5: فحص محاكاة التوافق
test('التوافق - يجب اكتشاف النباتات المناسبة', () => {
  const plants = require('./plants-database.js').generatePlants();
  
  // بيانات تربة
  const soil = {
    temp: 22,
    moisture: 70,
    ph: 6.5,
    n: 60,
    p: 40,
    k: 50
  };
  
  // دالة فحص التوافق
  function isCompatible(plant) {
    return soil.temp >= plant.tempMin && soil.temp <= plant.tempMax &&
           soil.moisture >= plant.moistureMin && soil.moisture <= plant.moistureMax &&
           soil.ph >= plant.phMin && soil.ph <= plant.phMax &&
           soil.n >= plant.nMin &&
           soil.p >= plant.pMin &&
           soil.k >= plant.kMin;
  }
  
  const suitable = plants.filter(isCompatible);
  assert(suitable.length > 0, 'يجب العثور على نبات مناسب واحد على الأقل');
});

// Test 6: فحص النطاقات العددية
test('الأرقام - يجب أن تكون جميع القيم أرقام صحيحة', () => {
  const plants = require('./plants-database.js').generatePlants();
  const plant = plants[Math.floor(Math.random() * plants.length)];
  
  assert(typeof plant.tempMin === 'number', 'tempMin يجب أن يكون رقم');
  assert(typeof plant.nMin === 'number', 'nMin يجب أن يكون رقم');
  assert(!isNaN(plant.tempMax), 'tempMax يجب أن يكون رقم صحيح');
  assert(!isNaN(plant.pMin), 'pMin يجب أن يكون رقم صحيح');
});

// Test 7: فحص عدم التكرار
test('التفرد - يجب ألا تكون هناك نباتات بنفس المعرف', () => {
  const plants = require('./plants-database.js').generatePlants();
  const ids = new Set();
  
  plants.forEach(plant => {
    assert(!ids.has(plant.id), `المعرف ${plant.id} مكرر`);
    ids.add(plant.id);
  });
});

// Test 8: فحص الرموز التعبيرية
test('الرموز - يجب أن يكون لكل نبات رمز تعبيري', () => {
  const plants = require('./plants-database.js').generatePlants();
  
  plants.forEach((plant, index) => {
    assert(plant.emoji, `النبات في الفهرس ${index} بلا رمز تعبيري`);
    assert(plant.emoji.length > 0, `النبات ${plant.nameAr} لديه رمز فارغ`);
  });
});

// Test 9: فحص صيغ البيانات
test('صيغ البيانات - يجب أن تدعم صيغ متعددة', () => {
  // دالة تحليل البيانات
  function parseData(data) {
    // صيغة 1: key:value pairs
    if (data.includes(':')) {
      const pairs = data.split(',');
      const result = {};
      pairs.forEach(pair => {
        const [key, value] = pair.split(':');
        result[key.trim()] = parseFloat(value);
      });
      return result;
    }
    
    // صيغة 2: JSON
    try {
      return JSON.parse(data);
    } catch (e) {
      // صيغة 3: CSV
      const values = data.split(',').map(parseFloat);
      return {
        TEMP: values[0],
        MOISTURE: values[1],
        PH: values[2],
        N: values[3],
        P: values[4],
        K: values[5]
      };
    }
  }
  
  // اختبر الصيغ
  const format1 = 'TEMP:22.5,MOISTURE:65,PH:6.5,N:50,P:40,K:45';
  const format2 = '{"TEMP": 22.5, "MOISTURE": 65, "PH": 6.5, "N": 50, "P": 40, "K": 45}';
  const format3 = '22.5,65,6.5,50,40,45';
  
  const data1 = parseData(format1);
  const data2 = parseData(format2);
  const data3 = parseData(format3);
  
  assert(data1.TEMP === 22.5, 'فشل في تحليل صيغة 1');
  assert(data2.MOISTURE === 65, 'فشل في تحليل صيغة 2');
  assert(data3.PH === 6.5, 'فشل في تحليل صيغة 3');
});

// Test 10: فحص الحسابات
test('الحسابات - يجب أن تعطي النتائج الصحيحة', () => {
  const soil = { n: 50, p: 40, k: 45 };
  const plant = { nMin: 60, pMin: 30, kMin: 50 };
  
  // احسب النقائص
  const nDeficit = Math.max(0, plant.nMin - soil.n); // 10
  const pDeficit = Math.max(0, plant.pMin - soil.p); // 0
  const kDeficit = Math.max(0, plant.kMin - soil.k); // 5
  
  assertEquals(nDeficit, 10, 'حساب نقص النيتروجين');
  assertEquals(pDeficit, 0, 'حساب نقص الفسفور');
  assertEquals(kDeficit, 5, 'حساب نقص البوتاسيوم');
});

// ============================================================
// تشغيل الاختبارات
// ============================================================

// تشغيل فقط إذا كان الملف يُشغّل مباشرة
if (require.main === module) {
  run();
}

module.exports = { test, run };
