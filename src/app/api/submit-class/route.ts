import { NextRequest, NextResponse } from 'next/server'
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

function generateReferenceId(): string {
  const today = new Date()
  const year = today.getFullYear().toString().slice(-2)
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `OC-${year}${month}${day}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Submit] Starting faculty submission...')
    const body = await request.json()

    const {
      class_date,
      faculty_name,
      course_title,
      batch,
      semester,
      program,
      section,
      start_time,
      duration_minutes,
      teams_link,
      remarks,
      idempotency_key,
    } = body

    const validation = validateFacultySubmission({
      class_date,
      faculty_name,
      course_title,
      batch,
      semester: semester || '',
      program,
      section,
      start_time,
      duration_minutes,
      teams_link,
      remarks: remarks || null,
    })

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.errors,
        },
        { status: 400 }
      )
    }

    const reference_id = generateReferenceId()
    const trimmedLink = String(teams_link).trim()

    // Build insert payload carefully — only columns that exist in the live schema
    const insertData: Record<string, unknown> = {
      class_date,
      faculty_name: String(faculty_name).trim(),
      course_title: String(course_title).trim(),
      batch: String(batch).trim(),
      semester: String(semester).trim(),
      program: String(program).trim(),
      section: String(section).trim(),
      start_time,
      duration_minutes: parseInt(duration_minutes, 10),
      teams_link: trimmedLink,
      remarks: remarks ? String(remarks).trim() : null,
      reference_id,
      is_deleted: false,
    }

    // Include idempotency_key when provided (column may be required in some schemas)
    if (idempotency_key) {
      insertData.idempotency_key = idempotency_key
    }

    console.log('[Submit] Inserting class with reference:', reference_id)

    let { data, error } = await supabase
      .from('online_classes')
      .insert([insertData])
      .select()

    // If idempotency_key column does not exist, retry without it
    if (error && idempotency_key && /idempotency_key/i.test(error.message)) {
      console.warn('[Submit] Retrying without idempotency_key:', error.message)
      delete insertData.idempotency_key
      const retry = await supabase.from('online_classes').insert([insertData]).select()
      data = retry.data
      error = retry.error
    }

    // If semester column does not exist yet, surface a clear message
    if (error && /semester/i.test(error.message)) {
      console.error('[Submit] Semester column missing. Run ADD_SEMESTER_AND_MEETING_LINK.sql in Supabase.')
      return NextResponse.json(
        {
          error:
            'Database is missing the semester column. Please run ADD_SEMESTER_AND_MEETING_LINK.sql in the Supabase SQL Editor, then try again.',
        },
        { status: 500 }
      )
    }

    if (error) {
      console.error('[Submit] Supabase error details:', JSON.stringify(error))
      return NextResponse.json(
        { error: `Failed to save: ${error.message}` },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No data returned from insert operation' },
        { status: 500 }
      )
    }

    console.log('[Submit] Success! Inserted record with ID:', data[0].id)
    return NextResponse.json({
      success: true,
      reference_id: reference_id,
      record_id: data[0].id,
    })
  } catch (error) {
    console.error('[Submit] Exception:', error)
    const errMsg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Server error: ${errMsg}` },
      { status: 500 }
    )
  }
}
