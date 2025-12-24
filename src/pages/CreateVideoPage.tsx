import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Upload, Download, RefreshCw, Sparkles, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  createTextToVideoTask,
  createImageToVideoTask,
  pollVideoTask,
  fileToBase64,
} from '@/services/api';
import { mergeAudioVideo, isFFmpegSupported } from '@/utils/ffmpeg';
import type { VideoAspectRatio, VideoDuration } from '@/types/api';
import { AIBackground } from '@/components/ui/AIBackground';
import { createGeneration } from '@/db/api';

const ASPECT_RATIOS: { value: VideoAspectRatio; label: string }[] = [
  { value: '9:16', label: '9:16 — عمودي (TikTok/Reels)' },
  { value: '16:9', label: '16:9 — أفقي (YouTube)' },
  { value: '1:1', label: '1:1 — مربع' },
];

const DURATIONS: { value: VideoDuration; label: string }[] = [
  { value: '5', label: '5 ثوانٍ' },
  { value: '10', label: '10 ثوانٍ' },
];

const AI_TOOLS = [
  // أدوات توليد الفيديو المتقدمة
  { value: 'sora2', label: 'Sora 2 — OpenAI' },
  { value: 'sora3', label: 'Sora 3 — OpenAI' },
  { value: 'google-veo-3', label: 'Google Veo 3' },
  { value: 'sora2-kling', label: 'Sora2 (Kling)' },
  { value: 'pollo-2', label: 'Pollo 2.0' },
  { value: 'veo-3-1-fast', label: 'Veo 3.1 Fast' },
  { value: 'vidu-q2-pro', label: 'Vidu Q2 Pro' },
  { value: 'hailuo-2-3', label: 'Hailuo 2.3' },
  { value: 'seedance-1-pro', label: 'Seedance 1.0 Pro' },
  // أدوات توليد الصور
  { value: 'nano-banana-pro', label: 'Nano Banana Pro' },
  { value: 'dalle3', label: 'DALL·E 3 — OpenAI' },
  { value: 'midjourney', label: 'Midjourney' },
  { value: 'stable-diffusion', label: 'Stable Diffusion' },
  { value: 'adobe-firefly', label: 'Adobe Firefly' },
  { value: 'bing-image-creator', label: 'Bing Image Creator' },
  { value: 'leonardo-ai', label: 'Leonardo AI' },
  { value: 'playground-ai', label: 'Playground AI' },
  { value: 'nightcafe', label: 'NightCafe Studio' },
  { value: 'deepai', label: 'DeepAI Image Generator' },
  { value: 'craiyon', label: 'Craiyon (DALL·E Mini)' },
];

// لغات الصوت المدعومة
const VOICE_LANGUAGES = [
  { value: 'ar', label: '🇸🇦 العربية' },
  { value: 'en', label: '🇺🇸 English' },
];

// صفحة إنشاء الفيديو
export default function CreateVideoPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const firstFrameInputRef = useRef<HTMLInputElement>(null);
  const lastFrameInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState('');
  const [selectedTool, setSelectedTool] = useState('sora2');
  
  // صور مرجعية: بداية ونهاية الفيديو
  const [firstFrameImage, setFirstFrameImage] = useState<File | null>(null);
  const [firstFramePreview, setFirstFramePreview] = useState<string | null>(null);
  const [lastFrameImage, setLastFrameImage] = useState<File | null>(null);
  const [lastFramePreview, setLastFramePreview] = useState<string | null>(null);
  
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('9:16');
  const [duration, setDuration] = useState<VideoDuration>('5');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  // إعدادات الصوت
  const [enableVoice, setEnableVoice] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState<'ar' | 'en'>('ar');
  const [voiceText, setVoiceText] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  
  // Text-to-Speech
  const [isGeneratingTTS, setIsGeneratingTTS] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement>(null);

  // Audio-Video Merging
  const [isMergingAudio, setIsMergingAudio] = useState(false);
  const [mergeProgress, setMergeProgress] = useState(0);
  const [ffmpegSupported, setFfmpegSupported] = useState(true);

  // Check FFmpeg support on mount
  useEffect(() => {
    setFfmpegSupported(isFFmpegSupported());
  }, []);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (generatedAudioUrl) {
        URL.revokeObjectURL(generatedAudioUrl);
      }
    };
  }, [generatedAudioUrl]);

  // معالجة رفع صورة الإطار الأول
  const handleFirstFrameSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        toast({
          title: 'نوع ملف غير مدعوم',
          description: 'يرجى اختيار صورة بصيغة PNG أو JPEG أو WEBP',
          variant: 'destructive',
        });
        return;
      }

      // التحقق من حجم الملف (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'حجم الملف كبير جدًا',
          description: 'يجب أن يكون حجم الملف أقل من 10MB',
          variant: 'destructive',
        });
        return;
      }

      setFirstFrameImage(file);

      // إنشاء معاينة
      const reader = new FileReader();
      reader.onload = (e) => {
        setFirstFramePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // معالجة رفع صورة الإطار الأخير
  const handleLastFrameSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        toast({
          title: 'نوع ملف غير مدعوم',
          description: 'يرجى اختيار صورة بصيغة PNG أو JPEG أو WEBP',
          variant: 'destructive',
        });
        return;
      }

      // التحقق من حجم الملف (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'حجم الملف كبير جدًا',
          description: 'يجب أن يكون حجم الملف أقل من 10MB',
          variant: 'destructive',
        });
        return;
      }

      setLastFrameImage(file);

      // إنشاء معاينة
      const reader = new FileReader();
      reader.onload = (e) => {
        setLastFramePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف الصوتي
      const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/m4a'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|webm|m4a)$/i)) {
        toast({
          title: 'نوع ملف غير مدعوم',
          description: 'يرجى اختيار ملف صوتي (MP3, WAV, OGG, WebM, M4A)',
          variant: 'destructive',
        });
        return;
      }

      // التحقق من حجم الملف (20MB)
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: 'حجم الملف كبير جدًا',
          description: 'يجب أن يكون حجم الملف الصوتي أقل من 20MB',
          variant: 'destructive',
        });
        return;
      }

      setAudioFile(file);
      setAudioFileName(file.name);
      toast({
        title: 'تم رفع الملف الصوتي',
        description: `تم اختيار: ${file.name}`,
      });
    }
  };

  const handleGenerateTTS = async () => {
    if (!voiceText.trim()) {
      toast({
        title: 'النص مطلوب',
        description: 'يرجى إدخال نص لتحويله إلى صوت',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingTTS(true);

    try {
      // Check if browser supports Speech Synthesis
      if (!('speechSynthesis' in window)) {
        toast({
          title: 'غير مدعوم',
          description: 'متصفحك لا يدعم تحويل النص إلى صوت',
          variant: 'destructive',
        });
        setIsGeneratingTTS(false);
        return;
      }

      // Create speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(voiceText);
      
      // Set language based on selection
      utterance.lang = voiceLanguage === 'ar' ? 'ar-SA' : 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => 
        voiceLanguage === 'ar' 
          ? voice.lang.startsWith('ar')
          : voice.lang.startsWith('en')
      );
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Create audio context for recording
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const destination = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(destination.stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setGeneratedAudioUrl(audioUrl);

        // Convert blob to file
        const audioFile = new File([audioBlob], `tts_${voiceLanguage}_${Date.now()}.webm`, {
          type: 'audio/webm',
        });
        
        setAudioFile(audioFile);
        setAudioFileName(audioFile.name);

        toast({
          title: 'تم توليد الصوت',
          description: 'يمكنك الآن معاينة الصوت أو استخدامه في الفيديو',
        });

        setIsGeneratingTTS(false);
      };

      // Start recording
      mediaRecorder.start();

      // Speak the text
      utterance.onend = () => {
        setTimeout(() => {
          mediaRecorder.stop();
          audioContext.close();
        }, 500);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        mediaRecorder.stop();
        audioContext.close();
        toast({
          title: 'خطأ في التوليد',
          description: 'حدث خطأ أثناء تحويل النص إلى صوت',
          variant: 'destructive',
        });
        setIsGeneratingTTS(false);
      };

      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('TTS generation error:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحويل النص إلى صوت. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
      setIsGeneratingTTS(false);
    }
  };

  const handleGenerate = async () => {
    if (mode === 'text' && !prompt.trim()) {
      toast({
        title: 'البرومبت مطلوب',
        description: 'يرجى إدخال وصف للفيديو الذي تريد توليده',
        variant: 'destructive',
      });
      return;
    }

    if (mode === 'image' && !firstFrameImage && !lastFrameImage) {
      toast({
        title: 'صورة مطلوبة',
        description: 'يرجى رفع صورة واحدة على الأقل (بداية أو نهاية)',
        variant: 'destructive',
      });
      return;
    }

    // التحقق من إعدادات الصوت
    if (enableVoice && !audioFile && !voiceText.trim()) {
      toast({
        title: 'الصوت مطلوب',
        description: 'يرجى رفع ملف صوتي أو إدخال نص للتحويل إلى صوت',
        variant: 'destructive',
      });
      return;
    }

    // إشعار بدمج الصوت التلقائي
    if (enableVoice && (audioFile || voiceText.trim()) && ffmpegSupported) {
      toast({
        title: 'سيتم دمج الصوت تلقائيًا',
        description: 'بعد توليد الفيديو، سيتم دمج الصوت معه تلقائيًا. قد يستغرق هذا بضع دقائق إضافية.',
        variant: 'default',
      });
    } else if (enableVoice && (audioFile || voiceText.trim()) && !ffmpegSupported) {
      toast({
        title: 'تحذير',
        description: 'متصفحك لا يدعم دمج الصوت التلقائي. سيتم توليد الفيديو بدون صوت. يمكنك دمج الصوت يدويًا بعد التحميل.',
        variant: 'default',
      });
    }

    setIsGenerating(true);
    setGeneratedVideo(null);
    setProgress(0);

    try {
      let taskId: string;

      if (mode === 'text') {
        // توليد من نص
        taskId = await createTextToVideoTask({
          prompt,
          aspect_ratio: aspectRatio,
          duration,
          model_name: 'kling-v2-5-turbo',
        });
      } else {
        // توليد من صورة (صورة واحدة أو صورتين)
        // إذا كانت هناك صورتان، نستخدم الأولى كإطار أول والثانية كإطار أخير
        // إذا كانت هناك صورة واحدة فقط، نستخدمها كصورة مرجعية
        
        let imageToUse: File;
        if (firstFrameImage && lastFrameImage) {
          // حالياً نستخدم الصورة الأولى، يمكن تطوير API لدعم صورتين
          imageToUse = firstFrameImage;
          toast({
            title: 'ملاحظة',
            description: 'سيتم استخدام صورة البداية كمرجع رئيسي. دعم الصورتين قيد التطوير.',
            variant: 'default',
          });
        } else {
          imageToUse = firstFrameImage || lastFrameImage!;
        }
        
        const base64Image = await fileToBase64(imageToUse);
        taskId = await createImageToVideoTask({
          image: base64Image,
          prompt: prompt || undefined,
          duration,
          model_name: 'kling-v2-5-turbo',
        });
      }

      toast({
        title: 'تم إنشاء المهمة',
        description: enableVoice 
          ? 'جاري توليد الفيديو مع الصوت... قد يستغرق حتى 10 دقائق'
          : 'جاري توليد الفيديو... قد يستغرق حتى 10 دقائق',
      });

      // محاكاة التقدم
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1, 95));
      }, 5000);

      // استطلاع حالة المهمة
      const videoUrl = await pollVideoTask(taskId, mode === 'image');

      clearInterval(progressInterval);
      setProgress(100);

      // دمج الصوت مع الفيديو إذا كان مفعلاً
      let finalVideoUrl = videoUrl;
      if (enableVoice && (audioFile || generatedAudioUrl) && ffmpegSupported) {
        try {
          setIsMergingAudio(true);
          setMergeProgress(0);
          
          toast({
            title: 'جاري دمج الصوت...',
            description: 'يرجى الانتظار، قد يستغرق هذا بضع دقائق',
          });

          // استخدام الصوت المولد أو الملف المرفوع
          const audioUrl = generatedAudioUrl || (audioFile ? URL.createObjectURL(audioFile) : null);
          
          if (audioUrl) {
            // دمج الصوت مع الفيديو
            const mergedBlob = await mergeAudioVideo(
              videoUrl,
              audioUrl,
              (progress) => setMergeProgress(progress)
            );

            // إنشاء URL للفيديو المدمج
            finalVideoUrl = URL.createObjectURL(mergedBlob);

            toast({
              title: 'تم الدمج! ✨',
              description: 'تم دمج الصوت مع الفيديو بنجاح',
            });
          }
        } catch (mergeError) {
          console.error('خطأ في دمج الصوت:', mergeError);
          toast({
            title: 'تحذير',
            description: 'فشل دمج الصوت. سيتم عرض الفيديو بدون صوت.',
            variant: 'destructive',
          });
          // استمر مع الفيديو الأصلي
        } finally {
          setIsMergingAudio(false);
          setMergeProgress(0);
        }
      }

      setGeneratedVideo(finalVideoUrl);
      
      // Save to database
      try {
        await createGeneration({
          type: 'video',
          mode: mode === 'text' ? 'text-to-video' : 'image-to-video',
          ai_tool: selectedTool,
          prompt: prompt || null,
          output_url: videoUrl,
          reference_url: mode === 'image' ? (firstFramePreview || lastFramePreview || undefined) : undefined,
          settings: {
            aspect_ratio: aspectRatio,
            duration: duration,
            model_name: 'kling-v2-5-turbo',
            voice_enabled: enableVoice,
            voice_language: enableVoice ? voiceLanguage : undefined,
            voice_text: enableVoice && voiceText ? voiceText : undefined,
          },
          metadata: {
            tool_label: AI_TOOLS.find(t => t.value === selectedTool)?.label || selectedTool,
            task_id: taskId,
            ...(mode === 'image' && (firstFrameImage || lastFrameImage) ? {
              first_frame_name: firstFrameImage?.name,
              first_frame_size: firstFrameImage?.size,
              last_frame_name: lastFrameImage?.name,
              last_frame_size: lastFrameImage?.size,
            } : {}),
            ...(enableVoice && audioFile ? {
              audio_file_name: audioFile.name,
              audio_file_size: audioFile.size,
            } : {}),
          },
        });
      } catch (dbError) {
        console.error('Failed to save generation to database:', dbError);
        // Don't show error to user, generation was successful
      }
      
      toast({
        title: 'تم! ✨',
        description: 'تم توليد الفيديو بنجاح',
      });
    } catch (error) {
      console.error('خطأ في توليد الفيديو:', error);
      toast({
        title: 'حصل خطأ',
        description: error instanceof Error ? error.message : 'فشل توليد الفيديو، جرّب مرة ثانية',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedVideo) return;

    try {
      toast({
        title: 'جاري التحميل...',
        description: 'يرجى الانتظار حتى يتم تحميل الفيديو',
      });

      // Fetch the video as blob for better mobile support
      const response = await fetch(generatedVideo);
      const blob = await response.blob();
      
      // Create object URL from blob
      const blobUrl = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `samco-video-${Date.now()}.mp4`;
      
      // For iOS Safari compatibility
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);

      toast({
        title: 'تم التحميل',
        description: 'تم تحميل الفيديو بنجاح',
      });
    } catch (error) {
      console.error('Download error:', error);
      
      // Fallback: open in new tab for mobile
      window.open(generatedVideo, '_blank');
      
      toast({
        title: 'تم فتح الفيديو',
        description: 'يمكنك حفظ الفيديو من المتصفح',
      });
    }
  };

  const handleShare = async () => {
    if (!generatedVideo) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'فيديو من سامكو',
          text: 'شاهد هذا الفيديو المولد بالذكاء الاصطناعي',
          url: generatedVideo,
        });
      } catch (error) {
        // المستخدم ألغى المشاركة
      }
    } else {
      try {
        await navigator.clipboard.writeText(generatedVideo);
        toast({
          title: 'تم النسخ',
          description: 'تم نسخ رابط الفيديو إلى الحافظة',
        });
      } catch (error) {
        toast({
          title: 'خطأ',
          description: 'فشل نسخ الرابط',
          variant: 'destructive',
        });
      }
    }
  };

  const handleReset = () => {
    setGeneratedVideo(null);
    setPrompt('');
    setFirstFrameImage(null);
    setFirstFramePreview(null);
    setLastFrameImage(null);
    setLastFramePreview(null);
    setAspectRatio('9:16');
    setDuration('5');
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* خلفية AI حية */}
      <AIBackground variant="video" />
      
      {/* الرأس */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">🎬 إنشاء فيديو بالذكاء الاصطناعي</h1>
              <p className="text-sm text-muted-foreground">Sora2 (Kling)</p>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!generatedVideo ? (
            // نموذج الإدخال
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* اختيار الوضع */}
                <Tabs value={mode} onValueChange={(v) => setMode(v as 'text' | 'image')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text" className="flex items-center gap-2">
                      <span className="text-lg">✍️</span>
                      <span>نص إلى فيديو</span>
                    </TabsTrigger>
                    <TabsTrigger value="image" className="flex items-center gap-2">
                      <span className="text-lg">🖼️</span>
                      <span>صورة إلى فيديو</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-6 mt-6">
                    {/* حقل البرومبت */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ✍️ وصف الفيديو (البرومبت)
                      </label>
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="اكتب وصفًا دقيقًا للفيديو الذي تريد توليده... يدعم نص طويل حتى 4000 حرف"
                        className="min-h-[200px] text-base resize-none"
                        maxLength={4000}
                      />
                      <span className="text-sm text-muted-foreground mt-2 block">
                        {prompt.length} / 4000
                      </span>
                    </div>
                  </TabsContent>

                  <TabsContent value="image" className="space-y-6 mt-6">
                    {/* رفع الصور المرجعية */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium mb-3">
                        🖼️ الصور المرجعية
                      </label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* صورة الإطار الأول */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🎬</span>
                            <h4 className="font-semibold text-sm">صورة البداية (الإطار الأول)</h4>
                          </div>
                          <input
                            ref={firstFrameInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleFirstFrameSelect}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            className="w-full h-40 border-2 border-dashed hover:border-primary/50 transition-colors"
                            onClick={() => firstFrameInputRef.current?.click()}
                          >
                            {firstFramePreview ? (
                              <div className="flex flex-col items-center gap-2">
                                <img
                                  src={firstFramePreview}
                                  alt="معاينة الإطار الأول"
                                  className="h-32 w-full object-contain rounded"
                                />
                                <span className="text-xs">تغيير الصورة</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <Upload className="h-8 w-8" />
                                <span className="text-sm">رفع صورة البداية</span>
                                <span className="text-xs text-muted-foreground">
                                  (اختياري - حد أقصى 10MB)
                                </span>
                              </div>
                            )}
                          </Button>
                          {firstFramePreview && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => {
                                setFirstFrameImage(null);
                                setFirstFramePreview(null);
                              }}
                            >
                              ❌ إزالة الصورة
                            </Button>
                          )}
                        </div>

                        {/* صورة الإطار الأخير */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🎞️</span>
                            <h4 className="font-semibold text-sm">صورة النهاية (الإطار الأخير)</h4>
                          </div>
                          <input
                            ref={lastFrameInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleLastFrameSelect}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            className="w-full h-40 border-2 border-dashed hover:border-primary/50 transition-colors"
                            onClick={() => lastFrameInputRef.current?.click()}
                          >
                            {lastFramePreview ? (
                              <div className="flex flex-col items-center gap-2">
                                <img
                                  src={lastFramePreview}
                                  alt="معاينة الإطار الأخير"
                                  className="h-32 w-full object-contain rounded"
                                />
                                <span className="text-xs">تغيير الصورة</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <Upload className="h-8 w-8" />
                                <span className="text-sm">رفع صورة النهاية</span>
                                <span className="text-xs text-muted-foreground">
                                  (اختياري - حد أقصى 10MB)
                                </span>
                              </div>
                            )}
                          </Button>
                          {lastFramePreview && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => {
                                setLastFrameImage(null);
                                setLastFramePreview(null);
                              }}
                            >
                              ❌ إزالة الصورة
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* نصيحة */}
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">
                          💡 <strong>نصيحة:</strong> يمكنك رفع صورة واحدة أو صورتين. الصورة الأولى ستظهر في بداية الفيديو، والصورة الأخيرة ستظهر في نهاية الفيديو. إذا رفعت صورة واحدة فقط، سيتم استخدامها كإطار مرجعي للفيديو بالكامل.
                        </p>
                      </div>
                    </div>

                    {/* مربع المطالبة (البرومبت) */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ✍️ وصف الفيديو (البرومبت)
                      </label>
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="اكتب وصفًا دقيقًا للفيديو الذي تريد توليده من الصور... يدعم نص طويل حتى 4000 حرف"
                        className="min-h-[150px] text-base resize-none"
                        maxLength={4000}
                      />
                      <span className="text-sm text-muted-foreground mt-2 block">
                        {prompt.length} / 4000
                      </span>
                      <p className="text-xs text-muted-foreground mt-2">
                        💡 نصيحة: اكتب وصفًا واضحًا للحركة والتفاصيل التي تريدها في الفيديو
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* اختيار الأداة */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    🤖 اختر أداة الذكاء الاصطناعي
                  </label>
                  <Select value={selectedTool} onValueChange={setSelectedTool}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_TOOLS.map((tool) => (
                        <SelectItem key={tool.value} value={tool.value}>
                          {tool.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    الأداة المختارة: <span className="font-semibold text-primary">{AI_TOOLS.find(t => t.value === selectedTool)?.label || 'Sora2 (Kling)'}</span>
                  </p>
                </div>

                {/* اختيار المقاس */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    📐 مقاس الفيديو
                  </label>
                  <Select value={aspectRatio} onValueChange={(v) => setAspectRatio(v as VideoAspectRatio)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ASPECT_RATIOS.map((ratio) => (
                        <SelectItem key={ratio.value} value={ratio.value}>
                          {ratio.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* اختيار المدة */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    ⏱️ مدة الفيديو
                  </label>
                  <Select value={duration} onValueChange={(v) => setDuration(v as VideoDuration)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATIONS.map((dur) => (
                        <SelectItem key={dur.value} value={dur.value}>
                          {dur.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* إعدادات الصوت */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium">
                      🎤 إضافة صوت للفيديو
                    </label>
                    <Button
                      type="button"
                      variant={enableVoice ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEnableVoice(!enableVoice)}
                    >
                      {enableVoice ? 'مفعّل' : 'غير مفعّل'}
                    </Button>
                  </div>

                  {/* معلومات دمج الصوت */}
                  {ffmpegSupported ? (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-xs text-green-700 dark:text-green-400 flex items-start gap-2">
                        <span className="text-base">✅</span>
                        <span>
                          <strong>دمج تلقائي:</strong> سيتم دمج الصوت مع الفيديو تلقائيًا بعد التوليد. 
                          قد يستغرق هذا بضع دقائق إضافية حسب طول الفيديو.
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-xs text-yellow-700 dark:text-yellow-400 flex items-start gap-2">
                        <span className="text-base">⚠️</span>
                        <span>
                          <strong>ملاحظة:</strong> متصفحك لا يدعم دمج الصوت التلقائي. 
                          يمكنك توليد الصوت وتحميله، ثم دمجه مع الفيديو يدويًا باستخدام برامج تحرير الفيديو.
                        </span>
                      </p>
                    </div>
                  )}

                  {enableVoice && (
                    <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                      {/* اختيار لغة الصوت */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          🌐 لغة الصوت
                        </label>
                        <Select value={voiceLanguage} onValueChange={(v) => setVoiceLanguage(v as 'ar' | 'en')}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {VOICE_LANGUAGES.map((lang) => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* نص الصوت */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          ✍️ نص الصوت
                        </label>
                        <Textarea
                          value={voiceText}
                          onChange={(e) => setVoiceText(e.target.value)}
                          placeholder={voiceLanguage === 'ar' 
                            ? 'اكتب النص الذي تريد تحويله إلى صوت بالعربية...'
                            : 'Enter the text you want to convert to speech in English...'}
                          className="min-h-[100px] text-base resize-none"
                          maxLength={1000}
                        />
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {voiceText.length} / 1000
                        </span>
                        
                        {/* زر توليد الصوت من النص */}
                        {voiceText.trim() && (
                          <Button
                            type="button"
                            variant="secondary"
                            className="w-full mt-3"
                            onClick={handleGenerateTTS}
                            disabled={isGeneratingTTS}
                          >
                            {isGeneratingTTS ? (
                              <>
                                <Sparkles className="ml-2 h-4 w-4 animate-spin" />
                                جاري توليد الصوت...
                              </>
                            ) : (
                              <>
                                <Sparkles className="ml-2 h-4 w-4" />
                                🎙️ توليد صوت من النص (Text-to-Speech)
                              </>
                            )}
                          </Button>
                        )}

                        {/* معاينة الصوت المولد */}
                        {generatedAudioUrl && (
                          <div className="mt-3 p-3 bg-primary/10 rounded-lg space-y-2">
                            <p className="text-xs font-medium mb-2 text-primary">
                              ✅ تم توليد الصوت بنجاح
                            </p>
                            <audio
                              ref={audioPreviewRef}
                              src={generatedAudioUrl}
                              controls
                              className="w-full"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                if (audioFile) {
                                  const link = document.createElement('a');
                                  link.href = generatedAudioUrl;
                                  link.download = audioFile.name;
                                  link.click();
                                  toast({
                                    title: 'تم التحميل',
                                    description: 'تم تحميل الملف الصوتي بنجاح',
                                  });
                                }
                              }}
                            >
                              <Download className="ml-2 h-4 w-4" />
                              تحميل الملف الصوتي
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* أو رفع ملف صوتي */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          🎵 أو ارفع ملف صوتي
                        </label>
                        <input
                          ref={audioInputRef}
                          type="file"
                          accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/webm,audio/m4a"
                          onChange={handleAudioFileSelect}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => audioInputRef.current?.click()}
                        >
                          {audioFileName ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">📁 {audioFileName}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              <span>اختر ملف صوتي (MP3, WAV, OGG, M4A)</span>
                            </div>
                          )}
                        </Button>
                        {audioFileName && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => {
                              setAudioFile(null);
                              setAudioFileName(null);
                              if (audioInputRef.current) {
                                audioInputRef.current.value = '';
                              }
                            }}
                          >
                            إزالة الملف
                          </Button>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          حد أقصى: 20MB | الصيغ المدعومة: MP3, WAV, OGG, WebM, M4A
                        </p>
                      </div>

                      <p className="text-xs text-muted-foreground bg-primary/10 p-3 rounded">
                        💡 يمكنك كتابة نص وتوليد صوت منه تلقائيًا (Text-to-Speech)، أو رفع ملف صوتي جاهز. إذا تم توفير كليهما، سيتم استخدام الملف الصوتي.
                      </p>
                    </div>
                  )}
                </div>

                {/* زر التوليد */}
                <Button
                  size="lg"
                  className="w-full h-14 text-lg"
                  onClick={handleGenerate}
                  disabled={isGenerating || (mode === 'text' && !prompt.trim()) || (mode === 'image' && !firstFrameImage && !lastFrameImage)}
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="ml-2 h-5 w-5 animate-spin" />
                      جاري التوليد...
                    </>
                  ) : (
                    <>
                      <Sparkles className="ml-2 h-5 w-5" />
                      🎥 توليد الفيديو
                    </>
                  )}
                </Button>

                {/* شريط التقدم */}
                {(isGenerating || isMergingAudio) && (
                  <div className="space-y-2">
                    <Progress value={isMergingAudio ? mergeProgress : progress} className="h-2" />
                    <p className="text-center text-sm text-muted-foreground">
                      {isMergingAudio ? (
                        <>🔊 جاري دمج الصوت مع الفيديو… رجاءً انتظر</>
                      ) : (
                        <>⏳ جاري التوليد… رجاءً انتظر (قد يستغرق حتى 10 دقائق)</>
                      )}
                    </p>
                    <p className="text-center text-xs text-muted-foreground">
                      {isMergingAudio ? mergeProgress : progress}% مكتمل
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            // عرض النتيجة
            <div className="space-y-6 animate-fade-in">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">✨ الفيديو المولد</h3>
                    {prompt && <p className="text-sm text-muted-foreground mb-1">{prompt}</p>}
                    <p className="text-xs text-muted-foreground">
                      الأداة: <span className="font-semibold text-primary">{AI_TOOLS.find(t => t.value === selectedTool)?.label || 'Sora2 (Kling)'}</span>
                    </p>
                  </div>

                  {/* مشغل الفيديو */}
                  <div className="bg-muted rounded-lg overflow-hidden mb-6">
                    <video
                      src={generatedVideo}
                      controls
                      className="w-full h-auto"
                      playsInline
                    >
                      متصفحك لا يدعم تشغيل الفيديو
                    </video>
                  </div>

                  {/* أزرار الإجراءات */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                    <Button size="lg" onClick={handleDownload}>
                      <Download className="ml-2 h-5 w-5" />
                      تحميل
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleShare}>
                      <Share2 className="ml-2 h-5 w-5" />
                      مشاركة
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleReset}>
                      <RefreshCw className="ml-2 h-5 w-5" />
                      إعادة توليد
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
