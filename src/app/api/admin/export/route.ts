import { createClient } from '@supabase/supabase-js'

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
    // Fetch only active (non-deleted) records per SRS FR-10
    const { data: classes, error } = await supabase
      .from('online_classes')
      .select('*')
      .neq('is_deleted', true)
      .order('class_date', { ascending: false })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    // Create CSV with only active records (double-check safety filter)
    const activeClasses = (classes || []).filter(c => !c.is_deleted)
    const headers = ['Reference ID', 'Date', 'Faculty', 'Course', 'Program', 'Batch', 'Section', 'Start Time', 'Duration', 'Teams Link', 'Remarks']
    const rows = activeClasses.map(c => [
      c.reference_id,
      c.class_date,
      c.faculty_name,
      c.course_title,
      c.program,
      c.batch,
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
