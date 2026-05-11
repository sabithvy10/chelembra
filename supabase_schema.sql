-- Run this in your Supabase SQL Editor

-- 1. Create Teams Table
CREATE TABLE IF NOT EXISTS teams (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'from-primary to-secondary',
  description TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Programs Table
CREATE TABLE IF NOT EXISTS programs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Results Table (stores entire result as JSON for simplicity)
CREATE TABLE IF NOT EXISTS results (
  id BIGSERIAL PRIMARY KEY,
  result_number TEXT NOT NULL,
  program_id BIGINT REFERENCES programs(id),
  title TEXT,
  category TEXT,
  timestamp TEXT,
  is_hidden BOOLEAN DEFAULT false,
  winners JSONB DEFAULT '[]',
  posters JSONB DEFAULT '[]',
  status TEXT DEFAULT 'PUBLISHED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create News Table
CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  image TEXT,
  date TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create Videos Table
CREATE TABLE IF NOT EXISTS videos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  thumb TEXT,
  views TEXT DEFAULT '0',
  date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  by TEXT,
  date TEXT,
  status TEXT DEFAULT 'pending',
  type TEXT DEFAULT 'general',
  result_id BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Settings Table (key-value store for about text, event date, etc.)
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('event_date', '2026 MAY 23-24 CHELEMBRA'),
  ('about_data', '{}')
ON CONFLICT (key) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name) VALUES
  ('Universal'), ('Bachelor'), ('Kids')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security but allow full public access (no auth for now)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any, then re-create
DO $$ BEGIN
  DROP POLICY IF EXISTS "public_all_teams" ON teams;
  DROP POLICY IF EXISTS "public_all_programs" ON programs;
  DROP POLICY IF EXISTS "public_all_categories" ON categories;
  DROP POLICY IF EXISTS "public_all_results" ON results;
  DROP POLICY IF EXISTS "public_all_gallery" ON gallery;
  DROP POLICY IF EXISTS "public_all_news" ON news;
  DROP POLICY IF EXISTS "public_all_videos" ON videos;
  DROP POLICY IF EXISTS "public_all_notifications" ON notifications;
  DROP POLICY IF EXISTS "public_all_settings" ON settings;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "public_all_teams" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_programs" ON programs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_results" ON results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_news" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_videos" ON videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_settings" ON settings FOR ALL USING (true) WITH CHECK (true);
