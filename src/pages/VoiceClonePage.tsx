// صفحة استنساخ الصوت
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Mic, Download, RotateCcw, Upload, ArrowRight, AlertCircle } from 'lucide-react';
import { cloneVoice, createAudioURL, downloadAudio } from '@/services/api';
import { AIBackground } from '@/components/ui/AIBackground';
import { createGeneration } from '@/db/api';

const MAX_CHARS = 5000;
const MAX_AUDIO_DURATION = 30; // ثوانٍ
const MIN_AUDIO_DURATION = 10; // ثوانٍ

export default function VoiceClonePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [voiceName, setVoiceName] = useState('');
  const [text, setText] = useState('');
  const [hasConsent, setHasConsent] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const charCount = text.length;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'];
    if (!validTypes.includes(file.type)) {
      setError('يرجى رفع ملف صوتي صالح (MP3, WAV, OGG, WebM)');
      return;
    }

    // التحقق من حجم الملف (أقل من 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('حجم الملف كبير جدًا. الحد الأقصى 10 ميجابايت');
      return;
    }

    setAudioFile(file);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!audioFile) {
      setError('الرجاء رفع عينة صوت');
      return;
    }

    if (!voiceName.trim()) {
      setError('الرجاء إدخال اسم للصوت');
      return;
    }

    if (!text.trim()) {
      setError('الرجاء إدخال النص المراد تحويله');
      return;
    }

    if (!hasConsent) {
      setError('يجب الموافقة على شروط الاستخدام');
      return;
    }

    if (text.length > MAX_CHARS) {
      setError(`النص طويل جدًا. الحد الأقصى ${MAX_CHARS} حرف`);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const blob = await cloneVoice(audioFile, text);
      const url = createAudioURL(blob);
      
      setAudioBlob(blob);
      setAudioUrl(url);
      
      // Save to database
      try {
        await createGeneration({
          type: 'audio',
          mode: 'voice-clone',
          ai_tool: 'azure-voice-clone',
          prompt: text,
          output_url: url,
          settings: {
            voice_name: voiceName,
          },
          metadata: {
            reference_file_name: audioFile.name,
            reference_file_size: audioFile.size,
            reference_file_type: audioFile.type,
            char_count: text.length,
          },
        });
      } catch (dbError) {
        console.error('Failed to save generation to database:', dbError);
        // Don't show error to user, generation was successful
      }
    } catch (err) {
      console.error('خطأ في استنساخ الصوت:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء استنساخ الصوت');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (audioBlob) {
      const filename = `samco-cloned-voice-${Date.now()}.mp3`;
      downloadAudio(audioBlob, filename);
    }
  };

  const handleRegenerate = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setError(null);
  };

  const handleReset = () => {
    setAudioFile(null);
    setVoiceName('');
    setText('');
    setHasConsent(false);
    handleRegenerate();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* خلفية AI حية */}
      <AIBackground variant="voiceClone" />
      
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
            <h1 className="text-xl font-bold gradient-text">🧬 استنساخ صوت</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-6">
            {/* رفع عينة الصوت */}
            <div className="space-y-2">
              <Label htmlFor="audioFile" className="text-base font-semibold">
                رفع عينة صوت ({MIN_AUDIO_DURATION} - {MAX_AUDIO_DURATION} ثانية)
              </Label>
              <div className="flex flex-col gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="audioFile"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-24 border-dashed border-2"
                >
                  {audioFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <Mic className="w-8 h-8 text-primary" />
                      <span className="text-sm font-medium">{audioFile.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(audioFile.size / 1024 / 1024).toFixed(2)} ميجابايت
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm">اضغط لرفع ملف صوتي</span>
                      <span className="text-xs text-muted-foreground">
                        MP3, WAV, OGG, WebM (حتى 10 ميجابايت)
                      </span>
                    </div>
                  )}
                </Button>
                
                {audioFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-muted-foreground"
                  >
                    إزالة الملف
                  </Button>
                )}
              </div>
              
              <div className="bg-muted/30 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  يفضّل صوت واضح بدون موسيقى أو ضوضاء في الخلفية للحصول على أفضل نتيجة
                </p>
              </div>
            </div>

            {/* اسم الصوت */}
            <div className="space-y-2">
              <Label htmlFor="voiceName" className="text-base font-semibold">
                اسم الصوت
              </Label>
              <Input
                id="voiceName"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                placeholder='مثال: "صوت سامكو"'
                className="text-base"
              />
            </div>

            {/* النص المراد تحويله */}
            <div className="space-y-2">
              <Label htmlFor="text" className="text-base font-semibold">
                النص المراد تحويله بنفس الصوت
              </Label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="اكتب النص الذي تريد تحويله باستخدام الصوت المستنسخ…"
                className="min-h-[150px] text-base resize-none"
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

            {/* موافقة الاستخدام */}
            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border">
              <Checkbox
                id="consent"
                checked={hasConsent}
                onCheckedChange={(checked) => setHasConsent(checked as boolean)}
                className="mt-1"
              />
              <Label
                htmlFor="consent"
                className="text-sm leading-relaxed cursor-pointer"
              >
                أؤكد أن الصوت الذي أرفعه هو صوتي أو لدي إذن باستخدامه. أتحمل المسؤولية الكاملة عن أي استخدام غير قانوني.
              </Label>
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
              disabled={isGenerating || !audioFile || !voiceName.trim() || !text.trim() || !hasConsent || charCount > MAX_CHARS}
              className="w-full h-12 text-lg font-semibold"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  <span>جاري الاستنساخ…</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 ml-2" />
                  <span>توليد الصوت المستنسخ</span>
                </>
              )}
            </Button>

            {/* مشغل الصوت */}
            {audioUrl && (
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-center">النتيجة</h3>
                
                {/* مشغل الصوت */}
                <div className="bg-muted/30 rounded-lg p-6">
                  <audio
                    controls
                    src={audioUrl}
                    className="w-full"
                    style={{ filter: 'hue-rotate(250deg)' }}
                  />
                </div>

                {/* أزرار الإجراءات */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل الصوت</span>
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

        {/* تحذير قانوني */}
        <Card className="mt-6 bg-destructive/5 border-destructive/20">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              تحذير قانوني
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              استنساخ صوت شخص آخر بدون إذنه يعتبر انتهاكًا للخصوصية وقد يكون غير قانوني. 
              استخدم هذه الميزة بمسؤولية وفقط للأصوات التي لديك الحق في استخدامها.
            </p>
          </CardContent>
        </Card>

        {/* نصائح */}
        <Card className="mt-6 bg-card/50 border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 text-sm">💡 نصائح للحصول على أفضل نتيجة:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>استخدم عينة صوت واضحة بدون ضوضاء في الخلفية</li>
              <li>المدة المثالية للعينة: 15-20 ثانية</li>
              <li>تأكد من أن الصوت في العينة طبيعي وليس مُعدّل</li>
              <li>جودة العينة تؤثر بشكل كبير على جودة النتيجة</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
