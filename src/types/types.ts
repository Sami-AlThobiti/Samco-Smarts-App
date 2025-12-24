// أنواع عامة للتطبيق

// نوع الملف الشخصي (غير مستخدم في هذا التطبيق)
export interface Profile {
  id: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}
