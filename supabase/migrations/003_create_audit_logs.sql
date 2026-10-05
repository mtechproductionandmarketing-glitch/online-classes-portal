-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID,
  action VARCHAR(50) NOT NULL CHECK (action IN ('LOGIN', 'LOGOUT', 'EDIT', 'DELETE', 'RESTORE', 'EXPORT')),
  record_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT audit_logs_admin_id_fk FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  CONSTRAINT audit_logs_record_id_fk FOREIGN KEY (record_id) REFERENCES online_classes(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create comments
COMMENT ON TABLE audit_logs IS 'Audit trail of all admin actions for compliance and debugging';
COMMENT ON COLUMN audit_logs.action IS 'Type of action: LOGIN, LOGOUT, EDIT, DELETE, RESTORE, EXPORT';
COMMENT ON COLUMN audit_logs.details IS 'JSON object with action-specific details (changes, filters, counts, etc.)';
