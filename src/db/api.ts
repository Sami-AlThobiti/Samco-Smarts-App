// Database API functions for Supabase operations
import { supabase } from './supabase';
import type {
  Generation,
  GenerationInsert,
  GenerationFilters,
  UserPreferences,
  UserPreferencesInsert,
  UserPreferencesUpdate,
} from '@/types/database';

// ============================================================================
// GENERATIONS API
// ============================================================================

/**
 * Create a new generation record
 */
export async function createGeneration(data: GenerationInsert): Promise<Generation> {
  const { data: generation, error } = await supabase
    .from('generations')
    .insert(data)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating generation:', error);
    throw new Error(`Failed to save generation: ${error.message}`);
  }

  if (!generation) {
    throw new Error('Failed to create generation: No data returned');
  }

  return generation;
}

/**
 * Get a single generation by ID
 */
export async function getGeneration(id: string): Promise<Generation | null> {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching generation:', error);
    throw new Error(`Failed to fetch generation: ${error.message}`);
  }

  return data;
}

/**
 * Get generations with optional filters
 */
export async function getGenerations(filters?: GenerationFilters): Promise<Generation[]> {
  let query = supabase.from('generations').select('*');

  // Apply filters
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  if (filters?.mode) {
    query = query.eq('mode', filters.mode);
  }
  if (filters?.ai_tool) {
    query = query.eq('ai_tool', filters.ai_tool);
  }

  // Apply ordering and pagination
  query = query.order('created_at', { ascending: false });
  
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching generations:', error);
    throw new Error(`Failed to fetch generations: ${error.message}`);
  }

  return Array.isArray(data) ? data : [];
}

/**
 * Get recent generations (last 20)
 */
export async function getRecentGenerations(limit = 20): Promise<Generation[]> {
  return getGenerations({ limit });
}

/**
 * Get generations by type
 */
export async function getGenerationsByType(
  type: 'image' | 'video' | 'audio',
  limit = 20
): Promise<Generation[]> {
  return getGenerations({ type, limit });
}

/**
 * Delete a generation by ID
 */
export async function deleteGeneration(id: string): Promise<void> {
  const { error } = await supabase.from('generations').delete().eq('id', id);

  if (error) {
    console.error('Error deleting generation:', error);
    throw new Error(`Failed to delete generation: ${error.message}`);
  }
}

/**
 * Delete all generations (use with caution)
 */
export async function deleteAllGenerations(): Promise<void> {
  const { error } = await supabase.from('generations').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    console.error('Error deleting all generations:', error);
    throw new Error(`Failed to delete all generations: ${error.message}`);
  }
}

// ============================================================================
// USER PREFERENCES API
// ============================================================================

/**
 * Get or create session ID for the current user
 */
export function getSessionId(): string {
  const STORAGE_KEY = 'samco_session_id';
  let sessionId = localStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    // Generate a new session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Get user preferences by session ID
 */
export async function getUserPreferences(sessionId?: string): Promise<UserPreferences | null> {
  const sid = sessionId || getSessionId();

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('session_id', sid)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }

  return data;
}

/**
 * Create user preferences
 */
export async function createUserPreferences(
  data: UserPreferencesInsert
): Promise<UserPreferences> {
  const { data: preferences, error } = await supabase
    .from('user_preferences')
    .insert(data)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating user preferences:', error);
    throw new Error(`Failed to create user preferences: ${error.message}`);
  }

  if (!preferences) {
    throw new Error('Failed to create user preferences: No data returned');
  }

  return preferences;
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  sessionId: string,
  updates: UserPreferencesUpdate
): Promise<UserPreferences> {
  const { data, error } = await supabase
    .from('user_preferences')
    .update(updates)
    .eq('session_id', sessionId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating user preferences:', error);
    throw new Error(`Failed to update user preferences: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to update user preferences: No data returned');
  }

  return data;
}

/**
 * Get or create user preferences for current session
 */
export async function getOrCreateUserPreferences(): Promise<UserPreferences> {
  const sessionId = getSessionId();
  let preferences = await getUserPreferences(sessionId);

  if (!preferences) {
    // Create default preferences
    preferences = await createUserPreferences({ session_id: sessionId });
  }

  return preferences;
}

/**
 * Update a specific preference field
 */
export async function updatePreference(
  key: keyof UserPreferencesUpdate,
  value: string | Record<string, unknown> | null
): Promise<void> {
  const sessionId = getSessionId();
  await updateUserPreferences(sessionId, { [key]: value });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get statistics about generations
 */
export async function getGenerationStats(): Promise<{
  total: number;
  images: number;
  videos: number;
  audios: number;
}> {
  const { count: total } = await supabase
    .from('generations')
    .select('*', { count: 'exact', head: true });

  const { count: images } = await supabase
    .from('generations')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'image');

  const { count: videos } = await supabase
    .from('generations')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'video');

  const { count: audios } = await supabase
    .from('generations')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'audio');

  return {
    total: total || 0,
    images: images || 0,
    videos: videos || 0,
    audios: audios || 0,
  };
}
