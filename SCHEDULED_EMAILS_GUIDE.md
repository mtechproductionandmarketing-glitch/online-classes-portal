# Scheduled Email Notification System - Complete Guide

## 🎯 Overview

The scheduled email system automatically sends reminder emails to teachers who haven't submitted their class records. It compares imported teachers with actual submissions and sends personalized notifications.

---

## 📋 How It Works

### 1. **Import Teachers (Friday Morning)**
- Admin uploads Excel file with teacher schedules
- File contains: Name, Email, Title, Course, Class Time, Batch, Section
- Teachers stored in `imported_teachers` table

### 2. **Schedule Check (Friday 5 PM)**
- Vercel cron job triggers automatically at 12 PM UTC (5 PM PKT)
- OR admin can manually trigger from the UI

### 3. **Email Logic**
1. Get all imported teachers for this week
2. Get all teachers who submitted classes in the past 7 days
3. Find the difference = "Missing Teachers"
4. For each missing teacher:
   - Load email template from database
   - Personalize with teacher details
   - Enhance tone with Claude AI
   - Log email record in `email_logs` table

### 4. **Email Template**
Template stored in `email_templates` table with variables:
- `{teacher_name}` - Teacher's full name
- `{course_title}` - Course they teach
- `{class_time}` - Scheduled class time
- `{batch}` - Batch number
- `{section}` - Section letter/code

**Default sender:** `Scs@paf-iast.edu.pk`

---

## 🚀 Usage

### Option A: Manual Trigger (Admin Dashboard)

1. Go to **Admin Dashboard** → **Advanced** → **📧 Send Reminder Emails**
2. Click "Send Missing Teacher Reminder Emails" button
3. System checks and sends emails to all missing teachers
4. View results showing:
   - Number of missing teachers
   - Number of emails sent
   - List of recipients
   - Any errors

### Option B: Automatic (Vercel Cron)

**Schedule:** Every Friday at 12 PM UTC (5 PM PKT)
- Configured in `vercel.json`
- Runs automatically, no admin action needed
- Emails logged in `email_logs` table

---

## 📊 Database Tables

### `imported_teachers`
Stores teachers imported from Excel:
```sql
- id: UUID (primary key)
- name: TEXT
- email: TEXT
- title: TEXT (Assistant Professor, Lecturer, etc)
- course: TEXT
- class_time: TEXT (9:00 AM, 2:00 PM, etc)
- batch: TEXT (2024, 2023, etc)
- section: TEXT (A, B, C)
- imported_date: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### `email_templates`
Customizable email templates:
```sql
- id: UUID (primary key)
- name: TEXT UNIQUE (e.g., "missing_class")
- subject: TEXT
- body: TEXT (supports {variables})
- sender: TEXT (default: Scs@paf-iast.edu.pk)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### `email_logs`
Records of all sent emails:
```sql
- id: UUID (primary key)
- teacher_id: UUID (foreign key → imported_teachers.id)
- subject: TEXT
- recipient: TEXT (email address)
- sent_at: TIMESTAMP
- status: TEXT (sent, bounced, etc)
- created_at: TIMESTAMP
```

### `online_classes`
Existing table with submitted classes:
- Uses `faculty_email` to match against imported teachers
- Checked for submissions in past 7 days

---

## 🔧 API Endpoints

### Trigger Email Sending
```
POST /api/admin/advanced/send-missing-emails
```

**Authentication:** Optional secret key via `CRON_SECRET` env variable

**Response:**
```json
{
  "success": true,
  "message": "Processed 5 missing teachers",
  "emailsSent": 5,
  "missingCount": 5,
  "missingTeachers": [
    {
      "name": "Dr. Ahmed Ali",
      "email": "ahmed.ali@paf-iast.edu.pk",
      "course": "Web Development"
    }
  ]
}
```

---

## ⚙️ Configuration

### Vercel Cron Schedule
File: `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/admin/advanced/send-missing-emails",
      "schedule": "0 12 * * 5"
    }
  ]
}
```

**Cron Format:** `minute hour day month dayOfWeek`
- `0 12 * * 5` = Friday, 12:00 PM UTC (5:00 PM PKT)

### Email Sender
Set in environment:
```
Scs@paf-iast.edu.pk
```

### Anthropic API Integration
Used for email tone enhancement:
- Requires `ANTHROPIC_API_KEY` in environment
- Uses Claude Opus 5.5 model
- Falls back to plain personalization if Claude unavailable

---

## 📝 Example Workflow

**Friday Morning (9 AM):**
1. Admin imports Excel with 10 teachers

**Friday 5 PM (Automatic):**
1. Cron job triggers
2. System checks: 10 imported vs 8 submitted
3. Finds 2 missing teachers: Dr. Ahmed, Prof. Fatima
4. Sends personalized emails to both
5. Logs: 2 emails sent

**Result in `email_logs`:**
```
teacher_id: f0b6080e-... | recipient: ahmed.ali@... | status: sent
teacher_id: e55c2069-... | recipient: fatima.khan@... | status: sent
```

---

## 🔍 Monitoring

### Check Sent Emails
```sql
-- Get all emails sent this week
SELECT teacher_id, recipient, subject, sent_at, status
FROM email_logs
WHERE sent_at >= NOW() - INTERVAL '7 days'
ORDER BY sent_at DESC;
```

### View Email Logs in UI
- Future enhancement: Add `email-logs` page to view all sent emails
- Track delivery status and failures

---

## ⚡ Advanced Features

### Email Personalization
Template variables are replaced automatically:
```
Original:
"Dear {teacher_name}, your class {course_title} at {class_time} ..."

Personalized:
"Dear Dr. Ahmed Ali, your class Web Development at 9:00 AM ..."
```

### Claude AI Enhancement (Optional)
Each email is improved for tone and professionalism:
- Input: Personalized template
- Processing: Claude enhances readability and warmth
- Output: Professional, encouraging message

---

## 🐛 Troubleshooting

### No emails sent?
- Check: Are there missing teachers? (teachers in imported_teachers not in online_classes)
- Check: Is email template configured?
- Check: Is Anthropic API key set? (optional but recommended)

### Emails not being logged?
- Verify `email_logs` table exists
- Check Supabase logs for errors
- Verify foreign key relationship to `imported_teachers`

### Template not loading?
- Ensure template with name "missing_class" exists in `email_templates`
- Check table permissions in Supabase RLS

---

## 🔐 Security

- API endpoint accepts optional `CRON_SECRET` header
- Configure for production: `Authorization: Bearer {CRON_SECRET}`
- Uses Supabase service role for database access
- Email addresses not exposed in logs beyond recipient field

---

## 📞 Support

For issues or customizations:
1. Check Vercel deployment logs
2. Review Supabase error logs
3. Check email sent from: `Scs@paf-iast.edu.pk`
4. Verify template exists and is properly formatted

---

## 📚 Files Created/Modified

### New Files:
- `/src/app/api/admin/advanced/send-missing-emails/route.ts` - Main endpoint
- `/src/app/admin/advanced/email-notifications/page.tsx` - Manual trigger UI
- `vercel.json` - Cron configuration

### Modified Files:
- `/src/app/admin/advanced/page.tsx` - Added "Send Reminder Emails" option

---

**Status:** ✅ Ready for deployment and testing
