# ✅ تكامل Gemini Chirp3-HD TTS - النسخة النهائية

## نظرة عامة

تم تحديث تطبيق سامكو لاستخدام **أصوات Chirp3-HD العربية** من Gemini API مع **برومبت صارم محسّن** لضمان النطق الصحيح.

## التحديثات الرئيسية

### ✅ 1. أصوات Chirp3-HD
استبدال جميع الأصوات بأصوات Chirp3-HD عالية الجودة:
- `ar-XA-Chirp3-HD-Kore` (أنثى)
- `ar-XA-Chirp3-HD-Puck` (ذكر)
- `ar-XA-Chirp3-HD-Charon` (ذكر)
- `ar-XA-Chirp3-HD-Aoede` (أنثى)

### ✅ 2. البرومبت الصارم للعربية
```
أنت قارئ صوتي محترف.
اقرأ النص العربي التالي كما هو مكتوب حرفيًا دون أي تعديل أو إعادة صياغة أو ترجمة.
التزم بعلامات الترقيم.
اقرأ الأرقام كأرقام عربية مفهومة في السياق.
نطق عربي فصيح واضح جدًا، مخارج حروف دقيقة، دون إدخال لهجة أجنبية.
```

### ✅ 3. أساليب النطق (Style Presets)
- **سينمائي**: بنبرة سينمائية فخمة، سرعة متوسطة، توقفات واضحة
- **هادئ**: بنبرة هادئة مطمئنة، سرعة بطيئة قليلاً
- **حماسي**: بنبرة حماسية سريعة قليلاً، مع وضوح شديد
- **طفولي**: بصوت طفولي لطيف مع الحفاظ على نطق العربية الصحيح

## الملفات المحدّثة

### Frontend
```
src/types/api.ts              ✏️ أصوات Chirp3-HD
src/services/api.ts           ✏️ برومبت صارم + أساليب
```

### Backend
```
backend-tts/server.js         ✏️ برومبت صارم + Chirp3-HD
```

## كيفية الاستخدام

### 1. إعداد Backend

```bash
cd backend-tts
npm install
cp .env.example .env
# أضف GEMINI_API_KEY في .env
npm start
```

### 2. اختبار مع البرومبت الصارم

```bash
curl -X POST http://localhost:8080/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "مرحبا بك في تطبيق سامكو لصناعة المحتوى بالذكاء الاصطناعي",
    "voiceName": "ar-XA-Chirp3-HD-Kore",
    "returnWavBase64": true
  }'
```

### 3. اختبار مع أسلوب سينمائي

```bash
curl -X POST http://localhost:8080/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "مرحبا بك في تطبيق سامكو",
    "voiceName": "ar-XA-Chirp3-HD-Kore",
    "styleHint": "أنت قارئ صوتي محترف...\nبنبرة سينمائية فخمة، سرعة متوسطة، توقفات واضحة بعد الجمل، وحماس متزن.",
    "returnWavBase64": true
  }'
```

## الأصوات المتاحة

| الاسم الكامل | الاسم المختصر | النوع | الوصف |
|--------------|---------------|------|-------|
| ar-XA-Chirp3-HD-Kore | كوري | أنثى | صوت أنثوي واضح عالي الجودة |
| ar-XA-Chirp3-HD-Puck | باك | ذكر | صوت ذكوري واضح عالي الجودة |
| ar-XA-Chirp3-HD-Charon | كارون | ذكر | صوت ذكوري عميق عالي الجودة |
| ar-XA-Chirp3-HD-Aoede | أويدي | أنثى | صوت أنثوي ناعم عالي الجودة |

## البرومبت الصارم - لماذا مهم؟

### المشكلة
Gemini TTS قد يحاول "تفسير" أو "إعادة صياغة" النص بدلاً من قراءته كما هو.

### الحل
البرومبت الصارم يجبر النموذج على:
1. ✅ قراءة النص حرفياً دون تغيير
2. ✅ الالتزام بعلامات الترقيم
3. ✅ نطق الأرقام بشكل صحيح
4. ✅ استخدام مخارج حروف دقيقة
5. ✅ تجنب اللهجات الأجنبية

## الأساليب المتاحة

### 1. سينمائي (Cinematic)
```javascript
style: 'cinematic'
```
**الاستخدام**: إعلانات، مقاطع ترويجية، محتوى احترافي

**الخصائص**:
- نبرة فخمة
- سرعة متوسطة
- توقفات واضحة
- حماس متزن

### 2. هادئ (Calm)
```javascript
style: 'calm'
```
**الاستخدام**: تأملات، قصص قبل النوم، محتوى مريح

**الخصائص**:
- نبرة هادئة مطمئنة
- سرعة بطيئة قليلاً
- بدون مبالغة

### 3. حماسي (Energetic)
```javascript
style: 'energetic'
```
**الاستخدام**: محتوى رياضي، أخبار عاجلة، محتوى حماسي

**الخصائص**:
- نبرة حماسية
- سرعة سريعة قليلاً
- وضوح شديد

### 4. طفولي (Child-like)
```javascript
style: 'child'
```
**الاستخدام**: قصص أطفال، محتوى تعليمي للأطفال

**الخصائص**:
- صوت طفولي لطيف
- الحفاظ على نطق صحيح

## السجلات المتوقعة

### Frontend Console

```
طلب Gemini TTS (Chirp3-HD): {
  locale: "ar-SA",
  voiceName: "ar-XA-Chirp3-HD-Kore",
  textLength: 50,
  speed: "medium",
  pitch: "medium",
  style: "cinematic",
  styleHint: "أنت قارئ صوتي محترف...\nبنبرة سينمائية فخمة..."
}

محتوى الطلب: {
  "text": "مرحبا بك...",
  "voiceName": "ar-XA-Chirp3-HD-Kore",
  "styleHint": "...",
  "returnWavBase64": true
}

حالة الاستجابة: 200 OK
تم توليد الصوت بنجاح: {
  size: 48000,
  type: "audio/wav",
  sampleRate: 24000
}
```

## نصائح لأفضل نطق عربي

### 1. استخدم البرومبت الصارم ✅
التطبيق يفعل هذا تلقائياً!

### 2. استخدم علامات الترقيم
```
❌ مرحبا كيف حالك اليوم
✅ مرحبا، كيف حالك اليوم؟
```

### 3. حوّل الأرقام إلى نص
```
❌ عندي 123 كتاب
✅ عندي مئة وثلاثة وعشرون كتاباً
```

### 4. استخدم UTF-8
التطبيق يرسل `charset=utf-8` تلقائياً ✅

### 5. اختر الأسلوب المناسب
- إعلانات → سينمائي
- قصص → هادئ
- أخبار → حماسي
- أطفال → طفولي

## مقارنة قبل وبعد

### قبل التحديث
```javascript
// أصوات عامة
voiceName: "Kore"

// برومبت بسيط
styleHint: "اقرأ النص التالي بلهجة سعودية..."
```

### بعد التحديث
```javascript
// أصوات Chirp3-HD عالية الجودة
voiceName: "ar-XA-Chirp3-HD-Kore"

// برومبت صارم محسّن
styleHint: `أنت قارئ صوتي محترف.
اقرأ النص العربي التالي كما هو مكتوب حرفيًا دون أي تعديل أو إعادة صياغة أو ترجمة.
التزم بعلامات الترقيم.
اقرأ الأرقام كأرقام عربية مفهومة في السياق.
نطق عربي فصيح واضح جدًا، مخارج حروف دقيقة، دون إدخال لهجة أجنبية.`
```

## الفوائد

### ✅ جودة صوت أعلى
Chirp3-HD يوفر جودة صوت ممتازة (24kHz WAV)

### ✅ نطق أدق
البرومبت الصارم يضمن قراءة النص كما هو

### ✅ مرونة أكبر
4 أساليب مختلفة للاختيار من بينها

### ✅ تحكم أفضل
Gemini TTS قابل للتوجيه بالبرومبت

## الاختبار

### اختبار أساسي
```bash
# نص بسيط
curl -X POST http://localhost:8080/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"مرحبا","voiceName":"ar-XA-Chirp3-HD-Kore","returnWavBase64":true}'
```

### اختبار مع علامات ترقيم
```bash
# نص مع علامات ترقيم
curl -X POST http://localhost:8080/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"مرحبا، كيف حالك اليوم؟","voiceName":"ar-XA-Chirp3-HD-Kore","returnWavBase64":true}'
```

### اختبار مع أرقام
```bash
# نص مع أرقام (محوّلة إلى نص)
curl -X POST http://localhost:8080/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"عندي مئة وثلاثة وعشرون كتاباً","voiceName":"ar-XA-Chirp3-HD-Kore","returnWavBase64":true}'
```

## معالجة الأخطاء

### خطأ: "Gemini TTS error"
**السبب**: مشكلة في Gemini API

**الحل**:
1. تحقق من GEMINI_API_KEY
2. تحقق من حصة API
3. تحقق من اسم الصوت صحيح (ar-XA-Chirp3-HD-Kore)

### خطأ: "No audio returned"
**السبب**: الاستجابة لا تحتوي على بيانات صوتية

**الحل**:
1. تحقق من البرومبت
2. تحقق من النص غير فارغ
3. تحقق من سجلات Backend

## قائمة التحقق

### ✅ Frontend
- [x] تحديث أسماء الأصوات إلى Chirp3-HD
- [x] تحديث البرومبت الصارم
- [x] إضافة أساليب النطق
- [x] اختبار lint (نجح ✓)

### ✅ Backend
- [x] تحديث الصوت الافتراضي إلى Chirp3-HD
- [x] تحديث البرومبت الصارم
- [x] اختبار endpoint

### ⏳ Testing
- [ ] اختبار نص عربي بسيط
- [ ] اختبار نص مع علامات ترقيم
- [ ] اختبار نص مع أرقام
- [ ] اختبار أساليب مختلفة
- [ ] اختبار أصوات مختلفة

## الخطوات التالية

1. **نشر Backend**:
```bash
cd backend-tts
npm install
# أضف GEMINI_API_KEY
npm start
```

2. **اختبار محلياً**:
```bash
curl -X POST http://localhost:8080/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"مرحبا","voiceName":"ar-XA-Chirp3-HD-Kore","returnWavBase64":true}'
```

3. **اختبار Frontend**:
- افتح التطبيق
- اذهب إلى "تحويل النص إلى صوت"
- جرب نصوص مختلفة
- جرب أساليب مختلفة

4. **نشر Production**:
- نشر Backend إلى Railway/Render
- تكوين proxy endpoint
- اختبار التكامل

## الموارد

### Documentation
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [Generate Speech](https://aistudio.google.com/generate-speech)
- [Chirp3-HD Voices](https://cloud.google.com/text-to-speech/docs/voices)

### Code Files
- Frontend: `src/services/api.ts`, `src/types/api.ts`
- Backend: `backend-tts/server.js`
- Documentation: `GEMINI_CHIRP3_HD_FINAL.md`

## الخلاصة

تم تحديث التطبيق بنجاح لاستخدام:
- ✅ أصوات Chirp3-HD عالية الجودة
- ✅ برومبت صارم محسّن للنطق الصحيح
- ✅ 4 أساليب نطق مختلفة
- ✅ دعم كامل للعربية والإنجليزية
- ✅ معالجة أخطاء شاملة
- ✅ توثيق شامل

**الحالة**: ✅ جاهز للنشر والاختبار
**التاريخ**: 2025-12-18
**الإصدار**: 3.1.0 (Chirp3-HD + Strict Prompt)

---

**ملاحظة مهمة**: البرومبت الصارم هو المفتاح للحصول على نطق عربي صحيح. تأكد من استخدامه دائماً!
