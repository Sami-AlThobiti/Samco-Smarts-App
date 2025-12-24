# تكامل Google AI Studio لتحويل النص إلى صوت

## نظرة عامة

تم تحديث التطبيق لاستخدام **Google AI Studio Text-to-Speech API** المتوفر على:
https://aistudio.google.com/generate-speech

## التغييرات الرئيسية

### 1. نقطة النهاية الجديدة
```
POST https://api-integrations.appmedo.com/app-8bbt7fcnal1d/api-google-ai-studio/v1/text:synthesize
```

### 2. هيكل الطلب المبسط
```json
{
  "text": "النص المراد تحويله",
  "languageCode": "ar",
  "voiceName": "ar-XA-Wavenet-A",
  "speakingRate": 1.0,
  "pitch": 0.0,
  "audioEncoding": "MP3"
}
```

### 3. معالجة الاستجابة المرنة
الكود الآن يدعم نوعين من الاستجابات:
- **JSON**: يحتوي على `audioContent` أو `audio` أو `data` بصيغة base64
- **Binary**: ملف صوتي مباشر

### 4. رموز اللغة المبسطة
- العربية: `ar` (بدلاً من `ar-XA`)
- الإنجليزية: `en` (بدلاً من `en-US`, `en-GB`, etc.)

## كيفية العمل

### الخطوة 1: إدخال النص
المستخدم يدخل النص في واجهة التطبيق

### الخطوة 2: اختيار الإعدادات
- اللغة/اللهجة
- الصوت (ذكر/أنثى)
- السرعة (0.5x - 1.5x)
- النبرة (-10 إلى +10)

### الخطوة 3: إرسال الطلب
```typescript
const googleRequest = {
  text: "مرحبا بك",
  languageCode: "ar",
  voiceName: "ar-XA-Wavenet-A",
  speakingRate: 1.0,
  pitch: 0.0,
  audioEncoding: "MP3"
};
```

### الخطوة 4: معالجة الاستجابة
```typescript
// إذا كانت JSON
if (contentType.includes('application/json')) {
  const result = await response.json();
  const base64Audio = result.audioContent || result.audio || result.data;
  // تحويل base64 إلى Blob
}

// إذا كانت Binary
else {
  const audioBlob = await response.blob();
}
```

## السجلات التفصيلية

عند استخدام الميزة، ستظهر السجلات التالية في console:

```
طلب Google AI Studio TTS: {
  locale: "ar-SA",
  languageCode: "ar",
  voiceName: "ar-XA-Wavenet-A",
  textLength: 50,
  speed: "medium",
  pitch: "medium"
}

محتوى الطلب: {
  "text": "مرحبا بك",
  "languageCode": "ar",
  "voiceName": "ar-XA-Wavenet-A",
  "speakingRate": 1.0,
  "pitch": 0.0,
  "audioEncoding": "MP3"
}

حالة الاستجابة: 200 OK

نوع المحتوى: application/json

استجابة JSON: ["audioContent"]

تم توليد الصوت بنجاح: {
  size: 45678,
  type: "audio/mpeg"
}
```

## معالجة الأخطاء

### خطأ: "لم يتم استلام ملف صوتي"
**الأسباب المحتملة**:
1. الاستجابة لا تحتوي على `audioContent` أو `audio` أو `data`
2. الاستجابة فارغة
3. تنسيق الاستجابة غير متوقع

**الحل**:
- تحقق من سجلات console
- ابحث عن "محتوى الاستجابة:" لرؤية البنية الفعلية
- تحقق من إعدادات Backend API

### خطأ: "فشل طلب تحويل النص إلى صوت: 401"
**السبب**: مشكلة في مفتاح API

**الحل**: تواصل مع فريق Backend للتحقق من:
- مفتاح Google AI Studio API
- صلاحيات المفتاح
- حصة API (Quota)

### خطأ: "فشل طلب تحويل النص إلى صوت: 400"
**السبب**: طلب غير صالح

**الحل**: تحقق من:
- النص غير فارغ
- اسم الصوت صحيح
- رمز اللغة صحيح
- القيم الرقمية (speakingRate, pitch) في النطاق الصحيح

## الاختبار

### اختبار أساسي
1. افتح التطبيق
2. انتقل إلى "تحويل النص إلى صوت"
3. أدخل: "مرحبا"
4. اختر: عربي (السعودية) → صوت أنثى 1
5. افتح console المتصفح (F12)
6. اضغط "توليد الصوت"
7. راقب السجلات

### ما يجب أن تراه
```
✅ طلب Google AI Studio TTS: {...}
✅ محتوى الطلب: {...}
✅ حالة الاستجابة: 200 OK
✅ نوع المحتوى: application/json أو audio/mpeg
✅ تم توليد الصوت بنجاح: {size: ..., type: ...}
```

### إذا ظهرت أخطاء
```
❌ خطأ في Google AI Studio API: {...}
❌ محتوى الاستجابة: {...}
❌ فشل توليد الصوت: ...
```

انسخ جميع السجلات وأرسلها لفريق الدعم.

## متطلبات Backend

### نقطة النهاية
يجب على Backend توفير proxy endpoint:
```
POST /api-google-ai-studio/v1/text:synthesize
```

### المهام المطلوبة
1. استقبال الطلب من Frontend
2. إضافة مفتاح Google AI Studio API
3. إرسال الطلب إلى Google AI Studio
4. إرجاع الاستجابة إلى Frontend

### تنسيق الطلب من Frontend
```json
{
  "text": "string",
  "languageCode": "ar" | "en",
  "voiceName": "string",
  "speakingRate": 0.5 - 1.5,
  "pitch": -10.0 - 10.0,
  "audioEncoding": "MP3"
}
```

### تنسيق الاستجابة المتوقعة
**خيار 1 - JSON**:
```json
{
  "audioContent": "base64_encoded_audio"
}
```

**خيار 2 - Binary**:
```
Content-Type: audio/mpeg
Body: binary audio data
```

## الفروقات عن Google Cloud TTS

| الميزة | Google Cloud TTS | Google AI Studio |
|--------|------------------|------------------|
| **نقطة النهاية** | `/api-google-tts/v1/text:synthesize` | `/api-google-ai-studio/v1/text:synthesize` |
| **هيكل الطلب** | متداخل (input, voice, audioConfig) | مسطح (text, languageCode, voiceName) |
| **رمز اللغة** | ar-XA | ar |
| **الاستجابة** | JSON فقط | JSON أو Binary |
| **المفاتيح** | audioContent | audioContent أو audio أو data |

## الخلاصة

تم تحديث التطبيق للعمل مع Google AI Studio بالميزات التالية:
- ✅ نقطة نهاية جديدة
- ✅ هيكل طلب مبسط
- ✅ معالجة استجابة مرنة
- ✅ سجلات تفصيلية للتصحيح
- ✅ معالجة أخطاء شاملة
- ✅ دعم JSON و Binary

**الحالة**: ✅ جاهز للاختبار
**التاريخ**: 2025-12-18
**الإصدار**: 2.3.0 (Google AI Studio)

---

**ملاحظة مهمة**: يجب على فريق Backend تكوين نقطة النهاية `/api-google-ai-studio/v1/text:synthesize` مع مفتاح Google AI Studio API الصحيح.
