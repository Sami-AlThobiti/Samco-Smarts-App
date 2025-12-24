// Database types for Supabase tables

export type GenerationType = 'image' | 'video' | 'audio';

export type GenerationMode =
  | 'text-to-image'
  | 'image-to-image'
  | 'text-to-video'
  | 'image-to-video'
  | 'text-to-speech'
  | 'voice-clone';

export interface Generation {
  id: string;
  created_at: string;
  type: GenerationType;
  mode: GenerationMode;
  ai_tool: string;
  prompt: string | null;
  output_url: string;
  reference_url: string | null;
  settings: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export interface GenerationInsert {
  type: GenerationType;
  mode: GenerationMode;
  ai_tool: string;
  prompt?: string | null;
  output_url: string;
  reference_url?: string | null;
  settings?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface UserPreferences {
  id: string;
  created_at: string;
  updated_at: string;
  session_id: string;
  favorite_image_tool: string | null;
  favorite_video_tool: string | null;
  favorite_voice_tool: string | null;
  default_image_aspect_ratio: string;
  default_video_aspect_ratio: string;
  default_video_duration: string;
  default_voice_locale: string;
  default_voice_speed: string;
  default_voice_pitch: string;
  preferences: Record<string, unknown>;
}

export interface UserPreferencesInsert {
  session_id: string;
  favorite_image_tool?: string | null;
  favorite_video_tool?: string | null;
  favorite_voice_tool?: string | null;
  default_image_aspect_ratio?: string;
  default_video_aspect_ratio?: string;
  default_video_duration?: string;
  default_voice_locale?: string;
  default_voice_speed?: string;
  default_voice_pitch?: string;
  preferences?: Record<string, unknown>;
}

export interface UserPreferencesUpdate {
  favorite_image_tool?: string | null;
  favorite_video_tool?: string | null;
  favorite_voice_tool?: string | null;
  default_image_aspect_ratio?: string;
  default_video_aspect_ratio?: string;
  default_video_duration?: string;
  default_voice_locale?: string;
  default_voice_speed?: string;
  default_voice_pitch?: string;
  preferences?: Record<string, unknown>;
}

// Query filters
export interface GenerationFilters {
  type?: GenerationType;
  mode?: GenerationMode;
  ai_tool?: string;
  limit?: number;
  offset?: number;
}
