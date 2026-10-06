import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: teachers, error } = await supabase
      .from('imported_teachers')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ teachers: teachers || [] })
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return Response.json({ error: 'Failed to fetch teachers' }, { status: 500 })
  }
}
