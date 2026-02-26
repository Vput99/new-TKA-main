-- SQL Schema for TKA Simulation Portal (Clean Slate Version)

-- 1. Drop existing tables to ensure clean state
DROP TABLE IF EXISTS exam_results;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS subjects;
DROP TYPE IF EXISTS question_type;

-- 2. Create Enum for Question Types
CREATE TYPE question_type AS ENUM ('multiple_choice', 'multiple_answer', 'true_false', 'table_true_false', 'short_answer', 'matching');

-- 3. Subjects Table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Profiles Table (Students & Teachers)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  full_name TEXT NOT NULL,
  nisn TEXT UNIQUE, -- For students
  access_code TEXT, -- For students (simulated password)
  faculty_id TEXT UNIQUE, -- For teachers
  password TEXT, -- For teachers
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Questions Table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  type question_type NOT NULL DEFAULT 'multiple_choice',
  question_text TEXT NOT NULL,
  image_url TEXT, -- For questions with images
  options JSONB DEFAULT '[]'::jsonb, -- Default to empty array, not null
  correct_answer JSONB NOT NULL, -- String for single, Array for multi, Object for table
  table_data JSONB DEFAULT NULL, -- For table-based questions
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Exam Results Table
CREATE TABLE exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL,
  answers JSONB, -- Store student's answers
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Row Level Security (RLS) Configuration
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Akses Baca Publik Profil" ON profiles FOR SELECT USING (true);
CREATE POLICY "Akses Baca Publik Mata Pelajaran" ON subjects FOR SELECT USING (true);
CREATE POLICY "Akses Baca Publik Pertanyaan" ON questions FOR SELECT USING (true);
CREATE POLICY "Akses Simpan Hasil Ujian" ON exam_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Akses Baca Hasil Ujian" ON exam_results FOR SELECT USING (true);

-- 8. Seed Data
INSERT INTO subjects (name, description) VALUES 
('Matematika', 'Latihan soal berhitung, logika matematika, dan pemecahan masalah dasar.'),
('Bahasa Indonesia', 'Pemahaman bacaan, tata bahasa, dan kosa kata dalam Bahasa Indonesia.');

-- Sample Accounts
INSERT INTO profiles (role, full_name, nisn, access_code) VALUES
('student', 'Budi Santoso', '00458123', '123456'),
('student', 'Ani Dewi', '00458124', '123456'),
('student', 'Dewi Nuraini', '00458125', '123456'),
('student', 'Fajar Kurniawan', '00458126', '123456'),
('student', 'Gita Wijaya', '00458127', '123456');

INSERT INTO profiles (role, full_name, faculty_id, password) VALUES
('teacher', 'Admin Utama', 'tka_admin', 'admin123');

-- Sample Exam Results
DO $$
DECLARE
    student1_id UUID;
    student2_id UUID;
    student3_id UUID;
    student4_id UUID;
    student5_id UUID;
    math_id UUID;
    indo_id UUID;
BEGIN
    SELECT id INTO student1_id FROM profiles WHERE nisn = '00458123' LIMIT 1;
    SELECT id INTO student2_id FROM profiles WHERE nisn = '00458124' LIMIT 1;
    SELECT id INTO student3_id FROM profiles WHERE nisn = '00458125' LIMIT 1;
    SELECT id INTO student4_id FROM profiles WHERE nisn = '00458126' LIMIT 1;
    SELECT id INTO student5_id FROM profiles WHERE nisn = '00458127' LIMIT 1;
    SELECT id INTO math_id FROM subjects WHERE name = 'Matematika' LIMIT 1;
    SELECT id INTO indo_id FROM subjects WHERE name = 'Bahasa Indonesia' LIMIT 1;

    IF student1_id IS NOT NULL AND math_id IS NOT NULL THEN
        INSERT INTO exam_results (student_id, subject_id, score, answers, completed_at) VALUES
        (student1_id, math_id, 85, '{}'::jsonb, NOW() - INTERVAL '2 days');
    END IF;
    IF student2_id IS NOT NULL AND indo_id IS NOT NULL THEN
        INSERT INTO exam_results (student_id, subject_id, score, answers, completed_at) VALUES
        (student2_id, indo_id, 70, '{}'::jsonb, NOW() - INTERVAL '1 day');
    END IF;
    IF student3_id IS NOT NULL AND math_id IS NOT NULL THEN
        INSERT INTO exam_results (student_id, subject_id, score, answers, completed_at) VALUES
        (student3_id, math_id, 92, '{}'::jsonb, NOW() - INTERVAL '3 days');
    END IF;
    IF student4_id IS NOT NULL AND indo_id IS NOT NULL THEN
        INSERT INTO exam_results (student_id, subject_id, score, answers, completed_at) VALUES
        (student4_id, indo_id, 78, '{}'::jsonb, NOW() - INTERVAL '4 days');
    END IF;
    IF student5_id IS NOT NULL AND math_id IS NOT NULL THEN
        INSERT INTO exam_results (student_id, subject_id, score, answers, completed_at) VALUES
        (student5_id, math_id, 65, '{}'::jsonb, NOW() - INTERVAL '5 days');
    END IF;
END $$;

-- Sample Questions
DO $$
DECLARE
    math_id UUID;
    indo_id UUID;
BEGIN
    SELECT id INTO math_id FROM subjects WHERE name = 'Matematika' LIMIT 1;
    SELECT id INTO indo_id FROM subjects WHERE name = 'Bahasa Indonesia' LIMIT 1;

    -- MATH QUESTIONS
    INSERT INTO questions (subject_id, type, question_text, image_url, options, correct_answer) VALUES 
    (math_id, 'multiple_choice', 'Perhatikan gambar bangun datar di bawah ini. Bangun datar apakah ini?', 
    'https://picsum.photos/seed/geometry/400/200', -- URL gambar soal
    '[{"id": "a", "text": "Persegi"}, {"id": "b", "text": "Segitiga"}, {"id": "c", "text": "Lingkaran"}, {"id": "d", "text": "Persegi Panjang"}]'::jsonb, 
    '"a"'::jsonb);

    INSERT INTO questions (subject_id, type, question_text, options, correct_answer) VALUES 
    (math_id, 'multiple_answer', 'Manakah dari bilangan berikut yang merupakan bilangan prima?', 
    '[{"id": "a", "text": "2"}, {"id": "b", "text": "4"}, {"id": "c", "text": "7"}, {"id": "d", "text": "9"}]'::jsonb, 
    '["a", "c"]'::jsonb);

    -- MATH QUESTIONS - Table True/False
    INSERT INTO questions (subject_id, type, question_text, table_data, correct_answer) VALUES 
    (math_id, 'table_true_false', 'Tentukan apakah pernyataan dalam tabel berikut Benar atau Salah.', 
    '{
        "headers": ["Pernyataan"],
        "rows": [
            {"id": "r1", "text": "2 + 2 = 4"},
            {"id": "r2", "text": "5 x 3 = 12"},
            {"id": "r3", "text": "10 / 2 = 5"}
        ]
    }'::jsonb, 
    '{"r1": true, "r2": false, "r3": true}'::jsonb);

    -- INDO QUESTIONS
    INSERT INTO questions (subject_id, type, question_text, image_url, options, correct_answer) VALUES 
    (indo_id, 'multiple_choice', 'Perhatikan gambar berikut. Apa yang sedang dilakukan anak tersebut?', 
    'https://picsum.photos/seed/reading/400/200', -- URL gambar soal
    '[{"id": "a", "text": "Membaca buku"}, {"id": "b", "text": "Bermain bola"}, {"id": "c", "text": "Menulis"}, {"id": "d", "text": "Melukis"}]'::jsonb, 
    '"a"'::jsonb);

    -- INDO QUESTIONS - Table True/False
    INSERT INTO questions (subject_id, type, question_text, table_data, correct_answer) VALUES 
    (indo_id, 'table_true_false', 'Tentukan apakah pengelompokan jenis kata berikut Benar atau Salah.', 
    '{
        "headers": ["Kata", "Jenis"],
        "rows": [
            {"id": "r1", "text": "Makan (Kata Kerja)"},
            {"id": "r2", "text": "Rumah (Kata Sifat)"},
            {"id": "r3", "text": "Cantik (Kata Sifat)"}
        ]
    }'::jsonb, 
    '{"r1": true, "r2": false, "r3": true}'::jsonb);

    -- MATH QUESTIONS - Multiple Choice with Image Options
    INSERT INTO questions (subject_id, type, question_text, options, correct_answer) VALUES 
    (math_id, 'multiple_choice', 'Pilih gambar yang menunjukkan angka 8.', 
    '[
        {"id": "a", "image_url": "https://picsum.photos/seed/number1/100/100", "text": "Angka 1"},
        {"id": "b", "image_url": "https://picsum.photos/seed/number8/100/100", "text": "Angka 8"},
        {"id": "c", "image_url": "https://picsum.photos/seed/number3/100/100", "text": "Angka 3"}
    ]'::jsonb, 
    '"b"'::jsonb);

    -- INDO QUESTIONS - Table True/False (Menu Makanan Example)
    INSERT INTO questions (subject_id, type, question_text, table_data, correct_answer) VALUES 
    (indo_id, 
     'table_true_false', 
     'Perhatikan tabel menu makanan di bawah ini, kemudian tentukan apakah pernyataan di bawahnya Benar atau Salah.', 
     '{
        "headers": ["No.", "Nama Makanan", "Harga"],
        "rows": [
            {"id": "m1", "No.": "1", "Nama Makanan": "Nasi Goreng", "Harga": "Rp 20.000"},
            {"id": "m2", "No.": "2", "Nama Makanan": "Mie Ayam", "Harga": "Rp 18.000"},
            {"id": "m3", "No.": "3", "Nama Makanan": "Es Teh", "Harga": "Rp 5.000"}
        ]
     }'::jsonb, 
     '{
        "r1": true, -- Nasi Goreng adalah makanan utama
        "r2": false, -- Mie Ayam lebih mahal dari Nasi Goreng
        "r3": true   -- Es Teh adalah minuman
     }'::jsonb
    );

    -- INDO QUESTIONS - Multiple Answer with Image Options
    INSERT INTO questions (subject_id, type, question_text, options, correct_answer) VALUES 
    (indo_id, 'multiple_answer', 'Pilih gambar yang menunjukkan buah-buahan.', 
    '[
        {"id": "a", "image_url": "https://picsum.photos/seed/apple/100/100", "text": "Apel"},
        {"id": "b", "image_url": "https://picsum.photos/seed/carrot/100/100", "text": "Wortel"},
        {"id": "c", "image_url": "https://picsum.photos/seed/banana/100/100", "text": "Pisang"}
    ]'::jsonb, 
    '["a", "c"]'::jsonb);

    -- MATH QUESTIONS - Short Answer
    INSERT INTO questions (subject_id, type, question_text, correct_answer) VALUES 
    (math_id, 'short_answer', 'Berapakah hasil dari 10 + 5?', '15'::jsonb);

    -- INDO QUESTIONS - Matching
    INSERT INTO questions (subject_id, type, question_text, options, correct_answer) VALUES 
    (indo_id, 'matching', 'Jodohkan kata-kata berikut dengan artinya yang benar.', 
    '[
        {"id": "left_1", "text": "Rumah"},
        {"id": "left_2", "text": "Makan"},
        {"id": "right_a", "text": "Tempat Tinggal"},
        {"id": "right_b", "text": "Menyantap"}
    ]'::jsonb, 
    '{"right_a": "left_1", "right_b": "left_2"}'::jsonb);

END $$;


