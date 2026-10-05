import { formatISO, isValid, parseISO, addDays } from 'date-fns'

// Pakistan timezone is UTC+5
const PAKISTAN_TZ_OFFSET = 5 * 60 * 60 * 1000

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

// Get Pakistan time as Date object
function getPakistanTime(): Date {
  const utc = new Date()
  const pkt = new Date(utc.getTime() + PAKISTAN_TZ_OFFSET)
  return pkt
}

export function validateClassDate(dateString: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!dateString) {
    errors.push({ field: 'class_date', message: 'Class date is required' })
    return { valid: false, errors }
  }

  const date = parseISO(dateString)
  if (!isValid(date)) {
    errors.push({ field: 'class_date', message: 'Invalid date format' })
    return { valid: false, errors }
  }

  const pktNow = getPakistanTime()
  const pktTomorrow = addDays(pktNow, 1)

  if (date > pktTomorrow) {
    errors.push({ 
      field: 'class_date', 
      message: 'Class date cannot be more than 1 day in the future' 
    })
  }

  return { valid: errors.length === 0, errors }
}

export function validateFacultyName(name: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!name || !name.trim()) {
    errors.push({ field: 'faculty_name', message: 'Faculty name is required' })
    return { valid: false, errors }
  }

  const trimmed = name.trim()
  if (trimmed.length > 150) {
    errors.push({ 
      field: 'faculty_name', 
      message: 'Faculty name must not exceed 150 characters' 
    })
  }

  return { valid: errors.length === 0, errors }
}

export function validateCourseTitle(title: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!title || !title.trim()) {
    errors.push({ field: 'course_title', message: 'Course title is required' })
    return { valid: false, errors }
  }

  const trimmed = title.trim()
  if (trimmed.length > 150) {
    errors.push({ 
      field: 'course_title', 
      message: 'Course title must not exceed 150 characters' 
    })
  }

  return { valid: errors.length === 0, errors }
}

export function validateBatch(batch: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!batch || !batch.trim()) {
    errors.push({ field: 'batch', message: 'Batch is required' })
    return { valid: false, errors }
  }

  const trimmed = batch.trim()
  if (trimmed.length > 150) {
    errors.push({ 
      field: 'batch', 
      message: 'Batch must not exceed 150 characters' 
    })
  }

  return { valid: errors.length === 0, errors }
}

export function validateProgram(program: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!program || !program.trim()) {
    errors.push({ field: 'program', message: 'Program is required' })
    return { valid: false, errors }
  }

  const trimmed = program.trim()
  if (trimmed.length > 150) {
    errors.push({ 
      field: 'program', 
      message: 'Program must not exceed 150 characters' 
    })
  }

  return { valid: errors.length === 0, errors }
}

export function validateSection(section: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!section || !section.trim()) {
    errors.push({ field: 'section', message: 'Section is required' })
    return { valid: false, errors }
  }

  const trimmed = section.trim()
  if (trimmed.length > 150) {
    errors.push({ 
      field: 'section', 
      message: 'Section must not exceed 150 characters' 
    })
  }

  return { valid: errors.length === 0, errors }
}

export function validateStartTime(timeString: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!timeString) {
    errors.push({ field: 'start_time', message: 'Start time is required' })
    return { valid: false, errors }
  }

  // Validate HH:MM format
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  if (!timeRegex.test(timeString)) {
    errors.push({ field: 'start_time', message: 'Invalid time format (use HH:MM)' })
  }

  return { valid: errors.length === 0, errors }
}

export function validateDuration(duration: string): ValidationResult {
  const errors: ValidationError[] = []

  if (duration === '') {
    errors.push({ field: 'duration_minutes', message: 'Duration is required' })
    return { valid: false, errors }
  }

  const durationNum = parseInt(duration, 10)

  if (isNaN(durationNum)) {
    errors.push({ field: 'duration_minutes', message: 'Duration must be a whole number' })
    return { valid: false, errors }
  }

  if (durationNum < 1 || durationNum > 300) {
    errors.push({ 
      field: 'duration_minutes', 
      message: 'Duration must be between 1 and 300 minutes' 
    })
  }

  return { valid: errors.length === 0, errors }
}

export function validateTeamsLink(link: string): ValidationResult {
  const errors: ValidationError[] = []

  if (!link) {
    errors.push({ field: 'teams_link', message: 'MS Teams link is required' })
    return { valid: false, errors }
  }

  try {
    const url = new URL(link)

    if (url.protocol !== 'https:') {
      errors.push({ 
        field: 'teams_link', 
        message: 'Teams link must use HTTPS' 
      })
      return { valid: false, errors }
    }

    const hostname = url.hostname
    if (hostname !== 'teams.microsoft.com' && hostname !== 'teams.live.com') {
      errors.push({ 
        field: 'teams_link', 
        message: 'Teams link must be from teams.microsoft.com or teams.live.com' 
      })
    }
  } catch {
    errors.push({ field: 'teams_link', message: 'Invalid URL' })
  }

  return { valid: errors.length === 0, errors }
}

export function validateRemarks(remarks: string | null): ValidationResult {
  const errors: ValidationError[] = []

  if (remarks && remarks.trim().length > 500) {
    errors.push({ 
      field: 'remarks', 
      message: 'Remarks must not exceed 500 characters' 
    })
  }

  return { valid: errors.length === 0, errors }
}

// Validate entire form
export function validateFacultySubmission(data: {
  class_date: string
  faculty_name: string
  course_title: string
  batch: string
  program: string
  section: string
  start_time: string
  duration_minutes: string
  teams_link: string
  remarks: string | null
}): ValidationResult {
  const allErrors: ValidationError[] = []

  const validations = [
    validateClassDate(data.class_date),
    validateFacultyName(data.faculty_name),
    validateCourseTitle(data.course_title),
    validateBatch(data.batch),
    validateProgram(data.program),
    validateSection(data.section),
    validateStartTime(data.start_time),
    validateDuration(data.duration_minutes),
    validateTeamsLink(data.teams_link),
    validateRemarks(data.remarks),
  ]

  for (const result of validations) {
    allErrors.push(...result.errors)
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  }
}
