// Keep-alive utility to prevent application from sleeping
import { supabase } from '@/db/supabase';

let keepAliveInterval: NodeJS.Timeout | null = null;
let activityCheckInterval: NodeJS.Timeout | null = null;
let isActive = false;
let lastActivityTime = Date.now();

/**
 * بدء آلية Keep-Alive المحسّنة
 * تقوم بإرسال طلب بسيط كل 2 دقيقة للحفاظ على التطبيق نشطًا
 * وتتبع نشاط المستخدم لإرسال طلبات إضافية عند الحاجة
 */
export function startKeepAlive(): void {
  if (isActive) {
    console.log('Keep-alive already active');
    return;
  }

  console.log('🚀 Starting enhanced keep-alive mechanism...');
  isActive = true;
  lastActivityTime = Date.now();

  // إرسال طلب فوري
  pingDatabase();

  // إرسال طلب كل 2 دقيقة (أكثر تكرارًا من قبل)
  keepAliveInterval = setInterval(() => {
    pingDatabase();
  }, 2 * 60 * 1000); // 2 دقيقة

  // فحص النشاط كل 30 ثانية
  activityCheckInterval = setInterval(() => {
    checkActivity();
  }, 30 * 1000); // 30 ثانية

  // تتبع نشاط المستخدم
  setupActivityListeners();

  // تتبع تغيير رؤية الصفحة
  setupVisibilityListener();

  console.log('✅ Keep-alive mechanism started successfully');
}

/**
 * إيقاف آلية Keep-Alive
 */
export function stopKeepAlive(): void {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
  
  if (activityCheckInterval) {
    clearInterval(activityCheckInterval);
    activityCheckInterval = null;
  }
  
  isActive = false;
  removeActivityListeners();
  console.log('🛑 Keep-alive stopped');
}

/**
 * إرسال طلب بسيط إلى قاعدة البيانات
 */
async function pingDatabase(): Promise<void> {
  try {
    const startTime = Date.now();
    
    // استعلام بسيط جدًا للحفاظ على الاتصال نشطًا
    const { error } = await supabase
      .from('generations')
      .select('id')
      .limit(1);

    const duration = Date.now() - startTime;

    if (error) {
      console.warn('⚠️ Keep-alive ping failed:', error.message);
    } else {
      console.log(`✅ Keep-alive ping successful (${duration}ms) at`, new Date().toLocaleTimeString('ar-SA'));
    }
  } catch (error) {
    console.warn('❌ Keep-alive ping error:', error);
  }
}

/**
 * تحديث وقت آخر نشاط
 */
function updateActivity(): void {
  lastActivityTime = Date.now();
}

/**
 * فحص النشاط وإرسال طلب إذا كان المستخدم نشطًا
 */
function checkActivity(): void {
  const timeSinceLastActivity = Date.now() - lastActivityTime;
  
  // إذا كان المستخدم نشطًا في آخر دقيقة، أرسل طلب إضافي
  if (timeSinceLastActivity < 60 * 1000) {
    console.log('👤 User is active, sending additional ping...');
    pingDatabase();
  }
}

/**
 * إعداد مستمعي نشاط المستخدم
 */
function setupActivityListeners(): void {
  // تتبع حركة الماوس
  document.addEventListener('mousemove', updateActivity, { passive: true });
  
  // تتبع النقرات
  document.addEventListener('click', updateActivity, { passive: true });
  
  // تتبع لمس الشاشة (للأجهزة المحمولة)
  document.addEventListener('touchstart', updateActivity, { passive: true });
  
  // تتبع ضغط المفاتيح
  document.addEventListener('keydown', updateActivity, { passive: true });
  
  // تتبع التمرير
  document.addEventListener('scroll', updateActivity, { passive: true });
}

/**
 * إزالة مستمعي نشاط المستخدم
 */
function removeActivityListeners(): void {
  document.removeEventListener('mousemove', updateActivity);
  document.removeEventListener('click', updateActivity);
  document.removeEventListener('touchstart', updateActivity);
  document.removeEventListener('keydown', updateActivity);
  document.removeEventListener('scroll', updateActivity);
}

/**
 * إعداد مستمع تغيير رؤية الصفحة
 */
function setupVisibilityListener(): void {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      // المستخدم عاد إلى الصفحة، أرسل طلب فوري
      console.log('👁️ User returned to page, sending immediate ping...');
      updateActivity();
      pingDatabase();
    }
  });
}

/**
 * التحقق من حالة Keep-Alive
 */
export function isKeepAliveActive(): boolean {
  return isActive;
}

/**
 * الحصول على وقت آخر نشاط
 */
export function getLastActivityTime(): number {
  return lastActivityTime;
}

/**
 * إرسال طلب يدوي (للاستخدام من مكونات أخرى)
 */
export function manualPing(): void {
  console.log('🔄 Manual ping requested...');
  updateActivity();
  pingDatabase();
}
