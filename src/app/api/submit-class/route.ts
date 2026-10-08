import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
import { validateFacultySubmission } from '@/lib/validation'

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
    console.log('[Submit] Request body received:', JSON.stringify(body).substring(0, 200))

    const {
      class_date,
      faculty_name,
      course_title,
      batch,
      program,
      section,
      start_time,
      duration_minutes,
      teams_link,
      remarks,
    } = body

    console.log('[Submit] Extracted fields:', {
      class_date, faculty_name, course_title, batch, program, section, start_time, duration_minutes
    })

    const validation = validateFacultySubmission({
      class_date,
      faculty_name,
      course_title,
      batch,
      program,
      section,
      start_time,
      duration_minutes,
      teams_link,
      remarks: remarks || null,
    })

    console.log('[Submit] Validation result:', { valid: validation.valid, errors: validation.errors })

    if (!validation.valid) {
      console.log('[Submit] Validation failed, returning 400')
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.errors,
        },
        { status: 400 }
      )
    }

    const reference_id = generateReferenceId()
    console.log('[Submit] Generated reference ID:', reference_id)

    const insertData = {
      class_date,
      faculty_name,
      course_title,
      batch,
      program,
      section,
      start_time,
      duration_minutes: parseInt(duration_minutes),
      teams_link,
      remarks: remarks || null,
      reference_id,
      submission_date: new Date().toISOString(),
      is_deleted: false,
    }

    console.log('[Submit] About to insert data:', JSON.stringify(insertData).substring(0, 200))

    const { data, error } = await supabase
      .from('online_classes')
      .insert([insertData])
      .select()

    console.log('[Submit] Insert response - data:', data, 'error:', error)

    if (error) {
      console.error('[Submit] Supabase error details:', JSON.stringify(error))
      return NextResponse.json(
        { error: `Failed to save: ${error.message}` },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      console.error('[Submit] Insert returned empty data array')
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
