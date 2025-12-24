import { useState } from 'react';
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
import { ArrowLeft, Download, RefreshCw, Copy, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateImage } from '@/services/api';
import type { ImageAspectRatio } from '@/types/api';
import { AIBackground } from '@/components/ui/AIBackground';
import { createGeneration } from '@/db/api';

const ASPECT_RATIOS: { value: ImageAspectRatio; label: string; dimensions: string }[] = [
  { value: '1:1', label: '1:1 — مربع', dimensions: '1024×1024' },
  { value: '9:16', label: '9:16 — عمودي (Stories)', dimensions: '1080×1920' },
  { value: '16:9', label: '16:9 — أفقي (YouTube)', dimensions: '1920×1080' },
  { value: '4:5', label: '4:5 — Instagram', dimensions: '1080×1350' },
];

const AI_TOOLS = [
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

// صفحة إنشاء صورة من نص
export default function TextToImagePage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [prompt, setPrompt] = useState('');
  const [selectedTool, setSelectedTool] = useState('nano-banana-pro');
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'البرومبت مطلوب',
        description: 'يرجى إدخال وصف للصورة التي تريد توليدها',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImage(prompt, undefined, aspectRatio);
      setGeneratedImage(imageUrl);
      
      // Save to database
      try {
        await createGeneration({
          type: 'image',
          mode: 'text-to-image',
          ai_tool: selectedTool,
          prompt: prompt,
          output_url: imageUrl,
          settings: {
            aspect_ratio: aspectRatio,
          },
          metadata: {
            tool_label: selectedToolLabel,
          },
        });
      } catch (dbError) {
        console.error('Failed to save generation to database:', dbError);
        // Don't show error to user, generation was successful
      }
      
      toast({
        title: 'تم! ✨',
        description: 'تم توليد الصورة بنجاح',
      });
    } catch (error) {
      console.error('خطأ في توليد الصورة:', error);
      toast({
        title: 'حصل خطأ',
        description: error instanceof Error ? error.message : 'فشل توليد الصورة، جرّب مرة ثانية',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `samco-text-to-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'تم التحميل',
      description: 'تم تحميل الصورة بنجاح',
    });
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast({
        title: 'تم النسخ',
        description: 'تم نسخ البرومبت إلى الحافظة',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل نسخ البرومبت',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setPrompt('');
    setAspectRatio('1:1');
  };

  const selectedToolLabel = AI_TOOLS.find(t => t.value === selectedTool)?.label || 'Nano Banana Pro';

  return (
    <div className="min-h-screen bg-background relative">
      {/* خلفية AI حية */}
      <AIBackground variant="image" />
      
      {/* الرأس */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">✍️ إنشاء صورة من نص</h1>
              <p className="text-sm text-muted-foreground">Text to Image</p>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!generatedImage ? (
            // نموذج الإدخال
            <Card>
              <CardContent className="p-6 space-y-6">
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
                    الأداة المختارة: <span className="font-semibold text-primary">{selectedToolLabel}</span>
                  </p>
                </div>

                {/* حقل البرومبت */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    ✍️ وصف الصورة (البرومبت)
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="اكتب وصفًا دقيقًا للصورة التي تريد توليدها... يدعم نص طويل حتى 4000 حرف"
                    className="min-h-[200px] text-base resize-none"
                    maxLength={4000}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">
                      {prompt.length} / 4000
                    </span>
                    {prompt && (
                      <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
                        <Copy className="ml-2 h-4 w-4" />
                        نسخ
                      </Button>
                    )}
                  </div>
                </div>

                {/* اختيار المقاس */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    📐 مقاس الصورة
                  </label>
                  <Select value={aspectRatio} onValueChange={(v) => setAspectRatio(v as ImageAspectRatio)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ASPECT_RATIOS.map((ratio) => (
                        <SelectItem key={ratio.value} value={ratio.value}>
                          {ratio.label} ({ratio.dimensions})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* زر التوليد */}
                <Button
                  size="lg"
                  className="w-full h-14 text-lg"
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="ml-2 h-5 w-5 animate-spin" />
                      جاري التوليد...
                    </>
                  ) : (
                    <>
                      <Sparkles className="ml-2 h-5 w-5" />
                      ⚡ توليد الصورة
                    </>
                  )}
                </Button>

                {/* شريط التقدم */}
                {isGenerating && (
                  <div className="space-y-2">
                    <Progress value={undefined} className="h-2" />
                    <p className="text-center text-sm text-muted-foreground">
                      ⏳ جاري التوليد… رجاءً انتظر (قد يستغرق حتى 5 دقائق)
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
                    <h3 className="text-lg font-semibold mb-2">✨ الصورة المولدة</h3>
                    <p className="text-sm text-muted-foreground mb-1">{prompt}</p>
                    <p className="text-xs text-muted-foreground">
                      الأداة: <span className="font-semibold text-primary">{selectedToolLabel}</span>
                    </p>
                  </div>

                  {/* الصورة */}
                  <div className="bg-muted rounded-lg overflow-hidden mb-6">
                    <img
                      src={generatedImage}
                      alt="صورة مولدة"
                      crossOrigin="anonymous"
                      className="w-full h-auto"
                    />
                  </div>

                  {/* أزرار الإجراءات */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                    <Button size="lg" onClick={handleDownload}>
                      <Download className="ml-2 h-5 w-5" />
                      تحميل
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleCopyPrompt}>
                      <Copy className="ml-2 h-5 w-5" />
                      نسخ البرومبت
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
