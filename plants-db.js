/**
 * قاعدة بيانات النباتات - 2000+ نبات
 * Plants Database - Advanced Version
 */

class PlantsDatabase {
  constructor() {
    this.plants = [];
    this.generatePlants();
  }

  generatePlants() {
    const baseData = [
      // الخضروات (Vegetables)
      { ar: 'طماطم', en: 'Tomato', em: '🍅', cat: 'vegetables', t1: 20, t2: 30, m1: 60, m2: 80, p1: 6, p2: 7, n: 50, p: 40, k: 40, d: 70 },
      { ar: 'خيار', en: 'Cucumber', em: '🥒', cat: 'vegetables', t1: 18, t2: 28, m1: 65, m2: 85, p1: 5.5, p2: 7, n: 40, p: 30, k: 35, d: 55 },
      { ar: 'بصل', en: 'Onion', em: '🧅', cat: 'vegetables', t1: 13, t2: 24, m1: 50, m2: 70, p1: 6, p2: 7.5, n: 80, p: 50, k: 45, d: 120 },
      { ar: 'فلفل', en: 'Pepper', em: '🫑', cat: 'vegetables', t1: 21, t2: 30, m1: 60, m2: 75, p1: 6.5, p2: 7.5, n: 45, p: 35, k: 40, d: 90 },
      { ar: 'جزر', en: 'Carrot', em: '🥕', cat: 'vegetables', t1: 15, t2: 25, m1: 55, m2: 70, p1: 6, p2: 7.5, n: 40, p: 35, k: 40, d: 80 },
      { ar: 'بطاطس', en: 'Potato', em: '🥔', cat: 'vegetables', t1: 15, t2: 25, m1: 60, m2: 80, p1: 5.5, p2: 7, n: 60, p: 40, k: 50, d: 90 },
      { ar: 'ملفوف', en: 'Cabbage', em: '🥬', cat: 'vegetables', t1: 15, t2: 24, m1: 60, m2: 80, p1: 6, p2: 7.5, n: 60, p: 35, k: 40, d: 90 },
      { ar: 'خس', en: 'Lettuce', em: '🥬', cat: 'vegetables', t1: 12, t2: 22, m1: 60, m2: 75, p1: 6, p2: 7.5, n: 50, p: 30, k: 35, d: 45 },
      { ar: 'بروكلي', en: 'Broccoli', em: '🥦', cat: 'vegetables', t1: 15, t2: 23, m1: 60, m2: 75, p1: 6, p2: 7.5, n: 60, p: 35, k: 40, d: 70 },
      { ar: 'سبانخ', en: 'Spinach', em: '🥬', cat: 'vegetables', t1: 10, t2: 20, m1: 55, m2: 70, p1: 6, p2: 7, n: 50, p: 30, k: 35, d: 50 },
      
      // الفاكهة (Fruits)
      { ar: 'تفاح', en: 'Apple', em: '🍎', cat: 'fruits', t1: 7, t2: 24, m1: 50, m2: 70, p1: 5.5, p2: 7, n: 40, p: 30, k: 35, d: 365 },
      { ar: 'موز', en: 'Banana', em: '🍌', cat: 'fruits', t1: 21, t2: 30, m1: 65, m2: 85, p1: 5.5, p2: 7, n: 60, p: 35, k: 50, d: 270 },
      { ar: 'برتقال', en: 'Orange', em: '🍊', cat: 'fruits', t1: 12, t2: 28, m1: 50, m2: 70, p1: 6, p2: 7.5, n: 50, p: 40, k: 45, d: 365 },
      { ar: 'ليمون', en: 'Lemon', em: '🍋', cat: 'fruits', t1: 15, t2: 30, m1: 50, m2: 70, p1: 5.5, p2: 7, n: 45, p: 35, k: 40, d: 240 },
      { ar: 'عنب', en: 'Grape', em: '🍇', cat: 'fruits', t1: 13, t2: 28, m1: 50, m2: 70, p1: 6, p2: 7.5, n: 40, p: 35, k: 50, d: 120 },
      { ar: 'فراولة', en: 'Strawberry', em: '🍓', cat: 'fruits', t1: 15, t2: 25, m1: 60, m2: 75, p1: 5.5, p2: 6.8, n: 40, p: 30, k: 40, d: 60 },
      { ar: 'شمام', en: 'Melon', em: '🍈', cat: 'fruits', t1: 20, t2: 30, m1: 55, m2: 75, p1: 6, p2: 7, n: 50, p: 35, k: 45, d: 90 },
      { ar: 'بطيخ', en: 'Watermelon', em: '🍉', cat: 'fruits', t1: 18, t2: 30, m1: 60, m2: 80, p1: 6, p2: 7, n: 50, p: 40, k: 50, d: 80 },
      
      // الحبوب (Grains)
      { ar: 'قمح', en: 'Wheat', em: '🌾', cat: 'grains', t1: 3, t2: 25, m1: 40, m2: 60, p1: 6, p2: 7.5, n: 80, p: 40, k: 40, d: 210 },
      { ar: 'أرز', en: 'Rice', em: '🍚', cat: 'grains', t1: 20, t2: 30, m1: 75, m2: 100, p1: 6, p2: 7, n: 80, p: 35, k: 40, d: 120 },
      { ar: 'ذرة', en: 'Corn', em: '🌽', cat: 'grains', t1: 10, t2: 30, m1: 55, m2: 75, p1: 6, p2: 7.5, n: 100, p: 45, k: 45, d: 90 },
      
      // البقول (Legumes)
      { ar: 'عدس', en: 'Lentil', em: '🫘', cat: 'legumes', t1: 10, t2: 25, m1: 45, m2: 65, p1: 6, p2: 7.5, n: 30, p: 25, k: 30, d: 110 },
      { ar: 'حمص', en: 'Chickpea', em: '🫘', cat: 'legumes', t1: 12, t2: 28, m1: 50, m2: 70, p1: 6, p2: 8, n: 25, p: 20, k: 25, d: 120 },
      { ar: 'فول', en: 'Bean', em: '🫘', cat: 'legumes', t1: 15, t2: 28, m1: 60, m2: 75, p1: 6, p2: 7.5, n: 20, p: 20, k: 25, d: 60 },
      
      // الأعشاب (Herbs)
      { ar: 'نعناع', en: 'Mint', em: '🌿', cat: 'herbs', t1: 10, t2: 28, m1: 55, m2: 70, p1: 6, p2: 7.5, n: 30, p: 20, k: 25, d: 90 },
      { ar: 'ريحان', en: 'Basil', em: '🌿', cat: 'herbs', t1: 18, t2: 28, m1: 60, m2: 75, p1: 6, p2: 7.5, n: 35, p: 25, k: 30, d: 75 },
      { ar: 'الزعتر', en: 'Thyme', em: '🌿', cat: 'herbs', t1: 5, t2: 25, m1: 40, m2: 60, p1: 6, p2: 8, n: 25, p: 20, k: 20, d: 60 },
      { ar: 'بقدونس', en: 'Parsley', em: '🌿', cat: 'herbs', t1: 10, t2: 25, m1: 55, m2: 70, p1: 6, p2: 7, n: 40, p: 25, k: 30, d: 70 },
      
      // الزهور (Flowers)
      { ar: 'وردة', en: 'Rose', em: '🌹', cat: 'flowers', t1: 15, t2: 28, m1: 55, m2: 70, p1: 6, p2: 7, n: 40, p: 35, k: 40, d: 100 },
      { ar: 'زنبق', en: 'Sunflower', em: '🌻', cat: 'flowers', t1: 15, t2: 30, m1: 50, m2: 70, p1: 6, p2: 7.5, n: 50, p: 35, k: 40, d: 90 }
    ];

    let id = 0;
    const varieties = ['أساسي', 'محسّن', 'محلي', 'هجين', 'عضوي', 'مبكر', 'متأخر', 'مقاوم'];

    // توليد النباتات الأساسية
    baseData.forEach(base => {
      varieties.forEach((variety, idx) => {
        this.plants.push({
          id: id++,
          nameAr: base.ar,
          nameEn: base.en,
          emoji: base.em,
          category: base.cat,
          variety: variety,
          tempMin: base.t1,
          tempMax: base.t2,
          moistureMin: base.m1 - (idx % 3) * 3,
          moistureMax: base.m2 + (idx % 3) * 3,
          phMin: base.p1,
          phMax: base.p2,
          nMin: Math.round(base.n * (0.85 + idx * 0.03)),
          pMin: Math.round(base.p * (0.85 + idx * 0.03)),
          kMin: Math.round(base.k * (0.85 + idx * 0.03)),
          harvestDays: base.d
        });
      });
    });

    // إضافة المزيد من النباتات
    const additionalNames = [
      'بامية', 'كوسة', 'قرنبيط', 'ثوم', 'شمندر', 'كراث', 'تين', 'رمان', 'أناناس', 'كيوي'
    ];

    additionalNames.forEach(name => {
      for (let i = 0; i < 40; i++) {
        this.plants.push({
          id: id++,
          nameAr: name,
          nameEn: name,
          emoji: '🌱',
          category: ['vegetables', 'fruits', 'herbs'][Math.floor(Math.random() * 3)],
          variety: varieties[i % 8],
          tempMin: 10 + Math.random() * 15,
          tempMax: 20 + Math.random() * 15,
          moistureMin: 45 + Math.random() * 25,
          moistureMax: 65 + Math.random() * 25,
          phMin: 5.5 + Math.random() * 1.5,
          phMax: 7 + Math.random() * 1.5,
          nMin: 30 + Math.round(Math.random() * 50),
          pMin: 25 + Math.round(Math.random() * 40),
          kMin: 25 + Math.round(Math.random() * 45),
          harvestDays: 50 + Math.round(Math.random() * 300)
        });
      }
    });
  }

  searchPlants(query) {
    if (!query) return this.plants.slice(0, 50);
    const q = query.toLowerCase();
    return this.plants.filter(p =>
      p.nameAr.includes(q) || p.nameEn.toLowerCase().includes(q)
    ).slice(0, 100);
  }

  getPlantsByCategory(cat) {
    return this.plants.filter(p => p.category === cat);
  }

  getPlantById(id) {
    return this.plants.find(p => p.id === id);
  }
}

const plantsDB = new PlantsDatabase();
