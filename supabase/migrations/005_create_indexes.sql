-- Create indexes on online_classes table for performance
-- Partial indexes on active records only (is_deleted = false)

CREATE INDEX IF NOT EXISTS online_classes_class_date_idx 
  ON online_classes(class_date) 
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS online_classes_faculty_name_idx 
  ON online_classes(faculty_name) 
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS online_classes_course_title_idx 
  ON online_classes(course_title) 
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS online_classes_program_idx 
  ON online_classes(program) 
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS online_classes_batch_idx 
  ON online_classes(batch) 
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS online_classes_section_idx 
  ON online_classes(section) 
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS online_classes_created_at_idx 
  ON online_classes(created_at);

-- Indexes on audit_logs table
CREATE INDEX IF NOT EXISTS audit_logs_admin_id_idx 
  ON audit_logs(admin_id);

CREATE INDEX IF NOT EXISTS audit_logs_record_id_idx 
  ON audit_logs(record_id);

CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx 
  ON audit_logs(created_at DESC);

-- Indexes on reference_id and idempotency_key are automatically created by unique constraints

-- Consider adding this only if full-text search is slow:
-- CREATE INDEX IF NOT EXISTS online_classes_faculty_name_trgm_idx 
--   ON online_classes USING GIN (faculty_name gin_trgm_ops) 
--   WHERE is_deleted = false;
