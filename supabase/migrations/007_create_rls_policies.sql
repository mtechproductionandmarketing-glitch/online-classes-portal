-- RLS Policies for online_classes table

-- Admins can read all active and deleted records
CREATE POLICY "admins_can_read_classes" ON online_classes
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Admins can update classes
CREATE POLICY "admins_can_update_classes" ON online_classes
  FOR UPDATE
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- No one can delete directly (must use soft delete through function)
-- INSERT via submit_online_class function only

-- RLS Policies for admin_users table

-- Only authenticated admins can read admin_users
CREATE POLICY "admins_can_read_admin_users" ON admin_users
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Admins cannot update admin_users via direct SQL (must use special function)
-- (No INSERT, UPDATE, DELETE policies to prevent direct modification)

-- RLS Policies for audit_logs table

-- Only authenticated admins can read audit logs
CREATE POLICY "admins_can_read_audit_logs" ON audit_logs
  FOR SELECT
  USING (is_admin(auth.uid()));

-- No INSERT, UPDATE, DELETE on audit_logs via direct SQL
-- Logs are only inserted through server functions

-- RLS Policies for reference_counters table

-- No SELECT for any role (prevent info leakage)
-- Only accessible through server functions

-- Anonymous (public) role gets NO policies
-- Public submissions must go through server route that calls submit_online_class function

-- Grant EXECUTE on public functions to appropriate roles
GRANT EXECUTE ON FUNCTION submit_online_class(DATE, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, TIME, SMALLINT, TEXT, VARCHAR, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_next_reference_id() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_admin_last_login(UUID) TO authenticated;

-- Note: Service role key is used server-side for admin operations
-- It has full access to all tables bypassing RLS
