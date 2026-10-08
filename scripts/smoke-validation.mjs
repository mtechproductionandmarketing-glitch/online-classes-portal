/**
 * Local smoke test for semester + meeting-link validation.
 * Run: node scripts/smoke-validation.mjs
 *
 * Note: This mirrors validation rules (does not import TS).
 */

function validateMeetingLink(link) {
  const errors = []
  if (!link || !String(link).trim()) {
    errors.push('A meeting/class link is required')
    return { valid: false, errors }
  }
  try {
    const url = new URL(String(link).trim())
    if (url.protocol !== 'https:') {
      errors.push('Meeting link must use HTTPS')
      return { valid: false, errors }
    }
    if (!url.hostname || url.hostname.indexOf('.') === -1) {
      errors.push('Meeting link must be a valid HTTPS URL')
    }
  } catch {
    errors.push('Invalid meeting link')
  }
  return { valid: errors.length === 0, errors }
}

function validateSemester(semester) {
  if (!semester || !String(semester).trim()) {
    return { valid: false, errors: ['Semester is required'] }
  }
  if (String(semester).trim().length > 150) {
    return { valid: false, errors: ['Semester too long'] }
  }
  return { valid: true, errors: [] }
}

const cases = [
  {
    name: 'reject empty meeting link',
    run: () => validateMeetingLink(''),
    expectValid: false,
  },
  {
    name: 'reject http (non-https) link',
    run: () => validateMeetingLink('http://meet.google.com/abc-defg-hij'),
    expectValid: false,
  },
  {
    name: 'accept Teams link',
    run: () => validateMeetingLink('https://teams.microsoft.com/l/meetup-join/19%3ameeting'),
    expectValid: true,
  },
  {
    name: 'accept Google Meet link',
    run: () => validateMeetingLink('https://meet.google.com/abc-defg-hij'),
    expectValid: true,
  },
  {
    name: 'accept Zoom link',
    run: () => validateMeetingLink('https://zoom.us/j/1234567890'),
    expectValid: true,
  },
  {
    name: 'accept other HTTPS class link',
    run: () => validateMeetingLink('https://university.edu/class/join/xyz'),
    expectValid: true,
  },
  {
    name: 'reject empty semester',
    run: () => validateSemester(''),
    expectValid: false,
  },
  {
    name: 'accept semester',
    run: () => validateSemester('Fall 2024'),
    expectValid: true,
  },
]

let failed = 0
for (const c of cases) {
  const result = c.run()
  const ok = result.valid === c.expectValid
  console.log(`${ok ? 'PASS' : 'FAIL'} - ${c.name}`, result.valid ? '' : `(${result.errors.join('; ')})`)
  if (!ok) failed++
}

if (failed > 0) {
  console.error(`\n${failed} test(s) failed`)
  process.exit(1)
}

console.log(`\nAll ${cases.length} smoke tests passed.`)
