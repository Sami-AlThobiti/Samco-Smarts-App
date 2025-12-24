import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import routes from './routes';
import NotFoundPage from './pages/NotFoundPage';

// import Header from '@/components/common/Header';
// import { AuthProvider } from '@/contexts/AuthContext';
// import { RouteGuard } from '@/components/common/RouteGuard';
import { Toaster } from '@/components/ui/toaster';
import BackgroundMusic from '@/components/ui/BackgroundMusic';
import { startKeepAlive, stopKeepAlive } from '@/utils/keepAlive';

function App() {
  // تفعيل الوضع الداكن افتراضيًا وبدء Keep-Alive
  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    // بدء آلية Keep-Alive للحفاظ على التطبيق نشطًا
    startKeepAlive();
    
    // تنظيف عند إلغاء التحميل
    return () => {
      stopKeepAlive();
    };
  }, []);

  return (
    <Router>
      {/*<AuthProvider>*/}
      {/*<RouteGuard>*/}
      <div className="flex flex-col min-h-screen">
        {/*<Header />*/}
        <main className="flex-grow">
          <Routes>
          {routes.map((route, index) => {
            const Component = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={<Component />}
              />
            );
          })}
          {/* 404 Page for all unmatched routes */}
          <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
      <Toaster />
      {/* مكون الموسيقى الخلفية */}
      <BackgroundMusic />
      {/*</RouteGuard>*/}
      {/*</AuthProvider>*/}
    </Router>
  );
}

export default App;
