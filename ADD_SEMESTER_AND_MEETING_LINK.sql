-- ============================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- Adds Semester + allows any HTTPS meeting/class link
-- ============================================================

-- 1. Add semester column
ALTER TABLE online_classes
  ADD COLUMN IF NOT EXISTS semester VARCHAR(150);

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

-- 2. Allow any valid HTTPS meeting link (Teams / Meet / Zoom / other)
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

-- 3. Index
CREATE INDEX IF NOT EXISTS online_classes_semester_idx
  ON online_classes(semester)
  WHERE is_deleted = false;

-- 4. Optional: semester on imported teachers
ALTER TABLE imported_teachers
  ADD COLUMN IF NOT EXISTS semester TEXT;

-- 5. Refresh active view
CREATE OR REPLACE VIEW active_online_classes AS
SELECT *
FROM online_classes
WHERE is_deleted = false;
