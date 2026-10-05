import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateFacultySubmission } from '@/lib/validation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
    const body = await request.json()

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

    const { data, error } = await supabase
      .from('online_classes')
      .insert([
        {
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
        },
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save class record. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      reference_id: reference_id,
      record_id: data?.[0]?.id,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
