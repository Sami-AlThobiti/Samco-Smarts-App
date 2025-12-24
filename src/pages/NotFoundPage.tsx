import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-6xl">😕</span>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-destructive">404</h1>
            <h2 className="text-2xl font-semibold">الصفحة غير موجودة</h2>
            <p className="text-muted-foreground">
              عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate('/')}
              className="w-full"
              size="lg"
            >
              <Home className="ml-2 h-5 w-5" />
              العودة للصفحة الرئيسية
            </Button>
            
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="ml-2 h-5 w-5" />
              العودة للصفحة السابقة
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-muted-foreground">
            إذا كنت تعتقد أن هذا خطأ، يرجى تحديث الصفحة أو الاتصال بالدعم.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
