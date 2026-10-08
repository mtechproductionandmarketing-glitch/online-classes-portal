-- Create online_classes table
CREATE TABLE IF NOT EXISTS online_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id VARCHAR(20) NOT NULL UNIQUE,
  class_date DATE NOT NULL,
  faculty_name VARCHAR(150) NOT NULL CHECK (char_length(trim(faculty_name)) > 0),
  course_title VARCHAR(150) NOT NULL CHECK (char_length(trim(course_title)) > 0),
  batch VARCHAR(150) NOT NULL CHECK (char_length(trim(batch)) > 0),
  semester VARCHAR(150) NOT NULL CHECK (char_length(trim(semester)) > 0),
  program VARCHAR(150) NOT NULL CHECK (char_length(trim(program)) > 0),
  section VARCHAR(150) NOT NULL CHECK (char_length(trim(section)) > 0),
  start_time TIME NOT NULL,
  duration_minutes SMALLINT NOT NULL CHECK (duration_minutes BETWEEN 1 AND 300),
  -- Meeting/class link: Teams, Meet, Zoom, or any other valid HTTPS URL
  teams_link TEXT NOT NULL CHECK (
    teams_link IS NOT NULL
    AND char_length(trim(teams_link)) > 0
    AND lower(trim(teams_link)) LIKE 'https://%'
  ),
  remarks VARCHAR(500),
  idempotency_key UUID NOT NULL UNIQUE,
  possible_duplicate BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID,
  CONSTRAINT online_classes_updated_by_fk FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  CONSTRAINT online_classes_deleted_by_fk FOREIGN KEY (deleted_by) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE online_classes ENABLE ROW LEVEL SECURITY;

-- Create comments
COMMENT ON TABLE online_classes IS 'Online class records submitted by faculty. Uses soft deletion.';
COMMENT ON COLUMN online_classes.reference_id IS 'Unique reference ID in format OC-YYMMDD-XXXX';
COMMENT ON COLUMN online_classes.idempotency_key IS 'Client-generated UUID to prevent duplicate submissions';
COMMENT ON COLUMN online_classes.possible_duplicate IS 'Flag set to true if same faculty, date, time, section exists';
COMMENT ON COLUMN online_classes.is_deleted IS 'Soft delete flag; soft-deleted records excluded from all reports';
