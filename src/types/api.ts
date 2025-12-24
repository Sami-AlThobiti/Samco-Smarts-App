// أنواع API لتطبيق سامكو

// نوع نسبة العرض إلى الارتفاع للصور
export type ImageAspectRatio = '1:1' | '9:16' | '16:9' | '4:5';

// نوع نسبة العرض إلى الارتفاع للفيديو
export type VideoAspectRatio = '16:9' | '9:16' | '1:1';

// نوع مدة الفيديو
export type VideoDuration = '5' | '10';

// نوع حالة المهمة
export type TaskStatus = 'submitted' | 'processing' | 'succeed' | 'failed';

// طلب توليد الصورة
export interface ImageGenerationRequest {
  contents: Array<{
    parts: Array<{
      text?: string;
      inline_data?: {
        mime_type: 'image/png' | 'image/jpeg' | 'image/webp';
        data: string;
      };
    }>;
  }>;
}

// استجابة توليد الصورة
export interface ImageGenerationResponse {
  status: number;
  msg: string;
  candidates: Array<{
    content: {
      role: string;
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    safetyRatings: Array<unknown>;
  }>;
}

// طلب توليد فيديو من نص
export interface TextToVideoRequest {
  model_name?: string;
  prompt: string;
  negative_prompt?: string;
  cfg_scale?: number;
  aspect_ratio?: VideoAspectRatio;
  duration?: VideoDuration;
  callback_url?: string;
  external_task_id?: string;
}

// طلب توليد فيديو من صورة
export interface ImageToVideoRequest {
  model_name?: string;
  image: string;
  prompt?: string;
  duration?: VideoDuration;
}

// استجابة إنشاء مهمة الفيديو
export interface VideoTaskResponse {
  code: number;
  message: string;
  request_id: string;
  data: {
    task_id: string;
    task_status: TaskStatus;
    task_info?: {
      external_task_id?: string;
    };
    created_at: number;
    updated_at: number;
  };
}

// استجابة استعلام مهمة الفيديو
export interface VideoQueryResponse {
  code: number;
  message: string;
  request_id: string;
  data: {
    task_id: string;
    task_status: TaskStatus;
    task_status_msg?: string;
    task_info?: {
      external_task_id?: string;
    };
    created_at: number;
    updated_at: number;
    task_result?: {
      videos: Array<{
        id: string;
        url: string;
        duration: string;
      }>;
    };
  };
}

// نوع نتيجة الصورة المولدة
export interface GeneratedImage {
  url: string;
  prompt: string;
  aspectRatio: ImageAspectRatio;
  timestamp: number;
}

// نوع نتيجة الفيديو المولد
export interface GeneratedVideo {
  url: string;
  prompt: string;
  aspectRatio: VideoAspectRatio;
  duration: VideoDuration;
  timestamp: number;
  taskId: string;
}

// ===== أنواع Text-to-Speech (Azure Speech Services) =====

// نوع اللغة/اللهجة (Locale)
export type TTSLocale = 
  // العربية
  | 'ar-SA'  // السعودية
  | 'ar-EG'  // مصر
  | 'ar-AE'  // الإمارات
  | 'ar-BH'  // البحرين
  | 'ar-DZ'  // الجزائر
  | 'ar-IQ'  // العراق
  | 'ar-JO'  // الأردن
  | 'ar-KW'  // الكويت
  | 'ar-LB'  // لبنان
  | 'ar-LY'  // ليبيا
  | 'ar-MA'  // المغرب
  | 'ar-OM'  // عمان
  | 'ar-QA'  // قطر
  | 'ar-SY'  // سوريا
  | 'ar-TN'  // تونس
  | 'ar-YE'  // اليمن
  // الإنجليزية
  | 'en-US'  // أمريكي
  | 'en-GB'  // بريطاني
  | 'en-AU'  // أسترالي
  | 'en-CA'  // كندي
  | 'en-IN'; // هندي

// معلومات الصوت
export interface VoiceInfo {
  name: string;           // اسم الصوت الكامل (مثل: ar-SA-ZariyahNeural)
  displayName: string;    // الاسم المعروض (مثل: زارية)
  locale: TTSLocale;      // اللغة/اللهجة
  gender: 'Male' | 'Female';
  styles?: string[];      // الأساليب المتاحة (مثل: cheerful, sad, angry)
}

// الأصوات المتاحة لكل لغة (Gemini API TTS - Chirp3-HD)
export const AVAILABLE_VOICES: Record<TTSLocale, VoiceInfo[]> = {
  // السعودية
  'ar-SA': [
    { name: 'ar-XA-Chirp3-HD-Kore', displayName: 'كوري (أنثى)', locale: 'ar-SA', gender: 'Female' },
    { name: 'ar-XA-Chirp3-HD-Puck', displayName: 'باك (ذكر)', locale: 'ar-SA', gender: 'Male' },
    { name: 'ar-XA-Chirp3-HD-Charon', displayName: 'كارون (ذكر)', locale: 'ar-SA', gender: 'Male' },
    { name: 'ar-XA-Chirp3-HD-Aoede', displayName: 'أويدي (أنثى)', locale: 'ar-SA', gender: 'Female' },
  ],
  // مصر
  'ar-EG': [
    { name: 'ar-XA-Chirp3-HD-Kore', displayName: 'كوري (أنثى)', locale: 'ar-EG', gender: 'Female' },
    { name: 'ar-XA-Chirp3-HD-Puck', displayName: 'باك (ذكر)', locale: 'ar-EG', gender: 'Male' },
  ],
  // الإمارات
  'ar-AE': [
    { name: 'ar-XA-Chirp3-HD-Kore', displayName: 'كوري (أنثى)', locale: 'ar-AE', gender: 'Female' },
    { name: 'ar-XA-Chirp3-HD-Puck', displayName: 'باك (ذكر)', locale: 'ar-AE', gender: 'Male' },
  ],
  // البحرين
  'ar-BH': [
    { name: 'ar-XA-Chirp3-HD-Kore', displayName: 'كوري (أنثى)', locale: 'ar-BH', gender: 'Female' },
    { name: 'ar-XA-Chirp3-HD-Puck', displayName: 'باك (ذكر)', locale: 'ar-BH', gender: 'Male' },
  ],
  // الجزائر
  'ar-DZ': [
    { name: 'ar-XA-Chirp3-HD-Kore', displayName: 'كوري (أنثى)', locale: 'ar-DZ', gender: 'Female' },
    { name: 'ar-XA-Chirp3-HD-Puck', displayName: 'باك (ذكر)', locale: 'ar-DZ', gender: 'Male' },
  ],
  // العراق
  'ar-IQ': [
    { name: 'ar-XA-Chirp3-HD-Kore', displayName: 'كوري (أنثى)', locale: 'ar-IQ', gender: 'Female' },
    { name: 'ar-XA-Chirp3-HD-Puck', displayName: 'باك (ذكر)', locale: 'ar-IQ', gender: 'Male' },
  ],
  // الأردن
  'ar-JO': [
    { name: 'ar-XA-Chirp3-HD-Kore', displayName: 'كوري (أنثى)', locale: 'ar-JO', gender: 'Female' },
    { name: 'ar-XA-Chirp3-HD-Puck', displayName: 'باك (ذكر)', locale: 'ar-JO', gender: 'Male' },
  ],
  // الكويت
  'ar-KW': [
    { name: 'ar-XA-Chirp3-HD-Kore', displayName: 'كوري (أنثى)', locale: 'ar-KW', gender: 'Female' },
    { name: 'ar-XA-Chirp3-HD-Puck', displayName: 'باك (ذكر)', locale: 'ar-KW', gender: 'Male' },
  ],
  // لبنان
  'ar-LB': [
    { name: 'ar-XA-Chirp3-HD-Kore', displayName: 'كوري (أنثى)', locale: 'ar-LB', gender: 'Female' },
    { name: 'ar-XA-Chirp3-HD-Puck', displayName: 'باك (ذكر)', locale: 'ar-LB', gender: 'Male' },
  ],
  // ليبيا
  'ar-LY': [
    { name: 'ar-XA-Chirp3-HD-Kore', displayName: 'كوري (أنثى)', locale: 'ar-LY', gender: 'Female' },
    { name: 'ar-XA-Chirp3-HD-Puck', displayName: 'باك (ذكر)', locale: 'ar-LY', gender: 'Male' },
  ],
  // المغرب
  'ar-MA': [
    { name: 'ar-XA-Chirp3-HD-Kore', displayName: 'كوري (أنثى)', locale: 'ar-MA', gender: 'Female' },
    { name: 'ar-XA-Chirp3-HD-Puck', displayName: 'باك (ذكر)', locale: 'ar-MA', gender: 'Male' },
  ],
  // عمان
  'ar-OM': [
    { name: 'ar-XA-Chirp3-HD-Kore', displayName: 'كوري (أنثى)', locale: 'ar-OM', gender: 'Female' },
    { name: 'ar-XA-Chirp3-HD-Puck', displayName: 'باك (ذكر)', locale: 'ar-OM', gender: 'Male' },
  ],
  // قطر
  'ar-QA': [
    { name: 'ar-XA-Chirp3-HD-Kore', displayName: 'كوري (أنثى)', locale: 'ar-QA', gender: 'Female' },
    { name: 'ar-XA-Chirp3-HD-Puck', displayName: 'باك (ذكر)', locale: 'ar-QA', gender: 'Male' },
  ],
  // سوريا
  'ar-SY': [
    { name: 'ar-XA-Chirp3-HD-Kore', displayName: 'كوري (أنثى)', locale: 'ar-SY', gender: 'Female' },
    { name: 'ar-XA-Chirp3-HD-Puck', displayName: 'باك (ذكر)', locale: 'ar-SY', gender: 'Male' },
  ],
  // تونس
  'ar-TN': [
    { name: 'ar-XA-Chirp3-HD-Kore', displayName: 'كوري (أنثى)', locale: 'ar-TN', gender: 'Female' },
    { name: 'ar-XA-Chirp3-HD-Puck', displayName: 'باك (ذكر)', locale: 'ar-TN', gender: 'Male' },
  ],
  // اليمن
  'ar-YE': [
    { name: 'ar-XA-Chirp3-HD-Kore', displayName: 'كوري (أنثى)', locale: 'ar-YE', gender: 'Female' },
    { name: 'ar-XA-Chirp3-HD-Puck', displayName: 'باك (ذكر)', locale: 'ar-YE', gender: 'Male' },
  ],
  // أمريكي
  'en-US': [
    { name: 'en-US-Chirp3-HD-Kore', displayName: 'Kore (Female)', locale: 'en-US', gender: 'Female' },
    { name: 'en-US-Chirp3-HD-Puck', displayName: 'Puck (Male)', locale: 'en-US', gender: 'Male' },
    { name: 'en-US-Chirp3-HD-Charon', displayName: 'Charon (Male)', locale: 'en-US', gender: 'Male' },
    { name: 'en-US-Chirp3-HD-Aoede', displayName: 'Aoede (Female)', locale: 'en-US', gender: 'Female' },
  ],
  // بريطاني
  'en-GB': [
    { name: 'en-GB-Chirp3-HD-Kore', displayName: 'Kore (Female)', locale: 'en-GB', gender: 'Female' },
    { name: 'en-GB-Chirp3-HD-Puck', displayName: 'Puck (Male)', locale: 'en-GB', gender: 'Male' },
  ],
  // أسترالي
  'en-AU': [
    { name: 'en-AU-Chirp3-HD-Kore', displayName: 'Kore (Female)', locale: 'en-AU', gender: 'Female' },
    { name: 'en-AU-Chirp3-HD-Puck', displayName: 'Puck (Male)', locale: 'en-AU', gender: 'Male' },
  ],
  // كندي
  'en-CA': [
    { name: 'en-CA-Chirp3-HD-Kore', displayName: 'Kore (Female)', locale: 'en-CA', gender: 'Female' },
    { name: 'en-CA-Chirp3-HD-Puck', displayName: 'Puck (Male)', locale: 'en-CA', gender: 'Male' },
  ],
  // هندي
  'en-IN': [
    { name: 'en-IN-Chirp3-HD-Kore', displayName: 'Kore (Female)', locale: 'en-IN', gender: 'Female' },
    { name: 'en-IN-Chirp3-HD-Puck', displayName: 'Puck (Male)', locale: 'en-IN', gender: 'Male' },
  ],
};

// نوع السرعة
export type SpeechSpeed = 'x-slow' | 'slow' | 'medium' | 'fast' | 'x-fast';

// نوع النبرة (Pitch)
export type SpeechPitch = 'x-low' | 'low' | 'medium' | 'high' | 'x-high';

// نوع الأسلوب (Style) - يعتمد على الصوت
export type SpeechStyle = 'cheerful' | 'sad' | 'angry' | 'excited' | 'empathetic' | 'newscast' | 'default';

// طلب تحويل النص إلى صوت (Azure Speech)
export interface AzureTTSRequest {
  text: string;
  voiceName: string;      // مثل: ar-SA-ZariyahNeural
  locale: TTSLocale;      // مثل: ar-SA
  speed?: SpeechSpeed;    // السرعة
  pitch?: SpeechPitch;    // النبرة
  style?: SpeechStyle;    // الأسلوب (إذا كان الصوت يدعمه)
  outputFormat?: 'audio-24khz-48kbitrate-mono-mp3' | 'audio-16khz-32kbitrate-mono-mp3';
}

// طلب تحويل النص إلى صوت (قديم - للتوافق)
export interface TextToSpeechRequest {
  model: 'tts-1' | 'tts-1-hd';
  input: string;
  voice: string;
  response_format?: 'mp3' | 'wav' | 'opus' | 'aac' | 'flac';
  speed?: number; // 0.25 to 4.0
}

// استجابة تحويل النص إلى صوت
export interface TextToSpeechResponse {
  audio: Blob | string; // يمكن أن يكون Blob أو URL
}

// نوع نتيجة الصوت المولد
export interface GeneratedAudio {
  url: string;
  text: string;
  locale: TTSLocale;
  voiceName: string;
  speed: SpeechSpeed;
  pitch: SpeechPitch;
  style?: SpeechStyle;
  timestamp: number;
}

// ===== أنواع Voice Cloning =====

// طلب استنساخ الصوت
export interface VoiceCloningRequest {
  audioSample: File | string; // ملف الصوت أو URL
  voiceName: string;
  text: string;
}

// استجابة استنساخ الصوت
export interface VoiceCloningResponse {
  audio: Blob | string;
  voiceId?: string;
}

// نوع نتيجة الصوت المستنسخ
export interface ClonedVoice {
  url: string;
  text: string;
  voiceName: string;
  timestamp: number;
}
