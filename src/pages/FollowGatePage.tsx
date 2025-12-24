import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink, Check } from 'lucide-react';
import { AIBackground } from '@/components/ui/AIBackground';

const TIKTOK_URL = 'https://www.tiktok.com/@samco_designer';

// صفحة بوابة المتابعة
export default function FollowGatePage() {
  const navigate = useNavigate();
  const [isOpening, setIsOpening] = useState(false);

  const handleFollowClick = () => {
    setIsOpening(true);
    window.open(TIKTOK_URL, '_blank');
    setTimeout(() => setIsOpening(false), 1000);
  };

  const handleConfirmFollow = () => {
    localStorage.setItem('samco_has_followed', 'true');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* خلفية AI حية */}
      <AIBackground variant="home" />
      <div className="max-w-md w-full text-center animate-fade-in">
        {/* شعار التطبيق */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center glow-primary">
            <span className="text-5xl font-bold text-white">S</span>
          </div>
        </div>

        {/* العنوان */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3 flex items-center justify-center gap-2">
            <span>🔓</span>
            <span className="gradient-text">افتح الاستخدام المجاني</span>
          </h1>
          <p className="text-xl text-foreground mb-2">
            تابع حساب سامكو على تيك توك
          </p>
          <p className="text-muted-foreground">
            للحصول على وصول مجاني كامل لجميع ميزات التطبيق
          </p>
        </div>

        {/* البطاقة */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-6">
          {/* زر المتابعة الرئيسي */}
          <Button
            size="lg"
            className="w-full mb-4 text-lg h-14 bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={handleFollowClick}
            disabled={isOpening}
          >
            <ExternalLink className="ml-2 h-5 w-5" />
            تابع @samco_designer على TikTok
          </Button>

          {/* زر التأكيد */}
          <Button
            size="lg"
            variant="outline"
            className="w-full text-lg h-14 border-2"
            onClick={handleConfirmFollow}
          >
            <Check className="ml-2 h-5 w-5" />
            لقد تابعت ✅
          </Button>
        </div>

        {/* ملاحظة */}
        <p className="text-sm text-muted-foreground">
          بعد المتابعة ارجع للتطبيق واضغط (لقد تابعت)
        </p>

        {/* الجملة التعريفية */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-lg text-muted-foreground italic">
            "اصنع صورك وفيديوهاتك بالذكاء الاصطناعي… بسهولة"
          </p>
        </div>
      </div>
    </div>
  );
}
