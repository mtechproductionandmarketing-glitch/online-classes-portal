-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_online_classes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS online_classes_update_timestamp ON online_classes;
CREATE TRIGGER online_classes_update_timestamp
  BEFORE UPDATE ON online_classes
  FOR EACH ROW
  EXECUTE FUNCTION update_online_classes_updated_at();

-- Function to generate Reference ID (OC-YYMMDD-XXXX)
CREATE OR REPLACE FUNCTION get_next_reference_id()
RETURNS VARCHAR(20) AS $$
DECLARE
  pkt_date DATE;
  counter INT;
  ref_id VARCHAR(20);
BEGIN
  -- Get Pakistan time date (UTC+5)
  pkt_date := (now() AT TIME ZONE 'Asia/Karachi')::DATE;
  
  -- Increment counter for this day
  INSERT INTO reference_counters (day, last_value)
  VALUES (pkt_date, 1)
  ON CONFLICT (day) DO UPDATE SET last_value = last_value + 1
  RETURNING last_value INTO counter;
  
  -- Format: OC-YYMMDD-XXXX (e.g., OC-261004-0017)
  ref_id := 'OC-' || 
            TO_CHAR(pkt_date, 'YYMMDD') || '-' || 
            LPAD(counter::TEXT, 4, '0');
  
  RETURN ref_id;
END;
$$ LANGUAGE plpgsql;

-- Function to submit a class (handles idempotency, duplicate detection)
CREATE OR REPLACE FUNCTION submit_online_class(
  p_class_date DATE,
  p_faculty_name VARCHAR(150),
  p_course_title VARCHAR(150),
  p_batch VARCHAR(150),
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
  -- Check if this exact idempotency_key already exists (idempotent submission)
  SELECT id, reference_id INTO v_record_id, v_ref_id
  FROM online_classes
  WHERE idempotency_key = p_idempotency_key AND is_deleted = false
  LIMIT 1;
  
  IF v_record_id IS NOT NULL THEN
    -- Submission already exists, return existing Reference ID
    RETURN QUERY SELECT true, v_ref_id, v_record_id, 'Submission already processed'::TEXT;
    RETURN;
  END IF;
  
  -- Check for possible duplicate (same faculty, date, time, section)
  SELECT EXISTS (
    SELECT 1 FROM online_classes
    WHERE is_deleted = false
      AND LOWER(TRIM(faculty_name)) = LOWER(TRIM(p_faculty_name))
      AND class_date = p_class_date
      AND start_time = p_start_time
      AND LOWER(TRIM(section)) = LOWER(TRIM(p_section))
  ) INTO v_duplicate_exists;
  
  -- Generate new Reference ID
  v_ref_id := get_next_reference_id();
  
  -- Insert the record
  INSERT INTO online_classes (
    reference_id,
    class_date,
    faculty_name,
    course_title,
    batch,
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
    TRIM(p_program),
    TRIM(p_section),
    p_start_time,
    p_duration_minutes,
    p_teams_link,
    CASE WHEN p_remarks IS NOT NULL THEN TRIM(p_remarks) ELSE NULL END,
    p_idempotency_key,
    v_duplicate_exists
  ) RETURNING online_classes.id INTO v_record_id;
  
  RETURN QUERY SELECT true, v_ref_id, v_record_id, 'Class submitted successfully'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to update admin's last login time
CREATE OR REPLACE FUNCTION update_admin_last_login(admin_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE admin_users
  SET last_login_at = now()
  WHERE id = admin_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = user_id
  ) INTO is_admin_user;
  
  RETURN is_admin_user;
END;
$$ LANGUAGE plpgsql;
