import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    console.log('[Admin API] Fetching all classes...')

    // Fetch all classes - use service role for full access
    const query = supabase
      .from('online_classes')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(100)

    const { data: classes, error, count } = await query

    console.log(`[Admin API] Query result: ${count} total records, error: ${error?.message || 'none'}`)

    if (error) {
      console.error('[Admin API] Error details:', error)
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

    console.log('[Admin API] Stats:', stats)

    return Response.json({
      classes: classes || [],
      stats,
      debug: { totalRecords: count }
    })
  } catch (error) {
    console.error('[Admin API] Exception:', error)
    return Response.json(
      { error: 'Failed to fetch classes', details: (error as any).message },
      { status: 500 }
    )
  }
}
