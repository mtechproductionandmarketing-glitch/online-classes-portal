import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    // Fetch all classes
    const { data: classes, error } = await supabase
      .from('online_classes')
      .select('*')
      .order('class_date', { ascending: false })
      .limit(100)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    // Calculate statistics
    const today = new Date().toISOString().split('T')[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const stats = {
      total: classes?.length || 0,
      today: classes?.filter(c => c.class_date === today).length || 0,
      week: classes?.filter(c => c.class_date >= weekAgo).length || 0,
      month: classes?.filter(c => c.class_date >= monthAgo).length || 0
    }

    return Response.json({
      classes: classes || [],
      stats
    })
  } catch (error) {
    console.error('Error fetching classes:', error)
    return Response.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}
