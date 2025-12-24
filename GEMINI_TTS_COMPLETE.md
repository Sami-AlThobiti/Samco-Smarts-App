# ✅ تكامل Gemini API TTS - مكتمل

## نظرة عامة

تم تحديث تطبيق سامكو لاستخدام **Gemini API TTS** (نفس ميزة Generate Speech في Google AI Studio).

🔗 **المرجع**: https://aistudio.google.com/generate-speech

## ما تم إنجازه

### ✅ Frontend (React)
1. **تحديث الأصوات** - استخدام أصوات Gemini (Kore, Puck, Charon, Aoede)
2. **styleHint ذكي** - توجيهات مخصصة لكل لهجة عربية
3. **معالجة WAV** - دعم تنسيق WAV بدلاً من MP3
4. **سجلات مفصلة** - تصحيح شامل
5. **رسائل عربية** - جميع الرسائل بالعربية

### ✅ Backend (Node.js)
1. **server.js** - خادم Express كامل
2. **PCM to WAV** - تحويل PCM إلى WAV
3. **Gemini API** - تكامل مع gemini-2.5-flash-preview-tts
4. **styleHint** - دعم توجيهات النطق
5. **Base64/Binary** - دعم كلا التنسيقين

## البنية التقنية

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   Frontend  │  POST   │   Backend    │  POST   │  Gemini API     │
│   (React)   │────────>│  (Node.js)   │────────>│  (Google)       │
│             │  JSON   │              │  JSON   │                 │
│             │<────────│              │<────────│                 │
│             │  WAV    │              │  PCM    │                 │
└─────────────┘         └──────────────┘         └─────────────────┘
```

## الملفات المعدلة/المُنشأة

### Frontend
```
src/types/api.ts              ✏️ أصوات Gemini
src/services/api.ts           ✏️ تكامل Gemini TTS
```

### Backend
```
backend-tts/
├── server.js                 ✨ خادم Express
├── package.json              ✨ التبعيات
├── .env.example              ✨ مثال البيئة
└── README.md                 ✨ التوثيق
```

### Documentation
```
GEMINI_TTS_COMPLETE.md        ✨ هذا الملف
GEMINI_TTS_BACKEND.md         ✨ دليل Backend
GEMINI_TTS_FRONTEND.md        ✨ دليل Frontend
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

### 2. الحصول على Gemini API Key

1. اذهب إلى https://aistudio.google.com/
2. اضغط "Get API Key"
3. أنشئ مفتاح API جديد
4. انسخه إلى `.env`

### 3. اختبار Backend

```bash
curl -X POST http://localhost:8080/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "مرحبا",
    "voiceName": "Kore",
    "returnWavBase64": true
  }'
```

### 4. تكوين Frontend

Frontend مُكوّن مسبقاً للاتصال بـ:
```
https://api-integrations.appmedo.com/app-8bbt7fcnal1d/api-gemini-tts/tts
```

**مطلوب من فريق Backend**:
- نشر الخادم
- تكوين proxy من `/api-gemini-tts/tts` إلى الخادم المنشور

## الأصوات المتاحة

| الاسم | النوع | الوصف |
|------|------|-------|
| Kore | أنثى | صوت أنثوي واضح |
| Puck | ذكر | صوت ذكوري واضح |
| Charon | ذكر | صوت ذكوري عميق |
| Aoede | أنثى | صوت أنثوي ناعم |

## styleHint للعربية

### السعودية
```
اقرأ النص التالي بلهجة سعودية واضحة وبنطق صحيح، واقرأه كما هو مكتوب دون تغيير.
```

### المصرية
```
اقرأ النص التالي بلهجة مصرية واضحة وبنطق صحيح، واقرأه كما هو مكتوب دون تغيير.
```

### الفصحى (افتراضي)
```
اقرأ النص التالي بالعربية الفصحى وبنطق واضح، واقرأه كما هو مكتوب دون تغيير.
```

## تدفق البيانات

### 1. Frontend → Backend

```json
{
  "text": "مرحبا بك في تطبيق سامكو",
  "voiceName": "Kore",
  "styleHint": "اقرأ النص التالي بلهجة سعودية...",
  "returnWavBase64": true
}
```

### 2. Backend → Gemini API

```json
{
  "contents": [{
    "parts": [{
      "text": "اقرأ النص التالي...\n\nالنص:\nمرحبا بك في تطبيق سامكو"
    }]
  }],
  "generationConfig": {
    "responseModalities": ["AUDIO"],
    "speechConfig": {
      "voiceConfig": {
        "prebuiltVoiceConfig": {
          "voiceName": "Kore"
        }
      }
    }
  }
}
```

### 3. Gemini API → Backend

```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "inlineData": {
          "data": "base64_pcm_audio..."
        }
      }]
    }
  }]
}
```

### 4. Backend → Frontend

```json
{
  "mimeType": "audio/wav",
  "sampleRate": 24000,
  "channels": 1,
  "audioBase64": "UklGRi4..."
}
```

## السجلات المتوقعة

### Frontend Console

```
طلب Gemini TTS: {
  locale: "ar-SA",
  voiceName: "Kore",
  textLength: 50,
  speed: "medium",
  pitch: "medium",
  styleHint: "اقرأ النص التالي بلهجة سعودية..."
}

محتوى الطلب: {
  "text": "مرحبا بك...",
  "voiceName": "Kore",
  "styleHint": "...",
  "returnWavBase64": true
}

حالة الاستجابة: 200 OK
نوع المحتوى: application/json
استجابة JSON: ["mimeType", "sampleRate", "channels", "audioBase64"]
تم توليد الصوت بنجاح: {
  size: 48000,
  type: "audio/wav",
  mimeType: "audio/wav",
  sampleRate: 24000
}
```

### Backend Console

```
TTS server running on :8080
```

## معالجة الأخطاء

### خطأ 500: "Missing GEMINI_API_KEY"
**السبب**: مفتاح API غير موجود في `.env`

**الحل**:
1. تأكد من وجود ملف `.env`
2. أضف `GEMINI_API_KEY=your_key_here`
3. أعد تشغيل الخادم

### خطأ 400: "text is required"
**السبب**: النص فارغ أو غير موجود

**الحل**:
- تأكد من إرسال `text` في الطلب
- تأكد من أن النص ليس فارغاً

### خطأ: "Gemini TTS error"
**السبب**: خطأ من Gemini API

**الحل**:
1. تحقق من صحة مفتاح API
2. تحقق من حصة API (Quota)
3. تحقق من حالة خدمة Gemini

### خطأ: "No audio returned"
**السبب**: الاستجابة لا تحتوي على بيانات صوتية

**الحل**:
1. تحقق من تنسيق الطلب
2. تحقق من اسم الصوت صحيح
3. تحقق من سجلات Backend

## نصائح لتحسين النطق العربي

### 1. استخدم styleHint واضح
```javascript
const styleHint = "اقرأ النص التالي بلهجة سعودية واضحة وبنطق صحيح، واقرأه كما هو مكتوب دون تغيير.";
```

### 2. تأكد من UTF-8
```javascript
headers: {
  'Content-Type': 'application/json; charset=utf-8'
}
```

### 3. حوّل الأرقام إلى نص
```javascript
// ❌ سيء
"عندي 123 كتاب"

// ✅ جيد
"عندي مئة وثلاثة وعشرون كتاباً"
```

### 4. استخدم علامات الترقيم
```javascript
// ❌ سيء
"مرحبا كيف حالك اليوم"

// ✅ جيد
"مرحبا، كيف حالك اليوم؟"
```

## المواصفات التقنية

### Audio Format
- **Type**: WAV (PCM)
- **Sample Rate**: 24000 Hz
- **Channels**: 1 (Mono)
- **Bit Depth**: 16-bit
- **Encoding**: Little-endian

### Request Limits
- **Max Text Length**: ~5000 characters
- **Max Request Size**: 2MB
- **Timeout**: 30 seconds

### Response Size
- **Average**: ~48KB per second of audio
- **Example**: 5 seconds = ~240KB

## الأمان

### ⚠️ مهم جداً

1. **لا تضع API Key في Frontend**
   ```javascript
   // ❌ خطر
   const GEMINI_API_KEY = "AIza...";
   
   // ✅ آمن
   // استخدم Backend
   ```

2. **استخدم HTTPS**
   ```
   ✅ https://your-server.com/tts
   ❌ http://your-server.com/tts
   ```

3. **قيّد CORS**
   ```javascript
   // Backend
   app.use(cors({
     origin: 'https://your-frontend.com'
   }));
   ```

4. **راقب الاستخدام**
   - تحقق من حصة API يومياً
   - ضع حدود للطلبات
   - سجّل الأخطاء

## النشر

### Backend Deployment

#### Option 1: Railway
1. Push code to GitHub
2. Connect to Railway
3. Add `GEMINI_API_KEY` environment variable
4. Deploy

#### Option 2: Render
1. Create Web Service
2. Connect GitHub repo
3. Add `GEMINI_API_KEY`
4. Deploy

#### Option 3: Your Server
```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start server.js --name samco-tts

# Save configuration
pm2 save

# Setup startup
pm2 startup
```

### Frontend Configuration

بعد نشر Backend، حدّث نقطة النهاية في `src/services/api.ts`:

```typescript
// Development
const TTS_ENDPOINT = 'http://localhost:8080/tts';

// Production
const TTS_ENDPOINT = 'https://your-backend.com/tts';
```

أو استخدم proxy من `api-integrations.appmedo.com`.

## الاختبار

### 1. اختبار Backend محلياً

```bash
# Start server
cd backend-tts
npm start

# Test with curl
curl -X POST http://localhost:8080/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"مرحبا","voiceName":"Kore","returnWavBase64":true}'
```

### 2. اختبار Frontend محلياً

```bash
# Start frontend
npm run dev

# Open browser
# Navigate to TTS page
# Enter text and generate
```

### 3. اختبار التكامل

1. تأكد من تشغيل Backend
2. افتح Frontend
3. اذهب إلى "تحويل النص إلى صوت"
4. أدخل: "مرحبا بك في تطبيق سامكو"
5. اختر صوت: كوري (أنثى)
6. اضغط "توليد الصوت"
7. استمع للنتيجة

## قائمة التحقق

### ✅ Backend
- [ ] تثبيت التبعيات (`npm install`)
- [ ] إضافة `GEMINI_API_KEY` في `.env`
- [ ] تشغيل الخادم (`npm start`)
- [ ] اختبار endpoint (`curl`)
- [ ] نشر إلى production
- [ ] تكوين CORS
- [ ] تكوين HTTPS

### ✅ Frontend
- [ ] تحديث الأصوات (مكتمل ✓)
- [ ] تحديث API integration (مكتمل ✓)
- [ ] اختبار محلياً
- [ ] تحديث نقطة النهاية للـ production
- [ ] اختبار التكامل
- [ ] نشر إلى production

### ✅ Testing
- [ ] نص عربي قصير
- [ ] نص عربي طويل
- [ ] نص إنجليزي
- [ ] أصوات مختلفة
- [ ] لهجات مختلفة
- [ ] معالجة الأخطاء

## الدعم

### إذا واجهت مشاكل

1. **تحقق من السجلات**
   - Frontend: Console المتصفح (F12)
   - Backend: Terminal logs

2. **تحقق من الاتصال**
   ```bash
   # Test backend
   curl http://localhost:8080/tts
   ```

3. **تحقق من API Key**
   - صحيح؟
   - صلاحيات كافية؟
   - حصة متبقية؟

4. **اتصل بالدعم**
   - انسخ جميع السجلات
   - حدد الخطوات للتكرار
   - أرفق screenshots

## الموارد

### Documentation
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [Generate Speech](https://aistudio.google.com/generate-speech)

### Code
- Frontend: `src/services/api.ts`
- Backend: `backend-tts/server.js`
- Types: `src/types/api.ts`

## الخلاصة

تم تكامل Gemini API TTS بنجاح مع:
- ✅ Frontend React كامل
- ✅ Backend Node.js جاهز
- ✅ أصوات Gemini عالية الجودة
- ✅ دعم اللهجات العربية
- ✅ styleHint ذكي
- ✅ معالجة WAV
- ✅ توثيق شامل

**الحالة**: ✅ جاهز للنشر والاختبار
**التاريخ**: 2025-12-18
**الإصدار**: 3.0.0 (Gemini TTS)

---

**ملاحظة مهمة**: يجب على فريق Backend نشر الخادم وتكوين proxy endpoint قبل الاستخدام في production.
