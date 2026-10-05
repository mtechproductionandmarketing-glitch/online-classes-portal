-- View for active (non-deleted) online classes only
-- Used for dashboards, reports, and statistics
CREATE OR REPLACE VIEW active_online_classes AS
SELECT *
FROM online_classes
WHERE is_deleted = false;

-- Invoke RLS on the view so admin checks still apply
ALTER VIEW active_online_classes SET (security_barrier);

-- Create comments
COMMENT ON VIEW active_online_classes IS 'View of active (non-deleted) classes. Used for all reporting and exports. RLS is enforced.';

-- Optional: Create materialized view for complex aggregations if needed later
-- (Not needed for v1.0, can add if performance becomes an issue)

-- Function to count distinct values (for statistics)
CREATE OR REPLACE FUNCTION count_distinct_text_values(table_name TEXT, column_name TEXT)
RETURNS INT AS $$
DECLARE
  result INT;
  query TEXT;
BEGIN
  query := 'SELECT COUNT(DISTINCT LOWER(TRIM(' || column_name || '))) FROM ' || table_name || ' WHERE is_deleted = false';
  EXECUTE query INTO result;
  RETURN COALESCE(result, 0);
END;
$$ LANGUAGE plpgsql;

-- Grant execute to admins
GRANT EXECUTE ON FUNCTION count_distinct_text_values(TEXT, TEXT) TO authenticated;
