-- Advanced Features Database Tables
-- Run these SQL commands in Supabase SQL Editor

-- 1. Create imported_teachers table
CREATE TABLE IF NOT EXISTS imported_teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT,
  course TEXT NOT NULL,
  class_time TEXT NOT NULL,
  batch TEXT,
  semester TEXT,
  section TEXT,
  imported_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sender TEXT DEFAULT 'Scs@paf-iast.edu.pk',
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create email_logs table (to track sent emails)
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES imported_teachers(id),
  subject TEXT NOT NULL,
  recipient EMAIL NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_imported_teachers_email ON imported_teachers(email);
CREATE INDEX IF NOT EXISTS idx_imported_teachers_imported_date ON imported_teachers(imported_date);
CREATE INDEX IF NOT EXISTS idx_email_logs_teacher_id ON email_logs(teacher_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);

-- 5. Insert default email template
INSERT INTO email_templates (name, subject, body, sender)
VALUES (
  'missing_class',
  'Class Not Submitted - Action Required',
  'Dear {teacher_name},

You were scheduled to teach {course_title} at {class_time} on Friday.
Class: {batch} - {section}

We noticed that you haven''t submitted the class record yet. Please submit it as soon as possible.

Emails sent from: Scs@paf-iast.edu.pk
School of Computing Sciences',
  'Scs@paf-iast.edu.pk'
)
ON CONFLICT (name) DO NOTHING;
