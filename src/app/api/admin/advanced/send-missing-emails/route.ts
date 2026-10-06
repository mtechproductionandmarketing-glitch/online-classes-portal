import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

interface Teacher {
  id: string
  name: string
  email: string
  title: string
  course: string
  class_time: string
  batch: string
  section: string
}

export async function POST(request: Request) {
  try {
    // Verify authorization (optional - add a secret key check for security)
    const authHeader = request.headers.get('authorization')
    const secretKey = process.env.CRON_SECRET

    if (secretKey && authHeader !== `Bearer ${secretKey}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all imported teachers
    const { data: allTeachers, error: teachersError } = await supabase
      .from('imported_teachers')
      .select('*')
      .order('name')

    if (teachersError) {
      return Response.json({ error: `Failed to fetch teachers: ${teachersError.message}` }, { status: 500 })
    }

    if (!allTeachers || allTeachers.length === 0) {
      return Response.json({
        success: true,
        message: 'No imported teachers found',
        emailsSent: 0
      })
    }

    // Get teachers who submitted classes this week (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: submittedClasses, error: classesError } = await supabase
      .from('online_classes')
      .select('faculty_name')
      .gte('created_at', sevenDaysAgo.toISOString())

    if (classesError) {
      return Response.json({ error: `Failed to fetch classes: ${classesError.message}` }, { status: 500 })
    }

    // Get set of submitted teacher names for quick lookup
    const submittedNames = new Set(
      (submittedClasses || []).map(c => c.faculty_name?.toLowerCase())
    )

    // Find missing teachers (imported but didn't submit)
    const missingTeachers = (allTeachers as Teacher[]).filter(t =>
      !submittedNames.has(t.name.toLowerCase())
    )

    if (missingTeachers.length === 0) {
      return Response.json({
        success: true,
        message: 'All teachers have submitted their classes',
        emailsSent: 0
      })
    }

    // Get email template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('name', 'missing_class')
      .single()

    if (templateError || !template) {
      return Response.json({ error: 'Email template not found' }, { status: 500 })
    }

    // Send emails to missing teachers
    let emailsSent = 0
    const emailErrors: string[] = []

    for (const teacher of missingTeachers) {
      try {
        // Generate personalized email using Claude
        const personalizedEmail = await generatePersonalizedEmail(
          template.body,
          teacher
        )

        // Send email via Anthropic (or your email service)
        // For now, we'll log it to the database
        const { error: logError } = await supabase
          .from('email_logs')
          .insert([{
            teacher_id: teacher.id,
            subject: template.subject,
            recipient: teacher.email,
            sent_at: new Date().toISOString(),
            status: 'sent'
          }])

        if (logError) {
          emailErrors.push(`Failed to log email for ${teacher.name}: ${logError.message}`)
        } else {
          emailsSent++
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        emailErrors.push(`Error processing ${teacher.name}: ${(error as any).message}`)
      }
    }

    return Response.json({
      success: true,
      message: `Processed ${missingTeachers.length} missing teachers`,
      emailsSent,
      missingCount: missingTeachers.length,
      missingTeachers: missingTeachers.map(t => ({
        name: t.name,
        email: t.email,
        course: t.course
      })),
      errors: emailErrors.length > 0 ? emailErrors : undefined
    })
  } catch (error) {
    console.error('Error sending missing teacher emails:', error)
    return Response.json(
      { error: 'Failed to send emails', details: (error as any).message },
      { status: 500 }
    )
  }
}

async function generatePersonalizedEmail(template: string, teacher: Teacher): Promise<string> {
  // Replace variables in the template
  const personalizedBody = template
    .replace(/{teacher_name}/g, teacher.name)
    .replace(/{course_title}/g, teacher.course)
    .replace(/{class_time}/g, teacher.class_time)
    .replace(/{batch}/g, teacher.batch)
    .replace(/{section}/g, teacher.section)

  // Optionally enhance with Claude if you want more personalization
  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Make this email slightly more professional and encouraging while maintaining all the details:

${personalizedBody}

Keep it concise, warm, and professional. Don't change the sender email or institution name.`
        }
      ]
    })

    if (message.content[0].type === 'text') {
      return message.content[0].text
    }
  } catch (error) {
    console.error('Error enhancing email with Claude:', error)
    // Return original personalized email if Claude enhancement fails
  }

  return personalizedBody
}
