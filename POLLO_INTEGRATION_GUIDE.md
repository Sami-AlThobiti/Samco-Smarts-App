# 🎬 دليل تكامل Pollo AI - الإصدار النهائي

## نظرة عامة

هذا الدليل يشرح كيفية تكامل تطبيق سامكو مع **Pollo AI API** بشكل صحيح، مع معالجة مشاكل MIME Type و CORS.

---

## 🔑 المتطلبات الأساسية

### 1. الحصول على API Key

```bash
# زيارة Pollo AI Platform
https://pollo.ai/api-platform

# التسجيل والحصول على API Key
# إضافة المفتاح إلى .env
VITE_POLLO_API_KEY=your_api_key_here
VITE_BACKEND_URL=http://localhost:8080
```

### 2. قراءة الوثائق الرسمية

- **API Documentation**: https://docs.pollo.ai/
- **Video Effects**: https://pollo.ai/video-effects
- **Generation Endpoint**: https://docs.pollo.ai/generation
- **Status Endpoint**: https://docs.pollo.ai/status

---

## 📋 هيكل الاستجابة الصحيح من Pollo AI

### استجابة إنشاء المهمة (Create Generation)

```json
{
  "taskId": "abc123xyz"
}
```

### استجابة حالة المهمة (Status Check)

```json
{
  "taskId": "abc123xyz",
  "generations": [
    {
      "status": "succeed",
      "url": "https://pollo.ai/storage/videos/abc123xyz.mp4",
      "mediaType": "video"
    }
  ]
}
```

### حالات Status المحتملة

| الحالة | الوصف | الإجراء |
|--------|-------|---------|
| `pending` | في الانتظار | استمر في Polling |
| `processing` | جاري المعالجة | استمر في Polling |
| `succeed` | نجح | استخدم `url` |
| `failed` | فشل | اعرض `failMsg` |

---

## ⚠️ مشكلة MIME Type الشائعة

### السبب

عند محاولة تشغيل الفيديو مباشرة من رابط Pollo، قد يحدث:

1. **رابط خاطئ**: استخدام رابط Status API بدلاً من رابط الفيديو
   ```
   ❌ https://pollo.ai/api/platform/generation/abc123/status
   ✅ https://pollo.ai/storage/videos/abc123.mp4
   ```

2. **CORS Issues**: المتصفح يمنع الوصول المباشر
3. **Headers خاطئة**: Content-Type ليس `video/mp4`

### الأعراض

```
Error: No video with supported format and MIME type found
```

### الحل: Video Proxy

استخدام Backend Proxy لجلب الفيديو وإعادة إرساله مع Headers صحيحة.

---

## 🛠️ البنية التقنية

### 1. Frontend Service (`src/services/polloApi.ts`)

```typescript
// إنشاء مهمة توليد
export async function createPolloGeneration(request: PolloGenerationRequest): Promise<string>

// التحقق من حالة المهمة
export async function checkPolloStatus(taskId: string): Promise<PolloStatusResponse>

// انتظار اكتمال التوليد (Polling)
export async function waitForPolloCompletion(
  taskId: string,
  onProgress?: (status: string) => void
): Promise<string>

// توليد فيديو كامل (إنشاء + انتظار)
export async function generatePolloVideo(
  request: PolloGenerationRequest,
  onProgress?: (status: string) => void
): Promise<string>

// الحصول على رابط فيديو عبر Proxy
export function getProxiedVideoUrl(videoUrl: string): string
```

### 2. Backend Proxy (`backend-pollo/server.js`)

```javascript
// Endpoint: GET /video?url=<video_url>
app.get('/video', async (req, res) => {
  // 1. جلب الفيديو من Pollo
  const response = await fetch(url);
  
  // 2. التحقق من Content-Type
  if (!contentType.startsWith('video/')) {
    return res.status(502).json({ error: 'ليس فيديو' });
  }
  
  // 3. إعداد Headers صحيحة
  res.setHeader('Content-Type', contentType);
  res.setHeader('Accept-Ranges', 'bytes');
  
  // 4. إرسال البيانات
  res.send(buffer);
});
```

---

## 🔄 تدفق العمل الكامل

### الخطوة 1: المستخدم يرفع الصور

```typescript
// في EffectDetailPage.tsx
const [images, setImages] = useState<File[]>([]);

// رفع الصور
const onDrop = useCallback((acceptedFiles: File[]) => {
  setImages([...images, ...acceptedFiles]);
}, [images]);
```

### الخطوة 2: تحويل الصور إلى Base64

```typescript
const imageBase64Array = await Promise.all(
  images.map(async (image) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // إزالة data:image/...;base64,
      };
      reader.readAsDataURL(image);
    });
  })
);
```

### الخطوة 3: إنشاء مهمة Pollo

```typescript
const taskId = await createPolloGeneration({
  effectId: effect.id,
  images: imageBase64Array,
  aspect: '9:16',
  duration: 8,
  prompt: effect.prompt,
});

// النتيجة: taskId = "abc123xyz"
```

### الخطوة 4: Polling للحالة

```typescript
const videoUrl = await waitForPolloCompletion(
  taskId,
  (status) => {
    // تحديث UI
    console.log('الحالة:', status);
  }
);

// النتيجة: videoUrl = "https://pollo.ai/storage/videos/abc123.mp4"
```

### الخطوة 5: استخدام Proxy للفيديو

```typescript
const proxiedUrl = getProxiedVideoUrl(videoUrl);
// النتيجة: "http://localhost:8080/video?url=https%3A%2F%2Fpollo.ai%2Fstorage%2Fvideos%2Fabc123.mp4"

setGeneratedVideoUrl(proxiedUrl);
```

### الخطوة 6: عرض الفيديو

```tsx
<video src={generatedVideoUrl} controls className="w-full h-full rounded-lg" />
```

---

## 🚀 تشغيل التطبيق

### 1. تشغيل Backend Proxy

```bash
cd backend-pollo
npm install
npm start

# الخرج:
# 🚀 Pollo Video Proxy يعمل على المنفذ 8080
# 📹 استخدم: http://localhost:8080/video?url=<video_url>
```

### 2. تشغيل Frontend

```bash
cd /workspace/app-8bbt7fcnal1d
npm run dev

# الخرج:
# ➜  Local:   http://localhost:5173/
```

### 3. اختبار التكامل

1. افتح التطبيق: http://localhost:5173/
2. اضغط على "✨ تأثيرات الفيديو"
3. اختر تأثير (مثل: 🌀 الدخول إلى المشهد)
4. ارفع صورة
5. اضغط "⚡ توليد الفيديو"
6. انتظر (30 ثانية - دقيقتين)
7. شاهد النتيجة

---

## 🐛 معالجة الأخطاء

### خطأ: "مفتاح Pollo AI API غير موجود"

**السبب**: لم يتم تعيين `VITE_POLLO_API_KEY` في `.env`

**الحل**:
```bash
echo "VITE_POLLO_API_KEY=your_api_key_here" >> .env
```

### خطأ: "فشل إنشاء المهمة"

**الأسباب المحتملة**:
1. API Key خاطئ أو منتهي
2. الصور كبيرة جداً (> 10MB)
3. صيغة الصور غير مدعومة
4. نفذت Credits من حسابك

**الحل**:
```typescript
// ضغط الصور قبل الإرسال
import imageCompression from 'browser-image-compression';

const compressedImage = await imageCompression(image, {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
});
```

### خطأ: "انتهت المهلة الزمنية للتوليد"

**السبب**: التوليد استغرق أكثر من دقيقتين (60 محاولة × 2 ثانية)

**الحل**:
```typescript
// زيادة عدد المحاولات في polloApi.ts
const maxAttempts = 120; // 4 دقائق
```

### خطأ: "المحتوى ليس فيديو"

**السبب**: الرابط المرجع ليس فيديو (قد يكون HTML أو JSON)

**الحل**:
```typescript
// التحقق من الرابط قبل الاستخدام
if (!videoUrl.includes('.mp4') && !videoUrl.includes('video')) {
  console.error('رابط غير صحيح:', videoUrl);
}
```

### خطأ: "CORS policy"

**السبب**: محاولة الوصول المباشر للفيديو من Pollo

**الحل**: استخدام Proxy (مطبق بالفعل)

---

## 📊 مراقبة الأداء

### Logging في Frontend

```typescript
console.log('📤 إرسال طلب توليد:', {
  effectId: effect.id,
  imagesCount: images.length,
  aspect: aspect,
  duration: duration,
});

console.log('⏳ جاري الانتظار... taskId:', taskId);

console.log('✅ تم الحصول على الفيديو:', videoUrl);
```

### Logging في Backend

```javascript
console.log('📥 جلب فيديو من:', url);
console.log('📄 نوع المحتوى:', contentType);
console.log('✅ تم إرسال الفيديو بنجاح، الحجم:', buffer.length, 'بايت');
```

### مراقبة الوقت

```typescript
const startTime = Date.now();

const videoUrl = await generatePolloVideo(...);

const endTime = Date.now();
const duration = (endTime - startTime) / 1000;

console.log(`⏱️ استغرق التوليد: ${duration.toFixed(1)} ثانية`);
```

---

## 🔒 الأمان

### 1. حماية API Key

```typescript
// ❌ خطأ - لا تضع API Key في Frontend مباشرة
const API_KEY = 'sk-1234567890';

// ✅ صحيح - استخدم Environment Variables
const API_KEY = import.meta.env.VITE_POLLO_API_KEY;
```

### 2. التحقق من الصور

```typescript
// التحقق من نوع الملف
const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
  throw new Error('نوع الملف غير مدعوم');
}

// التحقق من حجم الملف (10MB)
const maxSize = 10 * 1024 * 1024;
if (file.size > maxSize) {
  throw new Error('حجم الملف كبير جدًا');
}
```

### 3. Rate Limiting

```typescript
// في Backend
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 10, // 10 طلبات كحد أقصى
  message: 'تجاوزت الحد الأقصى للطلبات',
});

app.use('/video', limiter);
```

---

## 📈 التحسينات المستقبلية

### 1. Caching

```typescript
// Cache الفيديوهات المولدة
const videoCache = new Map<string, string>();

export function getCachedVideo(taskId: string): string | null {
  return videoCache.get(taskId) || null;
}

export function cacheVideo(taskId: string, url: string): void {
  videoCache.set(taskId, url);
}
```

### 2. Retry Logic

```typescript
async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error('فشل بعد عدة محاولات');
}
```

### 3. Progress Bar

```typescript
// عرض نسبة مئوية للتقدم
const [progress, setProgress] = useState(0);

await generatePolloVideo(
  request,
  (status) => {
    const progressMap = {
      'pending': 10,
      'processing': 50,
      'succeed': 100,
    };
    setProgress(progressMap[status] || 0);
  }
);
```

---

## 🧪 الاختبار

### اختبار Backend Proxy

```bash
# اختبار Health Check
curl http://localhost:8080/health

# اختبار Video Proxy (مع رابط فيديو حقيقي)
curl "http://localhost:8080/video?url=https://example.com/video.mp4" --output test.mp4
```

### اختبار Frontend API

```typescript
// في Console المتصفح
import { generatePolloVideo } from '@/services/polloApi';

const videoUrl = await generatePolloVideo({
  effectId: 'effect_portal',
  images: ['base64_image_data'],
  aspect: '9:16',
  duration: 8,
  prompt: 'Test prompt',
});

console.log('Video URL:', videoUrl);
```

---

## 📚 المراجع

### Pollo AI

- **الموقع الرسمي**: https://pollo.ai/
- **API Platform**: https://pollo.ai/api-platform
- **الوثائق**: https://docs.pollo.ai/
- **Video Effects**: https://pollo.ai/video-effects

### تقنيات أخرى

- **MDN - MIME Types**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
- **Express.js**: https://expressjs.com/
- **React Dropzone**: https://react-dropzone.js.org/

---

## ✅ Checklist قبل الإطلاق

### Backend

- [ ] تثبيت Dependencies (`npm install`)
- [ ] تشغيل السيرفر (`npm start`)
- [ ] اختبار Health Check
- [ ] اختبار Video Proxy مع رابط حقيقي

### Frontend

- [ ] إضافة `VITE_POLLO_API_KEY` إلى `.env`
- [ ] إضافة `VITE_BACKEND_URL` إلى `.env`
- [ ] تشغيل التطبيق (`npm run dev`)
- [ ] اختبار رفع الصور
- [ ] اختبار توليد فيديو كامل
- [ ] اختبار تحميل الفيديو
- [ ] اختبار مشاركة الفيديو

### الجودة

- [ ] اجتياز ESLint (`npm run lint`)
- [ ] اجتياز TypeScript (`tsc --noEmit`)
- [ ] اختبار على متصفحات مختلفة
- [ ] اختبار على أحجام شاشات مختلفة

---

## 🎉 الخلاصة

تم تنفيذ تكامل كامل مع Pollo AI يتضمن:

✅ **Frontend Service** لإدارة API Calls
✅ **Backend Proxy** لحل مشاكل CORS و MIME
✅ **Polling System** لمتابعة حالة التوليد
✅ **Error Handling** شامل
✅ **Progress Updates** للمستخدم
✅ **Type Safety** كامل مع TypeScript

**الحالة**: ✅ جاهز للاستخدام مع Pollo AI API
**التاريخ**: 2025-12-18
**الإصدار**: 4.2.0

---

**ملاحظة**: هذا التكامل يتطلب Pollo AI API Key صالح. بدون المفتاح، سيظهر خطأ "مفتاح Pollo AI API غير موجود".
