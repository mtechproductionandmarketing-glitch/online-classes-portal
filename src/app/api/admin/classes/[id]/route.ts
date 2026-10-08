import { createClient } from '@supabase/supabase-js'
import { validateFacultySubmission } from '@/lib/validation'

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

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    console.log(`[Delete-Class] Soft-deleting record: ${id}`)

    if (!id) {
      return Response.json({ error: 'Record ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('online_classes')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('is_deleted', false)
      .select('id')

    if (error) {
      console.error('[Delete-Class] Error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return Response.json({ error: 'Record not found or already deleted' }, { status: 404 })
    }

    console.log(`[Delete-Class] Successfully deleted: ${id}`)
    return Response.json({
      success: true,
      message: 'Record deleted successfully',
    })
  } catch (error) {
    console.error('[Delete-Class] Exception:', error)
    return Response.json({
      error: `Exception: ${(error as Error).message}`,
    }, { status: 500 })
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const { data, error } = await supabase
      .from('online_classes')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 404 })
    }

    return Response.json({ data })
  } catch (error) {
    console.error('[Get-Class] Exception:', error)
    return Response.json({
      error: `Exception: ${(error as Error).message}`,
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()

    console.log(`[Update-Class] Updating record: ${id}`)

    const updates = {
      class_date: body.class_date,
      faculty_name: body.faculty_name,
      course_title: body.course_title,
      batch: body.batch,
      semester: body.semester,
      program: body.program,
      section: body.section,
      start_time: body.start_time,
      duration_minutes: typeof body.duration_minutes === 'string'
        ? parseInt(body.duration_minutes, 10)
        : body.duration_minutes,
      teams_link: body.teams_link,
      remarks: body.remarks || null,
    }

    const validation = validateFacultySubmission({
      class_date: String(updates.class_date || ''),
      faculty_name: String(updates.faculty_name || ''),
      course_title: String(updates.course_title || ''),
      batch: String(updates.batch || ''),
      semester: String(updates.semester || ''),
      program: String(updates.program || ''),
      section: String(updates.section || ''),
      start_time: String(updates.start_time || '').slice(0, 5),
      duration_minutes: String(updates.duration_minutes ?? ''),
      teams_link: String(updates.teams_link || ''),
      remarks: updates.remarks,
    })

    if (!validation.valid) {
      return Response.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('online_classes')
      .update({
        ...updates,
        faculty_name: String(updates.faculty_name).trim(),
        course_title: String(updates.course_title).trim(),
        batch: String(updates.batch).trim(),
        semester: String(updates.semester).trim(),
        program: String(updates.program).trim(),
        section: String(updates.section).trim(),
        teams_link: String(updates.teams_link).trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('is_deleted', false)
      .select('id')

    if (error) {
      console.error('[Update-Class] Error:', error)
      if (/semester/i.test(error.message)) {
        return Response.json({
          error:
            'Database is missing the semester column. Please run ADD_SEMESTER_AND_MEETING_LINK.sql in the Supabase SQL Editor, then try again.',
        }, { status: 500 })
      }
      return Response.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return Response.json({ error: 'Record not found or already deleted' }, { status: 404 })
    }

    console.log(`[Update-Class] Successfully updated: ${id}`)
    return Response.json({
      success: true,
      message: 'Record updated successfully',
    })
  } catch (error) {
    console.error('[Update-Class] Exception:', error)
    return Response.json({
      error: `Exception: ${(error as Error).message}`,
    }, { status: 500 })
  }
}
