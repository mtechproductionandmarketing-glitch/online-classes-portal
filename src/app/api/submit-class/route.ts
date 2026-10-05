import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { validateFacultySubmission } from '@/lib/validation'

const submissionAttempts = new Map<string, number[]>()

function getRateLimit(ip: string): boolean {
  const now = Date.now()
  const tenMinutesAgo = now - 10 * 60 * 1000
  
  const attempts = submissionAttempts.get(ip) || []
  const recentAttempts = attempts.filter(time => time > tenMinutesAgo)
  
  if (recentAttempts.length >= 20) {
    return false
  }
  
  recentAttempts.push(now)
  submissionAttempts.set(ip, recentAttempts)
  return true
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  if (!getRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please wait 10 minutes before trying again.' },
      { status: 429 }
    )
  }

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
      idempotency_key,
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

    const rpcParams = {
      p_class_date: class_date,
      p_faculty_name: faculty_name,
      p_course_title: course_title,
      p_batch: batch,
      p_program: program,
      p_section: section,
      p_start_time: start_time,
      p_duration_minutes: parseInt(duration_minutes),
      p_teams_link: teams_link,
      p_remarks: remarks || null,
      p_idempotency_key: idempotency_key,
    }

    const { data, error } = await supabaseServer.rpc('submit_online_class', rpcParams as any)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save class record. Please try again.' },
        { status: 500 }
      )
    }

    if (data && (data as any).length > 0) {
      const result = (data as any)[0]
      if (result.success) {
        return NextResponse.json({
          success: true,
          reference_id: result.reference_id,
          record_id: result.record_id,
        })
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate Reference ID. Please contact support.' },
      { status: 500 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
