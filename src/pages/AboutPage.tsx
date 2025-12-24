import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles, Image as ImageIcon, Video, Globe, Zap, Download, Share2 } from 'lucide-react';
import { AIBackground } from '@/components/ui/AIBackground';
import { useNavigate } from 'react-router-dom';

// صفحة عن التطبيق
export default function AboutPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ImageIcon className="w-6 h-6" />,
      title: 'توليد صور احترافية بجودة عالية',
      description: 'استخدام تقنيات Nano Banana Pro لتوليد صور فائقة الجودة'
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: 'إنتاج فيديوهات سينمائية بالذكاء الاصطناعي',
      description: 'تقنية Sora2 من OpenAI لإنتاج فيديوهات احترافية'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'دعم كامل للغة العربية في الأوصاف',
      description: 'واجهة عربية كاملة مع دعم متقدم للنصوص العربية'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'رفع صور مرجعية لتوجيه التوليد',
      description: 'استخدم صورك الخاصة كمرجع لتوليد محتوى مخصص'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'معرض شخصي لجميع إبداعاتك',
      description: 'احفظ وشارك جميع أعمالك في مكان واحد'
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'تحميل ومشاركة فورية للمحتوى',
      description: 'حمل أعمالك بجودة عالية وشاركها مع العالم'
    }
  ];

  const socialLinks = [
    {
      name: 'TikTok',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      url: 'https://www.tiktok.com/@samco_designer',
      color: 'hover:bg-[#000000] hover:text-white'
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      url: 'https://www.instagram.com/samco_design?igsh=MXhiN2RjbG1ydHducg%3D%3D&utm_source=qr',
      color: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white'
    },
    {
      name: 'X (Twitter)',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: 'https://x.com/designer_samco?s=21&t=dbffdoGcvgOluktAOa9LHA',
      color: 'hover:bg-[#000000] hover:text-white'
    },
    {
      name: 'YouTube',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      url: 'https://www.youtube.com/@samco-desing',
      color: 'hover:bg-[#FF0000] hover:text-white'
    }
  ];

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

            {/* زر العودة */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/home')}
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة للرئيسية
            </Button>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="container mx-auto px-4 py-8 xl:py-12">
        {/* القسم التعريفي */}
        <div className="max-w-4xl mx-auto text-center mb-12 xl:mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">عن التطبيق</span>
          </div>
          
          <h2 className="text-3xl xl:text-5xl font-bold mb-6 gradient-text">
            تطبيق سامكو
          </h2>
          
          <p className="text-lg xl:text-xl text-muted-foreground leading-relaxed mb-6">
            منصة متقدمة لصناعة المحتوى بالذكاء الاصطناعي، تجمع بين أحدث تقنيات توليد الصور والفيديو لتمكين المبدعين من تحويل أفكارهم إلى واقع بصري مذهل.
          </p>

          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 xl:p-8 mb-8">
            <h3 className="text-xl xl:text-2xl font-bold mb-4 text-primary">التقنيات المستخدمة</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 text-right">
              <div className="bg-background/50 rounded-lg p-4">
                <p className="font-semibold text-secondary mb-2">Nano Banana Pro</p>
                <p className="text-sm text-muted-foreground">لتوليد صور فائقة الجودة</p>
              </div>
              <div className="bg-background/50 rounded-lg p-4">
                <p className="font-semibold text-accent mb-2">Sora2 من OpenAI</p>
                <p className="text-sm text-muted-foreground">لإنتاج فيديوهات سينمائية احترافية</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl p-6 xl:p-8 border border-primary/30">
            <p className="text-lg xl:text-xl font-bold mb-2">✨ ما يميزنا</p>
            <p className="text-base xl:text-lg text-foreground/90">
              الوصول المجاني الكامل بدون تسجيل معقد - فقط متابعة واحدة على TikTok وتبدأ رحلتك الإبداعية!
            </p>
          </div>
        </div>

        {/* قسم المميزات */}
        <div className="max-w-6xl mx-auto mb-12 xl:mb-16">
          <h3 className="text-2xl xl:text-3xl font-bold text-center mb-8 xl:mb-12">
            المميزات الرئيسية
          </h3>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {feature.icon}
                    </div>
                    <div className="flex-1 text-right">
                      <h4 className="text-lg font-bold mb-2">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* قسم الروابط الاجتماعية */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 xl:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl xl:text-3xl font-bold mb-3">تابعنا على منصات التواصل</h3>
              <p className="text-muted-foreground">ابقَ على اطلاع بآخر التحديثات والإبداعات</p>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="lg"
                  onClick={() => window.open(social.url, '_blank')}
                  className={`h-auto py-6 flex flex-col items-center gap-3 border-2 transition-all duration-300 ${social.color}`}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    {social.icon}
                  </div>
                  <span className="font-semibold">{social.name}</span>
                </Button>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-4">
                شارك التطبيق مع أصدقائك
              </p>
              <Button
                variant="default"
                size="lg"
                onClick={async () => {
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
                    try {
                      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
                      alert('تم نسخ رابط التطبيق إلى الحافظة');
                    } catch (error) {
                      alert('فشل نسخ الرابط');
                    }
                  }
                }}
                className="gap-2"
              >
                <Share2 className="w-5 h-5" />
                مشاركة التطبيق
              </Button>
            </div>
          </div>
        </div>

        {/* زر البدء */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={() => navigate('/home')}
            className="gap-2 text-lg px-8 py-6"
          >
            ابدأ الإبداع الآن
            <Sparkles className="w-5 h-5" />
          </Button>
        </div>
      </main>

      {/* الفوتر */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 سامكو لصناعة المحتوى Ai. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
