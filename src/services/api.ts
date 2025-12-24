// خدمة API لتطبيق سامكو
import type {
  ImageGenerationRequest,
  ImageGenerationResponse,
  TextToVideoRequest,
  ImageToVideoRequest,
  VideoTaskResponse,
  VideoQueryResponse,
  AzureTTSRequest,
  TTSLocale,
  VoiceInfo,
} from '@/types/api';
import { AVAILABLE_VOICES } from '@/types/api';

const APP_ID = import.meta.env.VITE_APP_ID || 'app-8bbt7fcnal1d';

// استخراج الصورة من استجابة Markdown
export function extractImageFromMarkdown(text: string): string | null {
  const regex = /!\[.*?\]\((data:image\/[^;]+;base64,[^)]+)\)/;
  const match = text.match(regex);
  return match ? match[1] : null;
}

// تحويل ملف إلى Base64
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // إزالة البادئة data:image/...;base64,
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// توليد صورة باستخدام Nano Banana Pro
export async function generateImage(
  prompt: string,
  referenceImage?: File,
  aspectRatio?: string
): Promise<string> {
  const parts: Array<{
    text?: string;
    inline_data?: {
      mime_type: 'image/png' | 'image/jpeg' | 'image/webp';
      data: string;
    };
  }> = [];

  // إضافة الصورة المرجعية إذا كانت موجودة
  if (referenceImage) {
    const base64Data = await fileToBase64(referenceImage);
    const mimeType = referenceImage.type as 'image/png' | 'image/jpeg' | 'image/webp';
    parts.push({
      inline_data: {
        mime_type: mimeType,
        data: base64Data,
      },
    });
  }

  // تحسين البرومبت بإضافة نسبة الأبعاد
  let enhancedPrompt = prompt;
  if (aspectRatio) {
    const aspectRatioMap: Record<string, string> = {
      '1:1': 'مربع 1024×1024 بكسل',
      '9:16': 'عمودي 1080×1920 بكسل',
      '16:9': 'أفقي 1920×1080 بكسل',
      '4:5': 'Instagram 1080×1350 بكسل',
    };
    const ratioDescription = aspectRatioMap[aspectRatio] || aspectRatio;
    enhancedPrompt = `${prompt}\n\nمهم جداً: يجب أن تكون الصورة بنسبة أبعاد ${ratioDescription} بالضبط. الصورة يجب أن تكون ${ratioDescription}.`;
  }

  // إضافة النص المحسّن
  parts.push({ text: enhancedPrompt });

  const requestBody: ImageGenerationRequest = {
    contents: [{ parts }],
  };

  const response = await fetch(
    'https://api-integrations.appmedo.com/app-8bbt7fcnal1d/api-Xa6JZ58oPMEa/v1beta/models/gemini-3-pro-image-preview:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID,
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(300000), // 5 دقائق
    }
  );

  if (!response.ok) {
    throw new Error(`فشل طلب API: ${response.status}`);
  }

  const data: ImageGenerationResponse = await response.json();

  if (data.status !== 0) {
    throw new Error(data.msg || 'فشل توليد الصورة');
  }

  const imageText = data.candidates[0]?.content?.parts[0]?.text;
  if (!imageText) {
    throw new Error('لم يتم العثور على صورة في الاستجابة');
  }

  const imageUrl = extractImageFromMarkdown(imageText);
  if (!imageUrl) {
    throw new Error('فشل استخراج الصورة من الاستجابة');
  }

  return imageUrl;
}

// إنشاء مهمة فيديو من نص
export async function createTextToVideoTask(
  request: TextToVideoRequest
): Promise<string> {
  const response = await fetch(
    'https://api-integrations.appmedo.com/app-8bbt7fcnal1d/api-DY8MX5oBQDGa/v1/videos/text2video',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID,
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error(`فشل طلب API: ${response.status}`);
  }

  const data: VideoTaskResponse = await response.json();

  if (data.code !== 0) {
    throw new Error(data.message || 'فشل إنشاء مهمة الفيديو');
  }

  return data.data.task_id;
}

// إنشاء مهمة فيديو من صورة
export async function createImageToVideoTask(
  request: ImageToVideoRequest
): Promise<string> {
  const response = await fetch(
    'https://api-integrations.appmedo.com/app-8bbt7fcnal1d/api-6LeB8Qe4rWGY/v1/videos/image2video',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID,
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error(`فشل طلب API: ${response.status}`);
  }

  const data: VideoTaskResponse = await response.json();

  if (data.code !== 0) {
    throw new Error(data.message || 'فشل إنشاء مهمة الفيديو');
  }

  return data.data.task_id;
}

// استعلام عن مهمة فيديو من نص
export async function queryTextToVideoTask(
  taskId: string
): Promise<VideoQueryResponse> {
  const response = await fetch(
    `https://api-integrations.appmedo.com/app-8bbt7fcnal1d/api-Q9KW2qRywm89/v1/videos/text2video/${taskId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`فشل طلب API: ${response.status}`);
  }

  const data: VideoQueryResponse = await response.json();

  if (data.code !== 0) {
    throw new Error(data.message || 'فشل الاستعلام عن مهمة الفيديو');
  }

  return data;
}

// استعلام عن مهمة فيديو من صورة
export async function queryImageToVideoTask(
  taskId: string
): Promise<VideoQueryResponse> {
  const response = await fetch(
    `https://api-integrations.appmedo.com/app-8bbt7fcnal1d/api-o9wN7X5E3nga/v1/videos/image2video/${taskId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`فشل طلب API: ${response.status}`);
  }

  const data: VideoQueryResponse = await response.json();

  if (data.code !== 0) {
    throw new Error(data.message || 'فشل الاستعلام عن مهمة الفيديو');
  }

  return data;
}

// استطلاع مهمة الفيديو حتى الاكتمال
export async function pollVideoTask(
  taskId: string,
  isImageToVideo: boolean = false,
  maxAttempts: number = 120, // 10 دقائق بفاصل 5 ثوانٍ
  interval: number = 5000
): Promise<string> {
  const queryFunction = isImageToVideo
    ? queryImageToVideoTask
    : queryTextToVideoTask;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = await queryFunction(taskId);

    if (result.data.task_status === 'succeed') {
      const videoUrl = result.data.task_result?.videos[0]?.url;
      if (!videoUrl) {
        throw new Error('لم يتم العثور على رابط الفيديو في النتيجة');
      }
      return videoUrl;
    }

    if (result.data.task_status === 'failed') {
      throw new Error(
        result.data.task_status_msg || 'فشل توليد الفيديو'
      );
    }

    // انتظر قبل المحاولة التالية
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error('انتهت مهلة توليد الفيديو');
}

// ===== وظائف تحويل النص إلى صوت (Gemini API TTS) =====

// معالجة النص العربي لتحسين النطق (اختياري)
export function preprocessArabicText(text: string): string {
  let processed = text;

  // 1. إزالة المسافات الزائدة
  processed = processed.replace(/\s+/g, ' ').trim();

  // 2. إضافة مسافات حول الكلمات الإنجليزية المدمجة في النص العربي
  processed = processed.replace(/([a-zA-Z]+)/g, ' $1 ');
  processed = processed.replace(/\s+/g, ' ').trim();

  return processed;
}

// تحويل السرعة إلى قيمة رقمية (غير مستخدم حالياً في Gemini)
function speedToRate(speed?: string): number {
  const speedMap: Record<string, number> = {
    'x-slow': 0.5,
    'slow': 0.75,
    'medium': 1.0,
    'fast': 1.25,
    'x-fast': 1.5
  };
  return speed ? speedMap[speed] || 1.0 : 1.0;
}

// تحويل النبرة إلى قيمة رقمية (غير مستخدم حالياً في Gemini)
function pitchToValue(pitch?: string): number {
  const pitchMap: Record<string, number> = {
    'x-low': -10.0,
    'low': -5.0,
    'medium': 0.0,
    'high': 5.0,
    'x-high': 10.0
  };
  return pitch ? pitchMap[pitch] || 0.0 : 0.0;
}

// إنشاء styleHint للعربية مع أساليب مختلفة
function getStyleHint(locale: string, speed?: string, pitch?: string, style?: string): string {
  const isArabic = locale.startsWith('ar-');
  
  if (!isArabic) {
    // للإنجليزية: توجيه بسيط
    return 'Read the following text clearly and naturally, exactly as written without any changes.';
  }

  // البرومبت الأساسي الصارم للعربية (فصحى سينمائية)
  const ARABIC_CINEMATIC_BASE = `أنت قارئ صوتي محترف.
اقرأ النص العربي التالي كما هو مكتوب حرفيًا دون أي تعديل أو إعادة صياغة.
نطق عربي فصيح واضح جدًا، مخارج حروف دقيقة، التزم بعلامات الترقيم.
بنبرة سينمائية فخمة، سرعة متوسطة، وقفات طبيعية بعد الجمل.
لا تغيّر الكلمات، لا تفسّر المعنى، اقرأ النص فقط.`;

  // إذا لم يتم تحديد أسلوب، استخدم السينمائي كافتراضي
  if (!style || style === 'cinematic') {
    return ARABIC_CINEMATIC_BASE;
  }

  // أساليب أخرى
  let styleHint = `أنت قارئ صوتي محترف.
اقرأ النص العربي التالي كما هو مكتوب حرفيًا دون أي تعديل أو إعادة صياغة.
نطق عربي فصيح واضح جدًا، مخارج حروف دقيقة، التزم بعلامات الترقيم.
لا تغيّر الكلمات، لا تفسّر المعنى، اقرأ النص فقط.`;

  if (style === 'calm') {
    styleHint += '\nبنبرة هادئة مطمئنة، سرعة بطيئة قليلاً، دون مبالغة.';
  } else if (style === 'energetic') {
    styleHint += '\nبنبرة حماسية سريعة قليلاً، مع وضوح شديد.';
  } else if (style === 'child') {
    styleHint += '\nبصوت طفولي لطيف مع الحفاظ على نطق العربية الصحيح.';
  }

  // إضافة توجيهات السرعة والنبرة إذا لزم الأمر
  if (speed === 'fast' || speed === 'x-fast') {
    styleHint += ' اقرأ بسرعة معتدلة.';
  } else if (speed === 'slow' || speed === 'x-slow') {
    styleHint += ' اقرأ ببطء وتأنٍ.';
  }

  if (pitch === 'high' || pitch === 'x-high') {
    styleHint += ' استخدم نبرة صوت مرتفعة قليلاً.';
  } else if (pitch === 'low' || pitch === 'x-low') {
    styleHint += ' استخدم نبرة صوت منخفضة قليلاً.';
  }

  return styleHint;
}

// تحويل النص إلى صوت باستخدام Gemini API TTS
export async function azureTextToSpeech(request: AzureTTSRequest): Promise<Blob> {
  try {
    // استخدام النص كما هو
    const textToConvert = request.text.trim();

    if (!textToConvert) {
      throw new Error('لا يمكن أن يكون النص فارغًا');
    }

    // إنشاء styleHint مناسب مع الأسلوب
    const styleHint = getStyleHint(request.locale, request.speed, request.pitch, request.style);

    console.log('طلب Gemini TTS (Chirp3-HD):', {
      locale: request.locale,
      voiceName: request.voiceName,
      textLength: textToConvert.length,
      speed: request.speed,
      pitch: request.pitch,
      style: request.style,
      styleHint: styleHint.substring(0, 150) + '...'
    });

    // إنشاء طلب Gemini TTS
    const geminiRequest = {
      text: textToConvert,
      voiceName: request.voiceName,
      styleHint: styleHint,
      returnWavBase64: true
    };

    console.log('محتوى الطلب:', JSON.stringify(geminiRequest, null, 2));

    // إرسال الطلب إلى Backend TTS endpoint
    const response = await fetch(
      'https://api-integrations.appmedo.com/app-8bbt7fcnal1d/api-gemini-tts/tts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-App-Id': APP_ID,
        },
        body: JSON.stringify(geminiRequest),
      }
    );

    console.log('حالة الاستجابة:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('خطأ في Gemini TTS API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`فشل طلب تحويل النص إلى صوت: ${response.status} - ${response.statusText}. ${errorText}`);
    }

    // محاولة قراءة الاستجابة
    const contentType = response.headers.get('content-type');
    console.log('نوع المحتوى:', contentType);

    if (contentType && contentType.includes('application/json')) {
      // الاستجابة JSON (تحتوي على audioBase64)
      const result = await response.json();
      console.log('استجابة JSON:', Object.keys(result));
      
      if (!result.audioBase64 && !result.audioContent && !result.audio && !result.data) {
        console.error('محتوى الاستجابة:', result);
        throw new Error('لم يتم استلام ملف صوتي من Gemini TTS');
      }

      // محاولة الحصول على البيانات الصوتية من مفاتيح مختلفة
      const base64Audio = result.audioBase64 || result.audioContent || result.audio || result.data;

      // تحويل base64 إلى Blob
      const audioData = atob(base64Audio);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }
      // WAV format
      const audioBlob = new Blob([audioArray], { type: 'audio/wav' });

      console.log('تم توليد الصوت بنجاح:', {
        size: audioBlob.size,
        type: audioBlob.type,
        mimeType: result.mimeType,
        sampleRate: result.sampleRate
      });

      return audioBlob;
    } else {
      // الاستجابة مباشرة كملف صوتي
      const audioBlob = await response.blob();
      
      if (audioBlob.size === 0) {
        throw new Error('تم استلام ملف صوتي فارغ من Gemini TTS');
      }

      console.log('تم توليد الصوت بنجاح:', {
        size: audioBlob.size,
        type: audioBlob.type
      });

      return audioBlob;
    }
  } catch (error) {
    console.error('خطأ في azureTextToSpeech:', error);
    if (error instanceof Error) {
      throw new Error(`فشل توليد الصوت: ${error.message}`);
    }
    throw new Error('فشل توليد الصوت: خطأ غير معروف');
  }
}

// الحصول على الأصوات المتاحة لـ locale معين
export function getAvailableVoices(locale: TTSLocale): VoiceInfo[] {
  return AVAILABLE_VOICES[locale] || [];
}

// تحويل النص إلى صوت (قديم - للتوافق مع الكود القديم)
export async function textToSpeech(
  text: string,
  voice: string = 'alloy',
  speed: number = 1.0,
  model: 'tts-1' | 'tts-1-hd' = 'tts-1-hd'
): Promise<Blob> {
  const response = await fetch(
    'https://api-integrations.appmedo.com/app-8bbt7fcnal1d/api-wL1znZBlexBY/v1/audio/speech',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer aoampOdNvwF3csAVKJNXX0h0KlQ2bDJU',
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID,
      },
      body: JSON.stringify({
        model: model,
        input: text,
        voice: voice,
        response_format: 'mp3',
        speed: speed,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('خطأ في API:', errorText);
    throw new Error(`فشل طلب تحويل النص إلى صوت: ${response.status}`);
  }

  // الاستجابة هي ملف صوتي ثنائي
  const audioBlob = await response.blob();
  return audioBlob;
}

// تحويل Blob إلى URL قابل للتشغيل
export function createAudioURL(blob: Blob): string {
  return URL.createObjectURL(blob);
}

// تنزيل ملف صوتي
export function downloadAudio(blob: Blob, filename: string = 'audio.mp3'): void {
  const url = createAudioURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ===== وظائف Voice Cloning =====

// استنساخ الصوت (ملاحظة: قد يتطلب API مخصص)
// هذه الوظيفة تستخدم Speech-to-Text API كمثال
// في التطبيق الحقيقي، ستحتاج إلى API استنساخ صوت متخصص
export async function cloneVoice(
  audioFile: File,
  text: string
): Promise<Blob> {
  // هذه وظيفة نموذجية - في الواقع ستحتاج إلى API استنساخ صوت حقيقي
  // حاليًا، سنستخدم TTS العادي كبديل
  console.warn('Voice cloning API not yet implemented, using standard TTS');
  return await textToSpeech(text, 'alloy');
}

// تحويل ملف صوتي إلى Base64
export async function audioFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
