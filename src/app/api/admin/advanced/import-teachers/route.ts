import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    // Read file as text
    const text = await file.text()

    // Simple CSV parser (supports both CSV and Excel exported as CSV)
    const lines = text.split('\n').map(line => line.trim()).filter(line => line)
    if (lines.length < 2) {
      return Response.json({ error: 'File is empty or invalid' }, { status: 400 })
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const requiredFields = ['teacher name', 'teacher email', 'teacher title', 'course title', 'class time', 'batch', 'section']

    console.log('CSV Headers:', headers)
    console.log('Required Fields:', requiredFields)

    // Validate headers - check if required fields exist in headers
    const missingFields = requiredFields.filter(field =>
      !headers.some(h => h.replace(/ /g, '') === field.replace(/ /g, ''))
    )

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields)
      return Response.json({
        error: `Missing required columns: ${missingFields.join(', ')}. Required: Teacher Name, Teacher Email, Teacher Title, Course Title, Class Time, Batch, Section. Optional: Semester`
      }, { status: 400 })
    }

    const findCol = (aliases: string[]) =>
      headers.findIndex(h => aliases.some(a => h.replace(/ /g, '') === a.replace(/ /g, '')))

    const idx = {
      name: findCol(['teacher name', 'name']),
      email: findCol(['teacher email', 'email']),
      title: findCol(['teacher title', 'title']),
      course: findCol(['course title', 'course']),
      class_time: findCol(['class time', 'time']),
      batch: findCol(['batch']),
      semester: findCol(['semester']),
      section: findCol(['section']),
    }

    // Clear old teachers data
    await supabase.from('imported_teachers').delete().neq('id', '')

    // Parse and insert teachers
    let imported = 0
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())

      if (values.length < 7) continue

      const teacherData = {
        name: values[idx.name] || values[0],
        email: values[idx.email] || values[1],
        title: values[idx.title] || values[2],
        course: values[idx.course] || values[3],
        class_time: values[idx.class_time] || values[4],
        batch: values[idx.batch] || values[5],
        semester: idx.semester >= 0 ? (values[idx.semester] || '') : '',
        section: values[idx.section] || values[6],
        imported_date: new Date().toISOString()
      }

      // Validate email
      if (!teacherData.email.includes('@')) continue

      await supabase.from('imported_teachers').insert([teacherData])
      imported++
    }

    return Response.json({
      success: true,
      imported,
      message: `Successfully imported ${imported} teachers`
    })

  } catch (error) {
    console.error('Import error:', error)
    return Response.json({ error: 'Failed to import teachers' }, { status: 500 })
  }
}
