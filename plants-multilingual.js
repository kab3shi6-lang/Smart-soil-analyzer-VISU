// Multilingual Plant Database - uses all 2000 plants from plantsDB with translations
// Load and transform all plants from the main database
const plantsMultilingualDB = {
    get plants() {
        if (!window.plantsDB || !window.plantsDB.plants) {
            console.warn('plantsDB not loaded yet, returning empty array');
            return [];
        }
        
        return window.plantsDB.plants.map(plant => {
            // Get the base name from the plant object
            let baseName = plant.nameEn || plant.nameAr || plant.name || 'Plant';
            let arabicName = plant.nameAr || plant.name || 'نبات';
            
            return {
                id: plant.id,
                emoji: plant.emoji || '🌱',
                names: {
                    ar: arabicName,
                    en: plant.nameEn || baseName,
                    fr: plant.nameFr || translateToFrench(baseName),
                    es: plant.nameEs || translateToSpanish(baseName),
                    de: plant.nameDe || translateToGerman(baseName),
                    zh: plant.nameCh || translateToChinese(baseName),
                    ja: plant.nameJa || translateToJapanese(baseName),
                    hi: plant.nameHi || translateToHindi(baseName),
                    tr: plant.nameTr || translateToTurkish(baseName),
                    pt: plant.namePt || translateToPortuguese(baseName)
                },
                tempMin: plant.tempMin || 15,
                tempMax: plant.tempMax || 28,
                moistureMin: plant.moistureMin || 50,
                moistureMax: plant.moistureMax || 80,
                phMin: plant.phMin || 6.0,
                phMax: plant.phMax || 7.0
            };
        });
    }
};


// Translation dictionaries for plant names
const plantTranslations = {
    // Common vegetables
    'tomato': { fr: 'Tomate', es: 'Tomate', de: 'Tomate', zh: '番茄', ja: 'トマト', hi: 'टमाटर', tr: 'Domates', pt: 'Tomate' },
    'cucumber': { fr: 'Concombre', es: 'Pepino', de: 'Gurke', zh: '黄瓜', ja: 'キュウリ', hi: 'खीरा', tr: 'Salatalık', pt: 'Pepino' },
    'lettuce': { fr: 'Laitue', es: 'Lechuga', de: 'Salat', zh: '生菜', ja: 'レタス', hi: 'सलाद', tr: 'Marul', pt: 'Alface' },
    'carrot': { fr: 'Carotte', es: 'Zanahoria', de: 'Karotte', zh: '胡萝卜', ja: 'ニンジン', hi: 'गाजर', tr: 'Havuç', pt: 'Cenoura' },
    'onion': { fr: 'Oignon', es: 'Cebolla', de: 'Zwiebel', zh: '洋葱', ja: 'タマネギ', hi: 'प्याज', tr: 'Soğan', pt: 'Cebola' },
    'garlic': { fr: 'Ail', es: 'Ajo', de: 'Knoblauch', zh: '大蒜', ja: 'ニンニク', hi: 'लहसुन', tr: 'Sarımsak', pt: 'Alho' },
    'corn': { fr: 'Maïs', es: 'Maíz', de: 'Mais', zh: '玉米', ja: 'トウモロコシ', hi: 'मकई', tr: 'Mısır', pt: 'Milho' },
    'potato': { fr: 'Pomme de terre', es: 'Patata', de: 'Kartoffel', zh: '马铃薯', ja: 'ジャガイモ', hi: 'आलू', tr: 'Patates', pt: 'Batata' },
    'broccoli': { fr: 'Brocoli', es: 'Brócoli', de: 'Brokkoli', zh: '花椰菜', ja: 'ブロッコリー', hi: 'ब्रोकली', tr: 'Brokoli', pt: 'Brócolis' },
    'eggplant': { fr: 'Aubergine', es: 'Berenjena', de: 'Aubergine', zh: '茄子', ja: 'ナス', hi: 'बैंगन', tr: 'Patlıcan', pt: 'Berinjela' },
    'pepper': { fr: 'Poivron', es: 'Pimiento', de: 'Paprika', zh: '辣椒', ja: 'ピーマン', hi: 'मिर्च', tr: 'Biber', pt: 'Pimenta' },
    'spinach': { fr: 'Épinard', es: 'Espinaca', de: 'Spinat', zh: '菠菜', ja: 'ほうれん草', hi: 'पालक', tr: 'Ispanak', pt: 'Espinafre' },
    'cabbage': { fr: 'Chou', es: 'Repollo', de: 'Kohl', zh: '卷心菜', ja: 'キャベツ', hi: 'पत्तागोभी', tr: 'Lahana', pt: 'Repolho' },
    'pumpkin': { fr: 'Courge', es: 'Calabaza', de: 'Kürbis', zh: '南瓜', ja: 'かぼちゃ', hi: 'कद्दू', tr: 'Balkabağı', pt: 'Abóbora' },
    'squash': { fr: 'Courge', es: 'Calabacín', de: 'Zucchini', zh: '西葫芦', ja: 'ズッキーニ', hi: 'तोरी', tr: 'Kabak', pt: 'Abobrinha' },
    'zucchini': { fr: 'Courgette', es: 'Calabacín', de: 'Zucchini', zh: '西葫芦', ja: 'ズッキーニ', hi: 'तोरी', tr: 'Kabak', pt: 'Abobrinha' },
    'radish': { fr: 'Radis', es: 'Rábano', de: 'Rettich', zh: '萝卜', ja: 'ダイコン', hi: 'मूली', tr: 'Turp', pt: 'Rabanete' },
    'beet': { fr: 'Betterave', es: 'Remolacha', de: 'Rübe', zh: '甜菜', ja: 'ビート', hi: 'चुकंदर', tr: 'Pancar', pt: 'Beterraba' },
    'turnip': { fr: 'Navet', es: 'Nabo', de: 'Kohlrabi', zh: '芜菁', ja: 'カブ', hi: 'शलजम', tr: 'Turp', pt: 'Nabo' },
    'celery': { fr: 'Céleri', es: 'Apio', de: 'Sellerie', zh: '芹菜', ja: 'セロリ', hi: 'अजवाइन', tr: 'Kereviz', pt: 'Aipo' },
    
    // Herbs and spices
    'basil': { fr: 'Basilic', es: 'Albahaca', de: 'Basilikum', zh: '罗勒', ja: 'バジル', hi: 'तुलसी', tr: 'Fesleğen', pt: 'Manjericão' },
    'mint': { fr: 'Menthe', es: 'Menta', de: 'Minze', zh: '薄荷', ja: 'ミント', hi: 'पुदीना', tr: 'Nane', pt: 'Menta' },
    'parsley': { fr: 'Persil', es: 'Perejil', de: 'Petersilie', zh: '欧芹', ja: 'パセリ', hi: 'अजमोद', tr: 'Maydanoz', pt: 'Salsa' },
    'cilantro': { fr: 'Coriandre', es: 'Cilantro', de: 'Koriander', zh: '香菜', ja: 'コリアンダー', hi: 'धनिया', tr: 'Kişniş', pt: 'Coentro' },
    'thyme': { fr: 'Thym', es: 'Tomillo', de: 'Thymian', zh: '百里香', ja: 'タイム', hi: 'अजवायन', tr: 'Kekik', pt: 'Tomilho' },
    'rosemary': { fr: 'Romarin', es: 'Romero', de: 'Rosmarin', zh: '迷迭香', ja: 'ローズマリー', hi: 'रोज़मेरी', tr: 'Biberiye', pt: 'Alecrim' },
    'oregano': { fr: 'Origan', es: 'Orégano', de: 'Oregano', zh: '牛至', ja: 'オレガノ', hi: 'ओरिगेनो', tr: 'Rigani', pt: 'Orégano' },
    'sage': { fr: 'Sauge', es: 'Salvia', de: 'Salbei', zh: '鼠尾草', ja: 'セージ', hi: 'ऋषभ', tr: 'Adaçayı', pt: 'Sálvia' },
    'dill': { fr: 'Aneth', es: 'Eneldo', de: 'Dill', zh: '莳萝', ja: 'ディル', hi: 'सोया', tr: 'Dereotu', pt: 'Endro' },
    'chives': { fr: 'Ciboulette', es: 'Cebollino', de: 'Schnittlauch', zh: '细香葱', ja: 'チャイブ', hi: 'प्याजी', tr: 'Saçaklı soğan', pt: 'Cebolinha' },
    
    // Fruits
    'apple': { fr: 'Pomme', es: 'Manzana', de: 'Apfel', zh: '苹果', ja: 'リンゴ', hi: 'सेब', tr: 'Elma', pt: 'Maçã' },
    'banana': { fr: 'Banane', es: 'Plátano', de: 'Banane', zh: '香蕉', ja: 'バナナ', hi: 'केला', tr: 'Muz', pt: 'Banana' },
    'orange': { fr: 'Orange', es: 'Naranja', de: 'Orange', zh: '橙子', ja: 'オレンジ', hi: 'संतरा', tr: 'Portakal', pt: 'Laranja' },
    'lemon': { fr: 'Citron', es: 'Limón', de: 'Zitrone', zh: '柠檬', ja: 'レモン', hi: 'नींबू', tr: 'Limon', pt: 'Limão' },
    'lime': { fr: 'Citron vert', es: 'Lima', de: 'Limette', zh: '青柠檬', ja: 'ライム', hi: 'नीबू', tr: 'Lime', pt: 'Lima' },
    'grape': { fr: 'Raisin', es: 'Uva', de: 'Traube', zh: '葡萄', ja: 'ブドウ', hi: 'अंगूर', tr: 'Üzüm', pt: 'Uva' },
    'strawberry': { fr: 'Fraise', es: 'Fresa', de: 'Erdbeere', zh: '草莓', ja: 'イチゴ', hi: 'स्ट्रॉबेरी', tr: 'Çilek', pt: 'Morango' },
    'blueberry': { fr: 'Myrtille', es: 'Arándano', de: 'Heidelbeere', zh: '蓝莓', ja: 'ブルーベリー', hi: 'नीली बेरी', tr: 'Mavi üzüm', pt: 'Mirtilo' },
    'raspberry': { fr: 'Framboise', es: 'Frambuesa', de: 'Himbeere', zh: '覆盆子', ja: 'ラズベリー', hi: 'रास्पबेरी', tr: 'Ahududu', pt: 'Framboesa' },
    'peach': { fr: 'Pêche', es: 'Melocotón', de: 'Pfirsich', zh: '桃子', ja: 'モモ', hi: 'आड़ू', tr: 'Şeftali', pt: 'Pêssego' },
    'pear': { fr: 'Poire', es: 'Pera', de: 'Birne', zh: '梨', ja: '梨', hi: 'नाशपाती', tr: 'Armut', pt: 'Pera' },
    'mango': { fr: 'Mangue', es: 'Mango', de: 'Mango', zh: '芒果', ja: 'マンゴー', hi: 'आम', tr: 'Mango', pt: 'Manga' },
    'pineapple': { fr: 'Ananas', es: 'Piña', de: 'Ananas', zh: '菠萝', ja: 'パイナップル', hi: 'अनानास', tr: 'Ananas', pt: 'Abacaxi' },
    'kiwi': { fr: 'Kiwi', es: 'Kiwi', de: 'Kiwi', zh: '奇异果', ja: 'キウイ', hi: 'कीवी', tr: 'Kivi', pt: 'Kiwi' },
    'watermelon': { fr: 'Pastèque', es: 'Sandía', de: 'Wassermelone', zh: '西瓜', ja: 'スイカ', hi: 'तरबूज', tr: 'Karpuz', pt: 'Melancia' },
    'melon': { fr: 'Melon', es: 'Melón', de: 'Melone', zh: '甜瓜', ja: 'メロン', hi: 'खरबूजा', tr: 'Melon', pt: 'Melão' },
    'avocado': { fr: 'Avocat', es: 'Aguacate', de: 'Avocado', zh: '鳄梨', ja: 'アボカド', hi: 'एवोकैडो', tr: 'Avokado', pt: 'Abacate' },
    'coconut': { fr: 'Noix de coco', es: 'Coco', de: 'Kokosnuss', zh: '椰子', ja: 'ココナッツ', hi: 'नारियल', tr: 'Hindistancevizi', pt: 'Coco' },
    'papaya': { fr: 'Papaye', es: 'Papaya', de: 'Papaya', zh: '木瓜', ja: 'パパイヤ', hi: 'पपीता', tr: 'Papaya', pt: 'Mamão' },
    'guava': { fr: 'Goyave', es: 'Guayaba', de: 'Guave', zh: '番石榴', ja: 'グアバ', hi: 'अमरूद', tr: 'Guava', pt: 'Goiaba' },
    
    // Default for unknown plants
    'plant': { fr: 'Plante', es: 'Planta', de: 'Pflanze', zh: '植物', ja: '植物', hi: 'पौधा', tr: 'Bitki', pt: 'Planta' }
};

// Translation helper functions
function translateToFrench(name) {
    return plantTranslations[name.toLowerCase()]?.fr || name;
}

function translateToSpanish(name) {
    return plantTranslations[name.toLowerCase()]?.es || name;
}

function translateToGerman(name) {
    return plantTranslations[name.toLowerCase()]?.de || name;
}

function translateToChinese(name) {
    return plantTranslations[name.toLowerCase()]?.zh || name;
}

function translateToJapanese(name) {
    return plantTranslations[name.toLowerCase()]?.ja || name;
}

function translateToHindi(name) {
    return plantTranslations[name.toLowerCase()]?.hi || name;
}

function translateToTurkish(name) {
    return plantTranslations[name.toLowerCase()]?.tr || name;
}

function translateToPortuguese(name) {
    return plantTranslations[name.toLowerCase()]?.pt || name;
}

// Helper function to get plant name by language
function getPlantName(plant, language = 'ar') {
    if (plant.names && plant.names[language]) {
        return plant.names[language];
    }
    if (plant.names && plant.names.ar) {
        return plant.names.ar;
    }
    return plant.nameAr || plant.name || 'نبات';
}

// Get all plant names in current language
function getAllPlantNamesInLanguage(language = 'ar') {
    return plantsMultilingualDB.plants.map(plant => ({
        id: plant.id,
        emoji: plant.emoji,
        name: getPlantName(plant, language)
    }));
}
