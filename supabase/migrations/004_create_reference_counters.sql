-- Create reference_counters helper table for safe Reference ID generation
CREATE TABLE IF NOT EXISTS reference_counters (
  day DATE PRIMARY KEY,
  last_value INT NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE reference_counters ENABLE ROW LEVEL SECURITY;

-- Create comments
COMMENT ON TABLE reference_counters IS 'Helper table for atomic Reference ID generation. One row per day.';
COMMENT ON COLUMN reference_counters.day IS 'Date in Pakistan time (UTC+5)';
COMMENT ON COLUMN reference_counters.last_value IS 'Incrementing counter for that day, used in Reference ID format OC-YYMMDD-XXXX';
