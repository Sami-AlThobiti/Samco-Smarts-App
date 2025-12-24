import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AIBackground } from '@/components/ui/AIBackground';

// صفحة البداية مع انتقال تلقائي
export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق من حالة المتابعة
    const hasFollowed = localStorage.getItem('samco_has_followed') === 'true';
    
    // الانتقال بعد 1.5 ثانية
    const timer = setTimeout(() => {
      if (hasFollowed) {
        navigate('/home');
      } else {
        navigate('/follow-gate');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      {/* خلفية AI حية */}
      <AIBackground variant="home" />
      <div className="text-center animate-fade-in">
        {/* شعار التطبيق */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center glow-primary">
            <span className="text-6xl font-bold text-white">S</span>
          </div>
        </div>
        
        {/* اسم التطبيق */}
        <h1 className="text-4xl font-bold mb-4 gradient-text">
          سامكو
        </h1>
        <p className="text-xl text-muted-foreground">
          لصناعة المحتوى بالذكاء الاصطناعي
        </p>
        
        {/* مؤشر التحميل */}
        <div className="mt-12">
          <div className="w-16 h-1 bg-muted rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
