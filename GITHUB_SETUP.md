# 📋 GitHub Setup Instructions

## الخطوة 1️⃣: إعداد جهازك المحلي

```powershell
# تأكد أنك في المجلد الصحيح
cd c:\Users\Akena\OneDrive\Desktop\smart_soil_website

# إذا لم تكن git مفعل بعد
git init

# أضف الملفات جميعها
git add .

# Commit أولي
git commit -m "🌱 Smart Soil Analyzer - Initial Commit"
```

---

## الخطوة 2️⃣: أنشئ Repository على GitHub

1. اذهب إلى https://github.com/new
2. ملء البيانات:
   - **Repository name**: `Smart-soil-analyzer-VISU`
   - **Description**: Smart Soil Analyzer - Real-time sensor monitoring
   - **Public** ✅
   - **Add a README file**: ❌ (عندنا README بالفعل)
   - **Add .gitignore**: ❌ (عندنا .gitignore بالفعل)
3. اضغط **Create repository**

---

## الخطوة 3️⃣: ربط المشروع المحلي

بعد إنشاء الـ Repository، ستظهر الأوامر. نفذها:

```powershell
# أضف الـ Remote
git remote add origin https://github.com/YOUR_USERNAME/Smart-soil-analyzer-VISU.git

# غيّر فرع main
git branch -M main

# Push المشروع
git push -u origin main
```

---

## الخطوة 4️⃣: تفعيل GitHub Pages (للموقع)

1. اذهب إلى Repository → **Settings**
2. اختر **Pages** من القائمة اليسرى
3. تحت **Build and deployment**:
   - **Source**: Deploy from a branch
   - **Branch**: main
   - **Folder**: / (root)
4. اضغط **Save**

سيقول لك:
```
Your site is live at: https://YOUR_USERNAME.github.io/Smart-soil-analyzer-VISU
```

---

## الخطوة 5️⃣: نشر Backend (اختياري)

### استخدم Railway.app (الموصى به):

1. اذهب إلى https://railway.app
2. اضغط **Deploy Now**
3. اختر **GitHub** وربط حسابك
4. اختر Repository
5. أضف متغيرات البيئة:
   ```
   PORT=3000
   MOCK_MODE=true
   ```
6. اضغط **Deploy**

الموقع سيكون على:
```
https://your-project-name.railway.app/advanced-v5.html
```

---

## 📝 تحديثات مستقبلية

لتحديث الكود:

```powershell
# عدّل الملفات
# ثم:

git add .
git commit -m "✨ Your changes description"
git push origin main
```

---

## ✅ تحقق من النشر

### GitHub Pages:
```
https://kab3shi6-lang.github.io/Smart-soil-analyzer-VISU/advanced-v5.html
```

### Railway Backend:
```
https://your-railway-app.railway.app/advanced-v5.html
```

---

## 🎯 ملخص الأوامر الأساسية

```powershell
# الإعداد الأول
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/Smart-soil-analyzer-VISU.git
git branch -M main
git push -u origin main

# التحديثات المستقبلية
git add .
git commit -m "Description"
git push origin main

# شوف الحالة
git status
git log
```

---

**هل تحتاج مساعدة في أي خطوة؟** 🚀
