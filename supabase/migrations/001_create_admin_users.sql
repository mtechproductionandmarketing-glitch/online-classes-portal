-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (role = 'admin'),
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login_at TIMESTAMPTZ,
  CONSTRAINT admin_users_id_fk FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Add helpful comment
COMMENT ON TABLE admin_users IS 'Admin users linked to Supabase auth.users. Passwords are managed by Supabase Auth only.';
COMMENT ON COLUMN admin_users.id IS 'UUID from auth.users(id)';
COMMENT ON COLUMN admin_users.email IS 'Email address, unique across all admins';
COMMENT ON COLUMN admin_users.role IS 'Admin role, currently all admins have admin role';
