-- Run this in your Supabase SQL Editor

-- 1. Create Teams Table
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  manual_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial teams
INSERT INTO teams (name, color, description) VALUES
('Team A', 'from-yellow-400 to-yellow-600', 'The golden warriors of literature.'),
('Team B', 'from-gray-300 to-gray-500', 'The silver knights of creativity.'),
('Team C', 'from-orange-600 to-amber-800', 'The bronze scholars of art.'),
('Team D', 'from-orange-500 to-orange-700', 'The striking artists of performance.');

-- 2. Create Programs Table
CREATE TABLE programs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Results Table
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  result_number TEXT NOT NULL UNIQUE,
  program_id INTEGER REFERENCES programs(id),
  category TEXT NOT NULL,
  status TEXT DEFAULT 'PUBLISHED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Result Winners (Many-to-One mapping to results)
CREATE TABLE result_winners (
  id SERIAL PRIMARY KEY,
  result_id INTEGER REFERENCES results(id) ON DELETE CASCADE,
  place INTEGER NOT NULL,
  name TEXT NOT NULL,
  team_id INTEGER REFERENCES teams(id),
  grade TEXT,
  points INTEGER DEFAULT 0
);

-- 5. Create Gallery Table
CREATE TABLE gallery (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create News Table
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  date TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create Videos Table
CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumb TEXT,
  views TEXT DEFAULT '0',
  date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allow anonymous read access
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to teams" ON teams FOR SELECT USING (true);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to programs" ON programs FOR SELECT USING (true);

ALTER TABLE results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to results" ON results FOR SELECT USING (true);

ALTER TABLE result_winners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to result_winners" ON result_winners FOR SELECT USING (true);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to gallery" ON gallery FOR SELECT USING (true);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to news" ON news FOR SELECT USING (true);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to videos" ON videos FOR SELECT USING (true);

-- Allow anonymous inserts/updates/deletes for now (for development purposes without Auth setup)
CREATE POLICY "Allow public all to teams" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all to programs" ON programs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all to results" ON results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all to result_winners" ON result_winners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all to gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all to news" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all to videos" ON videos FOR ALL USING (true) WITH CHECK (true);
