// صفحة تحويل النص إلى صوت (Azure Speech Services)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Volume2, Download, RotateCcw, Copy, Sparkles, ArrowRight } from 'lucide-react';
import { azureTextToSpeech, createAudioURL, downloadAudio, getAvailableVoices, preprocessArabicText } from '@/services/api';
import type { TTSLocale, VoiceInfo, SpeechSpeed, SpeechPitch, SpeechStyle } from '@/types/api';
import { AVAILABLE_VOICES } from '@/types/api';
import { AIBackground } from '@/components/ui/AIBackground';
import { createGeneration } from '@/db/api';

const MAX_CHARS = 5000;

// خريطة عرض اللغات/اللهجات
const LOCALE_DISPLAY: Record<TTSLocale, string> = {
  // العربية
  'ar-SA': '🇸🇦 عربي (السعودية)',
  'ar-EG': '🇪🇬 عربي (مصر)',
  'ar-AE': '🇦🇪 عربي (الإمارات)',
  'ar-BH': '🇧🇭 عربي (البحرين)',
  'ar-DZ': '🇩🇿 عربي (الجزائر)',
  'ar-IQ': '🇮🇶 عربي (العراق)',
  'ar-JO': '🇯🇴 عربي (الأردن)',
  'ar-KW': '🇰🇼 عربي (الكويت)',
  'ar-LB': '🇱🇧 عربي (لبنان)',
  'ar-LY': '🇱🇾 عربي (ليبيا)',
  'ar-MA': '🇲🇦 عربي (المغرب)',
  'ar-OM': '🇴🇲 عربي (عمان)',
  'ar-QA': '🇶🇦 عربي (قطر)',
  'ar-SY': '🇸🇾 عربي (سوريا)',
  'ar-TN': '🇹🇳 عربي (تونس)',
  'ar-YE': '🇾🇪 عربي (اليمن)',
  // الإنجليزية
  'en-US': '🇺🇸 English (US)',
  'en-GB': '🇬🇧 English (UK)',
  'en-AU': '🇦🇺 English (Australia)',
  'en-CA': '🇨🇦 English (Canada)',
  'en-IN': '🇮🇳 English (India)',
};

// خريطة عرض السرعة
const SPEED_DISPLAY: Record<SpeechSpeed, string> = {
  'x-slow': 'بطيء جدًا',
  'slow': 'بطيء',
  'medium': 'عادي',
  'fast': 'سريع',
  'x-fast': 'سريع جدًا',
};

// خريطة عرض النبرة
const PITCH_DISPLAY: Record<SpeechPitch, string> = {
  'x-low': 'منخفض جدًا',
  'low': 'منخفض',
  'medium': 'عادي',
  'high': 'مرتفع',
  'x-high': 'مرتفع جدًا',
};

// خريطة عرض الأسلوب
const STYLE_DISPLAY: Record<SpeechStyle, string> = {
  'default': 'عادي',
  'cheerful': 'مرح',
  'sad': 'حزين',
  'angry': 'غاضب',
  'excited': 'متحمس',
  'empathetic': 'متعاطف',
  'newscast': 'إخباري',
};

export default function CreateVoicePage() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [locale, setLocale] = useState<TTSLocale>('ar-SA');
  const [availableVoices, setAvailableVoices] = useState<VoiceInfo[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<VoiceInfo | null>(null);
  const [speed, setSpeed] = useState<SpeechSpeed>('medium');
  const [pitch, setPitch] = useState<SpeechPitch>('medium');
  const [style, setStyle] = useState<SpeechStyle>('default');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const charCount = text.length;

  // تحديث الأصوات المتاحة عند تغيير اللغة
  useEffect(() => {
    const voices = getAvailableVoices(locale);
    setAvailableVoices(voices);
    
    // اختيار أول صوت تلقائيًا
    if (voices.length > 0) {
      setSelectedVoice(voices[0]);
      // إعادة تعيين الأسلوب إلى default
      setStyle('default');
    }
  }, [locale]);

  // الحصول على الأساليب المتاحة للصوت المختار
  const getAvailableStyles = (): SpeechStyle[] => {
    if (!selectedVoice || !selectedVoice.styles) {
      return ['default'];
    }
    return ['default', ...selectedVoice.styles] as SpeechStyle[];
  };

  // معالجة النص العربي
  const handlePreprocessText = () => {
    if (locale.startsWith('ar-')) {
      const processed = preprocessArabicText(text);
      setText(processed);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('الرجاء إدخال النص');
      return;
    }

    if (text.length > MAX_CHARS) {
      setError(`النص طويل جدًا. الحد الأقصى ${MAX_CHARS} حرف`);
      return;
    }

    if (!selectedVoice) {
      setError('الرجاء اختيار صوت');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log('إعدادات التوليد:', {
        text: text.substring(0, 50) + '...',
        voiceName: selectedVoice.name,
        locale: locale,
        speed: speed,
        pitch: pitch,
        style: style,
      });
      
      const blob = await azureTextToSpeech({
        text: text,
        voiceName: selectedVoice.name,
        locale: locale,
        speed: speed,
        pitch: pitch,
        style: style !== 'default' ? style : undefined,
      });
      
      const url = createAudioURL(blob);
      
      setAudioBlob(blob);
      setAudioUrl(url);
      
      // Save to database
      try {
        await createGeneration({
          type: 'audio',
          mode: 'text-to-speech',
          ai_tool: 'azure-tts',
          prompt: text,
          output_url: url,
          settings: {
            voice_name: selectedVoice.name,
            locale: locale,
            speed: speed,
            pitch: pitch,
            style: style !== 'default' ? style : undefined,
          },
          metadata: {
            voice_display_name: selectedVoice.displayName,
            gender: selectedVoice.gender,
            locale_display: LOCALE_DISPLAY[locale],
            char_count: text.length,
          },
        });
      } catch (dbError) {
        console.error('Failed to save generation to database:', dbError);
        // Don't show error to user, generation was successful
      }
    } catch (err) {
      console.error('خطأ في توليد الصوت:', err);
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء توليد الصوت';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (audioBlob) {
      const filename = `samco-voice-${Date.now()}.mp3`;
      downloadAudio(audioBlob, filename);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
  };

  const handleRegenerate = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* خلفية AI حية */}
      <AIBackground variant="voice" />
      
      {/* الهيدر */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/home')}
              className="gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>رجوع</span>
            </Button>
            <h1 className="text-xl font-bold gradient-text">🎙️ تحويل النص إلى صوت</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-6">
            {/* حقل النص */}
            <div className="space-y-2">
              <Label htmlFor="text" className="text-base font-semibold">
                النص المراد تحويله إلى صوت
              </Label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="اكتب النص هنا… يدعم نص طويل"
                className="min-h-[200px] text-base resize-none"
                maxLength={MAX_CHARS}
              />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  يدعم حتى {MAX_CHARS.toLocaleString('ar-SA')} حرف
                </span>
                <span className={charCount > MAX_CHARS ? 'text-destructive' : 'text-muted-foreground'}>
                  {charCount.toLocaleString('ar-SA')} / {MAX_CHARS.toLocaleString('ar-SA')}
                </span>
              </div>
            </div>

            {/* زر تحسين النطق العربي */}
            {locale.startsWith('ar-') && text.trim() && (
              <Button
                variant="outline"
                onClick={handlePreprocessText}
                className="w-full gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>تحسين نطق العربية</span>
              </Button>
            )}

            {/* الإعدادات */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">⚙️ إعدادات الصوت</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* الخطوة 1: اختيار اللغة/اللهجة */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="locale" className="text-base">
                    1️⃣ اللغة واللهجة
                  </Label>
                  <Select value={locale} onValueChange={(value) => setLocale(value as TTSLocale)}>
                    <SelectTrigger id="locale" className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        العربية
                      </div>
                      {(Object.keys(LOCALE_DISPLAY) as TTSLocale[])
                        .filter(l => l.startsWith('ar-'))
                        .map(l => (
                          <SelectItem key={l} value={l}>
                            {LOCALE_DISPLAY[l]}
                          </SelectItem>
                        ))}
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                        English
                      </div>
                      {(Object.keys(LOCALE_DISPLAY) as TTSLocale[])
                        .filter(l => l.startsWith('en-'))
                        .map(l => (
                          <SelectItem key={l} value={l}>
                            {LOCALE_DISPLAY[l]}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* الخطوة 2: اختيار الصوت */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="voice" className="text-base">
                    2️⃣ الصوت
                  </Label>
                  <Select 
                    value={selectedVoice?.name || ''} 
                    onValueChange={(value) => {
                      const voice = availableVoices.find(v => v.name === value);
                      if (voice) {
                        setSelectedVoice(voice);
                        // إعادة تعيين الأسلوب إذا لم يكن متاحًا
                        if (!voice.styles || !voice.styles.includes(style)) {
                          setStyle('default');
                        }
                      }
                    }}
                  >
                    <SelectTrigger id="voice" className="h-12">
                      <SelectValue placeholder="اختر الصوت" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVoices.length === 0 ? (
                        <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                          لا توجد أصوات متاحة
                        </div>
                      ) : (
                        <>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            أصوات نسائية
                          </div>
                          {availableVoices
                            .filter(v => v.gender === 'Female')
                            .map(v => (
                              <SelectItem key={v.name} value={v.name}>
                                {v.displayName} (أنثى)
                              </SelectItem>
                            ))}
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                            أصوات رجالية
                          </div>
                          {availableVoices
                            .filter(v => v.gender === 'Male')
                            .map(v => (
                              <SelectItem key={v.name} value={v.name}>
                                {v.displayName} (ذكر)
                              </SelectItem>
                            ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* الخطوة 3: ستايل الأداء */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-base">3️⃣ ستايل الأداء</Label>
                  
                  {/* السرعة */}
                  <div className="space-y-2">
                    <Label htmlFor="speed" className="text-sm text-muted-foreground">
                      السرعة
                    </Label>
                    <Select value={speed} onValueChange={(value) => setSpeed(value as SpeechSpeed)}>
                      <SelectTrigger id="speed">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(SPEED_DISPLAY) as SpeechSpeed[]).map(s => (
                          <SelectItem key={s} value={s}>
                            {SPEED_DISPLAY[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* النبرة */}
                  <div className="space-y-2">
                    <Label htmlFor="pitch" className="text-sm text-muted-foreground">
                      النبرة
                    </Label>
                    <Select value={pitch} onValueChange={(value) => setPitch(value as SpeechPitch)}>
                      <SelectTrigger id="pitch">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(PITCH_DISPLAY) as SpeechPitch[]).map(p => (
                          <SelectItem key={p} value={p}>
                            {PITCH_DISPLAY[p]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* الأسلوب (إذا كان متاحًا) */}
                  {selectedVoice && selectedVoice.styles && selectedVoice.styles.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="style" className="text-sm text-muted-foreground">
                        الأسلوب (اختياري)
                      </Label>
                      <Select value={style} onValueChange={(value) => setStyle(value as SpeechStyle)}>
                        <SelectTrigger id="style">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableStyles().map(s => (
                            <SelectItem key={s} value={s}>
                              {STYLE_DISPLAY[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* رسالة الخطأ */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {/* زر التوليد */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !text.trim() || charCount > MAX_CHARS || !selectedVoice}
              className="w-full h-12 text-lg font-semibold"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  <span>جاري التوليد…</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 ml-2" />
                  <span>توليد الصوت</span>
                </>
              )}
            </Button>

            {/* مشغل الصوت */}
            {audioUrl && (
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-center">✅ النتيجة</h3>
                
                {/* مشغل الصوت */}
                <audio
                  controls
                  src={audioUrl}
                  className="w-full"
                  autoPlay
                />

                {/* أزرار الإجراءات */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل الصوت</span>
                  </Button>
                  
                  <Button
                    onClick={handleCopyText}
                    variant="outline"
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>نسخ النص</span>
                  </Button>
                  
                  <Button
                    onClick={handleRegenerate}
                    variant="outline"
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>إعادة توليد</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* نصائح */}
        <Card className="mt-6 bg-card/50 border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 text-sm">💡 نصائح للحصول على أفضل نتيجة:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>اختر اللغة/اللهجة المناسبة أولاً</li>
              <li>جرّب أصوات مختلفة للحصول على الأنسب</li>
              <li>استخدم زر "تحسين نطق العربية" للنصوص العربية</li>
              <li>جرّب سرعات ونبرات مختلفة للحصول على التأثير المطلوب</li>
              <li>بعض الأصوات تدعم أساليب خاصة (مرح، حزين، متحمس)</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
