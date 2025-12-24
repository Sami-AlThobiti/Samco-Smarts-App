-- Create user_preferences table for storing user settings
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Session identifier (browser fingerprint or generated ID)
  session_id TEXT UNIQUE NOT NULL,
  
  -- Favorite AI tools
  favorite_image_tool TEXT,
  favorite_video_tool TEXT,
  favorite_voice_tool TEXT,
  
  -- Default settings
  default_image_aspect_ratio TEXT DEFAULT '1:1',
  default_video_aspect_ratio TEXT DEFAULT '9:16',
  default_video_duration TEXT DEFAULT '5',
  default_voice_locale TEXT DEFAULT 'ar-SA',
  default_voice_speed TEXT DEFAULT 'medium',
  default_voice_pitch TEXT DEFAULT 'medium',
  
  -- UI preferences
  preferences JSONB DEFAULT '{}'::jsonb
);

-- Create index for session_id lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_session_id ON user_preferences(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON user_preferences
  FOR SELECT
  USING (true);

-- Create policy for public insert access
CREATE POLICY "Allow public insert access" ON user_preferences
  FOR INSERT
  WITH CHECK (true);

-- Create policy for public update access
CREATE POLICY "Allow public update access" ON user_preferences
  FOR UPDATE
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE user_preferences IS 'Stores user preferences and default settings for AI generation tools';