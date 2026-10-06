import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { subject, body } = await request.json()

    if (!subject || !body) {
      return Response.json({ error: 'Subject and body are required' }, { status: 400 })
    }

    // Update existing template or create if doesn't exist
    const { error } = await supabase.from('email_templates').upsert(
      {
        name: 'missing_class',
        subject,
        body,
        sender: 'Scs@paf-iast.edu.pk',
        updated_at: new Date().toISOString()
      },
      { onConflict: 'name' }
    )

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true, message: 'Template saved successfully' })
  } catch (error) {
    console.error('Error saving template:', error)
    return Response.json({ error: 'Failed to save template' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data: template, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('name', 'missing_class')
      .single()

    if (error && error.code !== 'PGRST116') {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ template })
  } catch (error) {
    console.error('Error fetching template:', error)
    return Response.json({ error: 'Failed to fetch template' }, { status: 500 })
  }
}
