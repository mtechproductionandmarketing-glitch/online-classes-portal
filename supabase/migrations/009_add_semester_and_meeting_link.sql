-- Migration: Add semester field + allow any class meeting link
-- Run this in the Supabase SQL Editor if columns/constraints are missing.

-- 1. Add semester column to online_classes
ALTER TABLE online_classes
  ADD COLUMN IF NOT EXISTS semester VARCHAR(150);

-- Backfill existing rows so NOT NULL can be applied safely
UPDATE online_classes
SET semester = 'Not specified'
WHERE semester IS NULL OR TRIM(semester) = '';

ALTER TABLE online_classes
  ALTER COLUMN semester SET NOT NULL;

ALTER TABLE online_classes
  DROP CONSTRAINT IF EXISTS online_classes_semester_check;

ALTER TABLE online_classes
  ADD CONSTRAINT online_classes_semester_check
  CHECK (char_length(trim(semester)) > 0);

-- 2. Relax teams_link constraint so any HTTPS meeting/class link is allowed
--    (Teams, Google Meet, Zoom, Webex, and other valid HTTPS links)
DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  FOR constraint_name IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE rel.relname = 'online_classes'
      AND nsp.nspname = 'public'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) ILIKE '%teams_link%'
  LOOP
    EXECUTE format('ALTER TABLE online_classes DROP CONSTRAINT IF EXISTS %I', constraint_name);
  END LOOP;
END $$;

ALTER TABLE online_classes
  DROP CONSTRAINT IF EXISTS online_classes_teams_link_check;

ALTER TABLE online_classes
  ADD CONSTRAINT online_classes_teams_link_check
  CHECK (
    teams_link IS NOT NULL
    AND char_length(trim(teams_link)) > 0
    AND lower(trim(teams_link)) LIKE 'https://%'
  );

COMMENT ON COLUMN online_classes.semester IS 'Academic semester for the class (e.g. Fall 2024, Spring 2025)';
COMMENT ON COLUMN online_classes.teams_link IS 'Class meeting/link URL (Teams, Meet, Zoom, or any valid HTTPS meeting link)';

-- 3. Index for semester filtering
CREATE INDEX IF NOT EXISTS online_classes_semester_idx
  ON online_classes(semester)
  WHERE is_deleted = false;

-- 4. Add semester to imported_teachers (advanced features)
ALTER TABLE imported_teachers
  ADD COLUMN IF NOT EXISTS semester TEXT;

-- 5. Recreate active view so new columns are included
CREATE OR REPLACE VIEW active_online_classes AS
SELECT *
FROM online_classes
WHERE is_deleted = false;

-- 6. Update submit_online_class to accept semester
CREATE OR REPLACE FUNCTION submit_online_class(
  p_class_date DATE,
  p_faculty_name VARCHAR(150),
  p_course_title VARCHAR(150),
  p_batch VARCHAR(150),
  p_semester VARCHAR(150),
  p_program VARCHAR(150),
  p_section VARCHAR(150),
  p_start_time TIME,
  p_duration_minutes SMALLINT,
  p_teams_link TEXT,
  p_remarks VARCHAR(500),
  p_idempotency_key UUID
)
RETURNS TABLE(success BOOLEAN, reference_id VARCHAR(20), record_id UUID, message TEXT) AS $$
DECLARE
  v_ref_id VARCHAR(20);
  v_record_id UUID;
  v_duplicate_exists BOOLEAN;
BEGIN
  SELECT id, online_classes.reference_id INTO v_record_id, v_ref_id
  FROM online_classes
  WHERE idempotency_key = p_idempotency_key AND is_deleted = false
  LIMIT 1;

  IF v_record_id IS NOT NULL THEN
    RETURN QUERY SELECT true, v_ref_id, v_record_id, 'Submission already processed'::TEXT;
    RETURN;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM online_classes
    WHERE is_deleted = false
      AND LOWER(TRIM(faculty_name)) = LOWER(TRIM(p_faculty_name))
      AND class_date = p_class_date
      AND start_time = p_start_time
      AND LOWER(TRIM(section)) = LOWER(TRIM(p_section))
  ) INTO v_duplicate_exists;

  v_ref_id := get_next_reference_id();

  INSERT INTO online_classes (
    reference_id,
    class_date,
    faculty_name,
    course_title,
    batch,
    semester,
    program,
    section,
    start_time,
    duration_minutes,
    teams_link,
    remarks,
    idempotency_key,
    possible_duplicate
  ) VALUES (
    v_ref_id,
    p_class_date,
    TRIM(p_faculty_name),
    TRIM(p_course_title),
    TRIM(p_batch),
    TRIM(p_semester),
    TRIM(p_program),
    TRIM(p_section),
    p_start_time,
    p_duration_minutes,
    TRIM(p_teams_link),
    CASE WHEN p_remarks IS NOT NULL THEN TRIM(p_remarks) ELSE NULL END,
    p_idempotency_key,
    v_duplicate_exists
  ) RETURNING online_classes.id INTO v_record_id;

  RETURN QUERY SELECT true, v_ref_id, v_record_id, 'Class submitted successfully'::TEXT;
END;
$$ LANGUAGE plpgsql;
