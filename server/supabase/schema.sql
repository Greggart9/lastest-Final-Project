-- ==============================================================================
-- EduCollab / FUNAAB Academic Portal - Supabase PostgreSQL Schema
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Universities Table
CREATE TABLE IF NOT EXISTS universities (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Colleges Table
CREATE TABLE IF NOT EXISTS colleges (
  id TEXT PRIMARY KEY,
  university_id TEXT REFERENCES universities(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(university_id, code)
);

-- 4. Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  college_id TEXT REFERENCES colleges(id) ON DELETE CASCADE,
  college_code TEXT NOT NULL,
  university_id TEXT REFERENCES universities(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  levels INTEGER[] DEFAULT ARRAY[100, 200, 300, 400],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  matric_no TEXT,
  first_name TEXT,
  last_name TEXT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'Student', -- 'Student', 'Course Rep', 'admin'
  university TEXT DEFAULT 'FUNAAB',
  college TEXT DEFAULT 'COLPHYS',
  department TEXT DEFAULT 'Computer Science',
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Submissions & Study Materials Table
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  author_name TEXT NOT NULL,
  author_email TEXT,
  course_code TEXT NOT NULL,
  title TEXT NOT NULL,
  university TEXT DEFAULT 'FUNAAB',
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  level TEXT NOT NULL,
  semester TEXT NOT NULL,
  category TEXT NOT NULL, -- 'course_materials', 'past_questions', 'solutions'
  file_name TEXT NOT NULL,
  file_size TEXT,
  file_type TEXT DEFAULT 'application/pdf',
  file_url TEXT, -- Cloudflare R2 public URL
  file_key TEXT, -- Cloudflare R2 storage key
  storage_provider TEXT DEFAULT 'cloudflare_r2',
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewer TEXT,
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Default Flagship Seed: Federal University of Agriculture, Abeokuta (FUNAAB)
-- ==============================================================================

INSERT INTO universities (id, code, name, short_name, status)
VALUES ('funaab', 'FUNAAB', 'Federal University of Agriculture, Abeokuta', 'FUNAAB (Abeokuta)', 'active')
ON CONFLICT (id) DO NOTHING;

-- Seed Colleges
INSERT INTO colleges (id, university_id, code, name, full_name)
VALUES
  ('colphys', 'funaab', 'COLPHYS', 'Physical Sciences', 'College of Physical Sciences'),
  ('colbios', 'funaab', 'COLBIOS', 'Biosciences', 'College of Biosciences'),
  ('coleng', 'funaab', 'COLENG', 'Engineering', 'College of Engineering'),
  ('colvet', 'funaab', 'COLVET', 'Veterinary Medicine', 'College of Veterinary Medicine'),
  ('colanim', 'funaab', 'COLANIM', 'Animal Science & Livestock Production', 'College of Animal Science & Livestock Production'),
  ('colplant', 'funaab', 'COLPLANT', 'Plant Science & Crop Production', 'College of Plant Science & Crop Production'),
  ('colamrud', 'funaab', 'COLAMRUD', 'Agricultural Management & Rural Development', 'College of Agricultural Management & Rural Development'),
  ('colfhec', 'funaab', 'COLFHEC', 'Food Science & Human Ecology', 'College of Food Science & Human Ecology')
ON CONFLICT (id) DO NOTHING;

-- Seed Departments for COLPHYS
INSERT INTO departments (id, college_id, college_code, university_id, code, name, levels)
VALUES
  ('csc', 'colphys', 'COLPHYS', 'funaab', 'CSC', 'Computer Science', ARRAY[100, 200, 300, 400]),
  ('mts', 'colphys', 'COLPHYS', 'funaab', 'MTS', 'Mathematics', ARRAY[100, 200, 300, 400, 500, 600]),
  ('phs', 'colphys', 'COLPHYS', 'funaab', 'PHS', 'Physics', ARRAY[100, 200, 300, 400]),
  ('sts', 'colphys', 'COLPHYS', 'funaab', 'STS', 'Statistics', ARRAY[100, 200, 300, 400]),
  ('chm', 'colphys', 'COLPHYS', 'funaab', 'CHM', 'Chemistry', ARRAY[100, 200, 300, 400])
ON CONFLICT (id) DO NOTHING;

-- Seed Default Admin
-- Password hash corresponds to 'Admin@2026Secure'
INSERT INTO users (id, matric_no, first_name, last_name, name, email, password_hash, role, college, department)
VALUES (
  'usr_admin_1',
  'ADM/001',
  'System',
  'Administrator',
  'System Administrator',
  'admin@funaab.edu.ng',
  '$2b$10$5IdwAuTzd6s20.hV75msV.nwCr1KOu8ovZqYz8Mp2BdDkZu4KXuue',
  'admin',
  'COLPHYS',
  'Computer Science'
) ON CONFLICT (email) DO NOTHING;

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow public read access for academic directory
DROP POLICY IF EXISTS "Allow public read universities" ON universities;
CREATE POLICY "Allow public read universities" ON universities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read colleges" ON colleges;
CREATE POLICY "Allow public read colleges" ON colleges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read departments" ON departments;
CREATE POLICY "Allow public read departments" ON departments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read submissions" ON submissions;
CREATE POLICY "Allow public read submissions" ON submissions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert submissions" ON submissions;
CREATE POLICY "Allow public insert submissions" ON submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full admin submissions" ON submissions;
CREATE POLICY "Allow full admin submissions" ON submissions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read users" ON users;
CREATE POLICY "Allow public read users" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert users" ON users;
CREATE POLICY "Allow public insert users" ON users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full admin users" ON users;
CREATE POLICY "Allow full admin users" ON users FOR ALL USING (true);
