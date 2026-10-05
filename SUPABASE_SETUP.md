# Supabase Integration Setup Guide

## Current Status
✅ Supabase integration is now live with real authentication!

## Supabase Project Details
- **Project URL**: https://uvbwfzzjegdospylvfai.supabase.co
- **Region**: Configured
- **Database**: PostgreSQL

## Environment Variables

### How to Get Your Keys

1. **Login to Supabase Dashboard**: https://app.supabase.com
2. **Select your project**: "online-classes-portal" 
3. **Go to Settings → API**
4. Copy the following:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### Environment Variables to Configure

Required variables for `.env.local` and Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=<Your Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Your Anon Key>
SUPABASE_SERVICE_ROLE_KEY=<Your Service Role Key>
SUPABASE_JWKS_URL=<Your Project URL>/auth/v1/.well-known/jwks.json
```

### Setting Variables in Vercel

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add all four variables for **Production** environment
3. Redeploy the application: `vercel --prod --yes`

## Admin Authentication

### Current Setup
- Authentication endpoint: `/api/auth/login`
- Session stored in localStorage with JWT tokens
- Session validation on dashboard access

### Create Admin Users in Supabase

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" and create admin accounts:

**Test Admin User 1:**
- Email: `admin@paf-iast.edu.pk`
- Password: `Admin@123456` (at least 6 characters)
- User Metadata:
  ```json
  {
    "role": "admin",
    "organization": "PAF-IAST",
    "department": "Administration"
  }
  ```

**Test Admin User 2:**
- Email: `director@paf-iast.edu.pk`
- Password: `Director@123456`
- User Metadata:
  ```json
  {
    "role": "director",
    "organization": "PAF-IAST",
    "department": "Administration"
  }
  ```

## API Endpoints

### Login
**POST** `/api/auth/login`
```json
{
  "email": "admin@paf-iast.edu.pk",
  "password": "Admin@123456"
}
```

**Response:**
```json
{
  "user": { "id": "...", "email": "admin@paf-iast.edu.pk" },
  "session": { "access_token": "...", "expires_at": ... }
}
```

### Submit Class
**POST** `/api/submit-class`
```json
{
  "class_date": "2026-10-04",
  "faculty_name": "Dr. John Doe",
  "course_title": "Data Structures",
  "program": "BS Computer Science",
  "batch": "Fall 2024",
  "section": "Blue",
  "start_time": "10:00",
  "duration_minutes": "90",
  "teams_link": "https://teams.microsoft.com/l/meetup-join/...",
  "remarks": ""
}
```

## Database Setup

### Tables to Create in Supabase (SQL)

```sql
-- Admin Users Table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  organization VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Online Classes Table
CREATE TABLE online_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id VARCHAR(20) UNIQUE NOT NULL,
  class_date DATE NOT NULL,
  faculty_name VARCHAR(255) NOT NULL,
  course_title VARCHAR(255) NOT NULL,
  program VARCHAR(255) NOT NULL,
  batch VARCHAR(100) NOT NULL,
  section VARCHAR(100) NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  teams_link TEXT NOT NULL,
  remarks TEXT,
  status VARCHAR(50) DEFAULT 'submitted',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(50),
  user_email VARCHAR(255),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  details JSONB
);
```

## Testing

1. **Faculty Portal**: https://online-classes-portal-complete.vercel.app
   - Submit class record without login
   - Should receive Reference ID

2. **Admin Login**: https://online-classes-portal-complete.vercel.app/admin
   - Use test credentials to login
   - Access admin dashboard

3. **Admin Dashboard**: https://online-classes-portal-complete.vercel.app/admin/dashboard
   - View KPI statistics
   - See recent submissions
   - Navigate using sidebar

## Troubleshooting

### Login fails with "Invalid credentials"
- Verify Supabase user exists in Authentication → Users
- Check password is correct (minimum 6 characters)
- Ensure environment variables are correctly set

### Dashboard shows "Unauthorized"
- Clear browser localStorage
- Login again with valid credentials
- Check session expiration (should be 1 hour by default)

### No data showing in dashboard
- Create online classes via faculty portal first
- Check database connection is working
- Verify RLS policies allow admin access

## Security Notes

⚠️ **Important**: These credentials are for development/demo only.

For production:
1. Use strong passwords
2. Enable 2FA in Supabase
3. Set proper Row-Level Security (RLS) policies
4. Use environment-specific credentials
5. Rotate keys periodically
6. Enable audit logging
7. Set up monitoring and alerts

## Next Steps

1. ✅ Add environment variables to Vercel
2. ✅ Create admin users in Supabase
3. Create database tables (use SQL above)
4. Set up Row-Level Security policies
5. Configure email notifications
6. Set up backup and disaster recovery
