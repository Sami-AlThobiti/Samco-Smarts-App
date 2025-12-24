-- Create generations table for storing all AI-generated content
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Generation type: 'image', 'video', 'audio'
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio')),
  
  -- Generation mode: 'text-to-image', 'image-to-image', 'text-to-video', 'image-to-video', 'text-to-speech', 'voice-clone'
  mode TEXT NOT NULL,
  
  -- AI tool used
  ai_tool TEXT NOT NULL,
  
  -- User input
  prompt TEXT,
  
  -- Generated content URL
  output_url TEXT NOT NULL,
  
  -- Reference/input file URL (for image-to-image, image-to-video, voice-clone)
  reference_url TEXT,
  
  -- Generation settings (JSON)
  settings JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_generations_type ON generations(type);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_mode ON generations(mode);
CREATE INDEX IF NOT EXISTS idx_generations_ai_tool ON generations(ai_tool);

-- Enable Row Level Security (RLS)
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (no auth required)
CREATE POLICY "Allow public read access" ON generations
  FOR SELECT
  USING (true);

-- Create policy for public insert access (no auth required)
CREATE POLICY "Allow public insert access" ON generations
  FOR INSERT
  WITH CHECK (true);

-- Create policy for public delete access (no auth required)
CREATE POLICY "Allow public delete access" ON generations
  FOR DELETE
  USING (true);

-- Add comment to table
COMMENT ON TABLE generations IS 'Stores all AI-generated content (images, videos, audio) with their settings and metadata';
