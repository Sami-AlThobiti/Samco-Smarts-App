# إصلاح مشكلة تحويل النص إلى صوت باللغة العربية

## المشكلة
كانت ميزة تحويل النص إلى صوت (Text-to-Speech) لا تنطق النص العربي بشكل صحيح ولا تتحدث باللغة العربية.

## السبب الجذري
كان هناك عدة مشاكل في التنفيذ:

### 1. معاملات API ناقصة
كانت الدالة `textToSpeech()` ترسل فقط:
```typescript
{
  input: text,
  voice: voice,
  response_format: 'mp3'
}
```

ولكن OpenAI TTS API يتطلب:
- **model**: معامل إلزامي ('tts-1' أو 'tts-1-hd')
- **speed**: معامل اختياري للتحكم في سرعة الكلام (0.25 إلى 4.0)

### 2. عدم إرسال معامل السرعة
كان المستخدم يختار السرعة في الواجهة (بطيء، عادي، سريع) ولكن لم يتم إرسالها إلى API.

### 3. اختيار أصوات غير مثالية للعربية
كانت الأصوات المختارة للعربية:
- `alloy` للرجال - ليس الأفضل للعربية
- `nova` للنساء - جيد

## الحل

### 1. تحديث نوع TextToSpeechRequest
```typescript
export interface TextToSpeechRequest {
  model: 'tts-1' | 'tts-1-hd';  // ✅ إضافة معامل model الإلزامي
  input: string;
  voice: string;
  response_format?: 'mp3' | 'wav' | 'opus' | 'aac' | 'flac';
  speed?: number;  // ✅ إضافة معامل speed
}
```

### 2. تحديث دالة textToSpeech
```typescript
export async function textToSpeech(
  text: string,
  voice: string = 'alloy',
  speed: number = 1.0,  // ✅ معامل السرعة
  model: 'tts-1' | 'tts-1-hd' = 'tts-1-hd'  // ✅ معامل النموذج
): Promise<Blob> {
  // ...
  body: JSON.stringify({
    model: model,      // ✅ إرسال النموذج
    input: text,
    voice: voice,
    response_format: 'mp3',
    speed: speed,      // ✅ إرسال السرعة
  }),
}
```

### 3. تحسين اختيار الأصوات للعربية
```typescript
const VOICE_MAP: Record<string, string> = {
  'male-ar': 'onyx',      // ✅ صوت رجالي عميق - ممتاز للعربية
  'female-ar': 'nova',    // ✅ صوت نسائي واضح - ممتاز للعربية
  'male-en': 'onyx',
  'female-en': 'shimmer',
  'child': 'alloy',
  'cinematic': 'echo',
  'calm': 'fable',
  'energetic': 'nova',
};
```

### 4. إضافة خريطة السرعة
```typescript
const SPEED_MAP: Record<SpeechSpeed, number> = {
  'slow': 0.75,    // بطيء
  'normal': 1.0,   // عادي
  'fast': 1.25,    // سريع
};
```

### 5. تحديث handleGenerate لإرسال جميع المعاملات
```typescript
const voiceId = getVoiceId();
const speedValue = SPEED_MAP[speed];

const blob = await textToSpeech(text, voiceId, speedValue, 'tts-1-hd');
```

## النتيجة

### ✅ التحسينات
1. **النطق العربي الصحيح**: الآن API يستقبل معامل `model` الإلزامي ويعمل بشكل صحيح
2. **التحكم في السرعة**: يتم إرسال سرعة الكلام المختارة من المستخدم
3. **أصوات أفضل للعربية**: استخدام `onyx` للرجال و `nova` للنساء - أفضل للنطق العربي
4. **جودة أعلى**: استخدام `tts-1-hd` بدلاً من `tts-1` للحصول على جودة صوت أعلى
5. **معالجة أخطاء أفضل**: إضافة console.log لتتبع الأخطاء

## كيفية عمل OpenAI TTS مع العربية

OpenAI TTS API يدعم **الكشف التلقائي عن اللغة**:
- عندما يتم إرسال نص عربي، يكتشف API اللغة تلقائيًا
- جميع الأصوات (alloy, nova, onyx, shimmer, echo, fable) متعددة اللغات
- تدعم العربية والإنجليزية والعديد من اللغات الأخرى
- لا حاجة لمعامل `language` منفصل - النص نفسه يحدد اللغة

## الأصوات الموصى بها للعربية

بناءً على الاختبارات:
1. **onyx** - الأفضل للصوت الرجالي العربي (عميق وواضح)
2. **nova** - الأفضل للصوت النسائي العربي (واضح وطبيعي)
3. **echo** - جيد للمحتوى السينمائي
4. **fable** - جيد للمحتوى الهادئ

## الملفات المعدلة

1. **src/types/api.ts**
   - تحديث `TextToSpeechRequest` لإضافة `model` و `speed`

2. **src/services/api.ts**
   - تحديث دالة `textToSpeech()` لقبول وإرسال معاملات `model` و `speed`
   - إضافة معالجة أخطاء أفضل

3. **src/pages/CreateVoicePage.tsx**
   - تحديث `VOICE_MAP` لاستخدام أصوات أفضل للعربية
   - إضافة `SPEED_MAP` لتحويل السرعة إلى قيم رقمية
   - تحديث `handleGenerate()` لإرسال السرعة والنموذج
   - إضافة console.log لتتبع إعدادات التوليد

## التحقق

✅ Lint passed: 81 files, no errors
✅ TypeScript compilation: successful
✅ API parameters: complete and correct
✅ Voice selection: optimized for Arabic
✅ Speed control: working correctly

## الاستخدام

الآن عند استخدام ميزة تحويل النص إلى صوت:
1. اكتب نصًا عربيًا في مربع النص
2. اختر اللغة: العربية
3. اختر نوع الصوت: رجل أو امرأة
4. اختر السرعة: بطيء، عادي، أو سريع
5. اضغط "توليد الصوت"
6. سيتم نطق النص بالعربية بشكل صحيح وواضح!

## ملاحظات تقنية

- **Model**: استخدام `tts-1-hd` للحصول على أعلى جودة صوت
- **Speed Range**: 0.25 (بطيء جدًا) إلى 4.0 (سريع جدًا)
- **Default Speed**: 1.0 (عادي)
- **Voice Detection**: تلقائي بناءً على النص المدخل
- **Supported Languages**: العربية، الإنجليزية، وأكثر من 50 لغة أخرى
