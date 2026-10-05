# Deployment Guide: Online Classes Recording & Tracking Portal

This guide provides step-by-step instructions to deploy the complete application from source code to production on Vercel.

## Prerequisites

Before starting, ensure you have:

1. **Node.js** (v18 or higher) and npm installed locally
2. **Git** installed and configured
3. **GitHub** account (free)
4. **Supabase** account (free at https://supabase.com)
5. **Vercel** account (free at https://vercel.com)
6. A code editor (VS Code recommended)

## Step 1: Clone/Download the Project

```bash
# If cloned from GitHub:
git clone https://github.com/YOUR_USERNAME/online-classes-recording-tracking-portal.git
cd online-classes-portal

# Or if starting fresh with the provided files:
# Just copy all files to a new directory
cd online-classes-portal
```

## Step 2: Install Dependencies

```bash
# Install all npm packages
npm install

# Verify installation
npm --version  # Should be 7.0.0 or higher
node --version # Should be 18.0.0 or higher
```

## Step 3: Set Up Supabase Project

### 3.1 Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New project"
3. Fill in:
   - **Name**: `online-classes-portal`
   - **Database Password**: Set a strong password (save it)
   - **Region**: Choose region closest to you (e.g., Frankfurt for EU)
4. Wait for project to initialize (5-10 minutes)

### 3.2 Get Supabase Credentials

1. In Supabase Dashboard, go to **Settings → API**
2. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### 3.3 Create `.env.local` File

Create a file named `.env.local` in your project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**⚠️ WARNING**: Never commit `.env.local` to GitHub. It's in `.gitignore` for this reason.

## Step 4: Apply Database Migrations

### 4.1 Install Supabase CLI

```bash
npm install -g supabase
```

### 4.2 Link to Your Supabase Project

```bash
supabase link --project-id your_project_id
```

When prompted for password, enter the database password you set in Step 3.1

### 4.3 Push Migrations

```bash
supabase db push
```

This applies all migrations in `supabase/migrations/` in order:
- Creates admin_users table
- Creates online_classes table
- Creates audit_logs table
- Creates reference_counters helper table
- Creates indexes
- Creates functions and triggers
- Applies Row Level Security policies
- Creates reporting views

### 4.4 Verify Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Run: `SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;`
3. You should see: `admin_users`, `audit_logs`, `online_classes`, `reference_counters`

## Step 5: Generate TypeScript Types

```bash
# Generate Supabase types
supabase gen types typescript --local > src/types/database.ts

# Verify the file was created
ls -la src/types/database.ts
```

## Step 6: Create Initial Admin User

### 6.1 In Supabase Dashboard

1. Go to **Authentication → Users**
2. Click **Add user**
3. Enter:
   - Email: `admin@example.com`
   - Password: (set a strong temporary password)
   - Auto Confirm User: YES
4. Click **Create user**

### 6.2 Link Admin to admin_users Table

1. Go to **SQL Editor** in Supabase
2. Run this SQL (replace UUID from the user you created):

```sql
INSERT INTO admin_users (id, email, role)
VALUES ('USER_UUID_FROM_AUTH_USERS', 'admin@example.com', 'admin')
ON CONFLICT DO NOTHING;
```

3. To get the correct UUID:
   - In **Authentication → Users**, click the user
   - Copy the **User ID** (UUID in the top right)
   - Use it in the SQL above

## Step 7: Test Locally

```bash
# Start development server
npm run dev

# Open browser
# Faculty portal: http://localhost:3000
# Admin login: http://localhost:3000/admin/login
```

### 7.1 Test Faculty Submission

1. Go to http://localhost:3000
2. Fill in a test class:
   - Date: Today
   - Faculty Name: Test Faculty
   - Course: Test Course
   - Program: BS CS
   - Batch: Fall 2024
   - Section: A
   - Start Time: 10:00
   - Duration: 90 minutes
   - Teams Link: `https://teams.microsoft.com/l/meetup-join/test`
   - Remarks: (optional)
3. Click Submit
4. Should see success screen with Reference ID (OC-YYMMDD-XXXX format)

### 7.2 Test Admin Login

1. Go to http://localhost:3000/admin/login
2. Login with:
   - Email: `admin@example.com`
   - Password: (password you set)
3. Should see Dashboard with:
   - KPI cards showing "1" class (from test above)
   - Charts with data
   - Records table with your test submission

## Step 8: Production Build Test

```bash
# Build for production
npm run build

# Start production server
npm start
```

Test the same faculty and admin flows again to confirm everything works.

## Step 9: Set Up GitHub Repository

### 9.1 Initialize Git (if not done)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 9.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create repository: `online-classes-recording-tracking-portal`
3. Do NOT initialize with README (we already have one)

### 9.3 Push to GitHub

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/online-classes-recording-tracking-portal.git

# Rename branch to main (if on master)
git branch -M main

# Verify no .env.local or secrets in staging
git status

# Stage all
git add .

# Create commit
git commit -m "Initial commit: Complete Online Classes Portal application

- Faculty portal for class submission (no login required)
- Admin portal with authentication
- Dashboard with KPI cards and charts
- Records management with soft delete
- Excel export functionality
- Audit logging of all admin actions
- Data cleanup tool for standardization
- Supabase PostgreSQL with RLS
- Fully responsive mobile design
- Complete test coverage"

# Push to GitHub
git push -u origin main
```

## Step 10: Deploy to Vercel

### 10.1 Connect Repository to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select `online-classes-recording-tracking-portal`
4. Click **Import**

### 10.2 Add Environment Variables

On the Vercel import screen, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Note**: These are the SAME values from your `.env.local`

### 10.3 Deploy

1. Click **Deploy**
2. Wait for build and deployment (5-10 minutes)
3. Once complete, you'll see a production URL like:
   ```
   https://online-classes-portal-abc123.vercel.app
   ```

## Step 11: Verify Production Deployment

### 11.1 Test Faculty Portal

1. Open the production URL in a new browser (incognito/private mode)
2. Submit a test class record
3. Verify success screen with Reference ID
4. Record should appear in database

### 11.2 Test Admin Portal

1. Go to `/admin/login` on production URL
2. Login with your admin email and password
3. Verify you see the dashboard
4. Verify the test record you just submitted appears in the records table

### 11.3 Test Key Features

- [ ] Dashboard KPI cards show correct numbers
- [ ] Charts display with data
- [ ] Search and filter work
- [ ] Pagination works
- [ ] Can edit a record
- [ ] Can delete and restore a record
- [ ] Excel export downloads
- [ ] Audit log shows your actions
- [ ] Mobile layout is responsive

## Step 12: Create Production Admin Account

When everything is working, create a real admin account (not `admin@example.com`):

### 12.1 In Supabase Dashboard

1. Go to **Authentication → Users**
2. Add a new user with:
   - Email: `your-admin-email@university.edu`
   - Password: (strong password)
   - Auto Confirm User: YES

### 12.2 Link to admin_users

```sql
INSERT INTO admin_users (id, email, role)
VALUES ('THE_NEW_USER_UUID', 'your-admin-email@university.edu', 'admin');
```

### 12.3 Delete Test Accounts

Optionally delete `admin@example.com` and any test user accounts.

## Step 13: Configure Automated Deployments

Your application is now set to auto-deploy whenever you push to the `main` branch:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically:
# 1. Detects the push
# 2. Builds the application
# 3. Deploys to production
# 4. Updates the live URL
```

## Step 14: Set Up Monitoring & Backups

### 14.1 Enable Supabase Backups

1. In Supabase Dashboard, go to **Database → Backups**
2. Choose backup frequency (daily minimum recommended)
3. Backups are stored for point-in-time recovery

### 14.2 Monitor Application Errors

1. In Vercel Dashboard, go to **Deployments**
2. Click your production deployment
3. Go to **Functions** to see any API errors
4. Set up email alerts if needed

## Post-Deployment Checklist

- [ ] Faculty portal is accessible without login
- [ ] Faculty can submit classes successfully
- [ ] Reference IDs are generated correctly
- [ ] Admin login works securely
- [ ] Admin dashboard displays correct data
- [ ] All admin features work (search, filter, edit, delete, export)
- [ ] Excel exports are formatted correctly
- [ ] Audit logs record all actions
- [ ] Mobile layout is responsive
- [ ] Error messages are user-friendly
- [ ] No sensitive data is exposed in error messages
- [ ] HTTPS is enforced (Vercel default)
- [ ] Database backups are configured
- [ ] GitHub repository is updated
- [ ] Production URL is documented

## Troubleshooting

### "Build failed on Vercel"
1. Check Vercel build logs
2. Common issue: Missing environment variables
3. Verify all three env vars are set in Vercel project settings

### "Supabase connection error"
1. Check `.env.local` values match Supabase dashboard exactly
2. Verify Supabase project is active (not paused)
3. Confirm database migrations ran successfully

### "Admin login fails in production"
1. Verify admin user exists in Supabase **Authentication**
2. Verify admin_users table record exists
3. Check email matches exactly (case-sensitive)
4. Try resetting password in Supabase Auth

### "Empty dashboard statistics"
1. Verify records were submitted (check Supabase Table Editor)
2. Confirm `is_deleted = false` for active records
3. Check RLS policies allow admin to read records

### "Excel export times out"
1. Try exporting fewer records (use date filter)
2. Verify no special characters in data that break Excel format
3. Check Vercel Function timeout settings (default 60s)

## Production Maintenance

### Regular Tasks

**Weekly:**
- Monitor Vercel dashboard for errors
- Check Supabase dashboard for activity

**Monthly:**
- Review audit logs for unusual activity
- Test restore functionality (if backups needed)
- Monitor database usage vs. free tier limits

**Before Semester:**
- Do full backup using Supabase export
- Test disaster recovery (restore from backup)
- Clear old test data if any

### Database Growth Management

The free Supabase tier includes 500MB database storage.

For ~1000 classes per semester (estimated 100KB each):
- Storage needed: ~100MB
- This leaves plenty of room for multiple semesters

If storage approaches limit:
- Archive old semesters to Excel exports
- Delete truly old test data
- Consider upgrading to paid tier

## Updating the Application

To add new features:

```bash
# 1. Make changes locally
# 2. Test with: npm run dev
# 3. Production build test: npm run build && npm start

# 4. Commit and push
git add .
git commit -m "Add new feature: X"
git push origin main

# 5. Vercel automatically deploys
# 6. Test on production URL
```

## Support

If you encounter issues:

1. Check this guide's Troubleshooting section
2. Review Supabase docs: https://supabase.com/docs
3. Review Next.js docs: https://nextjs.org/docs
4. Check Vercel docs: https://vercel.com/docs

## Final Confirmation

Once deployed and tested, you now have a production-ready application at:

```
LIVE WEBSITE: https://your-domain.vercel.app
```

Share this link with faculty to start submitting online classes!
