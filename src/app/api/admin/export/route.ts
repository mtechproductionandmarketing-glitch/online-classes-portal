import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

export async function GET() {
  try {
    // Fetch all records and filter deleted records in backend per SRS FR-10
    const { data: allClasses, error } = await supabase
      .from('online_classes')
      .select('*')
      .order('class_date', { ascending: false })

    // Filter out soft-deleted records in backend
    const classes = (allClasses || []).filter(c => !c.is_deleted)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    // Create CSV with only active records (double-check safety filter)
    const activeClasses = (classes || []).filter(c => !c.is_deleted)
    const headers = ['Reference ID', 'Date', 'Faculty', 'Course', 'Program', 'Batch', 'Semester', 'Section', 'Start Time', 'Duration', 'Meeting Link', 'Remarks']
    const rows = activeClasses.map(c => [
      c.reference_id,
      c.class_date,
      c.faculty_name,
      c.course_title,
      c.program,
      c.batch,
      c.semester || '',
      c.section,
      c.start_time,
      c.duration_minutes,
      c.teams_link,
      c.remarks || ''
    ])

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="classes-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return Response.json({ error: 'Export failed' }, { status: 500 })
  }
}
