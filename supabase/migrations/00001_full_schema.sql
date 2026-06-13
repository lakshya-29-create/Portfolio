-- Migration: Complete Portfolio Schema
-- Description: Creates blogs, projects, and messages tables with RLS policies
-- and the increment_views RPC function.

-- ═══════════════════════════════════════════════
-- 1. BLOGS TABLE
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS blogs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL,
  excerpt text,
  content text NOT NULL,
  cover_image_url text,
  tags text[] DEFAULT '{}',
  read_time int DEFAULT 0,
  is_published bool DEFAULT false,
  views int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_blogs_slug ON blogs (slug);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs (is_published) WHERE is_published = true;

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published blogs"
  ON blogs FOR SELECT
  TO anon
  USING (is_published = true);

CREATE POLICY "Authenticated can manage blogs"
  ON blogs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ═══════════════════════════════════════════════
-- 2. PROJECTS TABLE
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  tech_stack text[] DEFAULT '{}',
  live_url text,
  github_url text,
  cover_image_url text,
  is_featured bool DEFAULT false,
  category text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects (created_at DESC);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read projects"
  ON projects FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ═══════════════════════════════════════════════
-- 3. MESSAGES TABLE (Contact Form)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at DESC);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert messages"
  ON messages FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can read messages"
  ON messages FOR SELECT
  TO authenticated
  USING (true);

-- Drop old contact_messages table if it exists (migrating to new schema)
DROP TABLE IF EXISTS contact_messages;

-- ═══════════════════════════════════════════════
-- 4. RPC: increment_views
-- ═══════════════════════════════════════════════
CREATE OR REPLACE FUNCTION increment_views(blog_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blogs
  SET views = views + 1
  WHERE slug = blog_slug;
END;
$$;
