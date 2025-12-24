import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image, Video, Share2, ExternalLink, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AIBackground } from '@/components/ui/AIBackground';

const TIKTOK_URL = 'https://www.tiktok.com/@samco_designer';
const INSTAGRAM_URL = 'https://www.instagram.com/samco_designer';
const YOUTUBE_URL = 'https://www.youtube.com/@samco_designer';
const FACEBOOK_URL = 'https://www.facebook.com/samco.designer';
const TWITTER_URL = 'https://twitter.com/samco_designer';

// الصفحة الرئيسية
export default function HomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleShare = async () => {
    const shareText = 'تطبيق سامكو لصناعة المحتوى Ai - صور وفيديو بالذكاء الاصطناعي مجانًا';
    const shareUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'سامكو لصناعة المحتوى Ai',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // المستخدم ألغى المشاركة
      }
    } else {
      // نسخ إلى الحافظة
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast({
          title: 'تم النسخ',
          description: 'تم نسخ رابط التطبيق إلى الحافظة',
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

  return (
    <div className="min-h-screen bg-background relative">
      {/* خلفية AI حية */}
      <AIBackground variant="home" />
      
      {/* الرأس */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* الشعار */}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 from-primary to-secondary rounded-xl flex items-center justify-center border-solid bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8bbt7fcnal1d/IMG-8bcevg8ibhmo.png)] border-[#530ab7ff] border-[4px]"
                data-href="/follow-gate"
                data-target="_blank">
                <span className="text-2xl font-bold text-white">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold gradient-text tracking-wide" style={{ fontFamily: 'Cairo, Tajawal, system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}>المصمم سامكو</h1>
                <p className="text-xs text-muted-foreground">صناعة المحتوى بالذكاء الاصطناعي</p>
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/about')}
                className="gap-2"
              >
                <Info className="h-4 w-4" />
                <span className="hidden xl:inline">عن التطبيق</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(TIKTOK_URL, '_blank')}
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <ExternalLink className="ml-2 h-4 w-4" />
                <span className="hidden xl:inline">تابعنا على TikTok</span>
                <span className="xl:hidden">TikTok</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      {/* المحتوى الرئيسي */}
      <main className="container mx-auto px-4 py-8">
        {/* الترحيب */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl xl:text-4xl font-bold mb-4">
            مرحبًا 👋
          </h2>
          <p className="text-xl xl:text-2xl text-muted-foreground">
            ماذا تريد أن تصنع اليوم؟
          </p>
        </div>

        {/* البطاقات الرئيسية */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
          {/* بطاقة إنشاء صورة من نص */}
          <Card
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary overflow-hidden"
            onClick={() => navigate('/text-to-image')}
          >
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                {/* الأيقونة */}
                <div className="w-20 h-20 from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 glow-primary border-solid bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8bbt7fcnal1d/IMG-8bcvmrwq8dfk.png)] border-[#6124b6ff] border-[4px]">
                  <Image className="h-10 w-10 text-white" />
                </div>

                {/* العنوان */}
                <h3 className="text-2xl font-bold mb-3">
                  ✍️ إنشاء صورة من نص
                </h3>

                {/* الوصف */}
                <p className="text-muted-foreground mb-4">
                  ولّد صورًا احترافية من النص فقط باستخدام <span className="font-semibold text-primary">AI</span>
                </p>

                {/* نماذج الذكاء الاصطناعي */}
                <div className="w-full mb-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">مدعوم بأفضل نماذج AI:</p>
                  <div className="flex flex-wrap gap-2 justify-center text-xs">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">Nano Banana Pro</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">DALL·E 3</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">Midjourney</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">Stable Diffusion</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">Adobe Firefly</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">Bing Creator</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">Leonardo AI</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">Playground AI</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">NightCafe</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">DeepAI</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">Craiyon</span>
                  </div>
                </div>

                {/* الميزات */}
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  <li>✓ دعم النصوص الطويلة (حتى 4000 حرف)</li>
                  <li>✓ اختيار من 11 أداة AI</li>
                  <li>✓ مقاسات متعددة</li>
                </ul>

                {/* زر */}
                <Button size="lg" className="w-full">
                  ابدأ الآن
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* بطاقة إنشاء صورة من صورة */}
          <Card
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-secondary overflow-hidden"
            onClick={() => navigate('/create-image')}
          >
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                {/* الأيقونة */}
                <div className="w-20 h-20 from-secondary to-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 glow-secondary border-solid bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8bbt7fcnal1d/IMG-8bcvmrwq8dfk.png)] border-[#6124b6ff] border-[4px]">
                  <Image className="h-10 w-10 text-white" />
                </div>

                {/* العنوان */}
                <h3 className="text-2xl font-bold mb-3">
                  🖼️ إنشاء صورة من صورة
                </h3>

                {/* الوصف */}
                <p className="text-muted-foreground mb-4">
                  حوّل صورك الموجودة إلى صور جديدة باستخدام <span className="font-semibold text-secondary">AI</span>
                </p>

                {/* نماذج الذكاء الاصطناعي */}
                <div className="w-full mb-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">مدعوم بأفضل نماذج AI:</p>
                  <div className="flex flex-wrap gap-2 justify-center text-xs">
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-md border border-secondary/20">Nano Banana Pro</span>
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-md border border-secondary/20">DALL·E 3</span>
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-md border border-secondary/20">Midjourney</span>
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-md border border-secondary/20">Stable Diffusion</span>
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-md border border-secondary/20">Adobe Firefly</span>
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-md border border-secondary/20">Bing Creator</span>
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-md border border-secondary/20">Leonardo AI</span>
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-md border border-secondary/20">Playground AI</span>
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-md border border-secondary/20">NightCafe</span>
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-md border border-secondary/20">DeepAI</span>
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-md border border-secondary/20">Craiyon</span>
                  </div>
                </div>

                {/* الميزات */}
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  <li>✓ رفع صورة مرجعية</li>
                  <li>✓ اختيار من 11 أداة AI</li>
                  <li>✓ تعديلات ذكية</li>
                </ul>

                {/* زر */}
                <Button size="lg" className="w-full">
                  ابدأ الآن
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* بطاقة إنشاء فيديو */}
          <Card
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-secondary overflow-hidden"
            onClick={() => navigate('/create-video')}
          >
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                {/* الأيقونة */}
                <div className="w-20 h-20 from-secondary to-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 glow-secondary border-solid bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8bbt7fcnal1d/IMG-8bcwis6rzjeo.png)] border-[#6124b6ff] border-[4px]">
                  <Video className="h-10 w-10 text-white" />
                </div>

                {/* العنوان */}
                <h3 className="text-2xl font-bold mb-3">
                  🎬 إنشاء فيديو AI
                </h3>

                {/* الوصف */}
                <p className="text-muted-foreground mb-4">
                  أنشئ فيديوهات مذهلة من النص أو الصور باستخدام Sora2
                </p>

                {/* الميزات */}
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  <li>✓ توليد من نص أو صورة</li>
                  <li>✓ مدة قابلة للتخصيص (5-10 ثوانٍ)</li>
                  <li>✓ نسب عرض متعددة</li>
                </ul>

                {/* زر */}
                <Button size="lg" className="w-full">
                  ابدأ الآن
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* قسم تابعنا على منصات التواصل */}
        <div className="max-w-3xl mx-auto mb-8">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl xl:text-3xl font-bold mb-2 gradient-text">
                  📱 تابعنا على منصات التواصل
                </h3>
                <p className="text-muted-foreground">
                  كن جزءًا من مجتمعنا واحصل على آخر التحديثات والنصائح
                </p>
              </div>

              {/* أيقونات منصات التواصل */}
              <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
                {/* TikTok */}
                <button
                  onClick={() => window.open(TIKTOK_URL, '_blank')}
                  className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-primary/10 border-2 border-transparent hover:border-primary transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00f2ea] to-[#ff0050] flex items-center justify-center group-hover:shadow-lg transition-shadow">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">TikTok</span>
                </button>

                {/* Instagram */}
                <button
                  onClick={() => window.open(INSTAGRAM_URL, '_blank')}
                  className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-primary/10 border-2 border-transparent hover:border-primary transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center group-hover:shadow-lg transition-shadow">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">Instagram</span>
                </button>

                {/* YouTube */}
                <button
                  onClick={() => window.open(YOUTUBE_URL, '_blank')}
                  className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-primary/10 border-2 border-transparent hover:border-primary transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff0000] to-[#cc0000] flex items-center justify-center group-hover:shadow-lg transition-shadow">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">YouTube</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => window.open(FACEBOOK_URL, '_blank')}
                  className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-primary/10 border-2 border-transparent hover:border-primary transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1877f2] to-[#0c63d4] flex items-center justify-center group-hover:shadow-lg transition-shadow">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">Facebook</span>
                </button>

                {/* Twitter/X */}
                <button
                  onClick={() => window.open(TWITTER_URL, '_blank')}
                  className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-primary/10 border-2 border-transparent hover:border-primary transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1da1f2] to-[#0c85d0] flex items-center justify-center group-hover:shadow-lg transition-shadow">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">X (Twitter)</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* زر المشاركة */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleShare}
            className="border-2"
          >
            <Share2 className="ml-2 h-5 w-5" />
            🔗 شارك التطبيق مع أصدقائك
          </Button>
        </div>
      </main>
      {/* التذييل */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 سامكو لصناعة المحتوى Ai</p>
          <p className="mt-2 italic">"اصنع صورك وفيديوهاتك بالذكاء الاصطناعي… بسهولة"</p>
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate('/about')}
            className="mt-2 text-muted-foreground hover:text-primary"
          >
            عن التطبيق
          </Button>
        </div>
      </footer>
    </div>
  );
}
